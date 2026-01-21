import { NextRequest, NextResponse } from 'next/server'
import { Groq } from 'groq-sdk'

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
})

export const runtime = 'nodejs'
export const maxDuration = 30

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const screenshot = formData.get('screenshot') as File | null
    const textInput = formData.get('textInput') as string
    const chatHistoryStr = formData.get('chatHistory') as string
    const chatHistory = chatHistoryStr ? JSON.parse(chatHistoryStr) : []

    // Server-side file size validation (10MB limit)
    const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB in bytes
    if (screenshot) {
      // Check file type
      if (!screenshot.type.startsWith('image/')) {
        return NextResponse.json(
          { error: 'Invalid file type. Please upload an image file (PNG, JPG, GIF, etc.)' },
          { status: 400 }
        )
      }
      
      // Check file size
      if (screenshot.size > MAX_FILE_SIZE) {
        const fileSizeMB = (screenshot.size / 1024 / 1024).toFixed(2)
        return NextResponse.json(
          { error: `File size (${fileSizeMB}MB) exceeds the 10MB limit. Please upload a smaller image.` },
          { status: 400 }
        )
      }
    }

    let imageBase64 = null
    if (screenshot) {
      const arrayBuffer = await screenshot.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      imageBase64 = buffer.toString('base64')
    }

    // Prepare messages for Groq
    const messages: any[] = [
      {
        role: 'system',
        content: `You are a QA testing expert. Your task is to analyze screenshots and text requirements to generate comprehensive test cases. 
        Generate test cases in JSON format with the following structure:
        {
          "testCases": [
            {
              "id": "unique_id",
              "testCaseId": "TC001",
              "description": "Clear description of what to test",
              "steps": "Step-by-step instructions",
              "expectedResult": "What should happen",
              "priority": "High/Medium/Low",
              "status": "Not Executed"
            }
          ]
        }
        Generate at least 5-10 test cases covering positive, negative, and edge cases.`
      }
    ]

    // Add chat history
    messages.push(...chatHistory)

    // Build user message - Groq doesn't support vision, so we describe the image scenario
    let userMessage = ''
    
    if (imageBase64) {
      userMessage += `A screenshot has been uploaded. Please analyze the following requirements and generate test cases based on typical UI/UX patterns you would expect from a screenshot.\n\n`
    }

    if (textInput) {
      userMessage += `Requirements:\n${textInput}\n\n`
    }

    if (!userMessage.trim()) {
      return NextResponse.json(
        { error: 'Please provide either a screenshot or text input' },
        { status: 400 }
      )
    }

    userMessage += `Based on ${imageBase64 ? 'the uploaded screenshot and ' : ''}the requirements above, generate comprehensive test cases.`

    messages.push({
      role: 'user',
      content: userMessage
    })

    // Call Groq API - using llama-3.3-70b-versatile (updated from deprecated llama-3.1-70b-versatile)
    if (!process.env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is not configured. Please check your .env.local file.')
    }

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: messages,
      max_tokens: 2000,
      temperature: 0.7,
    })

    const aiResponse = response.choices[0].message.content || ''

    // Try to parse JSON from the response
    let testCases = []
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = aiResponse.match(/```json\s*([\s\S]*?)\s*```/) || aiResponse.match(/```\s*([\s\S]*?)\s*```/)
      let jsonStr = jsonMatch ? jsonMatch[1] : aiResponse
      
      // Try to find JSON object in the response
      if (!jsonStr.trim().startsWith('{')) {
        const jsonObjectMatch = jsonStr.match(/\{[\s\S]*\}/)
        if (jsonObjectMatch) {
          jsonStr = jsonObjectMatch[0]
        }
      }
      
      const parsed = JSON.parse(jsonStr.trim())
      
      // Handle different response formats
      if (Array.isArray(parsed)) {
        testCases = parsed
      } else if (parsed.testCases && Array.isArray(parsed.testCases)) {
        testCases = parsed.testCases
      } else if (parsed.testCase && Array.isArray(parsed.testCase)) {
        testCases = parsed.testCase
      } else {
        // If it's an object with test case-like structure, wrap it in an array
        if (parsed.testCaseId || parsed.description) {
          testCases = [parsed]
        }
      }
      
      // Ensure all test cases have required fields
      testCases = testCases.map((tc: any, idx: number) => ({
        id: tc.id || `tc-${idx + 1}`,
        testCaseId: tc.testCaseId || `TC${String(idx + 1).padStart(3, '0')}`,
        description: tc.description || 'Test case description',
        steps: tc.steps || tc.step || 'Test steps',
        expectedResult: tc.expectedResult || tc.expected || 'Expected result',
        priority: tc.priority || 'Medium',
        status: tc.status || 'Not Executed'
      }))
      
    } catch (error) {
      // If JSON parsing fails, log the response and create a fallback
      console.error('Failed to parse JSON:', error)
      console.error('AI Response:', aiResponse)
      // Create a fallback test case
      testCases = [{
        id: '1',
        testCaseId: 'TC001',
        description: 'Generated from AI response - parsing failed',
        steps: 'Review the AI generated response in the chat',
        expectedResult: 'Test cases should be properly formatted',
        priority: 'Medium',
        status: 'Not Executed'
      }]
    }

    // Update chat history
    const updatedHistory = [
      ...chatHistory,
      {
        role: 'assistant',
        content: aiResponse
      }
    ]

    return NextResponse.json({
      testCases,
      chatHistory: updatedHistory
    })
  } catch (error: any) {
    console.error('Error generating test cases:', error)
    const errorMessage = error?.message || error?.toString() || 'Failed to generate test cases'
    console.error('Full error details:', {
      message: errorMessage,
      stack: error?.stack,
      name: error?.name
    })
    return NextResponse.json(
      { 
        error: errorMessage,
        testCases: [],
        chatHistory: []
      },
      { status: 500 }
    )
  }
}

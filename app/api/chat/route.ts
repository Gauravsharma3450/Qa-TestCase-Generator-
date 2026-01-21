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
    const userMessage = formData.get('userMessage') as string

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
        content: `You are a QA testing expert helping to refine test cases. The user may ask you to:
        - Modify existing test cases
        - Add new test cases
        - Remove test cases
        - Change priorities or descriptions
        - Clarify requirements
        
        Always respond with updated test cases in JSON format:
        {
          "testCases": [
            {
              "id": "unique_id",
              "testCaseId": "TC001",
              "description": "Clear description",
              "steps": "Step-by-step instructions",
              "expectedResult": "Expected outcome",
              "priority": "High/Medium/Low",
              "status": "Not Executed"
            }
          ]
        }
        
        Maintain context from previous conversations and the original screenshot/requirements.`
      }
    ]

    // Add original context if available
    if (imageBase64 || textInput) {
      let contextMessage = ''
      
      if (imageBase64) {
        contextMessage += `Original screenshot was uploaded. `
      }

      if (textInput) {
        contextMessage += `Original requirements: ${textInput}`
      }

      messages.push({
        role: 'user',
        content: contextMessage
      })
    }

    // Add chat history (excluding the last assistant message if it's the initial generation)
    messages.push(...chatHistory)

    // Add user's new message
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
      const jsonMatch = aiResponse.match(/```json\s*([\s\S]*?)\s*```/) || aiResponse.match(/```\s*([\s\S]*?)\s*```/)
      const jsonStr = jsonMatch ? jsonMatch[1] : aiResponse
      const parsed = JSON.parse(jsonStr)
      testCases = parsed.testCases || parsed
    } catch (error) {
      console.error('Failed to parse JSON:', error)
      // Return existing test cases if parsing fails
      testCases = []
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
    console.error('Error processing chat:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process chat message' },
      { status: 500 }
    )
  }
}

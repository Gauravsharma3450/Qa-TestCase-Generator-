'use client'

import { useState } from 'react'
import ImageUpload from '@/components/ImageUpload'
import TextInput from '@/components/TextInput'
import ChatInterface from '@/components/ChatInterface'
import TestCaseViewer from '@/components/TestCaseViewer'

export default function Home() {
  const [screenshot, setScreenshot] = useState<File | null>(null)
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null)
  const [textInput, setTextInput] = useState('')
  const [testCases, setTestCases] = useState<any[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [chatHistory, setChatHistory] = useState<Array<{role: string, content: string}>>([])

  const handleScreenshotChange = (file: File | null) => {
    setScreenshot(file)
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setScreenshotPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setScreenshotPreview(null)
    }
  }

  const handleGenerate = async () => {
    if (!screenshot && !textInput.trim()) {
      alert('Please upload a screenshot or enter text requirements')
      return
    }

    setIsGenerating(true)
    try {
      const formData = new FormData()
      if (screenshot) {
        formData.append('screenshot', screenshot)
      }
      formData.append('textInput', textInput)
      formData.append('chatHistory', JSON.stringify(chatHistory))

      const response = await fetch('/api/generate', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate test cases')
      }

      if (data.error) {
        throw new Error(data.error)
      }

      setTestCases(data.testCases || [])
      setChatHistory(data.chatHistory || [])
    } catch (error: any) {
      console.error('Error generating test cases:', error)
      alert(error.message || 'Failed to generate test cases. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleChatMessage = async (message: string) => {
    const newHistory = [...chatHistory, { role: 'user', content: message }]
    setChatHistory(newHistory)

    try {
      const formData = new FormData()
      if (screenshot) {
        formData.append('screenshot', screenshot)
      }
      formData.append('textInput', textInput)
      formData.append('chatHistory', JSON.stringify(newHistory))
      formData.append('userMessage', message)

      const response = await fetch('/api/chat', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to process chat message')
      }

      const data = await response.json()
      setTestCases(data.testCases)
      setChatHistory(data.chatHistory || newHistory)
    } catch (error) {
      console.error('Error processing chat message:', error)
      alert('Failed to process message. Please try again.')
    }
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          QA Test Case Generator
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left Column: Input Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">Upload Screenshot</h2>
              <ImageUpload
                onFileChange={handleScreenshotChange}
                preview={screenshotPreview}
              />
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">Requirements</h2>
              <TextInput
                value={textInput}
                onChange={setTextInput}
                placeholder="Describe what you want to test or what you expect from the screenshot..."
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? 'Generating...' : 'Generate Test Cases'}
              </button>
              <button
                onClick={() => setShowChat(!showChat)}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                {showChat ? 'Hide Chat' : 'Open Chat'}
              </button>
            </div>
          </div>

          {/* Right Column: Chat Interface */}
          {showChat && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">Chat & Refine</h2>
              <ChatInterface
                onSendMessage={handleChatMessage}
                history={chatHistory}
              />
            </div>
          )}
        </div>

        {/* Test Cases Viewer */}
        {testCases.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <TestCaseViewer testCases={testCases} />
          </div>
        )}
      </div>
    </main>
  )
}

'use client'

import { useState } from 'react'
import { generateExcel, generateCSV } from '@/utils/fileGenerator'

interface TestCase {
  id: string
  testCaseId: string
  description: string
  steps: string
  expectedResult: string
  priority: string
  status: string
}

interface TestCaseViewerProps {
  testCases: TestCase[]
}

export default function TestCaseViewer({ testCases }: TestCaseViewerProps) {
  const [showCSV, setShowCSV] = useState(false)

  const handleDownloadExcel = async () => {
    await generateExcel(testCases)
  }

  const handleDownloadCSV = () => {
    generateCSV(testCases)
  }

  const csvContent = generateCSV(testCases, true) || '' // Get CSV as string

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Generated Test Cases</h2>
        <div className="flex gap-4">
          <button
            onClick={() => setShowCSV(!showCSV)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            {showCSV ? 'Hide CSV View' : 'Show CSV View'}
          </button>
          <button
            onClick={handleDownloadCSV}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Download CSV
          </button>
          <button
            onClick={handleDownloadExcel}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Download Excel
          </button>
        </div>
      </div>

      {showCSV ? (
        <div className="bg-gray-50 rounded-lg p-4 overflow-auto">
          <pre className="text-sm font-mono whitespace-pre-wrap">{csvContent}</pre>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border border-gray-300">
                  Test Case ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border border-gray-300">
                  Description
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border border-gray-300">
                  Steps
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border border-gray-300">
                  Expected Result
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border border-gray-300">
                  Priority
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border border-gray-300">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {testCases.map((tc, idx) => (
                <tr key={tc.id || idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border border-gray-300">
                    {tc.testCaseId}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 border border-gray-300">
                    {tc.description}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 border border-gray-300">
                    {tc.steps}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 border border-gray-300">
                    {tc.expectedResult}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border border-gray-300">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      tc.priority === 'High' ? 'bg-red-100 text-red-800' :
                      tc.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {tc.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border border-gray-300">
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                      {tc.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

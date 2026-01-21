import * as XLSX from 'xlsx'
import Papa from 'papaparse'
import ExcelJS from 'exceljs'

export interface TestCase {
  id: string
  testCaseId: string
  description: string
  steps: string
  expectedResult: string
  priority: string
  status: string
}

// Helper function to get priority color
function getPriorityColor(priority: string): { bg: string; fg: string } {
  const priorityLower = priority.toLowerCase()
  if (priorityLower === 'high') {
    return { bg: 'FFFF0000', fg: 'FFFFFFFF' } // Red background (ARGB: FF FF 00 00), white text
  } else if (priorityLower === 'medium') {
    return { bg: 'FFFFFF00', fg: 'FF000000' } // Yellow background (ARGB: FF FF FF 00), black text
  } else {
    return { bg: 'FF00FF00', fg: 'FF000000' } // Green background (ARGB: FF 00 FF 00), black text
  }
}

export async function generateExcel(testCases: TestCase[]) {
  // Create a new workbook and worksheet
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Test Cases')

  // Define columns
  worksheet.columns = [
    { header: 'Test Case ID', key: 'testCaseId', width: 15 },
    { header: 'Description', key: 'description', width: 40 },
    { header: 'Steps', key: 'steps', width: 50 },
    { header: 'Expected Result', key: 'expectedResult', width: 40 },
    { header: 'Priority', key: 'priority', width: 12 },
    { header: 'Status', key: 'status', width: 12 },
  ]

  // Style the header row
  worksheet.getRow(1).font = { bold: true, size: 12 }
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE0E0E0' }, // Light gray background
  }
  worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' }

  // Add data rows with color formatting for priority
  testCases.forEach((tc, index) => {
    const row = worksheet.addRow({
      testCaseId: tc.testCaseId,
      description: tc.description,
      steps: tc.steps,
      expectedResult: tc.expectedResult,
      priority: tc.priority,
      status: tc.status,
    })

    // Apply color to priority column based on priority value
    const priorityCell = row.getCell(5) // Priority is column 5 (E)
    const colors = getPriorityColor(tc.priority)
    priorityCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: colors.bg },
    }
    priorityCell.font = {
      color: { argb: colors.fg },
      bold: true,
    }
    priorityCell.alignment = { vertical: 'middle', horizontal: 'center' }

    // Add borders to all cells
    row.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      }
    })
  })

  // Generate Excel file
  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', 'test_cases.xlsx')
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function generateCSV(testCases: TestCase[], returnString: boolean = false): string | void {
  // Prepare data for CSV
  const csvData = testCases.map(tc => ({
    'Test Case ID': tc.testCaseId,
    'Description': tc.description,
    'Steps': tc.steps,
    'Expected Result': tc.expectedResult,
    'Priority': tc.priority,
    'Status': tc.status,
  }))

  const csv = Papa.unparse(csvData)

  if (returnString) {
    return csv
  }

  // Create blob and download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', 'test_cases.csv')
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

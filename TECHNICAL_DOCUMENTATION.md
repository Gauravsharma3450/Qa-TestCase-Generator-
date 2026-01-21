# Technical Documentation
## QA Test Case Generator

**Version:** 1.0.0  
**Last Updated:** 2024  
**Technology Stack:** Next.js 14, React 18, TypeScript, Groq API, ExcelJS

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [API Routes](#api-routes)
5. [Components](#components)
6. [Utilities](#utilities)
7. [Configuration](#configuration)
8. [Environment Variables](#environment-variables)
9. [File Upload & Validation](#file-upload--validation)
10. [Error Handling](#error-handling)
11. [Deployment](#deployment)
12. [Troubleshooting](#troubleshooting)

---

## Architecture Overview

The application is built using Next.js 14 with the App Router architecture. It follows a client-server model where:

- **Frontend**: React components with client-side state management
- **Backend**: Next.js API routes handling AI integration and file processing
- **AI Service**: Groq API (llama-3.3-70b-versatile model) for test case generation
- **File Generation**: ExcelJS for Excel files with formatting, PapaParse for CSV

### System Flow

```
User Input (Screenshot/Text) 
  → API Route (/api/generate)
    → Groq API (AI Processing)
      → JSON Response Parsing
        → Test Cases Display
          → Excel/CSV Export
```

---

## Technology Stack

### Core Framework
- **Next.js 14.0.4**: React framework with App Router
- **React 18.2.0**: UI library
- **TypeScript 5.3.3**: Type safety

### Styling
- **Tailwind CSS 3.4.0**: Utility-first CSS framework
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixing

### AI Integration
- **Groq SDK 0.3.3**: Groq API client
- **Model**: llama-3.3-70b-versatile

### File Processing
- **ExcelJS 4.4.0**: Excel file generation with styling
- **PapaParse 5.4.1**: CSV parsing and generation
- **xlsx 0.18.5**: Legacy Excel support (kept for compatibility)

### Development Tools
- **ESLint**: Code linting
- **TypeScript**: Static type checking

---

## Project Structure

```
d:\Assignment\
├── app/
│   ├── api/
│   │   ├── chat/
│   │   │   └── route.ts          # Chat API endpoint
│   │   ├── generate/
│   │   │   └── route.ts          # Test case generation endpoint
│   ├── error.tsx                  # Error boundary component
│   ├── global-error.tsx           # Global error handler
│   ├── globals.css                # Global styles
│   ├── layout.tsx                 # Root layout
│   ├── not-found.tsx              # 404 page
│   └── page.tsx                   # Main application page
├── components/
│   ├── ChatInterface.tsx          # Chat UI component
│   ├── ImageUpload.tsx            # File upload component
│   ├── TestCaseViewer.tsx         # Test cases display component
│   └── TextInput.tsx              # Text input component
├── utils/
│   └── fileGenerator.ts           # Excel/CSV generation utilities
├── next.config.js                 # Next.js configuration
├── package.json                   # Dependencies and scripts
├── tailwind.config.js             # Tailwind configuration
├── tsconfig.json                  # TypeScript configuration
└── .env.local                     # Environment variables (not in repo)
```

---

## API Routes

### POST `/api/generate`

**Purpose**: Generate test cases from screenshot and/or text input

**Request Body** (FormData):
- `screenshot`: File (optional, max 10MB, image/*)
- `textInput`: string (optional)
- `chatHistory`: string (JSON stringified array)

**Response**:
```json
{
  "testCases": [
    {
      "id": "unique_id",
      "testCaseId": "TC001",
      "description": "Test description",
      "steps": "Step-by-step instructions",
      "expectedResult": "Expected outcome",
      "priority": "High|Medium|Low",
      "status": "Not Executed"
    }
  ],
  "chatHistory": [...]
}
```

**Error Responses**:
- `400`: Invalid file type or size, missing input
- `500`: API error, parsing error

**Configuration**:
- Runtime: `nodejs`
- Max Duration: 30 seconds
- File Size Limit: 10MB
- File Type Validation: image/* only

---

### POST `/api/chat`

**Purpose**: Refine or modify existing test cases through chat

**Request Body** (FormData):
- `screenshot`: File (optional, max 10MB)
- `textInput`: string (optional)
- `chatHistory`: string (JSON stringified array)
- `userMessage`: string (required)

**Response**: Same as `/api/generate`

**Configuration**: Same as `/api/generate`

---

## Components

### `ImageUpload.tsx`

**Props**:
```typescript
interface ImageUploadProps {
  onFileChange: (file: File | null) => void
  preview: string | null
}
```

**Features**:
- Drag & drop support
- Click to upload
- Image preview
- Client-side validation (10MB limit, image types only)
- File removal

**Validation**:
- File type: Must start with `image/`
- File size: Maximum 10MB
- Error messages displayed via alerts

---

### `TextInput.tsx`

**Props**:
```typescript
interface TextInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}
```

**Features**:
- Multi-line text input
- Placeholder support
- Controlled component

---

### `ChatInterface.tsx`

**Props**:
```typescript
interface ChatInterfaceProps {
  onSendMessage: (message: string) => Promise<void>
  history: Array<{role: string, content: string}>
}
```

**Features**:
- Message history display
- User input field
- Send button
- Scrollable chat area
- Role-based message styling (user/assistant)

---

### `TestCaseViewer.tsx`

**Props**:
```typescript
interface TestCaseViewerProps {
  testCases: TestCase[]
}
```

**Features**:
- Table view of test cases
- CSV view toggle
- Excel download (with color formatting)
- CSV download
- Priority color coding (High=Red, Medium=Yellow, Low=Green)

---

## Utilities

### `fileGenerator.ts`

#### `generateExcel(testCases: TestCase[]): Promise<void>`

Generates an Excel file with:
- Color-coded priority column
- Formatted header row
- Cell borders
- Optimized column widths
- Bold priority text

**Priority Colors**:
- High: Red background (#FF0000), white text
- Medium: Yellow background (#FFFF00), black text
- Low: Green background (#00FF00), black text

**Dependencies**: ExcelJS

---

#### `generateCSV(testCases: TestCase[], returnString?: boolean): string | void`

Generates CSV file or returns CSV string.

**Parameters**:
- `testCases`: Array of test case objects
- `returnString`: If true, returns CSV string instead of downloading

**Dependencies**: PapaParse

---

## Configuration

### `next.config.js`

```javascript
{
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb'
    }
  }
}
```

**Settings**:
- React Strict Mode: Enabled
- Server Actions Body Limit: 10MB

---

### `tailwind.config.js`

Standard Tailwind CSS configuration with default theme.

---

### `tsconfig.json`

TypeScript configuration for Next.js 14 with strict type checking.

---

## Environment Variables

### Required

**`.env.local`** (create in project root):

```env
GROQ_API_KEY=your_groq_api_key_here
```

**Note**: Never commit `.env.local` to version control.

---

## File Upload & Validation

### Client-Side Validation

**Location**: `components/ImageUpload.tsx`

**Checks**:
1. File type: `file.type.startsWith('image/')`
2. File size: `file.size <= 10 * 1024 * 1024` (10MB)

**Error Handling**: Alerts user with specific error messages

---

### Server-Side Validation

**Location**: `app/api/generate/route.ts`, `app/api/chat/route.ts`

**Checks**:
1. File type validation
2. File size validation (10MB)
3. Returns HTTP 400 with descriptive error messages

**Error Response Example**:
```json
{
  "error": "File size (12.5MB) exceeds the 10MB limit. Please upload a smaller image."
}
```

---

## Error Handling

### Error Components

1. **`app/error.tsx`**: Client-side error boundary
   - Catches runtime errors in the app
   - Displays error message
   - Provides "Try again" button

2. **`app/global-error.tsx`**: Global error handler
   - Catches errors in root layout
   - Must include `<html>` and `<body>` tags

3. **`app/not-found.tsx`**: 404 page
   - Custom 404 error page
   - Link back to home

### API Error Handling

All API routes use try-catch blocks:
- Logs errors to console
- Returns appropriate HTTP status codes
- Provides user-friendly error messages

---

## Deployment

### Build Process

```bash
npm run build
```

**Output**: `.next` directory with optimized production build

### Start Production Server

```bash
npm start
```

### Environment Setup for Production

1. Set `GROQ_API_KEY` environment variable
2. Ensure Node.js 18+ is installed
3. Run `npm install --production` (or `npm ci`)

### Vercel Deployment

1. Connect repository to Vercel
2. Add `GROQ_API_KEY` in Vercel environment variables
3. Deploy automatically on push

**Note**: API routes have `maxDuration: 30` which may need adjustment for Vercel Pro plan.

---

## Troubleshooting

### Common Issues

#### 1. "Missing required error components"

**Solution**: Ensure all error components exist:
- `app/error.tsx`
- `app/global-error.tsx`
- `app/not-found.tsx`

Clear `.next` cache and restart:
```bash
rm -rf .next
npm run dev
```

---

#### 2. "GROQ_API_KEY is not configured"

**Solution**: 
1. Create `.env.local` in project root
2. Add: `GROQ_API_KEY=your_key_here`
3. Restart dev server

---

#### 3. "Model decommissioned" Error

**Solution**: Model has been updated to `llama-3.3-70b-versatile`. If you see this error, ensure you're using the latest code.

---

#### 4. File Upload Size Limit

**Current Limit**: 10MB

**To Change**:
1. Update `MAX_FILE_SIZE` in API routes
2. Update client-side validation in `ImageUpload.tsx`
3. Update `next.config.js` if needed

---

#### 5. Excel File Not Downloading

**Check**:
- Browser console for errors
- ExcelJS is installed: `npm list exceljs`
- Function is async: `await generateExcel(testCases)`

---

### Performance Considerations

1. **Large Files**: 10MB limit prevents memory issues
2. **API Timeout**: 30-second limit for API routes
3. **Chat History**: Stored in memory, consider pagination for large histories
4. **Excel Generation**: Async operation, may take time for large datasets

---

## API Integration Details

### Groq API Configuration

**Model**: `llama-3.3-70b-versatile`

**Parameters**:
- `max_tokens`: 2000
- `temperature`: 0.7

**System Prompt**: Configured to generate test cases in JSON format with specific structure.

**Note**: Groq models don't support direct image input. Screenshots are processed and described in text format.

---

## Security Considerations

1. **API Key**: Stored in `.env.local`, never committed
2. **File Validation**: Both client and server-side
3. **Input Sanitization**: JSON parsing with error handling
4. **CORS**: Handled by Next.js (same-origin by default)

---

## Future Enhancements

1. Database integration for test case persistence
2. User authentication
3. Test case templates
4. Batch processing
5. Integration with test management tools
6. Image analysis using vision models (when available)

---

## Support & Maintenance

**Dependencies Update**:
```bash
npm update
npm audit fix
```

**Type Checking**:
```bash
npm run lint
```

**Build Verification**:
```bash
npm run build
```

---

**Document Version**: 1.0  
**Last Updated**: 2024

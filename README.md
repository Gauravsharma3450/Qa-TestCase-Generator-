# QA Test Case Generator

An AI-powered application for generating test cases from screenshots and text descriptions.

## Features

- 📸 Upload screenshots for analysis
- ✍️ Text input for requirements
- 🤖 AI-powered test case generation
- 💬 Chat interface for modifications
- 📊 Excel file generation
- 📄 CSV view and download

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the root directory:
```
OPENAI_API_KEY=your_openai_api_key_here
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Upload a screenshot of the feature you want to test
2. Enter your requirements in the text field
3. Click "Generate Test Cases" to let AI analyze and create test cases
4. Use the chat interface to refine or modify test cases
5. View test cases in CSV format or download as Excel file

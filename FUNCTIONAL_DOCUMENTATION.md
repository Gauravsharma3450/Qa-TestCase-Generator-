# Functional Documentation
## QA Test Case Generator

**Version:** 1.0.0  
**Last Updated:** 2026  
**Target Audience:** QA Testers, Project Managers, Business Analysts

---

## Table of Contents

1. [Overview](#overview)
2. [Purpose & Objectives](#purpose--objectives)
3. [Key Features](#key-features)
4. [User Requirements](#user-requirements)
5. [System Requirements](#system-requirements)
6. [Getting Started](#getting-started)
7. [User Guide](#user-guide)
8. [Feature Descriptions](#feature-descriptions)
9. [Use Cases](#use-cases)
10. [Output Formats](#output-formats)
11. [Limitations](#limitations)
12. [FAQ](#faq)

---

## Overview

The QA Test Case Generator is an AI-powered web application designed to help QA testers quickly create comprehensive test cases from screenshots and text descriptions. The application uses artificial intelligence to analyze user inputs and automatically generate structured test cases that can be exported to Excel or CSV formats.

---

## Purpose & Objectives

### Primary Purpose

To streamline the test case creation process by:
- Reducing manual effort in writing test cases
- Ensuring comprehensive test coverage (positive, negative, edge cases)
- Providing structured, consistent test case formats
- Enabling quick export to standard formats (Excel/CSV)

### Key Objectives

1. **Efficiency**: Generate multiple test cases in seconds
2. **Quality**: AI ensures comprehensive coverage
3. **Flexibility**: Support both visual (screenshot) and textual inputs
4. **Collaboration**: Chat interface for refining test cases
5. **Portability**: Export to commonly used formats

---

## Key Features

### 1. Screenshot Upload
- Drag & drop or click to upload
- Image preview before submission
- Support for common image formats (PNG, JPG, GIF, etc.)
- Maximum file size: 10MB

### 2. Text Input
- Multi-line text area for requirements
- Flexible input format
- Can be used alone or with screenshots

### 3. AI-Powered Generation
- Automatic test case generation
- Covers positive, negative, and edge cases
- Generates 5-10 test cases per request
- Structured output with all required fields

### 4. Chat Interface
- Interactive refinement of test cases
- Natural language modifications
- Context-aware responses
- Maintains conversation history

### 5. Test Case Display
- Clean, organized table view
- Color-coded priority indicators
- Scrollable for large datasets
- Real-time updates

### 6. Export Options
- **Excel Export**: Formatted with colors, borders, and styling
- **CSV Export**: Plain text format for compatibility
- **CSV View**: Preview CSV format before download

---

## User Requirements

### Prerequisites

1. **Web Browser**: Modern browser (Chrome, Firefox, Edge, Safari)
2. **Internet Connection**: Required for AI processing
3. **Groq API Key**: Provided by administrator or obtained from Groq

### User Skills

- Basic computer literacy
- Understanding of test case concepts
- Ability to describe requirements clearly

---

## System Requirements

### Minimum Requirements

- **Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Screen Resolution**: 1280x720 minimum
- **Internet**: Stable connection for API calls

### Recommended

- **Browser**: Latest version
- **Screen Resolution**: 1920x1080 or higher
- **Internet**: Broadband connection

---

## Getting Started

### Initial Setup

1. **Access the Application**
   - Navigate to the application URL (provided by administrator)
   - Or run locally: `http://localhost:3000`

2. **Verify Access**
   - Application should load without errors
   - You should see the main interface

### First-Time Use

1. Prepare a screenshot or text description of the feature to test
2. Follow the [User Guide](#user-guide) below
3. Review generated test cases
4. Export to Excel or CSV as needed

---

## User Guide

### Step 1: Upload Screenshot (Optional)

1. Click on the upload area or drag & drop an image
2. Supported formats: PNG, JPG, GIF, WEBP, etc.
3. Maximum file size: 10MB
4. Preview will appear if upload is successful
5. Click "Remove Image" to change or remove

**Tips**:
- Use clear, high-quality screenshots
- Crop to focus on the feature being tested
- Ensure text in screenshots is readable

---

### Step 2: Enter Requirements (Optional)

1. Type your requirements in the text area
2. Be specific about what needs to be tested
3. Include any constraints or special conditions
4. You can use either screenshot OR text, or both

**Example Requirements**:
```
Test the login functionality with:
- Valid username and password
- Invalid credentials
- Empty fields
- Password visibility toggle
- Remember me checkbox
```

---

### Step 3: Generate Test Cases

1. Click the **"Generate Test Cases"** button
2. Wait for processing (typically 5-15 seconds)
3. Test cases will appear in the table below

**What Happens**:
- AI analyzes your input
- Generates 5-10 comprehensive test cases
- Covers positive, negative, and edge cases
- Assigns priorities automatically

---

### Step 4: Review Test Cases

The generated test cases include:

- **Test Case ID**: Unique identifier (TC001, TC002, etc.)
- **Description**: What is being tested
- **Steps**: Step-by-step instructions
- **Expected Result**: What should happen
- **Priority**: High, Medium, or Low (color-coded)
- **Status**: Default "Not Executed"

**Priority Colors**:
- 🔴 **High**: Red background
- 🟡 **Medium**: Yellow background
- 🟢 **Low**: Green background

---

### Step 5: Refine with Chat (Optional)

1. Click **"Open Chat"** button
2. Type your modification request
3. Examples:
   - "Change TC001 priority to High"
   - "Add a test case for mobile view"
   - "Remove test case TC005"
4. Click **"Send"**
5. Test cases will update automatically

**Chat Examples**:
```
"Make all test cases high priority"
"Add test cases for error messages"
"Update TC002 to include boundary value testing"
```

---

### Step 6: Export Test Cases

#### Excel Export

1. Click **"Download Excel"** button
2. File downloads as `test_cases.xlsx`
3. Opens in Excel with:
   - Color-coded priority column
   - Formatted headers
   - Cell borders
   - Optimized column widths

#### CSV Export

1. Click **"Download CSV"** button
2. File downloads as `test_cases.csv`
3. Compatible with any spreadsheet application

#### CSV Preview

1. Click **"Show CSV View"** button
2. View CSV format in browser
3. Click **"Hide CSV View"** to return to table

---

## Feature Descriptions

### Screenshot Analysis

**How It Works**:
- Screenshot is uploaded to the server
- AI analyzes the visual content (described in text)
- Generates test cases based on UI elements visible

**Best Practices**:
- Use clear, focused screenshots
- Include relevant UI elements
- Avoid cluttered or unclear images

---

### Text-Based Generation

**How It Works**:
- Text requirements are sent to AI
- AI interprets the requirements
- Generates appropriate test cases

**Best Practices**:
- Be specific and detailed
- Include acceptance criteria
- Mention edge cases if known

---

### Chat Interface

**How It Works**:
- Maintains conversation context
- Understands previous test cases
- Applies modifications intelligently

**Capabilities**:
- Modify existing test cases
- Add new test cases
- Remove test cases
- Change priorities
- Update descriptions

---

### Priority Assignment

**Automatic Assignment**:
- AI assigns priorities based on:
  - Criticality of functionality
  - Risk assessment
  - Business impact

**Manual Override**:
- Use chat to change priorities
- Example: "Make TC001 high priority"

---

## Use Cases

### Use Case 1: New Feature Testing

**Scenario**: QA tester receives a new login feature to test

**Steps**:
1. Take screenshot of login page
2. Enter requirements: "Test login with valid/invalid credentials"
3. Generate test cases
4. Review and refine if needed
5. Export to Excel for test execution

**Expected Outcome**: 5-10 comprehensive test cases covering all scenarios

---

### Use Case 2: Regression Testing

**Scenario**: Need to create test cases for existing feature

**Steps**:
1. Enter detailed text requirements
2. Generate test cases
3. Use chat to add specific regression scenarios
4. Export for test plan

**Expected Outcome**: Complete regression test suite

---

### Use Case 3: Quick Test Case Creation

**Scenario**: Need test cases quickly for a demo

**Steps**:
1. Upload screenshot
2. Generate test cases
3. Export immediately
4. Refine later if needed

**Expected Outcome**: Quick test case generation in under a minute

---

## Output Formats

### Excel Format (.xlsx)

**Structure**:
- Sheet name: "Test Cases"
- Columns: Test Case ID, Description, Steps, Expected Result, Priority, Status
- Formatting:
  - Header row: Gray background, bold text
  - Priority column: Color-coded (Red/Yellow/Green)
  - All cells: Borders, proper alignment
  - Column widths: Optimized for readability

**Compatibility**: Microsoft Excel, Google Sheets, LibreOffice Calc

---

### CSV Format (.csv)

**Structure**:
- Comma-separated values
- Headers in first row
- UTF-8 encoding
- Compatible with all spreadsheet applications

**Use Cases**:
- Import into test management tools
- Version control
- Data analysis

---

## Limitations

### File Upload

- **Maximum Size**: 10MB per image
- **Supported Formats**: Image files only (PNG, JPG, GIF, etc.)
- **No Batch Upload**: One image at a time

### AI Generation

- **Model Limitations**: Groq models don't support direct image analysis
- **Context Window**: Limited by API constraints
- **Accuracy**: Depends on input quality and clarity

### Chat Interface

- **Context**: Maintains conversation history in memory
- **Large Histories**: May slow down with extensive conversations

### Export

- **Excel**: Limited to ~65,000 rows (Excel limitation)
- **CSV**: No practical limit, but large files may be slow

---

## FAQ

### Q1: Can I upload multiple screenshots at once?

**A**: Currently, only one screenshot at a time is supported. Upload one, generate test cases, then upload another if needed.

---

### Q2: What if the generated test cases are not accurate?

**A**: Use the chat interface to refine them. You can ask the AI to modify, add, or remove test cases. Be specific in your requests.

---

### Q3: Can I save test cases in the application?

**A**: Currently, test cases are not saved in the application. Export them to Excel or CSV to save locally.

---

### Q4: What happens if my file is larger than 10MB?

**A**: You'll receive an error message. Compress the image or use a smaller screenshot. The application validates file size both on client and server.

---

### Q5: Can I use the application offline?

**A**: No, the application requires an internet connection to communicate with the Groq API for AI processing.

---

### Q6: How many test cases are generated?

**A**: Typically 5-10 test cases per generation. You can use chat to request more or fewer test cases.

---

### Q7: Can I customize the test case format?

**A**: The format is standardized. However, you can modify descriptions, steps, and priorities using the chat interface.

---

### Q8: Is my data secure?

**A**: 
- Screenshots and data are processed through secure API calls
- No data is stored on the server
- API keys are stored securely in environment variables
- All processing happens in real-time

---

### Q9: What browsers are supported?

**A**: Modern browsers including Chrome, Firefox, Safari, and Edge (latest versions recommended).

---

### Q10: Can I integrate this with test management tools?

**A**: Export to CSV format and import into your test management tool. Most tools support CSV import.

---

## Best Practices

### For Screenshot Upload

1. ✅ Use clear, high-resolution images
2. ✅ Focus on the feature being tested
3. ✅ Ensure text is readable
4. ✅ Avoid cluttered screenshots
5. ❌ Don't upload very large files (>10MB)

### For Text Requirements

1. ✅ Be specific and detailed
2. ✅ Include acceptance criteria
3. ✅ Mention edge cases
4. ✅ Use clear language
5. ❌ Don't use vague descriptions

### For Chat Refinement

1. ✅ Be specific in requests
2. ✅ Reference test case IDs when needed
3. ✅ Ask for one change at a time for clarity
4. ✅ Review changes before making more
5. ❌ Don't use ambiguous language

---

## Support & Feedback

For technical issues or feature requests, contact your system administrator or development team.

---

**Document Version**: 1.0  
**Last Updated**: 2024

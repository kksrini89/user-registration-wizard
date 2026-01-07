# User Registration Wizard

A multi-step registration wizard to collect user information and their preferences.

## Overview

This wizard guides users through a 7-step registration process:

### Step 1: Account Information
- Email address (with format validation)
- Username
- Password (minimum 6 characters)
- Confirm password (must match)

### Step 2: Personal Details
- Full name
- Date of birth (date picker)
- Gender (dropdown)
- **State selection via clickable SVG map** ← Custom component

### Step 3: Email Verification
- OTP code input (6 digits, simulated)
- Help text explaining this is a demo

### Step 4: Business Details
- Company name
- Company size dropdown (1-10, 11-50, 51+)
- **Conditional field:** "Do you have an ops team?" (only shows if size is 51+)

### Step 5: Security & Password
- Password field with real-time strength meter ← Custom component
- Confirm password
- Help text showing requirements

### Step 6: Communication Preferences
- Newsletter subscription checkbox
- Marketing emails checkbox
- Product notifications checkbox
- Onboarding assistance checkbox

### Step 7: Review & Submit
- Displays all user-entered data organized by section
- Final submit button

## Run Instructions

1. **No installation needed!** The project uses only HTML, CSS, and JavaScript.

2. Open the project folder:
   ```bash
   cd <dir_name>
   ```

3. Either:
   - Open `index.html` in your web browser:
     - Double-click `index.html`, or Right-click → Open with your browser, or
   - Use a local server

4. After filling each step of the form, click **Next** to proceed to thenext step.

## Important Things

- User's typed data automatically persists when they click "Back"—no need for complex restore logic

- We use JS plain object for storing user data that's collected from the form fields

- Custom Components we built:
  - SVG map for state selection
  - Password strength meter

- Validation runs **before** moving to next step, so invalid data never gets saved.

## UX Expectations

- **Progress bar (visual and numeric)**  
- **Back/Next buttons with validation**  
- **Data preservation on back navigation**  
- **Final review step with summary**

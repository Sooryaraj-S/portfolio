# Google Sheets Integration Setup Guide

## Overview
This guide shows how to automatically save contact form submissions to a Google Sheet.

## Prerequisites
- Google Account
- Google Cloud Project (free tier available)
- Node.js backend running

## Step-by-Step Setup

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click the project dropdown at the top
3. Click **"New Project"**
4. Enter project name: "Portfolio Contact Form"
5. Click **Create**
6. Wait for project creation (may take a moment)

### 2. Enable Google Sheets API

1. In Google Cloud Console, search for **"Sheets API"**
2. Click on **Google Sheets API**
3. Click **Enable**
4. You'll be redirected to the API details page

### 3. Create a Service Account

1. In Google Cloud Console, go to **APIs & Services** → **Credentials**
2. Click **+ Create Credentials** → **Service Account**
3. Fill in service account details:
   - **Service account name**: "portfolio-contact-bot"
   - Click **Create and Continue**
4. Grant roles (click **Continue** if you don't need to grant roles)
5. Click **Done**

### 4. Generate Service Account Key

1. In Credentials page, click on the service account you just created
2. Go to **Keys** tab
3. Click **Add Key** → **Create new key**
4. Select **JSON**
5. Click **Create**
6. A JSON file will download - **save this securely**

### 5. Create a Google Sheet

1. Go to [Google Sheets](https://docs.google.com/spreadsheets)
2. Click **+ Create new spreadsheet**
3. Name it: "Portfolio Contact Submissions"
4. Add headers in the first row:
   - A1: `Timestamp`
   - B1: `Name`
   - C1: `Email`
   - D1: `Subject`
   - E1: `Message`

### 6. Share Sheet with Service Account

1. Copy the **client_email** from the JSON key file
   ```
   Example: portfolio-contact-bot@project-id.iam.gserviceaccount.com
   ```

2. Open your Google Sheet (from Step 5)
3. Click **Share** button (top right)
4. Paste the service account email
5. Give it **Editor** permission
6. Click **Share**

### 7. Get Spreadsheet ID

1. Open your Google Sheet
2. Copy the ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/[THIS_IS_YOUR_ID]/edit
   ```

### 8. Configure Environment Variables

1. In your Portfolio folder, create or update the `.env` file
2. Add the following (from your JSON key file and Spreadsheet ID):

   ```env
   GOOGLE_SERVICE_ACCOUNT_EMAIL=portfolio-contact-bot@your-project.iam.gserviceaccount.com
   GOOGLE_SERVICE_ACCOUNT_KEY={"type": "service_account", "project_id": "your-project-id", ...}
   GOOGLE_SHEETS_SPREADSHEET_ID=your-spreadsheet-id-here
   ```

   **OR** Save the JSON key file directly:

   1. Place the downloaded JSON key file in your portfolio folder as `service-account-key.json`
   2. Update `.env`:
      ```env
      GOOGLE_SERVICE_ACCOUNT_KEY_FILE=./service-account-key.json
      GOOGLE_SHEETS_SPREADSHEET_ID=your-spreadsheet-id-here
      ```

### 9. Install Dependencies

```bash
npm install
```

### 10. Test the Integration

1. Start your backend:
   ```bash
   npm start
   ```

2. Submit a test message through your portfolio contact form
3. Check your Google Sheet - the message should appear!

## Troubleshooting

### "Spreadsheet ID not configured"
- Make sure `GOOGLE_SHEETS_SPREADSHEET_ID` is set in `.env`
- Verify the ID is correct (copy from URL again)

### "Permission denied" error
- Verify the service account email has Editor access to the Google Sheet
- Re-share the sheet with the service account email
- Wait a minute for permissions to propagate

### "Invalid API key" error
- Check the JSON key file is correctly copied to `.env`
- Ensure the file hasn't been modified

### Check Google Sheets API is enabled
- Go to Google Cloud Console → APIs & Services → Enabled APIs
- Verify "Google Sheets API" is listed

## Security Notes ⚠️

1. **Never commit `.env` file to Git** - Add it to `.gitignore`
2. **Never share the service account JSON key publicly**
3. **Keep the JSON key file secure**
4. For production, use environment variables through your hosting platform

## Advanced: Alternative Setup with API Key

If you don't want to use a service account, you can use an API key (simpler but less secure):

1. In Google Cloud Console → Credentials
2. Click **+ Create Credentials** → **API Key**
3. Copy the API key
4. Add to `.env`:
   ```env
   GOOGLE_SHEETS_API_KEY=your-api-key-here
   GOOGLE_SHEETS_SPREADSHEET_ID=your-spreadsheet-id-here
   ```

> **Note**: API key method requires the sheet to be publicly readable. Service account is recommended for better security.

## Monitor Your Submissions

- Check your Google Sheet to see all submissions in real-time
- You can add formulas, charts, or sorting in Google Sheets
- Export data for analysis or reporting

## Support

For more information:
- [Google Sheets API Documentation](https://developers.google.com/sheets/api)
- [Google Cloud Documentation](https://cloud.google.com/docs)
- Contact: sooryaraj.dev@gmail.com

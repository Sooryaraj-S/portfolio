# Portfolio Contact Backend Setup

## Overview
This backend handles contact form submissions from your portfolio. It's built with Node.js and Express.

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run the Server**
   ```bash
   npm start
   ```

The server will start on: **http://localhost:5000**

---

## Save Contact Information to Google Sheets

### ⭐ Simplest Option (Recommended - 5 minutes)

Choose ONE of these easy methods:

1. **Web3Forms** (Recommended) - [Setup Guide](GOOGLE_SHEETS_EASY_OPTIONS.md#option-2-using-web3forms-simple---5-minutes)
2. **Google Forms** - [Setup Guide](GOOGLE_SHEETS_EASY_OPTIONS.md#option-3-using-google-forms-embedded---10-minutes)
3. **Formspree** - [Setup Guide](GOOGLE_SHEETS_EASY_OPTIONS.md#option-1-using-formspree-easiest---5-minutes)

See [GOOGLE_SHEETS_EASY_OPTIONS.md](GOOGLE_SHEETS_EASY_OPTIONS.md) for quick setup.

### Production Option

For advanced integration using Google Sheets API directly:
- See [GOOGLE_SHEETS_SETUP.md](GOOGLE_SHEETS_SETUP.md)
- Requires Google Cloud setup but most flexible

## API Endpoints

### 1. Submit Contact Form
**POST** `/api/contact`

Request body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Project Inquiry",
  "message": "I'd like to discuss a project..."
}
```

Response:
```json
{
  "success": true,
  "message": "Message received! I'll get back to you soon.",
  "data": {
    "id": 1234567890,
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Project Inquiry",
    "message": "I'd like to discuss a project...",
    "timestamp": "2024-02-10T10:30:00.000Z"
  }
}
```

### 2. View All Messages (Admin)
**GET** `/api/messages`

Returns all stored contact messages.

### 3. Delete a Message
**DELETE** `/api/messages/:id`

Deletes a specific message by ID.

### 4. Health Check
**GET** `/api/health`

Simple endpoint to verify the server is running.

## Features

✓ Form validation on backend
✓ CORS enabled for frontend
✓ In-memory message storage (upgrade to database for production)
✓ Email notification support (optional)
✓ Error handling and logging
✓ Admin endpoints for managing messages

## Email Notifications (Optional)

To enable email notifications:

1. Uncomment the `sendEmailNotification` function in `server.js`
2. Set up a Gmail app-specific password:
   - Enable 2-factor authentication on your Gmail account
   - Generate an app password
   - Add to `.env`:
     ```
     EMAIL_USER=your-email@gmail.com
     EMAIL_PASSWORD=your-app-password
     ADMIN_EMAIL=your-email@gmail.com
     ```

## Production Deployment

For production, consider:

1. **Database Integration** - Replace in-memory storage with MongoDB/PostgreSQL
2. **Authentication** - Add auth for admin endpoints
3. **Rate Limiting** - Prevent spam submissions
4. **Email Service** - Use SendGrid, Mailgun, or AWS SES
5. **HTTPS** - Enable SSL/TLS
6. **Environment Variables** - Use secure key management

## Troubleshooting

### "Cannot find module" error
```bash
npm install
```

### Connection refused on localhost:5000
Make sure the server is running:
```bash
npm start
```

### Frontend can't connect to backend
- Ensure backend is running on port 5000
- Check browser console for CORS errors
- Verify API endpoint URL in script.js

## Support

For issues or questions, contact: sooryaraj.dev@gmail.com

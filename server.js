// ============================================
// PORTFOLIO CONTACT FORM BACKEND
// ============================================

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { google } = require('googleapis');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('.'));

// Store messages in memory (for demo - replace with database in production)
const messages = [];

// Google Sheets Configuration
const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
const sheets = google.sheets('v4');

// ============================================
// ROUTES
// ============================================

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'Backend is running' });
});

// Contact form submission endpoint
app.post('/api/contact', (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Validation
        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email address'
            });
        }

        // Store message
        const newMessage = {
            id: Date.now(),
            name: name.trim(),
            email: email.trim(),
            subject: subject.trim(),
            message: message.trim(),
            timestamp: new Date().toISOString()
        };

        messages.push(newMessage);

        // Log to console (in production, save to database)
        console.log('New contact message:', newMessage);

        // Save to Google Sheets if configured
        if (SPREADSHEET_ID) {
            saveToGoogleSheets(newMessage)
                .then(() => console.log('✓ Message saved to Google Sheets'))
                .catch(error => console.error('Google Sheets error:', error.message));
        }

        // Send success response
        res.json({
            success: true,
            message: 'Message received! I\'ll get back to you soon.',
            data: newMessage
        });

        // TODO: Uncomment below to send email notification
        // sendEmailNotification(newMessage);

    } catch (error) {
        console.error('Error processing contact form:', error);
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.'
        });
    }
});

// Get all messages (admin endpoint - add authentication in production)
app.get('/api/messages', (req, res) => {
    res.json({
        total: messages.length,
        messages: messages
    });
});

// Delete a message (admin endpoint)
app.delete('/api/messages/:id', (req, res) => {
    const messageId = parseInt(req.params.id);
    const index = messages.findIndex(msg => msg.id === messageId);
    
    if (index === -1) {
        return res.status(404).json({
            success: false,
            message: 'Message not found'
        });
    }

    const deletedMessage = messages.splice(index, 1);
    res.json({
        success: true,
        message: 'Message deleted',
        data: deletedMessage[0]
    });
});

// ============================================
// GOOGLE SHEETS INTEGRATION
// ============================================

async function saveToGoogleSheets(message) {
    try {
        if (!SPREADSHEET_ID) {
            throw new Error('Google Sheets Spreadsheet ID not configured');
        }

        const auth = new google.auth.GoogleAuth({
            keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const authClient = await auth.getClient();
        const sheetsAPI = google.sheets({
            version: 'v4',
            auth: authClient
        });

        // Prepare data for Google Sheets
        const values = [[
            new Date(message.timestamp).toLocaleString(),
            message.name,
            message.email,
            message.subject,
            message.message
        ]];

        // Append data to Google Sheets
        const response = await sheetsAPI.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Sheet1!A:E',
            valueInputOption: 'RAW',
            resource: {
                values: values
            }
        });

        return response.data;

    } catch (error) {
        console.error('Google Sheets Error:', error.message);
        throw error;
    }
}

// ============================================
// EMAIL NOTIFICATION (Optional)
// ============================================

// Uncomment the below function and configure your email service
/*
const nodemailer = require('nodemailer');

function sendEmailNotification(message) {
    // Configure your email service
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: message.email,
        to: process.env.ADMIN_EMAIL,
        subject: `New Contact Form: ${message.subject}`,
        html: `
            <h2>New Contact Message</h2>
            <p><strong>Name:</strong> ${message.name}</p>
            <p><strong>Email:</strong> ${message.email}</p>
            <p><strong>Subject:</strong> ${message.subject}</p>
            <p><strong>Message:</strong></p>
            <p>${message.message.replace(/\n/g, '<br>')}</p>
            <hr>
            <p><small>Received on: ${message.timestamp}</small></p>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Email error:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}
*/

// ============================================
// ERROR HANDLING
// ============================================

app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
    console.log(`\n✓ Server running on http://localhost:${PORT}`);
    console.log(`✓ Contact API: POST http://localhost:${PORT}/api/contact`);
    console.log(`✓ View messages: GET http://localhost:${PORT}/api/messages\n`);
});

module.exports = app;

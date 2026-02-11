# Quick Alternative: Simple Google Sheets Integration

If the Service Account setup is too complex, here's a simpler approach:

## Option 1: Using Formspree (Easiest - 5 minutes)

### Steps:

1. Go to [Formspree.io](https://formspree.io)
2. Sign up with your Gmail account
3. Create a new form, set email to where you want notifications
4. You'll get an endpoint like: `https://formspree.io/f/YOUR_ID`
5. Update your backend `script.js`:

```javascript
// Replace the fetch URL with:
fetch('https://formspree.io/f/YOUR_ID', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
})
```

Then connect Formspree to Google Sheets (they have built-in integration).

---

## Option 2: Using Web3Forms (Simple - 5 minutes)

1. Go to [Web3Forms.com](https://web3forms.com)
2. Get a free access key
3. Add to your `script.js`:

```javascript
const formData = new FormData();
formData.append('access_key', 'YOUR_ACCESS_KEY');
formData.append('name', nameField.value);
formData.append('email', emailField.value);
formData.append('subject', subjectField.value);
formData.append('message', messageField.value);

fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    body: formData
})
```

Web3Forms can auto-save to Google Sheets via Zapier integration.

---

## Option 3: Using Google Forms (Embedded - 10 minutes)

1. Create a Google Form at [forms.google.com](https://forms.google.com)
2. Create fields: Name, Email, Subject, Message
3. In Form Settings → Responses → Create Spreadsheet
4. Embed the form in your portfolio:

```html
<iframe src="https://docs.google.com/forms/d/YOUR_FORM_ID/viewform" width="100%" height="600"></iframe>
```

Data auto-saves to Google Sheet!

---

## Option 4: Using Zapier (Most Powerful - 15 minutes)

1. Connect your backend to Google Sheets via Zapier
2. When form is submitted → Zapier catches it → Saves to Google Sheet
3. Zapier also sends you notifications

---

## My Recommendation:

- **Easiest & Quickest**: Use **Web3Forms** (Option 2)
- **Most User-Friendly**: Use **Google Forms** (Option 3)
- **Most Powerful**: Use **Zapier** (Option 4)
- **Production-Grade**: Use **Service Account** (from main guide)

All of these save data to Google Sheets automatically!

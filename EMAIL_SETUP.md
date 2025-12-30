# Email Notifications Setup Guide

NutriTrack now includes automatic email notifications for:
- ✅ Welcome email on registration
- ✅ Calorie goal achievement alerts
- ✅ Daily summary reminders (optional)
- ✅ Weekly reports (optional)

## Setup Instructions

### Option 1: Gmail (Recommended - Free)

**Step 1: Enable 2-Factor Authentication**
1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Click "Security" in the left menu
3. Enable "2-Step Verification"

**Step 2: Create App Password**
1. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. Select "Mail" and "Windows Computer" (or your device)
3. Click "Generate"
4. Copy the 16-character password

**Step 3: Update Environment Variables**
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
EMAIL_FROM=your-email@gmail.com
```

### Option 2: SendGrid (Free Tier - 100 emails/day)

**Step 1: Create SendGrid Account**
1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Verify your email
3. Go to Settings → API Keys
4. Create a new API key

**Step 2: Update Email Service**
In `server/src/services/email.ts`, uncomment the SendGrid configuration:

```typescript
const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY,
  },
});
```

**Step 3: Update Environment Variables**
```env
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=noreply@nutritrack.com
```

### Option 3: Other Email Services

Nodemailer supports many providers:
- Outlook/Hotmail
- Yahoo Mail
- Zoho
- Custom SMTP servers

Update the transporter configuration in `server/src/services/email.ts` accordingly.

## Email Types

### 1. Welcome Email
Sent automatically when a user registers.

**Triggers:**
- User creates new account

**Content:**
- Welcome message
- Getting started guide
- Feature overview

### 2. Calorie Goal Alert
Sent when user reaches their daily calorie goal.

**Triggers:**
- User logs a meal that reaches/exceeds daily goal

**Content:**
- Congratulations message
- Total calories logged
- Encouragement

### 3. Daily Reminder (Optional)
Can be sent daily to remind users to log meals.

**To Enable:**
Add a cron job in your backend:

```typescript
import cron from 'node-cron';

// Send daily reminder at 8 PM
cron.schedule('0 20 * * *', async () => {
  // Get all users and send daily summary
  const allUsers = await db.query.users.findMany();
  for (const user of allUsers) {
    // Calculate today's calories
    // Send email
  }
});
```

### 4. Weekly Report (Optional)
Sends a summary of the week's nutrition.

**To Enable:**
Add a cron job for weekly reports:

```typescript
// Send weekly report every Monday at 9 AM
cron.schedule('0 9 * * 1', async () => {
  // Calculate weekly stats
  // Send email
});
```

## Testing Email Locally

Use Mailtrap for testing without sending real emails:

1. Sign up at [mailtrap.io](https://mailtrap.io)
2. Create a testing inbox
3. Get SMTP credentials
4. Update `.env`:

```env
EMAIL_USER=your-mailtrap-user
EMAIL_PASSWORD=your-mailtrap-password
```

## Troubleshooting

### Emails Not Sending

**Check 1: Environment Variables**
```bash
# Verify .env is loaded
echo $EMAIL_USER
```

**Check 2: Gmail App Password**
- Ensure 2FA is enabled
- Use the 16-character app password (without spaces)
- Don't use your regular Gmail password

**Check 3: SendGrid API Key**
- Verify API key is valid
- Check SendGrid account has sending enabled
- Verify sender email is verified

**Check 4: Backend Logs**
```bash
# Check for email errors in console
npm run dev
```

### Rate Limiting

**Gmail:** 500 emails/day limit
**SendGrid (Free):** 100 emails/day limit

If you need more, upgrade your plan or use a dedicated email service.

### Email Delivery Issues

1. **Emails going to spam:**
   - Set up SPF records
   - Set up DKIM records
   - Use a branded domain

2. **Bounced emails:**
   - Verify recipient email addresses
   - Check for typos

3. **Delayed delivery:**
   - Check email service status
   - Verify network connectivity

## Production Checklist

- [ ] Email credentials configured in `.env`
- [ ] Email service account verified
- [ ] Test email sent successfully
- [ ] SPF/DKIM records configured (for custom domain)
- [ ] Email templates reviewed
- [ ] Rate limits considered
- [ ] Error logging set up
- [ ] Unsubscribe mechanism (if needed)

## Email Template Customization

To customize email templates, edit `server/src/services/email.ts`:

```typescript
export async function sendWelcomeEmail(email: string, userName: string) {
  // Customize HTML template here
  const html = `
    <div>Your custom HTML</div>
  `;
  
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Your custom subject',
    html,
  });
}
```

## Next Steps

1. Choose an email provider (Gmail recommended for testing)
2. Set up credentials
3. Update `.env` file
4. Test by registering a new account
5. Check email inbox for welcome email

For production, consider:
- Using a dedicated email service (SendGrid, Mailgun)
- Setting up branded domain
- Implementing unsubscribe links
- Adding email preferences to user profile

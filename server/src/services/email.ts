import nodemailer from 'nodemailer';

// Create transporter - configure based on your email provider
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD, // Use app-specific password for Gmail
  },
});

// Alternative: Using SendGrid
// const transporter = nodemailer.createTransport({
//   host: 'smtp.sendgrid.net',
//   port: 587,
//   auth: {
//     user: 'apikey',
//     pass: process.env.SENDGRID_API_KEY,
//   },
// });

export async function sendWelcomeEmail(email: string, userName: string) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@nutritrack.com',
      to: email,
      subject: 'Welcome to NutriTrack! 🥗',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4CAF50;">Welcome to NutriTrack! 🥗</h1>
          <p>Hi ${userName},</p>
          <p>Thank you for signing up! We're excited to help you track your nutrition and achieve your health goals.</p>
          
          <h2 style="color: #333;">Getting Started:</h2>
          <ul>
            <li>📊 Log your meals daily to track calories</li>
            <li>📈 View monthly analytics and insights</li>
            <li>🍳 Create and save your favorite recipes</li>
            <li>📄 Upload diet plans and doctor consultations</li>
            <li>⚙️ Customize your daily calorie goals</li>
          </ul>
          
          <p style="margin-top: 30px; color: #666;">
            If you have any questions, feel free to reach out to our support team.
          </p>
          
          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            This is an automated email. Please do not reply directly to this message.
          </p>
        </div>
      `,
    });
    console.log(`Welcome email sent to ${email}`);
  } catch (error) {
    console.error('Failed to send welcome email:', error);
  }
}

export async function sendDailyReminderEmail(email: string, userName: string, totalCalories: number, goal: number) {
  try {
    const percentage = Math.round((totalCalories / goal) * 100);
    const remaining = Math.max(0, goal - totalCalories);

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@nutritrack.com',
      to: email,
      subject: `Daily Summary: ${totalCalories} kcal logged - NutriTrack`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4CAF50;">Daily Summary 📊</h1>
          <p>Hi ${userName},</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="margin-top: 0; color: #333;">Today's Nutrition</h2>
            <p style="font-size: 24px; font-weight: bold; color: #4CAF50; margin: 10px 0;">
              ${totalCalories} / ${goal} kcal
            </p>
            <p style="color: #666; margin: 10px 0;">
              Progress: ${percentage}%
            </p>
            <p style="color: #666; margin: 10px 0;">
              Remaining: ${remaining} kcal
            </p>
          </div>
          
          <p style="margin-top: 20px;">
            Keep up the great work! Continue logging your meals to stay on track with your goals.
          </p>
          
          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            This is an automated email. Please do not reply directly to this message.
          </p>
        </div>
      `,
    });
    console.log(`Daily reminder email sent to ${email}`);
  } catch (error) {
    console.error('Failed to send daily reminder email:', error);
  }
}

export async function sendWeeklyReportEmail(
  email: string,
  userName: string,
  weeklyStats: {
    totalCalories: number;
    averageCalories: number;
    mealsLogged: number;
    topMeal: string;
  }
) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@nutritrack.com',
      to: email,
      subject: 'Your Weekly Nutrition Report - NutriTrack',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4CAF50;">Weekly Report 📈</h1>
          <p>Hi ${userName},</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="margin-top: 0; color: #333;">This Week's Summary</h2>
            <table style="width: 100%; color: #333;">
              <tr>
                <td style="padding: 10px 0;">Total Calories:</td>
                <td style="text-align: right; font-weight: bold; color: #4CAF50;">${weeklyStats.totalCalories} kcal</td>
              </tr>
              <tr>
                <td style="padding: 10px 0;">Daily Average:</td>
                <td style="text-align: right; font-weight: bold; color: #4CAF50;">${weeklyStats.averageCalories} kcal</td>
              </tr>
              <tr>
                <td style="padding: 10px 0;">Meals Logged:</td>
                <td style="text-align: right; font-weight: bold; color: #4CAF50;">${weeklyStats.mealsLogged}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0;">Most Logged Meal:</td>
                <td style="text-align: right; font-weight: bold; color: #4CAF50;">${weeklyStats.topMeal}</td>
              </tr>
            </table>
          </div>
          
          <p style="margin-top: 20px;">
            Great job staying consistent! Keep logging your meals and you'll reach your goals in no time.
          </p>
          
          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            This is an automated email. Please do not reply directly to this message.
          </p>
        </div>
      `,
    });
    console.log(`Weekly report email sent to ${email}`);
  } catch (error) {
    console.error('Failed to send weekly report email:', error);
  }
}

export async function sendCalorieGoalAlert(email: string, userName: string, totalCalories: number, goal: number) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@nutritrack.com',
      to: email,
      subject: 'Calorie Goal Reached! 🎉 - NutriTrack',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4CAF50;">Goal Achieved! 🎉</h1>
          <p>Hi ${userName},</p>
          
          <p>Congratulations! You've reached your daily calorie goal of ${goal} kcal.</p>
          
          <div style="background-color: #e8f5e9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4CAF50;">
            <p style="margin: 0; font-size: 18px; font-weight: bold; color: #2e7d32;">
              Total Logged: ${totalCalories} kcal
            </p>
          </div>
          
          <p>You're doing amazing! Keep up the consistent tracking to maintain your health goals.</p>
          
          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            This is an automated email. Please do not reply directly to this message.
          </p>
        </div>
      `,
    });
    console.log(`Goal alert email sent to ${email}`);
  } catch (error) {
    console.error('Failed to send goal alert email:', error);
  }
}

export default transporter;

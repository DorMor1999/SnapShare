import axios from 'axios';

export const sendEventInvitationEmail = async (
  firstName: string,
  lastName: string,
  email: string,
  eventName: string
): Promise<void> => {
  const apiKey = process.env.BREVO_API_KEY;
  console.log('apiKey: ' + apiKey);
  const senderEmail = 'snapsharesup@gmail.com';
  const senderName = 'SnapShare';

  const fullName = `${firstName} ${lastName}`;

  const loginUrl = 'http://localhost:5173/login';
  const registerUrl = 'http://localhost:5173/register';
  const imageUrl = 'https://github.com/DorMor1999/SnapShare/blob/main/SnapShare/ProjectSpecification/logo.jpeg?raw=true';

  const data = {
    sender: {
      name: senderName,
      email: senderEmail,
    },
    to: [
      {
        email,
        name: fullName,
      },
    ],
    subject: `You're Invited to ${eventName} on SnapShare`,
    htmlContent: `
      <html>
      <body style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h1 style="margin-top: 15px;">Hello ${firstName},</h1>
        <p>You're invited to <strong>${eventName}</strong> on SnapShare!</p>

        <p>If you're already registered, click <strong>Login</strong>. Otherwise, click <strong>Register</strong> below:</p>

        <div style="margin-top: 20px;">
          <a href="${loginUrl}" style="text-decoration: none; padding: 12px 24px; background-color: #007BFF; color: white; border-radius: 5px; margin-right: 10px; display: inline-block;">Login</a>
          <a href="${registerUrl}" style="text-decoration: none; padding: 12px 24px; background-color: #28A745; color: white; border-radius: 5px; display: inline-block;">Register</a>
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <img src="${imageUrl}" alt="Event Banner" style="max-width: 100%; height: auto; border-radius: 10px;" />
        </div>
      </body>
    </html>
    `,
  };

  try {
    const response = await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey,
        },
      }
    );

    console.log(
      `✅ Email sent to ${email}:`,
      response.data.messageId || response.data
    );
  } catch (error: any) {
    console.error(
      `❌ Failed to send email to ${email}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

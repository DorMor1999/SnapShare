import axios from 'axios';
import fs from "fs";
import path from "path";

export const sendEventInvitationEmail = async (
  firstName: string,
  lastName: string,
  email: string,
  eventName: string
): Promise<void> => {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = 'snapsharesup@gmail.com';
  const senderName = 'SnapShare';

  const fullName = `${firstName} ${lastName}`;

  const loginUrl = 'http://localhost:5173/login';
  const registerUrl = 'http://localhost:5173/register';
  const imageUrl = 'https://github.com/DorMor1999/SnapShare/blob/main/SnapShare/ProjectSpecification/logo.jpeg?raw=true';

  // Load the HTML template
  const templatePath = path.join(
    __dirname,
    "../constants/emailTemplates/InvitationTemplate.html"  
  );
  let htmlContent = fs.readFileSync(templatePath, "utf-8");

  // Replace placeholders with dynamic values
  htmlContent = htmlContent
    .replace(/{{firstName}}/g, firstName)
    .replace(/{{eventName}}/g, eventName)
    .replace(/{{loginUrl}}/g, loginUrl)
    .replace(/{{registerUrl}}/g, registerUrl)
    .replace(/{{imageUrl}}/g, imageUrl);

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
    htmlContent
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

import { ConfigService } from '@nestjs/config';

export class EmailTemplates {
    static getPasswordResetTemplate(resetUrl: string, email: string, configService: ConfigService): string {
        const currentYear = new Date().getFullYear();
        const frontendUrl = configService.get('FRONTEND_URL');

        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>BusNGo Password Reset</title>
            <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }
            .logo {
                text-align: center;
                margin-bottom: 20px;
            }
            .logo img {
                max-width: 150px;
            }
            .container {
                background-color: #f9f9f9;
                border-radius: 5px;
                padding: 20px;
            }
            h1 {
                color: #0066cc;
                margin-top: 0;
            }
            .button {
                display: inline-block;
                background-color: #0066cc;
                color: #ffffff !important;
                text-decoration: none;
                padding: 10px 20px;
                border-radius: 5px;
                margin-top: 15px;
            }
            .footer {
                margin-top: 20px;
                font-size: 12px;
                color: #666;
                text-align: center;
            }
            </style>
        </head>
        <body>
            <div class="container">
            <h1>Password Reset Request</h1>
            <p>Hello,</p>
            <p>We received a request to reset your password for your BusNGo account. If you didn't make this request, please ignore this email.</p>
            <p>To reset your password, click the button below:</p>
            <a href="${resetUrl}" class="button">Reset Your Password</a>
            <p>This link will expire in 5 minutes for security reasons.</p>
            <p>If you're having trouble clicking the button, copy and paste the following URL into your web browser:</p>
            <p>${resetUrl}</p>
            <p>If you need further assistance, please don't hesitate to contact our support team.</p>
            <p>Safe travels!</p>
            <p>The BusNGo Team</p>
            </div>
            <div class="footer">
            <p>&copy; ${currentYear} BusNGo. All rights reserved.</p>
            <p>This email was sent to ${email}. Please do not reply to this email.</p>
            </div>
        </body>
        </html>`;
    }
}
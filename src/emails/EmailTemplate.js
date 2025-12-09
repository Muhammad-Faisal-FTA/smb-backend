// emailTemplates.ts

export const Verification_Email_Template = (verificationCode) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>FinancePulse – Verify Your Email</title>

    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: #F5F7FA;
            font-family: Arial, Helvetica, sans-serif;
            color: #333;
        }

        .wrapper {
            max-width: 620px;
            margin: 40px auto;
            background: #ffffff;
            border-radius: 12px;
            border: 1px solid #e2e5ec;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.06);
        }

        .header {
            background: linear-gradient(135deg, #5A4AF4, #3F35C5);
            padding: 35px 20px;
            text-align: center;
        }

        .header h1 {
            margin: 0;
            font-size: 30px;
            font-weight: bold;
            color: #ffffff;
        }

        .body {
            padding: 35px;
            line-height: 1.7;
            font-size: 16px;
        }

        .body p {
            margin-bottom: 20px;
        }

        .code-box {
            display: block;
            margin: 30px 0;
            padding: 16px;
            background: #f0edff;
            color: #5A4AF4;
            border: 2px dashed #5A4AF4;
            text-align: center;
            font-weight: bold;
            font-size: 28px;
            letter-spacing: 4px;
            border-radius: 8px;
        }

        .footer {
            background: #F5F7FA;
            padding: 20px;
            text-align: center;
            font-size: 13px;
            color: #777;
            border-top: 1px solid #e2e5ec;
        }
    </style>
</head>

<body>
    <div class="wrapper">
        <div class="header">
            <h1>FinancePulse</h1>
        </div>

        <div class="body">
            <p>Hello,</p>

            <p>
                Welcome to <strong>FinancePulse</strong> — your intelligent platform for
                financial insights and real-time business analytics.
            </p>

            <p>
                Please verify your account by using the code below:
            </p>

            <span class="code-box">${verificationCode}</span>

            <p>
                If you didn’t request this, simply ignore this email.  
                Our team is available for support anytime.
            </p>
        </div>

        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} FinancePulse. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;
};




export const Welcome_Email_Template = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Our Community</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f4f4f4;
              color: #333;
          }
          .container {
              max-width: 600px;
              margin: 30px auto;
              background: #ffffff;
              border-radius: 8px;
              box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
              overflow: hidden;
              border: 1px solid #ddd;
          }
          .header {
              background-color: #007BFF;
              color: white;
              padding: 20px;
              text-align: center;
              font-size: 26px;
              font-weight: bold;
          }
          .content {
              padding: 25px;
              line-height: 1.8;
          }
          .welcome-message {
              font-size: 18px;
              margin: 20px 0;
          }
          .button {
              display: inline-block;
              padding: 12px 25px;
              margin: 20px 0;
              background-color: #007BFF;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              text-align: center;
              font-size: 16px;
              font-weight: bold;
              transition: background-color 0.3s;
          }
          .button:hover {
              background-color: #0056b3;
          }
          .footer {
              background-color: #f4f4f4;
              padding: 15px;
              text-align: center;
              color: #777;
              font-size: 12px;
              border-top: 1px solid #ddd;
          }
          p {
              margin: 0 0 15px;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">Welcome to Our Community!</div>
          <div class="content">
              <p class="welcome-message">Hello {name},</p>
              <p>We’re thrilled to have you join us! Your registration was successful, and we’re committed to providing you with the best experience possible.</p>
              <p>Here’s how you can get started:</p>
              <ul>
                  <li>Explore our features and customize your experience.</li>
                  <li>Stay informed by checking out our blog for the latest updates and tips.</li>
                  <li>Reach out to our support team if you have any questions or need assistance.</li>
              </ul>
              <a href="#" class="button">Get Started</a>
              <p>If you need any help, don’t hesitate to contact us. We’re here to support you every step of the way.</p>
          </div>
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
`;

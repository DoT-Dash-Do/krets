export const htmlResponse = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Email Verification</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            text-align: center;
            background-color: #f4f4f4;
            padding: 20px;
          }
          h1 {
            color: #333333;
          }
          .button {
            background-color: #4CAF50;
            border: none;
            color: white;
            padding: 15px 32px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            margin: 4px 2px;
            cursor: pointer;
            border-radius: 4px;
          }
        </style>
      </head>
      <body>
        <h1>Your email is now verified</h1>
        <a href="https://krets-alpha.vercel.app/login">
        <button class="button">Continue</button>
        </a>
      </body>
    </html>
    `;
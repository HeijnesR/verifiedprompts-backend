// email.js - Email service voor VerifiedPrompts
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

// Basis email template
const baseTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #0f172a; margin: 0; padding: 0; background: #f8fafc; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
    .header h1 { color: #ffffff; margin: 0; font-size: 24px; }
    .header .checkmark { color: #10b981; }
    .content { background: #ffffff; padding: 30px; border: 1px solid #e2e8f0; }
    .footer { background: #f1f5f9; padding: 20px; text-align: center; border-radius: 0 0 12px 12px; font-size: 14px; color: #64748b; }
    .button { display: inline-block; background: #10b981; color: #ffffff !important; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 20px 0; }
    .button:hover { background: #059669; }
    .highlight-box { background: #d1fae5; border: 1px solid #10b981; border-radius: 8px; padding: 15px; margin: 20px 0; }
    .price { font-size: 28px; font-weight: 800; color: #0f172a; }
    .divider { border-top: 1px solid #e2e8f0; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1><span class="checkmark">✓</span> VerifiedPrompts</h1>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>© 2024 VerifiedPrompts. All rights reserved.</p>
      <p>The marketplace for verified AI prompts.</p>
      <p><a href="https://getverifiedprompts.com">getverifiedprompts.com</a></p>
    </div>
  </div>
</body>
</html>
`;

// Welkom email na registratie
async function sendWelcomeEmail(to, name) {
  const content = `
    <h2>Welcome to VerifiedPrompts, ${name || 'there'}! 🎉</h2>
    <p>Thanks for joining the marketplace for verified AI prompts.</p>
    <p>Here's what you can do:</p>
    <ul>
      <li><strong>Buy prompts</strong> - Browse our verified prompts with example outputs</li>
      <li><strong>Sell prompts</strong> - Share your best prompts and earn 70% of every sale</li>
    </ul>
    <a href="https://getverifiedprompts.com" class="button">Browse Marketplace</a>
    <div class="divider"></div>
    <p>Questions? Reply to this email - we're happy to help!</p>
  `;

  await resend.emails.send({
    from: 'VerifiedPrompts <info@getverifiedprompts.com>',
    to,
    subject: 'Welcome to VerifiedPrompts! ✓',
    html: baseTemplate(content)
  });
}

// Bevestiging voor koper na aankoop
async function sendPurchaseConfirmation(to, buyerName, prompt, promptText) {
  const content = `
    <h2>Purchase Confirmed! 🎉</h2>
    <p>Hi ${buyerName || 'there'},</p>
    <p>Thanks for your purchase! Here are your details:</p>
    
    <div class="highlight-box">
      <strong>${prompt.title}</strong><br>
      <span class="price">$${prompt.price.toFixed(2)}</span>
    </div>
    
    <p><strong>Your prompt:</strong></p>
    <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; font-family: monospace; font-size: 14px; white-space: pre-wrap; word-wrap: break-word;">
${promptText}
    </div>
    
    <a href="https://getverifiedprompts.com/my-purchases" class="button">View My Purchases</a>
    
    <div class="divider"></div>
    <p><strong>Tips for best results:</strong></p>
    <ul>
      <li>Replace variables in {curly braces} with your specific content</li>
      <li>Use with ${prompt.aiModel || 'your preferred AI model'}</li>
    </ul>
    <p>Questions? Reply to this email!</p>
  `;

  await resend.emails.send({
    from: 'VerifiedPrompts <info@getverifiedprompts.com>',
    to,
    subject: `Purchase Confirmed: ${prompt.title} ✓`,
    html: baseTemplate(content)
  });
}

// Notificatie voor verkoper bij verkoop
async function sendSaleNotification(to, sellerName, prompt, earnings) {
  const content = `
    <h2>You Made a Sale! 💰</h2>
    <p>Hi ${sellerName || 'there'},</p>
    <p>Great news - someone just bought your prompt!</p>
    
    <div class="highlight-box">
      <strong>${prompt.title}</strong><br>
      <p style="margin: 10px 0 0 0;">
        Sale price: <strong>$${prompt.price.toFixed(2)}</strong><br>
        Your earnings (70%): <span class="price">$${earnings.toFixed(2)}</span>
      </p>
    </div>
    
    <p>Keep creating great prompts - your audience is growing!</p>
    
    <a href="https://getverifiedprompts.com/sell" class="button">Create Another Prompt</a>
    
    <div class="divider"></div>
    <p style="font-size: 14px; color: #64748b;">Payouts are processed monthly. Questions? Reply to this email.</p>
  `;

  await resend.emails.send({
    from: 'VerifiedPrompts <info@getverifiedprompts.com>',
    to,
    subject: `You made a sale: ${prompt.title} 💰`,
    html: baseTemplate(content)
  });
}

// Bevestiging wanneer prompt is goedgekeurd
async function sendPromptApproved(to, sellerName, prompt) {
  const content = `
    <h2>Your Prompt is Live! ✓</h2>
    <p>Hi ${sellerName || 'there'},</p>
    <p>Good news - your prompt has been verified and is now live on the marketplace!</p>
    
    <div class="highlight-box">
      <strong>${prompt.title}</strong><br>
      <p style="margin: 10px 0 0 0;">
        Price: <strong>$${prompt.price.toFixed(2)}</strong><br>
        Verification Score: <strong>${prompt.verificationScore || 'N/A'}/100</strong>
      </p>
    </div>
    
    <a href="https://getverifiedprompts.com/prompt/${prompt.id}" class="button">View Your Prompt</a>
    
    <p>Share your prompt to get more sales:</p>
    <p style="background: #f1f5f9; padding: 10px; border-radius: 4px; font-size: 14px;">
      https://getverifiedprompts.com/prompt/${prompt.id}
    </p>
    
    <div class="divider"></div>
    <p>Questions? Reply to this email!</p>
  `;

  await resend.emails.send({
    from: 'VerifiedPrompts <info@getverifiedprompts.com>',
    to,
    subject: `Your prompt "${prompt.title}" is now live! ✓`,
    html: baseTemplate(content)
  });
}

// Test email functie
async function sendTestEmail(to) {
  const content = `
    <h2>Test Email</h2>
    <p>If you're reading this, email is working! 🎉</p>
    <a href="https://getverifiedprompts.com" class="button">Visit VerifiedPrompts</a>
  `;

  await resend.emails.send({
    from: 'VerifiedPrompts <info@getverifiedprompts.com>',
    to,
    subject: 'Test Email from VerifiedPrompts',
    html: baseTemplate(content)
  });
}

module.exports = {
  sendWelcomeEmail,
  sendPurchaseConfirmation,
  sendSaleNotification,
  sendPromptApproved,
  sendTestEmail
};

const nodemailer = require('nodemailer');
const Imap = require('imap');
const { simpleParser } = require('mailparser');
require('dotenv').config();

// Email transporter for sending
let transporter = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }
  return transporter;
}

/**
 * Send RFP email to vendor
 */
async function sendRFPEmail(vendorEmail, vendorName, rfpData) {
  const transporter = getTransporter();
  
  const emailBody = `
Dear ${vendorName},

We are inviting you to submit a proposal for the following Request for Proposal (RFP):

RFP Title: ${rfpData.title}
Description: ${rfpData.description}
Budget: ${rfpData.budget ? `$${rfpData.budget.toLocaleString()}` : 'To be determined'}
Delivery Deadline: ${rfpData.delivery_deadline || 'To be discussed'}
Payment Terms: ${rfpData.payment_terms || 'To be discussed'}
Warranty Requirements: ${rfpData.warranty_terms || 'To be discussed'}

Requirements:
${rfpData.requirements && rfpData.requirements.length > 0 
  ? rfpData.requirements.map(req => 
      `- ${req.item_name}: Quantity ${req.quantity}${req.specifications ? `, ${req.specifications}` : ''}`
    ).join('\n')
  : 'See description above'}

Please reply to this email with your proposal, including:
- Itemized pricing
- Delivery timeline
- Payment terms
- Warranty information
- Any additional terms or conditions

We look forward to receiving your proposal.

Best regards,
Procurement Team
  `.trim();

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: vendorEmail,
    subject: `RFP: ${rfpData.title}`,
    text: emailBody,
    html: emailBody.replace(/\n/g, '<br>'),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
}

/**
 * Check for new vendor response emails
 */
async function checkForVendorResponses(callback) {
  const imap = new Imap({
    user: process.env.IMAP_USER,
    password: process.env.IMAP_PASSWORD,
    host: process.env.IMAP_HOST,
    port: parseInt(process.env.IMAP_PORT) || 993,
    tls: true,
    tlsOptions: { rejectUnauthorized: false }
  });

  imap.once('ready', () => {
    imap.openBox('INBOX', false, (err, box) => {
      if (err) {
        console.error('Error opening inbox:', err);
        return;
      }

      // Search for unread emails
      imap.search(['UNSEEN'], (err, results) => {
        if (err) {
          console.error('Error searching emails:', err);
          return;
        }

        if (!results || results.length === 0) {
          imap.end();
          return;
        }

        const fetch = imap.fetch(results, { bodies: '', struct: true });

        fetch.on('message', (msg, seqno) => {
          msg.on('body', (stream, info) => {
            simpleParser(stream, (err, parsed) => {
              if (err) {
                console.error('Error parsing email:', err);
                return;
              }

              // Check if this looks like a vendor response (contains "proposal", "quote", "rfp", etc.)
              const subject = parsed.subject || '';
              const text = parsed.text || '';
              const lowerText = (subject + ' ' + text).toLowerCase();

              if (lowerText.includes('proposal') || 
                  lowerText.includes('quote') || 
                  lowerText.includes('quotation') ||
                  lowerText.includes('rfp') ||
                  lowerText.includes('response')) {
                callback({
                  from: parsed.from?.text || '',
                  subject: parsed.subject || '',
                  text: parsed.text || '',
                  html: parsed.html || '',
                  date: parsed.date,
                  attachments: parsed.attachments || []
                });
              }
            });
          });
        });

        fetch.once('end', () => {
          imap.end();
        });
      });
    });
  });

  imap.once('error', (err) => {
    console.error('IMAP error:', err);
  });

  imap.connect();
}

module.exports = {
  sendRFPEmail,
  checkForVendorResponses
};


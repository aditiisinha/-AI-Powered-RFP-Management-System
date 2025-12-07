const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

/**
 * Helper to clean JSON string from Markdown code blocks
 */
function cleanJsonString(text) {
  if (!text) return '{}';
  // Remove markdown code blocks if present
  let cleanText = text.replace(/```json\n?|\n?```/g, '');
  // Attempt to find the first '{' and last '}' to handle any preamble/postamble
  const firstBrace = cleanText.indexOf('{');
  const lastBrace = cleanText.lastIndexOf('}');

  if (firstBrace !== -1 && lastBrace !== -1) {
    cleanText = cleanText.substring(firstBrace, lastBrace + 1);
  }

  return cleanText;
}

/**
 * Convert natural language procurement request into structured RFP
 */
async function createRFPFromNaturalLanguage(userInput) {
  const prompt = `You are an AI assistant that helps convert natural language procurement requests into structured RFPs.

User Request:
${userInput}

Extract and structure the following information into a JSON format:
- title: A clear, concise title for the RFP
- description: A detailed description of what needs to be procured
- budget: The total budget (as a number, or null if not specified)
- delivery_deadline: Delivery deadline in YYYY-MM-DD format (or null if not specified)
- payment_terms: Payment terms (e.g., "net 30", "50% upfront", etc.)
- warranty_terms: Warranty requirements
- requirements: An array of objects with fields: item_name, quantity, specifications (any relevant details)

Return ONLY valid JSON, no additional text. Example format:
{
  "title": "Office Equipment Procurement",
  "description": "Procurement of laptops and monitors for new office",
  "budget": 50000,
  "delivery_deadline": "2024-02-15",
  "payment_terms": "net 30",
  "warranty_terms": "1 year warranty",
  "requirements": [
    {
      "item_name": "Laptops",
      "quantity": 20,
      "specifications": "16GB RAM"
    },
    {
      "item_name": "Monitors",
      "quantity": 15,
      "specifications": "27-inch"
    }
  ]
}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const cleanJson = cleanJsonString(text);
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error('Error in createRFPFromNaturalLanguage:', error);
    throw new Error('Failed to create RFP from natural language');
  }
}

/**
 * Parse vendor response email into structured proposal data
 */
async function parseVendorResponse(emailBody, emailSubject, attachments = []) {
  const prompt = `You are an AI assistant that extracts structured proposal information from vendor response emails.

Email Subject: ${emailSubject}

Email Body:
${emailBody}

Extract the following information from this vendor response and return it as JSON:
- total_price: Total price quoted (as a number, or null if not found)
- itemized_prices: Array of objects with item_name and price
- delivery_time: Estimated delivery time
- payment_terms: Payment terms offered
- warranty_terms: Warranty information
- additional_terms: Any other important terms or conditions
- completeness_score: A score from 0-100 indicating how complete the response is (based on how many required fields are addressed)

Return ONLY valid JSON, no additional text. Example format:
{
  "total_price": 48500,
  "itemized_prices": [
    {"item_name": "Laptops", "price": 35000},
    {"item_name": "Monitors", "price": 13500}
  ],
  "delivery_time": "25 days",
  "payment_terms": "net 30",
  "warranty_terms": "1 year warranty included",
  "additional_terms": "Free shipping and setup included",
  "completeness_score": 95
}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const cleanJson = cleanJsonString(text);
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error('Error in parseVendorResponse:', error);
    throw new Error('Failed to parse vendor response');
  }
}

/**
 * Generate AI-powered comparison and recommendation for proposals
 */
async function generateProposalComparison(rfpData, proposals) {
  const prompt = `You are an AI assistant that helps procurement managers compare vendor proposals and make recommendations.

RFP Details:
Title: ${rfpData.title}
Budget: ${rfpData.budget || 'Not specified'}
Delivery Deadline: ${rfpData.delivery_deadline || 'Not specified'}
Requirements: ${JSON.stringify(rfpData.requirements, null, 2)}

Proposals:
${proposals.map((p, idx) => `
Proposal ${idx + 1} - Vendor: ${p.vendor_name}
- Total Price: ${p.total_price || 'Not provided'}
- Delivery Time: ${p.delivery_time || 'Not provided'}
- Payment Terms: ${p.payment_terms || 'Not provided'}
- Warranty: ${p.warranty_terms || 'Not provided'}
- Completeness Score: ${p.completeness_score || 0}
- Additional Terms: ${p.additional_terms || 'None'}
`).join('\n')}

Analyze these proposals and provide:
1. A comparison summary highlighting key differences
2. A ranked list of vendors (best to worst) with reasoning
3. A recommendation for which vendor to choose and why

Return as JSON with:
- comparison_summary: A detailed comparison of all proposals
- vendor_rankings: Array of objects with vendor_name, rank, score (0-100), and reasoning
- recommendation: The recommended vendor name and detailed explanation

Return ONLY valid JSON, no additional text.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const cleanJson = cleanJsonString(text);
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error('Error in generateProposalComparison:', error);
    throw new Error('Failed to generate proposal comparison');
  }
}

module.exports = {
  createRFPFromNaturalLanguage,
  parseVendorResponse,
  generateProposalComparison
};


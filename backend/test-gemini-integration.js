const aiService = require('./services/aiService');
require('dotenv').config();

async function runTests() {
    console.log('Starting Gemini Integration Tests...');

    if (!process.env.GEMINI_API_KEY) {
        console.error('ERROR: GEMINI_API_KEY is not set in .env file');
        process.exit(1);
    }

    // Test 1: createRFPFromNaturalLanguage
    console.log('\n--- Test 1: Create RFP from Natural Language ---');
    try {
        const input = "I need 50 ergonomic chairs and 10 standing desks for the new sales office. Budget is around $20,000. Need them by end of next month.";
        console.log(`Input: "${input}"`);
        const rfp = await aiService.createRFPFromNaturalLanguage(input);
        console.log('Result:', JSON.stringify(rfp, null, 2));

        if (rfp.requirements && rfp.requirements.length >= 2) {
            console.log('✅ Test 1 Passed');
        } else {
            console.log('❌ Test 1 Failed: structured data missing or incorrect');
        }
    } catch (error) {
        console.log('❌ Test Failed with error:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
        if (error.response) console.log('Response:', JSON.stringify(error.response, null, 2));
    }

    // Test 2: parseVendorResponse
    console.log('\n--- Test 2: Parse Vendor Response ---');
    try {
        const emailSubject = "Re: Office Furniture RFP Quote";
        const emailBody = `
      Hi there,
      
      Thanks for the opportunity. We can supply the ergonomic chairs for $250 each and standing desks for $400 each.
      Total comes to $16,500.
      
      We can deliver in 3 weeks.
      Payment terms: 50% down, 50% on delivery.
      All items come with a 3-year warranty.
      
      Best,
      OfficeSupplies Co.
    `;
        console.log('Input Email Body:', emailBody.trim().substring(0, 100) + '...');
        const parsed = await aiService.parseVendorResponse(emailBody, emailSubject);
        console.log('Result:', JSON.stringify(parsed, null, 2));

        if (parsed.total_price && parsed.itemized_prices.length > 0) {
            console.log('✅ Test 2 Passed');
        } else {
            console.log('❌ Test 2 Failed: structured data missing or incorrect');
        }
    } catch (error) {
        console.log('❌ Test Failed with error:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    }

    // Test 3: generateProposalComparison
    console.log('\n--- Test 3: Generate Proposal Comparison ---');
    try {
        const rfpData = {
            title: "Office Furniture",
            budget: 20000,
            delivery_deadline: "2024-03-01",
            requirements: [
                { item_name: "Chairs", quantity: 50, specifications: "Ergonomic" },
                { item_name: "Desks", quantity: 10, specifications: "Standing" }
            ]
        };

        const proposals = [
            {
                vendor_name: "OfficeSupplies Co",
                total_price: 16500,
                delivery_time: "3 weeks",
                payment_terms: "50% upfront",
                warranty_terms: "3 years",
                completeness_score: 90
            },
            {
                vendor_name: "FurnitureDirect",
                total_price: 15000,
                delivery_time: "6 weeks",
                payment_terms: "Net 30",
                warranty_terms: "1 year",
                completeness_score: 85
            }
        ];

        console.log('Comparing 2 proposals...');
        const comparison = await aiService.generateProposalComparison(rfpData, proposals);
        console.log('Result:', JSON.stringify(comparison, null, 2));

        if (comparison.recommendation && comparison.vendor_rankings) {
            console.log('✅ Test 3 Passed');
        } else {
            console.log('❌ Test 3 Failed: structured data missing or incorrect');
        }
    } catch (error) {
        console.log('❌ Test Failed with error:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    }
}

runTests();

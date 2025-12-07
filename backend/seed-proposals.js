const mongoose = require('mongoose');
const RFP = require('./models/RFP');
const Vendor = require('./models/Vendor');
const Proposal = require('./models/Proposal');
require('dotenv').config();

async function seedProposals() {
    try {
        const mongoURI = process.env.MONGODB_URI;
        if (!mongoURI) {
            throw new Error('MONGODB_URI not found in .env');
        }

        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB');

        // Get the first available RFP and Vendors
        const rfp = await RFP.findOne();
        const vendors = await Vendor.find().limit(3);

        if (!rfp) {
            console.log('No RFP found! Please create an RFP first.');
            process.exit();
        }

        if (vendors.length === 0) {
            console.log('No vendors found! Please seed vendors first.');
            process.exit();
        }

        console.log(`Seeding proposals for RFP: ${rfp.title} (${rfp._id})`);

        const proposals = [
            {
                rfp_id: rfp._id,
                vendor_id: vendors[0]._id,
                vendor_name: vendors[0].name, // For convenience, though likely not in schema
                email_subject: `Proposal: ${rfp.title}`,
                email_body: "Please find our attached proposal...",
                total_price: 45000,
                itemized_prices: [
                    { item_name: "Development", price: 30000 },
                    { item_name: "Maintenance", price: 15000 }
                ],
                delivery_time: "4 weeks",
                payment_terms: "50% upfront, 50% on completion",
                warranty_terms: "12 months support",
                additional_terms: "Includes 2 weeks of training",
                completeness_score: 95,
                received_at: new Date()
            },
            {
                rfp_id: rfp._id,
                vendor_id: vendors[1]?._id || vendors[0]._id,
                vendor_name: vendors[1]?.name || vendors[0].name,
                email_subject: `Re: ${rfp.title} - Quote`,
                email_body: "Hi team, here is our quote...",
                total_price: 42000,
                itemized_prices: [
                    { item_name: "Phase 1", price: 20000 },
                    { item_name: "Phase 2", price: 22000 }
                ],
                delivery_time: "6 weeks",
                payment_terms: "Net 30",
                warranty_terms: "6 months standard warranty",
                additional_terms: "No training included",
                completeness_score: 88,
                received_at: new Date()
            }
        ];

        await Proposal.insertMany(proposals);
        console.log('Proposals seeded successfully!');

    } catch (error) {
        console.error('Error seeding proposals:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
        process.exit();
    }
}

seedProposals();

const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({
    rfp_id: { type: mongoose.Schema.Types.ObjectId, ref: 'RFP', required: true },
    vendor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
    email_subject: { type: String },
    email_body: { type: String },
    total_price: { type: Number },
    itemized_prices: [{
        item_name: String,
        price: Number
    }],
    delivery_time: { type: String },
    payment_terms: { type: String },
    warranty_terms: { type: String },
    additional_terms: { type: String },
    raw_response: { type: String },
    parsed_data: { type: Object }, // Storing full parsed JSON
    completeness_score: { type: Number },
    received_at: { type: Date, default: Date.now },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Proposal', proposalSchema);

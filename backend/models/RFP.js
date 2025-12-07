const mongoose = require('mongoose');

const rfpSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    budget: { type: Number },
    delivery_deadline: { type: String }, // Keeping as string to match existing logic, or could be Date
    payment_terms: { type: String },
    warranty_terms: { type: String },
    requirements: [{
        item_name: String,
        quantity: Number,
        specifications: String
    }],
    status: {
        type: String,
        enum: ['draft', 'active', 'closed', 'awarded'],
        default: 'draft'
    },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RFP', rfpSchema);

const mongoose = require('mongoose');

const aiRecommendationSchema = new mongoose.Schema({
    rfp_id: { type: mongoose.Schema.Types.ObjectId, ref: 'RFP', required: true },
    recommendation_text: { type: String },
    vendor_rankings: [{
        vendor_name: String,
        rank: Number,
        score: Number,
        reasoning: String
    }],
    comparison_summary: { type: String },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AIRecommendation', aiRecommendationSchema);

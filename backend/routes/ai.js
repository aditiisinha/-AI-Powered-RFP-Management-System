const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');
const RFP = require('../models/RFP');
const Proposal = require('../models/Proposal');
const AIRecommendation = require('../models/AIRecommendation');

// Generate AI comparison and recommendation for proposals
router.post('/compare-proposals/:rfpId', async (req, res) => {
  try {
    const { rfpId } = req.params;

    // Get RFP data
    const rfp = await RFP.findById(rfpId);
    if (!rfp) {
      return res.status(404).json({ error: 'RFP not found' });
    }

    // Get all proposals for this RFP
    const proposals = await Proposal.find({ rfp_id: rfpId }).populate('vendor_id', 'name');

    if (proposals.length === 0) {
      return res.status(400).json({ error: 'No proposals found for this RFP' });
    }

    const formattedProposals = proposals.map(p => ({
      vendor_name: p.vendor_id ? p.vendor_id.name : 'Unknown Vendor',
      total_price: p.total_price,
      delivery_time: p.delivery_time,
      payment_terms: p.payment_terms,
      warranty_terms: p.warranty_terms,
      additional_terms: p.additional_terms,
      completeness_score: p.completeness_score
    }));

    // Generate AI comparison
    const comparison = await aiService.generateProposalComparison(rfp, formattedProposals);

    // Save recommendation to database
    const recommendation = new AIRecommendation({
      rfp_id: rfpId,
      recommendation_text: comparison.recommendation,
      vendor_rankings: comparison.vendor_rankings || [],
      comparison_summary: comparison.comparison_summary
    });

    await recommendation.save();

    res.json({
      success: true,
      comparison: comparison,
      proposals: proposals
    });
  } catch (error) {
    console.error('Error generating comparison:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get AI recommendations for an RFP
router.get('/recommendations/:rfpId', async (req, res) => {
  try {
    const { rfpId } = req.params;
    const recommendation = await AIRecommendation.findOne({ rfp_id: rfpId })
      .sort({ created_at: -1 });

    if (!recommendation) {
      return res.status(404).json({ error: 'No recommendations found' });
    }

    res.json(recommendation);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

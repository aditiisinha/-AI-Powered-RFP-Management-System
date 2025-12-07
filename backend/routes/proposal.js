const express = require('express');
const router = express.Router();
const Proposal = require('../models/Proposal');
const Vendor = require('../models/Vendor');

// Get all proposals for an RFP
router.get('/rfp/:rfpId', async (req, res) => {
  try {
    const { rfpId } = req.params;
    // Populate vendor details
    const proposals = await Proposal.find({ rfp_id: rfpId })
      .populate('vendor_id', 'name email')
      .sort({ received_at: -1 });

    // Transform to match previous structure if needed, or update frontend to use populated fields
    // Frontend likely expects vendor_name and vendor_email
    const transformedProposals = proposals.map(p => {
      const pObj = p.toObject();
      if (p.vendor_id) {
        pObj.vendor_name = p.vendor_id.name;
        pObj.vendor_email = p.vendor_id.email;
      }
      return pObj;
    });

    res.json(transformedProposals);
  } catch (error) {
    console.error('Error fetching proposals:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get single proposal
router.get('/:id', async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id).populate('vendor_id', 'name email');
    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found' });
    }

    // Flatten for compatibility
    const pObj = proposal.toObject();
    if (proposal.vendor_id) {
      pObj.vendor_name = proposal.vendor_id.name;
      pObj.vendor_email = proposal.vendor_id.email;
    }

    res.json(pObj);
  } catch (error) {
    console.error('Error fetching proposal:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create proposal
router.post('/', async (req, res) => {
  try {
    const {
      rfp_id,
      vendor_id,
      email_subject,
      email_body,
      total_price,
      itemized_prices,
      delivery_time,
      payment_terms,
      warranty_terms,
      additional_terms,
      raw_response,
      parsed_data,
      completeness_score
    } = req.body;

    const newProposal = new Proposal({
      rfp_id,
      vendor_id,
      email_subject,
      email_body,
      total_price,
      itemized_prices, // Mongoose handles array of objects
      delivery_time,
      payment_terms,
      warranty_terms,
      additional_terms,
      raw_response,
      parsed_data, // Mongoose handles object
      completeness_score
    });

    await newProposal.save();
    res.json(newProposal);
  } catch (error) {
    console.error('Error creating proposal:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update proposal
router.put('/:id', async (req, res) => {
  try {
    const updatedProposal = await Proposal.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updated_at: Date.now() },
      { new: true }
    );
    if (!updatedProposal) {
      return res.status(404).json({ error: 'Proposal not found' });
    }
    res.json(updatedProposal);
  } catch (error) {
    console.error('Error updating proposal:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete proposal
router.delete('/:id', async (req, res) => {
  try {
    const result = await Proposal.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Proposal not found' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting proposal:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

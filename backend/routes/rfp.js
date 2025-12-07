const express = require('express');
const router = express.Router();
const RFP = require('../models/RFP');
const aiService = require('../services/aiService');

// Create RFP from natural language
router.post('/create-from-text', async (req, res) => {
  try {
    const { userInput } = req.body;

    if (!userInput) {
      return res.status(400).json({ error: 'User input is required' });
    }

    // Use AI to convert natural language to structured RFP
    let structuredRFP;
    try {
      structuredRFP = await aiService.createRFPFromNaturalLanguage(userInput);
    } catch (aiError) {
      console.error("AI Service Error (using fallback):", aiError.message);

      // Smart Fallback: Regex-based extraction
      const extractValue = (regex) => {
        const match = userInput.match(regex);
        return match ? match[1] : null;
      };

      const budgetMatch = userInput.match(/budget (?:is|of)?\s*(?:rs\.?|inr|usd|\$)?\s*([\d,]+)/i) || userInput.match(/(?:rs\.?|inr|usd|\$)\s*([\d,]+)\s*(?:total)?\s*budget/i);
      const budget = budgetMatch ? parseInt(budgetMatch[1].replace(/,/g, '')) : 0;

      const deadlineMatch = userInput.match(/delivery within\s*(\d+\s*days)/i) || userInput.match(/deadline\s*[:is]\s*([\w\s-]+)/i);
      const delivery_deadline = deadlineMatch ? deadlineMatch[1] : null;

      // Extract payment terms
      const paymentTermsMatch = userInput.match(/payment term[s]?\s*(?:should be|is)?\s*([\w\s%]+?)(?:and|but|\.|,|$)/i);
      let payment_terms = paymentTermsMatch ? paymentTermsMatch[1].trim() : null;
      if (payment_terms && payment_terms.length > 50) payment_terms = "Net 30";

      // Extract warranty
      const warrantyMatch = userInput.match(/(\d+)\s*(year|month|week)s?\s*warranty/i) || userInput.match(/warranty\s*(?:is|should be)?\s*(?:at least)?\s*(\d+)\s*(year|month|week)s?/i);
      let warranty_terms = "Not specified";

      if (warrantyMatch) {
        const duration = parseInt(warrantyMatch[1] || warrantyMatch[3]);
        const unit = (warrantyMatch[2] || warrantyMatch[4]).toLowerCase();

        if (unit.startsWith('year')) {
          warranty_terms = `${duration * 12} months`;
        } else if (unit.startsWith('month')) {
          warranty_terms = `${duration} months`;
        } else {
          warranty_terms = `${duration} ${unit}s`;
        }
      }

      structuredRFP = {
        title: "Generated RFP (Offline Mode)",
        description: userInput,
        budget: budget,
        delivery_deadline: delivery_deadline,
        payment_terms: payment_terms,
        warranty_terms: warranty_terms,
        requirements: []
      };
    }

    const newRFP = new RFP({
      ...structuredRFP,
      status: 'draft'
    });

    await newRFP.save();

    res.json({
      success: true,
      rfp: newRFP,
      structuredData: structuredRFP
    });
  } catch (error) {
    console.error('Error creating RFP:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all RFPs
router.get('/', async (req, res) => {
  try {
    const rfps = await RFP.find().sort({ created_at: -1 });
    res.json(rfps);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single RFP
router.get('/:id', async (req, res) => {
  try {
    const rfp = await RFP.findById(req.params.id);
    if (!rfp) {
      return res.status(404).json({ error: 'RFP not found' });
    }
    res.json(rfp);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update RFP
router.put('/:id', async (req, res) => {
  try {
    const updatedRFP = await RFP.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updated_at: Date.now() },
      { new: true }
    );
    if (!updatedRFP) {
      return res.status(404).json({ error: 'RFP not found' });
    }
    res.json(updatedRFP);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete RFP
router.delete('/:id', async (req, res) => {
  try {
    const result = await RFP.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'RFP not found' });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

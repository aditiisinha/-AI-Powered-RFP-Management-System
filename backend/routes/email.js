const express = require('express');
const router = express.Router();
const emailService = require('../services/emailService');
const aiService = require('../services/aiService');
const RFP = require('../models/RFP');
const Vendor = require('../models/Vendor');
const Proposal = require('../models/Proposal');
const RFPVendor = require('../models/RFPVendor');

// Send RFP to vendors
const mongoose = require('mongoose');

// ... imports remain the same

// Send RFP to vendors
router.post('/send-rfp', async (req, res) => {
  try {
    const { rfpId, vendorIds } = req.body;

    if (!rfpId || !vendorIds || !Array.isArray(vendorIds) || vendorIds.length === 0) {
      return res.status(400).json({ error: 'RFP ID and vendor IDs are required' });
    }

    if (!mongoose.Types.ObjectId.isValid(rfpId)) {
      return res.status(400).json({ error: 'Invalid RFP ID format. If you are using old data, please create a new RFP.' });
    }


    // Get RFP data
    const rfp = await RFP.findById(rfpId);
    if (!rfp) {
      return res.status(404).json({ error: 'RFP not found' });
    }

    const rfpData = {
      title: rfp.title,
      description: rfp.description,
      budget: rfp.budget,
      delivery_deadline: rfp.delivery_deadline,
      payment_terms: rfp.payment_terms,
      warranty_terms: rfp.warranty_terms,
      requirements: rfp.requirements
    };

    // Get vendors
    const vendors = await Vendor.find({ _id: { $in: vendorIds } });

    if (vendors.length !== vendorIds.length) {
      // Warning: some vendors might not be found, but we proceed with found ones
      // Or return error. Let's proceed with valid ones.
      console.warn(`Requested ${vendorIds.length} vendors, found ${vendors.length}`);
    }

    const results = [];

    // Send email to each vendor and record in database
    for (const vendor of vendors) {
      try {
        await emailService.sendRFPEmail(vendor.email, vendor.name, rfpData);

        // Record in rfp_vendors collection
        await RFPVendor.findOneAndUpdate(
          { rfp_id: rfpId, vendor_id: vendor._id },
          {
            sent_at: new Date(),
            status: 'sent'
          },
          { upsert: true, new: true }
        );

        results.push({ vendorId: vendor._id, vendorName: vendor.name, success: true });
      } catch (error) {
        console.error(`Error sending email to ${vendor.name}:`, error);
        results.push({ vendorId: vendor._id, vendorName: vendor.name, success: false, error: error.message });
      }
    }

    res.json({ success: true, results });
  } catch (error) {
    console.error('Error sending RFP emails:', error);
    res.status(500).json({ error: error.message });
  }
});

// Check for new vendor responses
router.post('/check-responses', async (req, res) => {
  try {
    const processedEmails = [];

    await emailService.checkForVendorResponses(async (email) => {
      try {
        // Try to find vendor by email
        const vendor = await Vendor.findOne({ email: email.from });
        if (!vendor) {
          console.log(`Unknown vendor email: ${email.from}`);
          return;
        }

        // Try to find associated RFP (check recent RFPs sent to this vendor)
        // Find latest RFPVendor entry for this vendor with status 'sent'
        const rfpVendor = await RFPVendor.findOne({ vendor_id: vendor._id, status: 'sent' })
          .sort({ sent_at: -1 });

        if (!rfpVendor) {
          console.log(`No active RFP found for vendor: ${vendor.name}`);
          return;
        }

        const rfp = await RFP.findById(rfpVendor.rfp_id);
        if (!rfp) {
          console.log(`RFP not found for ID: ${rfpVendor.rfp_id}`);
          return;
        }

        // Use AI to parse the response
        const parsedData = await aiService.parseVendorResponse(
          email.text,
          email.subject,
          email.attachments
        );

        // Save proposal
        const newProposal = new Proposal({
          rfp_id: rfp._id,
          vendor_id: vendor._id,
          email_subject: email.subject,
          email_body: email.text,
          total_price: parsedData.total_price,
          itemized_prices: parsedData.itemized_prices || [],
          delivery_time: parsedData.delivery_time,
          payment_terms: parsedData.payment_terms,
          warranty_terms: parsedData.warranty_terms,
          additional_terms: parsedData.additional_terms,
          raw_response: email.text,
          parsed_data: parsedData,
          completeness_score: parsedData.completeness_score
        });

        await newProposal.save();

        // Update rfp_vendors status
        rfpVendor.status = 'responded';
        await rfpVendor.save();

        processedEmails.push({
          vendor: vendor.name,
          rfp: rfp.title,
          success: true
        });
      } catch (error) {
        console.error('Error processing email:', error);
        processedEmails.push({
          from: email.from,
          success: false,
          error: error.message
        });
      }
    });

    res.json({ success: true, processed: processedEmails });
  } catch (error) {
    console.error('Error checking for responses:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

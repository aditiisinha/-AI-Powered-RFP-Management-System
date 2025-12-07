const express = require('express');
const router = express.Router();
const Vendor = require('../models/Vendor');

// Get all vendors
router.get('/', async (req, res) => {
  try {
    const vendors = await Vendor.find().sort({ created_at: -1 });
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single vendor
router.get('/:id', async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    res.json(vendor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create vendor
router.post('/', async (req, res) => {
  try {
    const { name, email, contact_person, phone, address } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const existingVendor = await Vendor.findOne({ email });
    if (existingVendor) {
      return res.status(400).json({ error: 'Vendor with this email already exists' });
    }

    const newVendor = new Vendor({
      name,
      email,
      contact_person,
      phone,
      address
    });

    await newVendor.save();
    res.json(newVendor);
  } catch (error) {
    console.error('Error creating vendor:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update vendor
router.put('/:id', async (req, res) => {
  try {
    const updatedVendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updated_at: Date.now() },
      { new: true }
    );
    if (!updatedVendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    res.json(updatedVendor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete vendor
router.delete('/:id', async (req, res) => {
  try {
    const result = await Vendor.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

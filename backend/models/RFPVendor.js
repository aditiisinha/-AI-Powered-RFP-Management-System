const mongoose = require('mongoose');

const rfpVendorSchema = new mongoose.Schema({
    rfp_id: { type: mongoose.Schema.Types.ObjectId, ref: 'RFP', required: true },
    vendor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
    sent_at: { type: Date },
    status: {
        type: String,
        enum: ['pending', 'sent', 'responded', 'rejected'],
        default: 'pending'
    }
});

// Compound index to ensure unique pairs
rfpVendorSchema.index({ rfp_id: 1, vendor_id: 1 }, { unique: true });

module.exports = mongoose.model('RFPVendor', rfpVendorSchema);

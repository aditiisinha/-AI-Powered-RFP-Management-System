const express = require('express');
const router = express.Router();
const RFP = require('../models/RFP');
const Vendor = require('../models/Vendor');
const Proposal = require('../models/Proposal');
const RFPVendor = require('../models/RFPVendor');

router.get('/stats', async (req, res) => {
    try {
        const [
            totalRFPs,
            activeRFPs,
            totalVendors,
            totalProposals,
            pendingProposals
        ] = await Promise.all([
            RFP.countDocuments(),
            RFP.countDocuments({ status: 'active' }),
            Vendor.countDocuments(),
            Proposal.countDocuments(),
            RFPVendor.countDocuments({ status: 'sent' })
        ]);

        // Get recent activity
        const recentRFPs = await RFP.find()
            .sort({ created_at: -1 })
            .limit(5)
            .select('title status created_at');

        res.json({
            metrics: {
                totalRFPs,
                activeRFPs,
                totalVendors,
                totalProposals,
                pendingProposals
            },
            recentActivity: recentRFPs
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const RFP = require('../models/RFP');
const Proposal = require('../models/Proposal');
const Vendor = require('../models/Vendor');

router.get('/data', async (req, res) => {
    try {
        // 1. Budget Distribution (by Status)
        const budgetByStatus = await RFP.aggregate([
            {
                $group: {
                    _id: "$status",
                    totalBudget: { $sum: "$budget" },
                    count: { $sum: 1 }
                }
            }
        ]);

        // 2. Proposals per Vendor (Top 5)
        // First get vendors with most proposals
        const proposalsPerVendor = await Proposal.aggregate([
            {
                $group: {
                    _id: "$vendor_id",
                    proposalCount: { $sum: 1 },
                    avgScore: { $avg: "$completeness_score" },
                    totalValue: { $sum: "$total_price" }
                }
            },
            { $sort: { proposalCount: -1 } },
            { $limit: 5 }
        ]);

        // Populate vendor names
        const enrichedVendorData = await Vendor.populate(proposalsPerVendor, { path: '_id', select: 'name' });

        // 3. Monthly Activity (Last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const rfpActivity = await RFP.aggregate([
            { $match: { created_at: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: { $month: "$created_at" },
                    count: { $sum: 1 }
                }
            }
        ]);

        const proposalActivity = await Proposal.aggregate([
            { $match: { created_at: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: { $month: "$created_at" },
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json({
            budgetDistribution: budgetByStatus.map(b => ({
                name: b._id.charAt(0).toUpperCase() + b._id.slice(1),
                value: b.totalBudget
            })),
            vendorPerformance: enrichedVendorData.map(v => ({
                name: v._id ? v._id.name : 'Unknown',
                proposals: v.proposalCount,
                avgScore: Math.round(v.avgScore || 0),
                value: v.totalValue
            })),
            monthlyActivity: {
                rfps: rfpActivity,
                proposals: proposalActivity
            }
        });

    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

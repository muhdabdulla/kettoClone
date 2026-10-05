const FundraiserLead = require("../models/FundraiserLead");

// @desc    Submit a "Start a Fundraiser" inquiry lead
// @route   POST /api/leads
exports.createLead = async (req, res, next) => {
  try {
    const lead = await FundraiserLead.create(req.body);
    res.status(201).json({
      success: true,
      message: "Fundraiser inquiry received! Our campaign expert will reach out to you shortly.",
      data: lead
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all leads (admin view)
// @route   GET /api/leads
exports.getLeads = async (req, res, next) => {
  try {
    const leads = await FundraiserLead.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: leads.length, data: leads });
  } catch (error) {
    next(error);
  }
};

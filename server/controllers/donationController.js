const Donation = require("../models/Donation");
const Campaign = require("../models/Campaign");

// ==========================================
// 1. CREATE A DONATION
// @route   POST /api/donations
// @desc    Process a new donation and atomically update the campaign total in MongoDB Atlas
// ==========================================
exports.createDonation = async (req, res, next) => {
  try {
    const { campaignId, donorName, email, amount, tax80G } = req.body;

    // 1. Verify campaign exists in MongoDB Atlas
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ success: false, message: "Campaign not found" });
    }

    // 2. Create donation record in MongoDB Atlas
    const donation = await Donation.create({
      campaignId,
      donorName,
      email,
      amount: Number(amount),
      tax80G: !!tax80G,
      paymentStatus: "success"
    });

    // 3. Atomically increment campaign raisedAmount and donorsCount using $inc
    const updatedCampaign = await Campaign.findByIdAndUpdate(
      campaignId,
      {
        $inc: { raisedAmount: Number(amount), donorsCount: 1 }
      },
      { new: true }
    );

    res.status(201).json({
      success: true,
      message: `Thank you, ${donorName}! Your contribution of ₹${Number(amount).toLocaleString("en-IN")} was received.`,
      donation,
      updatedCampaign: {
        _id: updatedCampaign._id,
        title: updatedCampaign.title,
        raisedAmount: updatedCampaign.raisedAmount,
        goalAmount: updatedCampaign.goalAmount,
        donorsCount: updatedCampaign.donorsCount,
        progressPercent: updatedCampaign.progressPercent
      }
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 2. GET ALL DONATIONS
// @route   GET /api/donations
// @desc    Retrieve all donations from MongoDB Atlas
// ==========================================
exports.getDonations = async (req, res, next) => {
  try {
    const { campaignId } = req.query;
    const query = campaignId ? { campaignId } : {};
    
    const donations = await Donation.find(query)
      .populate("campaignId", "title category")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: donations.length,
      source: "mongodb-atlas",
      data: donations
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 3. GET DONATIONS FOR A SPECIFIC CAMPAIGN
// @route   GET /api/donations/:campaignId
// @desc    Retrieve recent donations for a specific campaign
// ==========================================
exports.getCampaignDonations = async (req, res, next) => {
  try {
    const { campaignId } = req.params;

    const donations = await Donation.find({ campaignId })
      .sort({ createdAt: -1 })
      .limit(20)
      .select("donorName amount createdAt");

    res.status(200).json({
      success: true,
      count: donations.length,
      data: donations
    });
  } catch (error) {
    next(error);
  }
};

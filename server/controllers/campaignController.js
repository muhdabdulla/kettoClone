const Campaign = require("../models/Campaign");

// ==========================================
// 1. GET ALL CAMPAIGNS
// @route   GET /api/campaigns
// @desc    Retrieve all campaigns with optional category and search filters
// ==========================================
exports.getCampaigns = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    let query = { status: "active" };

    if (category && category !== "all") {
      query.category = category.toLowerCase();
    }

    if (search && search.trim() !== "") {
      const searchRegex = new RegExp(search.trim(), "i");
      query.$or = [{ title: searchRegex }, { organizer: searchRegex }];
    }

    const campaigns = await Campaign.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: campaigns.length,
      source: "mongodb-atlas",
      data: campaigns
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 2. GET SINGLE CAMPAIGN BY ID
// @route   GET /api/campaigns/:id
// @desc    Retrieve a single campaign by MongoDB _id
// ==========================================
exports.getCampaignById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const campaign = await Campaign.findById(id);

    if (!campaign) {
      return res.status(404).json({ success: false, message: "Campaign not found" });
    }

    res.status(200).json({ success: true, data: campaign });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 3. CREATE A NEW CAMPAIGN
// @route   POST /api/campaigns
// @desc    Add a new campaign to the platform
// ==========================================
exports.createCampaign = async (req, res, next) => {
  try {
    const campaign = await Campaign.create(req.body);
    res.status(201).json({ success: true, data: campaign });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 4. UPDATE CAMPAIGN BY ID
// @route   PUT /api/campaigns/:id
// @desc    Update existing campaign details
// ==========================================
exports.updateCampaign = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updated = await Campaign.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: "Campaign not found" });
    }

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 5. DELETE CAMPAIGN BY ID
// @route   DELETE /api/campaigns/:id
// @desc    Remove a campaign from database
// ==========================================
exports.deleteCampaign = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleted = await Campaign.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Campaign not found" });
    }

    res.status(200).json({
      success: true,
      message: "Campaign deleted successfully",
      data: deleted
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 6. GET PLATFORM IMPACT STATS
// @route   GET /api/campaigns/stats/impact
// @desc    Returns total raised amount, donors count, and active fundraisers
// ==========================================
exports.getImpactStats = async (req, res, next) => {
  try {
    const stats = await Campaign.aggregate([
      {
        $group: {
          _id: null,
          totalRaised: { $sum: "$raisedAmount" },
          totalDonors: { $sum: "$donorsCount" },
          activeCampaigns: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: stats[0] || { totalRaised: 0, totalDonors: 0, activeCampaigns: 0 }
    });
  } catch (error) {
    next(error);
  }
};

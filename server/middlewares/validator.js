// ==========================================
// VALIDATION MIDDLEWARES
// Clean, understandable input validation before hitting controllers
// ==========================================

// Validate campaign creation / update payload
const validateCampaign = (req, res, next) => {
  const { title, goalAmount, organizer, category } = req.body;

  // On PUT, fields may be partially updated, but if provided, validate them
  if (req.method === "POST") {
    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return res.status(400).json({ success: false, message: "Campaign title is required" });
    }

    if (!organizer || typeof organizer !== "string" || organizer.trim().length === 0) {
      return res.status(400).json({ success: false, message: "Organizer name is required" });
    }

    if (!goalAmount || isNaN(Number(goalAmount)) || Number(goalAmount) < 1000) {
      return res.status(400).json({ success: false, message: "Goal amount must be a number of at least ₹1,000" });
    }
  }

  if (goalAmount !== undefined) {
    const numGoal = Number(goalAmount);
    if (isNaN(numGoal) || numGoal < 1000) {
      return res.status(400).json({ success: false, message: "Goal amount must be at least ₹1,000" });
    }
    req.body.goalAmount = numGoal;
  }

  if (category) {
    const validCategories = ["children", "cancer", "education", "animals", "medical", "others"];
    if (!validCategories.includes(category.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid category. Must be one of: ${validCategories.join(", ")}`
      });
    }
    req.body.category = category.toLowerCase();
  }

  next();
};

// Validate donation payload
const validateDonation = (req, res, next) => {
  const { campaignId, donorName, email, amount } = req.body;

  if (!campaignId) {
    return res.status(400).json({ success: false, message: "Campaign ID is required" });
  }

  if (!donorName || typeof donorName !== "string" || donorName.trim().length === 0) {
    return res.status(400).json({ success: false, message: "Donor name is required" });
  }

  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: "A valid email is required for tax 80G receipt" });
  }

  const numAmount = Number(amount);
  if (isNaN(numAmount) || numAmount < 100) {
    return res.status(400).json({ success: false, message: "Minimum donation amount is ₹100" });
  }

  req.body.amount = numAmount;
  next();
};

// Validate fundraiser lead payload
const validateLead = (req, res, next) => {
  const { beneficiary, cause, goalAmount, mobileNumber } = req.body;

  if (!beneficiary || !cause) {
    return res.status(400).json({ success: false, message: "Beneficiary and Cause are required" });
  }

  const numGoal = Number(goalAmount);
  if (isNaN(numGoal) || numGoal < 5000) {
    return res.status(400).json({ success: false, message: "Target goal must be at least ₹5,000" });
  }

  if (!mobileNumber || mobileNumber.trim().length < 8) {
    return res.status(400).json({ success: false, message: "Valid mobile number is required" });
  }

  req.body.goalAmount = numGoal;
  next();
};

// Validate user payload
const validateUser = (req, res, next) => {
  const { name, email } = req.body;

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return res.status(400).json({ success: false, message: "User name is required" });
  }

  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: "A valid email is required" });
  }

  next();
};

module.exports = {
  validateCampaign,
  validateDonation,
  validateLead,
  validateUser
};

const express = require("express");
const router = express.Router();
const {
  createDonation,
  getDonations,
  getCampaignDonations
} = require("../controllers/donationController");
const { validateDonation } = require("../middlewares/validator");

// Donation endpoints
router.get("/", getDonations);
router.post("/", validateDonation, createDonation);
router.get("/:campaignId", getCampaignDonations);

module.exports = router;

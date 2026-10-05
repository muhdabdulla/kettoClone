const express = require("express");
const router = express.Router();
const {
  getCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  getImpactStats
} = require("../controllers/campaignController");
const { validateCampaign } = require("../middlewares/validator");

// Specific routes first to prevent collision with /:id
router.get("/stats/impact", getImpactStats);

// Campaign CRUD endpoints
router.get("/", getCampaigns);
router.get("/:id", getCampaignById);
router.post("/", validateCampaign, createCampaign);
router.put("/:id", validateCampaign, updateCampaign);
router.delete("/:id", deleteCampaign);

module.exports = router;

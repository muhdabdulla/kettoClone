const express = require("express");
const router = express.Router();
const { createLead, getLeads } = require("../controllers/leadController");
const { validateLead } = require("../middlewares/validator");

router.post("/", validateLead, createLead);
router.get("/", getLeads);

module.exports = router;

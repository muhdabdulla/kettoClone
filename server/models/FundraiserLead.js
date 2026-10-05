const mongoose = require("mongoose");

const fundraiserLeadSchema = new mongoose.Schema(
  {
    beneficiary: {
      type: String,
      required: [true, "Beneficiary type is required"],
      trim: true
    },
    cause: {
      type: String,
      required: [true, "Fundraising cause is required"],
      trim: true
    },
    goalAmount: {
      type: Number,
      required: [true, "Target goal amount is required"],
      min: [5000, "Goal must be at least ₹5,000"]
    },
    mobileNumber: {
      type: String,
      required: [true, "Mobile number is required"],
      trim: true
    },
    status: {
      type: String,
      enum: ["new", "contacted", "verified", "rejected"],
      default: "new"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("FundraiserLead", fundraiserLeadSchema);

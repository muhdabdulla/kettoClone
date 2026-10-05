const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    campaignId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      required: [true, "Campaign ID is required"]
    },
    donorName: {
      type: String,
      required: [true, "Donor name is required"],
      trim: true
    },
    email: {
      type: String,
      required: [true, "Donor email is required"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"]
    },
    amount: {
      type: Number,
      required: [true, "Donation amount is required"],
      min: [100, "Minimum donation amount is ₹100"]
    },
    tax80G: {
      type: Boolean,
      default: false
    },
    paymentStatus: {
      type: String,
      enum: ["success", "pending", "failed"],
      default: "success"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Donation", donationSchema);

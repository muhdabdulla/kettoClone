const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Campaign title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"]
    },
    organizer: {
      type: String,
      required: [true, "Organizer name is required"],
      trim: true
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["children", "cancer", "education", "animals", "medical", "others"],
      default: "medical",
      lowercase: true,
      trim: true
    },
    goalAmount: {
      type: Number,
      required: [true, "Goal amount is required"],
      min: [1000, "Goal amount must be at least ₹1,000"]
    },
    raisedAmount: {
      type: Number,
      default: 0,
      min: 0
    },
    donorsCount: {
      type: Number,
      default: 0,
      min: 0
    },
    daysLeft: {
      type: Number,
      default: 30,
      min: 0
    },
    imageUrl: {
      type: String,
      default: "assets/images/hero-banner.png"
    },
    badges: {
      type: [String],
      default: ["Verified"]
    },
    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"]
    },
    mobile: {
      type: String,
      default: "",
      trim: true
    },
    status: {
      type: String,
      enum: ["active", "completed", "closed"],
      default: "active"
    }
  },
  {
    timestamps: true
  }
);

// Virtual for calculation of progress percentage
campaignSchema.virtual("progressPercent").get(function () {
  if (!this.goalAmount || this.goalAmount === 0) return 0;
  return Math.min(100, Math.round((this.raisedAmount / this.goalAmount) * 100));
});

campaignSchema.set("toJSON", { virtuals: true });
campaignSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Campaign", campaignSchema);

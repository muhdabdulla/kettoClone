const mongoose = require("mongoose");

// ==========================================
// USER MODEL SCHEMA
// Represents a platform user (donor or fundraiser organizer)
// username is unique per user — acts as their handle on Ketto
// ==========================================
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"]
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [30, "Username cannot exceed 30 characters"],
      match: [/^[a-z0-9_]+$/, "Username can only contain lowercase letters, numbers, and underscores"]
    },
    email: {
      type: String,
      required: [true, "Email address is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"]
    },
    phone: {
      type: String,
      trim: true,
      default: ""
    },
    role: {
      type: String,
      enum: ["donor", "organizer", "admin"],
      default: "donor"
    }
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt
  }
);

module.exports = mongoose.model("User", userSchema);

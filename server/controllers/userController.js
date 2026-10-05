const User = require("../models/User");

// Helper to auto-generate a unique username from name
function generateUsername(name) {
  const base = name.toLowerCase().trim().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
  return base + "_" + Math.floor(1000 + Math.random() * 9000);
}

// ==========================================
// 1. REGISTER — Create a brand-new user
// @route   POST /api/users/register
// @desc    Register with name, username, email, phone
// ==========================================
exports.register = async (req, res, next) => {
  try {
    const { name, username, email, phone } = req.body;

    if (!name || !username || !email) {
      return res.status(400).json({
        success: false,
        message: "Full name, username, and email are required."
      });
    }

    const cleanEmail    = email.toLowerCase().trim();
    const cleanUsername = username.toLowerCase().trim().replace(/\s+/g, "_");

    // Username format check
    if (!/^[a-z0-9_]{3,30}$/.test(cleanUsername)) {
      return res.status(400).json({
        success: false,
        message: "Username must be 3–30 characters and contain only letters, numbers, or underscores."
      });
    }

    // Check uniqueness
    const existingByUsername = await User.findOne({ username: cleanUsername });
    if (existingByUsername) {
      return res.status(409).json({
        success: false,
        message: `Username "@${cleanUsername}" is already taken. Please choose another.`
      });
    }

    const existingByEmail = await User.findOne({ email: cleanEmail });
    if (existingByEmail) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists. Please sign in instead."
      });
    }

    const user = await User.create({
      name: name.trim(),
      username: cleanUsername,
      email: cleanEmail,
      phone: phone?.trim() || "",
      role: "donor"
    });

    res.status(201).json({
      success: true,
      isNewUser: true,
      message: `Welcome to Ketto, @${user.username}! Your account has been created.`,
      data: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    // Duplicate key fallback
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({
        success: false,
        message: field === "username"
          ? "That username is already taken. Please choose another."
          : "An account with this email already exists."
      });
    }
    next(error);
  }
};

// ==========================================
// 2. SIGN IN — By email or username
// @route   POST /api/users/signin
// @desc    Sign in existing user by email or username
// ==========================================
exports.signIn = async (req, res, next) => {
  try {
    const { email, username } = req.body;

    if (!email && !username) {
      return res.status(400).json({
        success: false,
        message: "Please provide your email or username to sign in."
      });
    }

    let user = null;

    if (email) {
      user = await User.findOne({ email: email.toLowerCase().trim() });
    } else if (username) {
      user = await User.findOne({ username: username.toLowerCase().trim() });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found. Please register first."
      });
    }

    res.status(200).json({
      success: true,
      isNewUser: false,
      message: `Welcome back, @${user.username}!`,
      data: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 3. CHECK USERNAME AVAILABILITY
// @route   GET /api/users/check-username?username=xxx
// @desc    Returns whether username is available
// ==========================================
exports.checkUsername = async (req, res, next) => {
  try {
    const { username } = req.query;
    if (!username) {
      return res.status(400).json({ success: false, message: "Username is required." });
    }
    const clean = username.toLowerCase().trim();
    const exists = await User.findOne({ username: clean });
    res.status(200).json({
      success: true,
      available: !exists,
      message: exists ? `@${clean} is already taken.` : `@${clean} is available!`
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 4. GET ALL USERS
// @route   GET /api/users
// ==========================================
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-__v").sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 5. GET USER BY ID
// @route   GET /api/users/:id
// ==========================================
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-__v");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// Keep backward-compatible alias for old callers
exports.signInOrRegister = exports.signIn;
exports.createUser       = exports.register;

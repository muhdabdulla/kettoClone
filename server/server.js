const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables from .env
dotenv.config({ path: path.join(__dirname, ".env") });

const connectDB = require("./config/db");
const requestLogger = require("./middlewares/requestLogger");
const errorHandler = require("./middlewares/errorHandler");

const campaignRoutes = require("./routes/campaignRoutes");
const donationRoutes = require("./routes/donationRoutes");
const userRoutes = require("./routes/userRoutes");
const leadRoutes = require("./routes/leadRoutes");

const app = express();

// ==========================================
// MIDDLEWARES
// ==========================================
// 1. Enable Cross-Origin Resource Sharing (CORS) for frontend
app.use(cors());

// 2. Body Parser for JSON payloads
app.use(express.json());

// 3. Body Parser for URL-encoded forms
app.use(express.urlencoded({ extended: true }));

// 4. Custom Request Logger
app.use(requestLogger);

// 5. Serve static frontend files (HTML, CSS, JS, Assets)
app.use(express.static(path.join(__dirname, "..")));

// ==========================================
// ROUTES
// ==========================================
// API Overview Route
app.get("/api", (req, res) => {
  res.json({
    project: "Ketto Crowdfunding Clone API",
    status: "online",
    endpoints: {
      campaigns: "/api/campaigns",
      singleCampaign: "/api/campaigns/:id",
      campaignStats: "/api/campaigns/stats/impact",
      donations: "/api/donations",
      users: "/api/users",
      leads: "/api/leads"
    }
  });
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  const isConnected = require("mongoose").connection.readyState === 1;
  res.status(200).json({
    status: "healthy",
    database: isConnected ? "connected (MongoDB Atlas)" : "disconnected (memory fallback active)",
    timestamp: new Date().toISOString()
  });
});

// Mount modular feature routes
app.use("/api/campaigns", campaignRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/leads", leadRoutes);

// 404 Catch-All Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.originalUrl} not found on this server`
  });
});

// Centralized Error Handling Middleware (must be registered last)
app.use(errorHandler);

// ==========================================
// SERVER INITIALIZATION
// ==========================================
const PORT = process.env.PORT || 5000;

async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 Ketto Backend Server is running!`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`📖 API Root: http://localhost:${PORT}/api/campaigns`);
    console.log(`====================================================`);
  });
}

startServer();

module.exports = app;
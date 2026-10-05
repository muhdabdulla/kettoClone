const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const mongoose = require("mongoose");
const dns = require("dns");

try {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (e) { }

const Campaign = require("../models/Campaign");
const User = require("../models/User");
const Donation = require("../models/Donation");
const sampleCampaigns = require("../data/initialCampaigns");

const sampleUsers = [
  {
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    phone: "+91 98765 43210",
    role: "donor"
  },
  {
    name: "Priya Nair",
    email: "priya.nair@example.com",
    phone: "+91 98111 22334",
    role: "organizer"
  }
];

function sanitizeMongoUri(rawUri) {
  if (!rawUri) return "";
  let uri = rawUri.trim();
  uri = uri.replace(/:<([^>]+)>@/, (match, pwd) => `:${encodeURIComponent(pwd)}@`);
  return uri;
}

async function seedDatabase() {
  try {
    const rawUri = process.env.MONGO_URI;
    if (!rawUri) {
      console.error("❌ ERROR: MONGO_URI is missing in server/.env");
      process.exit(1);
    }

    const cleanUri = sanitizeMongoUri(rawUri);
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(cleanUri, { serverSelectionTimeoutMS: 8000 });
    console.log("✅ Connected to MongoDB Atlas!");

    console.log("Clearing old campaigns, users, and donations...");
    await Campaign.deleteMany({});
    await User.deleteMany({});
    await Donation.deleteMany({});

    console.log("🌱 Seeding Users...");
    const createdUsers = await User.insertMany(sampleUsers);
    console.log(`✅ Seeded ${createdUsers.length} users.`);

    console.log("🌱 Seeding Campaigns...");
    const createdCampaigns = await Campaign.insertMany(sampleCampaigns);
    console.log(`✅ Seeded ${createdCampaigns.length} campaigns.`);

    console.log("🌱 Seeding Initial Donations...");
    if (createdCampaigns.length > 0) {
      await Donation.create([
        {
          campaignId: createdCampaigns[0]._id,
          donorName: "Amitabh K.",
          email: "amitabh@example.com",
          amount: 5000,
          tax80G: true,
          paymentStatus: "success"
        },
        {
          campaignId: createdCampaigns[1]._id,
          donorName: "Sunil Joshi",
          email: "sunil.j@example.com",
          amount: 2500,
          tax80G: true,
          paymentStatus: "success"
        }
      ]);
      console.log(`✅ Seeded initial donations.`);
    }

    console.log("\n🎉 Database seeded successfully for evaluation!");
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    console.log("💡 Tip: If you see an IP whitelist or SSL error, add 0.0.0.0/0 to Atlas Network Access.");
    process.exit(1);
  }
}

seedDatabase();

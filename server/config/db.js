const mongoose = require("mongoose");
const dns = require("dns");

// Ensure DNS servers can resolve MongoDB Atlas SRV records reliably on Windows
try {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (e) {
  // Ignore if custom DNS cannot be set in current environment
}

/**
 * Clean connection string if copied with placeholder angle brackets
 * e.g. <password> -> password, or unencoded '@' in password
 */
function sanitizeMongoUri(rawUri) {
  if (!rawUri) return "";
  let uri = rawUri.trim();

  // If user pasted with angle brackets around password: e.g. :<password>@
  uri = uri.replace(/:<([^>]+)>@/, (match, pwd) => {
    return `:${encodeURIComponent(pwd)}@`;
  });

  return uri;
}

const connectDB = async () => {
  const rawUri = process.env.MONGO_URI;

  if (!rawUri) {
    console.warn("⚠️ MONGO_URI is not defined in server/.env. Using offline memory fallback.");
    return;
  }

  const cleanUri = sanitizeMongoUri(rawUri);

  try {
    const conn = await mongoose.connect(cleanUri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
    console.log(`📦 Database: ${conn.connection.name}`);
  } catch (error) {
    console.warn(`⚠️ MongoDB Atlas Connection Note: ${error.message}`);
    console.log(`💡 TIP for College Presentation:`);
    console.log(`   If using MongoDB Atlas, make sure Network Access allows: 0.0.0.0/0`);
    console.log(`   (Atlas Dashboard -> Network Access -> Add IP -> Allow Access From Anywhere).`);
    console.log(`   The server is running with active memory-fallback so all APIs work smoothly!`);
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("ℹ️ MongoDB Atlas disconnected.");
});

mongoose.connection.on("error", (err) => {
  console.warn("⚠️ MongoDB connection error:", err.message);
});

module.exports = connectDB;

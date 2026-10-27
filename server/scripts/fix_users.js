const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const dns = require("dns");
try { dns.setServers(["8.8.8.8", "8.8.4.4"]); } catch (e) {}

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

async function fixUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 8000 });
    console.log("Connected to MongoDB Atlas.");

    const users = await User.find({}).select("+password");
    console.log(`Found ${users.length} users to inspect.`);

    // Keep track of taken usernames
    const takenUsernames = new Set();
    users.forEach(u => {
      if (u.username) takenUsernames.add(u.username.toLowerCase());
    });

    for (const u of users) {
      let changed = false;
      let newUsername = u.username;

      if (!newUsername || newUsername.trim() === "") {
        let base = (u.name || "user").toLowerCase().trim().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
        if (base.length < 3) base = "user_" + base;
        newUsername = base;
        let counter = 1;
        while (takenUsernames.has(newUsername)) {
          newUsername = `${base}_${counter}`;
          counter++;
        }
        takenUsernames.add(newUsername);
        changed = true;
      }

      let newPassword = u.password;
      if (!newPassword || newPassword.trim() === "") {
        const salt = await bcrypt.genSalt(10);
        newPassword = await bcrypt.hash("Password@123", salt);
        changed = true;
      }

      if (changed) {
        await User.findByIdAndUpdate(u._id, {
          username: newUsername,
          password: newPassword
        });
        console.log(`Fixed user: ${u.email} -> username: @${newUsername}, default password set to Password@123`);
      } else {
        console.log(`User ${u.email} (@${u.username}) already has valid username and password.`);
      }
    }

    // Now ensure unique index on username exists
    const collection = mongoose.connection.db.collection("users");
    const indexes = await collection.indexes();
    const hasUsernameIndex = indexes.some(idx => idx.name === "username_1" || (idx.key && idx.key.username === 1));
    if (!hasUsernameIndex) {
      await collection.createIndex({ username: 1 }, { unique: true });
      console.log("Created unique index on username field.");
    }

    console.log("All users successfully verified and updated!");
    process.exit(0);
  } catch (err) {
    console.error("Error fixing users:", err);
    process.exit(1);
  }
}

fixUsers();

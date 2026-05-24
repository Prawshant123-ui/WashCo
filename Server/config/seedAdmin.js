const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

const seedAdmin = async () => {
  try {
    const existing = await User.findOne({ email: process.env.ADMIN_EMAIL });

    if (existing) {
      // Account exists — make sure it has admin role
      if (existing.role !== "admin") {
        existing.role = "admin";
        await existing.save();
        console.log("✅ Existing account upgraded to admin");
      } else {
        console.log("✅ Admin already exists");
      }
      return;
    }

    // No account yet — create fresh admin
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
    await User.create({
      name: process.env.ADMIN_NAME || "Admin",
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      role: "admin",
    });

    console.log("✅ Admin account created");
  } catch (err) {
    console.error("❌ Admin seed failed:", err.message);
  }
};

module.exports = seedAdmin;
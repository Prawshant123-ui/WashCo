// Importing required resources
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register function
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Block registration with the reserved admin email
    if (email === process.env.ADMIN_EMAIL) {
      return res.status(403).json({ message: "This email is not allowed for registration." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists!!" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const role = "user"; // always force user, never trust req.body.role
    const user = await User.create({ name, email, password: hashedPassword, role });

    const userResponse = user.toObject();
    delete userResponse.password;
    return res.status(201).json(userResponse);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Login function
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials!!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials!!" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "7d",
      },
    );

    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(200).json({
      token,
      user: userResponse
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
};

//Importing required resources
const User = require("./models/userModel");
const bcrypt = required("bcryptjs");
const jwt = require("jsonwebtoken");

// Register function

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(400).json({ message: "User already exists!!" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({ name, email, hashedPassword });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Login function

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({ message: "Invalid credentials!!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials!!" });
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

    res.status(200).json(token, user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

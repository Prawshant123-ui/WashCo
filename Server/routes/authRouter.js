//Importing required resources
const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");
const router = express.Router();

// Routes for authentication
router.post("/register", registerUser);
router.post("/login", loginUser);

exports.module = router;

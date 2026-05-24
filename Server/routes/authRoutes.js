// Importing required resources
const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");
const router = express.Router();
const { loginLimiter } = require("../middlewares/ratelimiter");
const { registerValidation } = require("../validators/authValidator");
const { validate } = require("../middlewares/validateMiddleware");

// Routes for authentication
router.post(
  "/register",
  registerValidation,
  validate,
  registerUser
);
router.post("/login", loginLimiter, loginUser);

module.exports = router;

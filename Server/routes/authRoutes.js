//Importing required resources
const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");
const router = express.Router();
const { loginLimiter } = require("./middleware/rateLimiter");
const { registerValidation } = require("../validators/authValidator");
const { validate } = require("../middleware/validateMiddleware");

// Routes for authentication
router.post(
    "/register",
    registerValidation,
    validate,
    registerUser
);
router.post("/login", loginLimiter, loginUser);

exports.module = router;

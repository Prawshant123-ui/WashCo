//Initializing dotenv
require("dotenv").config();

//Importing required resources
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { apiLimiter } = require("./middleware/rateLimiter");
const authRoutes = require("./routes/authRoutes");
const offerRoutes = require("./routes/offerRoutes");
const bookingRoutes=require("./routes/bookingRoutes")

//Initializing Express
const app = express();

//Initializing Database
connectDB();

//Applied CORS for Security
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use(apiLimiter);

app.use(express.json());

// Using routes as API
app.use("/api/auth", authRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/bookings", bookingRoutes);

// Server PORT
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});

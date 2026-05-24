// DNS configuration (Error occured due to Wlink DNS configuration)
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);


//Initializing dotenv
require("dotenv").config();

//Importing required resources
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { apiLimiter } = require("./middlewares/ratelimiter");
const authRoutes = require("./routes/authRoutes");
const offerRoutes = require("./routes/offerRoutes");
const bookingRoutes=require("./routes/bookingRoutes")

//Initializing Express
const app = express();

//Initializing Database
connectDB();

//Applied CORS for Security
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(apiLimiter);

app.use(express.json());

// Using routes as API
app.use("/api/auth", authRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/bookings", bookingRoutes);

// Server PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});

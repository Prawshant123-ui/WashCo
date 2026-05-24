require("dotenv").config(); // ← must be first line

const express = require("express");
const cors = require("cors");
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = require("./config/db");
const seedAdmin = require("./config/seedAdmin");
const authRoutes = require("./routes/authRoutes");
const offerRoutes = require("./routes/offerRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const { apiLimiter } = require("./middlewares/ratelimiter");

const app = express();

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://your-app-name.netlify.app" // ← add this after you get netlify URL
  ],
  credentials: true,
}));
app.use(apiLimiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/bookings", bookingRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;

// Single async start — DB first, seed second, listen third
const start = async () => {
  try {
    await connectDB();       // 1. connect
    await seedAdmin();       // 2. seed admin after DB is ready
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server failed to start:", error.message);
    process.exit(1);
  }
};

start();
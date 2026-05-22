//Initializing dotenv
require("dotenv").config();

//Importing required resources
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRouter");
const offerRoutes = require("./routes/offerRoutes");

//Initializing Express
const app = express();

//Initializing Database
connectDB();

//Applied CORS for Security
app.use(cors());

app.use(express.json());

// Using routes as API
app.use("/api/auth", authRoutes);
app.use("/api/offers", offerRoutes);

// Server PORT
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});

const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
    family: 4,
  });
  console.log("Database connected successfully!!");
};

module.exports = connectDB;
//Database setup for data storage in MongoDB Atlas using Mongoose
const mongoose = require("mongoose");

const connectDB = async (req, res) => {
  try {
    await mongoose.connect(process.env.MONO_URI);

    console.log("Database connected successfully!!");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;

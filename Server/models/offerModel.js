//Importing required resources
const mongoose = require("mongoose");

//Database Schema for offers
const offerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    vehicleType: {
      type: String,
      enum: ["car", "bike", "Others"],
      required: true,
    },
    duration: {
      type: String,
    },
    isActive: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Offer", offerSchema);

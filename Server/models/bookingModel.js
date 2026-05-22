const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        offer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Offer",
            required: true
        },

        vehicleType: {
            type: String,
            enum: ["car", "bike"],
            required: true
        },

        vehicleModel: {
            type: String,
            required: true
        },

        vehicleNumber: {
            type: String,
            required: true
        },

        washType: {
            type: String,
            enum: ["deep", "mild"],
            required: true
        },

        image: {
            type: String
        },

        status: {
            type: String,
            enum: ["pending", "confirmed", "completed"],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Booking", bookingSchema);
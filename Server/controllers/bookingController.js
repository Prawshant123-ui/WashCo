// Importing required resources
const Booking = require("../models/bookingModel");
const Offer = require("../models/offerModel");

// Create Booking
const createBooking = async (req, res) => {
  try {
    const { offer, vehicleType, vehicleModel, vehicleNumber, washType } = req.body;

    // Check if the specified offer exists
    const existingOffer = await Offer.findById(offer);
    if (!existingOffer) {
      return res.status(404).json({ message: "Offer not found!!" });
    }

    const image = req.file ? req.file.path : "";

    const booking = await Booking.create({
      user: req.user.id,
      offer,
      vehicleType,
      vehicleModel,
      vehicleNumber,
      washType,
      image,
    });

    return res.status(201).json(booking);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Bookings (User Panel)
const getUserBooking = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate("offer")
      .sort({ createdAt: -1 });

    return res.json(bookings);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Booking (Admin Panel)
const getAdminBooking = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.vehicleType) {
      filter.vehicleType = req.query.vehicleType;
    }

    const total = await Booking.countDocuments(filter);

    const bookings = await Booking.find(filter)
      .populate("user", "name email")
      .populate("offer")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    return res.json({
      page,
      totalPages: Math.ceil(total / limit),
      total,
      bookings,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Update booking status
const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found!!" });
    }

    if (req.body.status) {
      booking.status = req.body.status;
    }

    const updated = await booking.save();
    return res.json(updated);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createBooking,
  getMyBookings: getUserBooking,
  getAllBookings: getAdminBooking,
  updateBookingStatus: updateBooking
};
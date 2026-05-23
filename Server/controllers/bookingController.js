//Importing required resources
const Booking = require("../models/bookingModel");

//Create Booking
const createBooking = async (req, res) => {
  try {
    const { offer, vehicleType, vehicleModel, vehicleNumber, washType } =
      req.body;

    const existingOffer = await offer.findById(req.params.id);

    if (existingOffer) {
      res.status(404).json({ message: "Offer already exists!!" });
    }
    const image = req.file ? req.file.path : "";

    const booking = await offer.create({
      user: req.user.id,
      offer,
      vehicleType,
      vehicleModel,
      vehicleNumber,
      washType,
      image,
    });
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

//Get All Bookings(User Panel)

const getUserBooking = async (req, res) => {
  try {
    const booking = await Booking.find({ user: req.user.id })
      .populate(offer)
      .sort({ createdAt: -1 });

    res.json(booking);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All booking (Admni Panel)

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

    const booking = await Booking.countDocuments(filter)
      .populate("user", "name email")
      .populate("offer")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    res.json({
      page,
      totalPages: Math.ceil(total / limit),
      total,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

//Update booking status

const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      res.status(404).json({ message: "Booking not found!!" });
    }

    booking.status = req.body.status;

    const updated = await booking.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


module.exports = {
    createBooking,
    getMyBookings,
    getAllBookings,
    updateBookingStatus
};
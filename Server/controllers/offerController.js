// Importing required resources
const Offer = require("../models/offerModel");

// Create Offer
const createOffer = async (req, res) => {
  try {
    const offer = await Offer.create(req.body);
    return res.status(201).json(offer);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Read All Offer with pagination
const getAllOffer = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Offer.countDocuments({ isActive: true });

    const offers = await Offer.find({ isActive: true })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    return res.json({
      page,
      totalPages: Math.ceil(total / limit),
      total,
      offers,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Read Single offer
const getSingleOffer = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);

    if (!offer) {
      return res.status(404).json({ message: "There's no such offer" });
    }

    return res.json(offer);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Update offer
const updateOffer = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);

    if (!offer) {
      return res.status(404).json({ message: "There's no such offer" });
    }

    Object.assign(offer, req.body);

    const updated = await offer.save();

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Offer
const deleteOffer = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);

    if (!offer) {
      return res.status(404).json({ message: "There's no such offer" });
    }

    await offer.deleteOne();

    return res.json({ message: "Offer deleted!!" });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createOffer,
  getOffers: getAllOffer,
  getOfferById: getSingleOffer,
  updateOffer,
  deleteOffer,
};

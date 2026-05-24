// Importing required resources
const express = require("express");
const router = express.Router();
const {
  createOffer,
  getOffers,
  getOfferById,
  updateOffer,
  deleteOffer,
} = require("../controllers/offerController");
const { protect } = require("../middlewares/authMiddleware");
const { adminOnly } = require("../middlewares/adminMiddleware");

// Routes for offers
router.get("/", getOffers);

router.get("/:id", getOfferById);

router.post("/", protect, adminOnly, createOffer);

router.put("/:id", protect, adminOnly, updateOffer);

router.delete("/:id", protect, adminOnly, deleteOffer);

module.exports = router;

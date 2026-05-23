const express = require("express");

const router = express.Router();

const {
    createBooking,
    getMyBookings,
    getAllBookings,
    updateBookingStatus
} = require("../controllers/bookingController");

const { protect } = require("../middleware/authMiddleware");

const { adminOnly } = require("../middleware/adminMiddleware");

const upload = require("../middleware/uploadMiddleware");



router.post(
    "/",
    protect,
    upload.single("image"),
    createBooking
);

router.get(
    "/my-bookings",
    protect,
    getMyBookings
);
router.get(
    "/admin",
    protect,
    adminOnly,
    getAllBookings
);

router.put(
    "/:id/status",
    protect,
    adminOnly,
    updateBookingStatus
);

module.exports = router;
//Importing required resources
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Middleware logic for uploadng image and video using multer and multer-cloudinary-storage
const storage = new CloudinaryStorage({
  cloudinary,

  params: {
    folder: "wash_bookings",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = upload;

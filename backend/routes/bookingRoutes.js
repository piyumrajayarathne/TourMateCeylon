const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking
} = require("../controllers/bookingController");

router.post("/", protect, createBooking);

router.get("/my-bookings", protect, getMyBookings);

router.get("/:bookingId", protect, getBookingById);

router.patch("/:bookingId/cancel", protect, cancelBooking);

module.exports = router;

const Booking = require("../models/booking");
require("../models/room");
require("../models/hotel");

const createBooking = async (req, res) => {
  try {
    const {
      bookingType,
      serviceId,
      startDate,
      endDate,
      numberOfGuests,
      amount
    } = req.body;

    if (
      !bookingType ||
      !serviceId ||
      !startDate ||
      numberOfGuests == null ||
      amount == null
    ) {
      return res.status(400).json({
        message: "Please provide all required booking details."
      });
    }

    const guests = Number(numberOfGuests);
    const bookingAmount = Number(amount);
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : undefined;

    if (
      !Number.isInteger(guests) ||
      guests < 1 ||
      !Number.isFinite(bookingAmount) ||
      bookingAmount < 0 ||
      Number.isNaN(start.getTime()) ||
      (end && Number.isNaN(end.getTime()))
    ) {
      return res.status(400).json({
        message: "Please provide valid booking details."
      });
    }

    if (end && end < start) {
      return res.status(400).json({
        message: "End date cannot be before start date."
      });
    }

    const booking = await Booking.create({
      travelerId: req.userId,
      bookingType,
      serviceId,
      startDate: start,
      endDate: end,
      numberOfGuests: guests,
      amount: bookingAmount
    });

    return res.status(201).json({
      message: "Booking created successfully.",
      booking
    });
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid booking details."
      });
    }

    console.error("Create booking error:", error);

    return res.status(500).json({
      message: "Failed to create booking."
    });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      travelerId: req.userId
    })
      .populate({
        path: "serviceId",
        model: "Room",
        populate: {
          path: "hotelId",
          model: "Hotel",
          select: "hotelName location images averageRating"
        }
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: bookings.length,
      bookings
    });
  } catch (error) {
    console.error("Get bookings error:", error);

    return res.status(500).json({
      message: "Failed to fetch bookings."
    });
  }
};

const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.bookingId,
      travelerId: req.userId
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found."
      });
    }

    return res.status(200).json({ booking });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid booking ID."
      });
    }

    console.error("Get booking error:", error);

    return res.status(500).json({
      message: "Failed to fetch booking."
    });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.bookingId,
      travelerId: req.userId
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found."
      });
    }

    if (
      booking.bookingStatus === "Completed" ||
      booking.bookingStatus === "Cancelled"
    ) {
      return res.status(400).json({
        message: `A ${booking.bookingStatus.toLowerCase()} booking cannot be cancelled.`
      });
    }

    booking.bookingStatus = "Cancelled";
    await booking.save();

    return res.status(200).json({
      message: "Booking cancelled successfully.",
      booking
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid booking ID."
      });
    }

    console.error("Cancel booking error:", error);

    return res.status(500).json({
      message: "Failed to cancel booking."
    });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking
};

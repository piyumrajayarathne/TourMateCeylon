const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    travelerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    bookingType: {
      type: String,
      enum: ["Hotel", "Guide", "Experience", "Transport", "Event"],
      required: true
    },

    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },

    startDate: {
      type: Date,
      required: true
    },

    endDate: {
      type: Date
    },

    numberOfGuests: {
      type: Number,
      required: true,
      min: 1
    },

    amount: {
      type: Number,
      required: true,
      min: 0
    },

    bookingStatus: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled", "Completed"],
      default: "Pending"
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded"],
      default: "Pending"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Booking", bookingSchema);
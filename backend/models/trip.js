const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    travelerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    tripName: {
      type: String,
      required: true,
      trim: true
    },

    numberOfTravelers: {
      type: Number,
      required: true,
      min: 1
    },

    startDate: {
      type: Date,
      required: true
    },

    endDate: {
      type: Date,
      required: true
    },

    totalBudget: {
      type: Number,
      required: true,
      min: 0
    },

    currency: {
      type: String,
      required: true,
      default: "LKR"
    },

    totalExpenses: {
      type: Number,
      default: 0,
      min: 0
    },

    remainingBudget: {
      type: Number,
      default: 0,
      min: 0
    },

    tripStatus: {
      type: String,
      enum: ["Planning", "Ongoing", "Completed", "Cancelled"],
      default: "Planning"
    },

    destinations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Destination"
      }
    ],

    hotelBookings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking"
      }
    ],

    guideBookings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking"
      }
    ],

    experienceBookings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking"
      }
    ],

    eventBookings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking"
      }
    ],

    transportBookings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking"
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Trip", tripSchema);
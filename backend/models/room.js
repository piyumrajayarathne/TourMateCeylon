const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true
    },

    roomType: {
      type: String,
      required: true,
      trim: true
    },

    pricePerNight: {
      type: Number,
      required: true,
      min: 0
    },

    maximumGuests: {
      type: Number,
      required: true,
      min: 1
    },

    availabilityStatus: {
      type: String,
      enum: ["Available", "Unavailable"],
      default: "Available"
    },

    images: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Room", roomSchema);
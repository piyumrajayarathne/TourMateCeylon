const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    hotelName: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    location: {
      type: String,
      required: true,
      trim: true
    },

    amenities: {
      type: [String],
      default: []
    },

    images: {
      type: [String],
      default: []
    },

    averageRating: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Hotel", hotelSchema);
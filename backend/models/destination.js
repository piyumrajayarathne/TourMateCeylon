const mongoose = require("mongoose");

const destinationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    province: {
      type: String,
      required: true,
      trim: true
    },

    district: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: String,
      enum: [
        "Beach",
        "Mountain",
        "Historical",
        "Wildlife",
        "Religious",
        "Adventure"
      ],
      required: true
    },

    description: {
      type: String,
      required: true
    },

    images: {
      type: [String],
      default: []
    },

    entranceFees: {
      localAdult: {
        type: Number,
        default: 0
      },
      localChild: {
        type: Number,
        default: 0
      },
      foreignAdult: {
        type: Number,
        default: 0
      },
      foreignChild: {
        type: Number,
        default: 0
      }
    },

    openingHours: {
      type: String,
      default: ""
    },

    bestVisitingSeason: {
      type: String,
      default: ""
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

module.exports = mongoose.model("Destination", destinationSchema);
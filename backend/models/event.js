const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    eventTitle: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: String,
      enum: [
        "Cultural",
        "Arts",
        "Religious",
        "Adventure",
        "Nature",
        "Food"
     ],
      required: true
    },

    description: {
      type: String,
      required: true
    },

    venue: {
      type: String,
      required: true,
      trim: true
    },

    startDate: {
      type: Date,
      required: true
    },

    endDate: {
      type: Date,
      required: true
    },

    ticketPrice: {
      type: Number,
      default: 0,
      min: 0
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

module.exports = mongoose.model("Event", eventSchema);
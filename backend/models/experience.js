const mongoose = require("mongoose");

const experienceSchema = new mongoose.Schema(
  {
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: String,
      enum: [
        "Adventure Activity",
        "Village Tour",
        "Tea Plantation Tour",
        "Wildlife Safari",
        "Cultural Experience"
      ],
      required: true
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

    duration: {
      type: String,
      required: true
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    images: {
      type: [String],
      default: []
    },

    availabilityStatus: {
      type: String,
      enum: ["Available", "Unavailable"],
      default: "Available"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Experience", experienceSchema);
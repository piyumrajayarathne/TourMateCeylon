const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    vehicleName: {
      type: String,
      required: true,
      trim: true
    },

    vehicleType: {
      type: String,
      enum: ["Car", "Van", "SUV", "Mini Bus", "Bus"],
      required: true
    },

    capacity: {
      type: Number,
      required: true,
      min: 1
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

module.exports = mongoose.model("Vehicle", vehicleSchema);
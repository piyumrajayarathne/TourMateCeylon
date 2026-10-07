const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true
    },

    lastName: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },

    phoneNumber: {
      type: String,
      required: true
    },

    profileImage: {
      type: String,
      default: ""
    },

    role: {
      type: String,
      enum: [
        "Traveler",
        "Hotel Owner",
        "Tour Guide",
        "Transport Provider",
        "Experience Provider",
        "Admin"
      ],
      default: "Traveler"
    },

    travelerType: {
      type: String,
      enum: ["Local", "Foreign"],
      default: "Local"
    },

    status: {
      type: String,
      enum: ["Active", "Inactive", "Suspended"],
      default: "Active"
    },

    languagesSpoken: {
      type: [String],
      default: []
    },

    certifications: {
      type: [String],
      default: []
    },

    yearsOfExperience: {
      type: Number,
      default: 0
    },

    serviceAreas: {
      type: [String],
      default: []
    },

    bio: {
      type: String,
      default: ""
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

module.exports = mongoose.model("User", userSchema);
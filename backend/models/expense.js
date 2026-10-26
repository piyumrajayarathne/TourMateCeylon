
const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: true
    },

    travelerId: {
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
        "Transport",
        "Accommodation",
        "Food",
        "Activities",
        "Shopping",
        "Other"
      ],
      required: true
    },

    amount: {
      type: Number,
      required: true,
      min: 0.01
    },

    expenseDate: {
      type: Date,
      required: true,
      default: Date.now
    },

    notes: {
      type: String,
      default: "",
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Expense", expenseSchema);

const express = require("express");
const router = express.Router();

const {
  createExpense,
  getTripExpenses
} = require("../controllers/expenseController");

const { protect } = require("../middleware/authMiddleware");

router.post("/:tripId", protect, createExpense);

router.get("/:tripId", protect, getTripExpenses);

module.exports = router;

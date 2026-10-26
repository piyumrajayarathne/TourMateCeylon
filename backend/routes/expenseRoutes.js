const express = require("express");
const router = express.Router();

const {
  createExpense,
  getTripExpenses,
  updateExpense,
  deleteExpense
} = require("../controllers/expenseController");

const { protect } = require("../middleware/authMiddleware");

router.post("/:tripId", protect, createExpense);
router.get("/:tripId", protect, getTripExpenses);
router.put("/:tripId/:expenseId", protect, updateExpense);
router.delete("/:tripId/:expenseId", protect, deleteExpense);

module.exports = router;
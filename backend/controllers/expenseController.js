const Expense = require("../models/expense");
const Trip = require("../models/trip");

const createExpense = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { title, category, amount, expenseDate, notes } = req.body;

    if (!title || !category || amount === undefined || amount === null) {
      return res.status(400).json({
        message: "Please provide the expense title, category, and amount."
      });
    }

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        message: "Expense amount must be greater than zero."
      });
    }

    const trip = await Trip.findOne({
      _id: tripId,
      travelerId: req.userId
    });

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found."
      });
    }

    const expense = await Expense.create({
      tripId: trip._id,
      travelerId: req.userId,
      title: title.trim(),
      category,
      amount: numericAmount,
      expenseDate: expenseDate || Date.now(),
      notes
    });

    const total = await Expense.aggregate([
      { $match: { tripId: trip._id } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    trip.totalExpenses = total.length ? total[0].total : 0;
    trip.remainingBudget = trip.totalBudget - trip.totalExpenses;

    await trip.save();

    return res.status(201).json({
      message: "Expense added successfully.",
      expense,
      budget: {
        totalBudget: trip.totalBudget,
        totalExpenses: trip.totalExpenses,
        remainingBudget: trip.remainingBudget,
        currency: trip.currency
      }
    });
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        message: error.message
      });
    }

    console.error("Create expense error:", error.message);

    return res.status(500).json({
      message: "Failed to add expense."
    });
  }
};

const getTripExpenses = async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.tripId,
      travelerId: req.userId
    });

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found."
      });
    }

    const expenses = await Expense.find({
      tripId: trip._id,
      travelerId: req.userId
    }).sort({ expenseDate: -1 });

    return res.status(200).json({
      count: expenses.length,
      expenses,
      budget: {
        totalBudget: trip.totalBudget,
        totalExpenses: trip.totalExpenses,
        remainingBudget: trip.remainingBudget,
        currency: trip.currency
      }
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid trip ID."
      });
    }

    console.error("Get expenses error:", error.message);

    return res.status(500).json({
      message: "Failed to retrieve expenses."
    });
  }
};


const updateExpense = async (req, res) => {
  try {
    const { tripId, expenseId } = req.params;
    const { title, category, amount, expenseDate, notes } = req.body;

    const trip = await Trip.findOne({
      _id: tripId,
      travelerId: req.userId
    });

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found."
      });
    }

    const expense = await Expense.findOne({
      _id: expenseId,
      tripId: trip._id,
      travelerId: req.userId
    });

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found."
      });
    }

    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({
          message: "Expense title cannot be empty."
        });
      }
      expense.title = title.trim();
    }

    if (category !== undefined) {
      expense.category = category;
    }

    if (amount !== undefined) {
      const numericAmount = Number(amount);

      if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
        return res.status(400).json({
          message: "Expense amount must be greater than zero."
        });
      }

      expense.amount = numericAmount;
    }

    if (expenseDate !== undefined) {
      const parsedDate = new Date(expenseDate);

      if (Number.isNaN(parsedDate.getTime())) {
        return res.status(400).json({
          message: "Please provide a valid expense date."
        });
      }

      expense.expenseDate = parsedDate;
    }

    if (notes !== undefined) {
      expense.notes = notes;
    }

    await expense.save();

    const totals = await Expense.aggregate([
      { $match: { tripId: trip._id } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    trip.totalExpenses = totals.length ? totals[0].total : 0;
    trip.remainingBudget = trip.totalBudget - trip.totalExpenses;

    await trip.save();

    return res.status(200).json({
      message: "Expense updated successfully.",
      expense,
      budget: {
        totalBudget: trip.totalBudget,
        totalExpenses: trip.totalExpenses,
        remainingBudget: trip.remainingBudget,
        currency: trip.currency
      }
    });
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        message: error.message
      });
    }

    console.error("Update expense error:", error.message);

    return res.status(500).json({
      message: "Failed to update expense."
    });
  }
};


const deleteExpense = async (req, res) => {
  try {
    const { tripId, expenseId } = req.params;

    const trip = await Trip.findOne({
      _id: tripId,
      travelerId: req.userId
    });

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found."
      });
    }

    const expense = await Expense.findOne({
      _id: expenseId,
      tripId: trip._id,
      travelerId: req.userId
    });

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found."
      });
    }

    await expense.deleteOne();

    const totals = await Expense.aggregate([
      { $match: { tripId: trip._id } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    trip.totalExpenses = totals.length ? totals[0].total : 0;
    trip.remainingBudget = trip.totalBudget - trip.totalExpenses;

    await trip.save();

    return res.status(200).json({
      message: "Expense deleted successfully.",
      budget: {
        totalBudget: trip.totalBudget,
        totalExpenses: trip.totalExpenses,
        remainingBudget: trip.remainingBudget,
        currency: trip.currency
      }
    });
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        message: error.message
      });
    }

    console.error("Delete expense error:", error.message);

    return res.status(500).json({
      message: "Failed to delete expense."
    });
  }
};

module.exports = {
  createExpense,
  getTripExpenses,
  updateExpense,
  deleteExpense
};


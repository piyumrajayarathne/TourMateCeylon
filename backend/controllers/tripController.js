const Trip = require("../models/trip");
const Destination = require("../models/destination");

const createTrip = async (req, res) => {
  try {
    const {
      tripName,
      numberOfTravelers,
      startDate,
      endDate,
      totalBudget,
      currency,
      destinations
    } = req.body;

    if (
      !tripName ||
      !numberOfTravelers ||
      !startDate ||
      !endDate ||
      totalBudget === undefined ||
      totalBudget === null
    ) {
      return res.status(400).json({
        message: "Please provide all required trip fields."
      });
    }

    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    if (
      Number.isNaN(parsedStartDate.getTime()) ||
      Number.isNaN(parsedEndDate.getTime()) ||
      parsedEndDate < parsedStartDate
    ) {
      return res.status(400).json({
        message: "Please provide valid trip dates."
      });
    }

    if (
      !Number.isInteger(Number(numberOfTravelers)) ||
      Number(numberOfTravelers) < 1
    ) {
      return res.status(400).json({
        message: "Number of travelers must be at least 1."
      });
    }

    if (!Number.isFinite(Number(totalBudget)) || Number(totalBudget) < 0) {
      return res.status(400).json({
        message: "Total budget must be a non-negative number."
      });
    }

    const destinationIds = destinations || [];

    if (!Array.isArray(destinationIds)) {
      return res.status(400).json({
        message: "Destinations must be an array of destination IDs."
      });
    }

    if (destinationIds.length > 0) {
      const foundCount = await Destination.countDocuments({
        _id: { $in: destinationIds }
      });

      if (foundCount !== new Set(destinationIds.map(String)).size) {
        return res.status(400).json({
          message: "One or more destination IDs are invalid."
        });
      }
    }

    const trip = await Trip.create({
      travelerId: req.userId,
      tripName: tripName.trim(),
      numberOfTravelers: Number(numberOfTravelers),
      startDate: parsedStartDate,
      endDate: parsedEndDate,
      totalBudget: Number(totalBudget),
      currency: currency || "LKR",
      totalExpenses: 0,
      remainingBudget: Number(totalBudget),
      destinations: destinationIds
    });

    return res.status(201).json({
      message: "Trip created successfully.",
      trip
    });
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        message: error.message
      });
    }

    console.error("Create trip error:", error.message);

    return res.status(500).json({
      message: "Failed to create trip."
    });
  }
};

const getMyTrips = async (req, res) => {
  try {
    const trips = await Trip.find({
      travelerId: req.userId
    })
      .populate("destinations", "name province district category")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: trips.length,
      trips
    });
  } catch (error) {
    console.error("Get trips error:", error.message);

    return res.status(500).json({
      message: "Failed to retrieve trips."
    });
  }
};

const updateTrip = async (req, res) => {
  try {
    const { tripId } = req.params;

    const trip = await Trip.findOne({
      _id: tripId,
      travelerId: req.userId
    });

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found."
      });
    }

    const allowedFields = [
      "tripName",
      "numberOfTravelers",
      "startDate",
      "endDate",
      "totalBudget",
      "currency",
      "tripStatus",
      "destinations"
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        trip[field] = req.body[field];
      }
    }

    if (
      !trip.tripName ||
      !Number.isInteger(Number(trip.numberOfTravelers)) ||
      Number(trip.numberOfTravelers) < 1 ||
      !Number.isFinite(Number(trip.totalBudget)) ||
      Number(trip.totalBudget) < 0
    ) {
      return res.status(400).json({
        message: "Please provide valid trip details."
      });
    }

    if (
      new Date(trip.startDate) > new Date(trip.endDate)
    ) {
      return res.status(400).json({
        message: "End date must be on or after the start date."
      });
    }

    if (!Array.isArray(trip.destinations)) {
      return res.status(400).json({
        message: "Destinations must be an array."
      });
    }

    if (trip.destinations.length > 0) {
      const foundCount = await Destination.countDocuments({
        _id: { $in: trip.destinations }
      });

      if (foundCount !== new Set(trip.destinations.map(String)).size) {
        return res.status(400).json({
          message: "One or more destination IDs are invalid."
        });
      }
    }

    trip.tripName = trip.tripName.trim();
    trip.numberOfTravelers = Number(trip.numberOfTravelers);
    trip.totalBudget = Number(trip.totalBudget);

    const Expense = require("../models/expense");
    const expenses = await Expense.aggregate([
      { $match: { tripId: trip._id } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    trip.totalExpenses = expenses.length ? expenses[0].total : 0;
    trip.remainingBudget = trip.totalBudget - trip.totalExpenses;

    await trip.save();

    return res.status(200).json({
      message: "Trip updated successfully.",
      trip
    });
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        message: error.message
      });
    }

    console.error("Update trip error:", error.message);

    return res.status(500).json({
      message: "Failed to update trip."
    });
  }
};

// Delete a trip and its expenses
const deleteTrip = async (req, res) => {
  try {
    const { tripId } = req.params;

    const trip = await Trip.findOne({
      _id: tripId,
      travelerId: req.userId
    });

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found."
      });
    }

    const Expense = require("../models/expense");

    await Expense.deleteMany({
      tripId: trip._id,
      travelerId: req.userId
    });

    await Trip.deleteOne({ _id: trip._id });

    return res.status(200).json({
      message: "Trip and associated expenses deleted successfully."
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid trip ID."
      });
    }

    console.error("Delete trip error:", error.message);

    return res.status(500).json({
      message: "Failed to delete trip."
    });
  }
};

module.exports = {
  createTrip,
  getMyTrips,
  updateTrip,
  deleteTrip
};

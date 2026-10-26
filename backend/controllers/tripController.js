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

module.exports = {
  createTrip,
  getMyTrips
};

const Destination = require("../models/destination");

const createDestination = async (req, res) => {
  try {
    const {
      name,
      province,
      district,
      category,
      description,
      images,
      entranceFees,
      openingHours,
      bestVisitingSeason
    } = req.body;

    if (
      !name ||
      !province ||
      !district ||
      !category ||
      !description
    ) {
      return res.status(400).json({
        message: "Please provide all required destination fields."
      });
    }

    const destination = await Destination.create({
      name,
      province,
      district,
      category,
      description,
      images,
      entranceFees,
      openingHours,
      bestVisitingSeason
    });

    return res.status(201).json({
      message: "Destination created successfully.",
      destination
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: error.message
      });
    }

    console.error("Create destination error:", error.message);

    return res.status(500).json({
      message: "Failed to create destination."
    });
  }
};


const getAllDestinations = async (req, res) => {
  try {
    const destinations = await Destination.find().sort({
      createdAt: -1
    });

    return res.status(200).json({
      count: destinations.length,
      destinations
    });
  } catch (error) {
    console.error("Get destinations error:", error.message);

    return res.status(500).json({
      message: "Failed to retrieve destinations."
    });
  }
};

const getDestinationById = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);

    if (!destination) {
      return res.status(404).json({
        message: "Destination not found."
      });
    }

    return res.status(200).json({ destination });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid destination ID."
      });
    }

    console.error("Get destination error:", error.message);

    return res.status(500).json({
      message: "Failed to retrieve destination."
    });
  }
};


const updateDestination = async (req, res) => {
  try {
    const destination = await Destination.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!destination) {
      return res.status(404).json({
        message: "Destination not found."
      });
    }

    return res.status(200).json({
      message: "Destination updated successfully.",
      destination
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid destination ID."
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: error.message
      });
    }

    console.error("Update destination error:", error.message);

    return res.status(500).json({
      message: "Failed to update destination."
    });
  }
};


const deleteDestination = async (req, res) => {
  try {
    const destination = await Destination.findByIdAndDelete(
      req.params.id
    );

    if (!destination) {
      return res.status(404).json({
        message: "Destination not found."
      });
    }

    return res.status(200).json({
      message: "Destination deleted successfully.",
      destination
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid destination ID."
      });
    }

    console.error("Delete destination error:", error.message);

    return res.status(500).json({
      message: "Failed to delete destination."
    });
  }
};


module.exports = {
  createDestination,
  getAllDestinations,
  getDestinationById,
  updateDestination,
  deleteDestination
};

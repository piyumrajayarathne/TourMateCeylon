const Hotel = require("../models/hotel");
const Room = require("../models/room");

const createHotel = async (req, res) => {
  try {
    const {
      hotelName,
      description,
      location,
      amenities,
      images
    } = req.body;

    if (!hotelName || !description || !location) {
      return res.status(400).json({
        message: "Please provide the hotel name, description and location."
      });
    }

    const hotel = await Hotel.create({
      ownerId: req.userId,
      hotelName,
      description,
      location,
      amenities,
      images
    });

    return res.status(201).json({
      message: "Hotel created successfully.",
      hotel
    });
  } catch (error) {
    console.error("Create hotel error:", error);
    return res.status(500).json({
      message: "Failed to create hotel."
    });
  }
};

const getAllHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find()
      .select("hotelName description location amenities images averageRating")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: hotels.length,
      hotels
    });
  } catch (error) {
    console.error("Get hotels error:", error);
    return res.status(500).json({
      message: "Failed to retrieve hotels."
    });
  }
};

const getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id)
      .select("hotelName description location amenities images averageRating");

    if (!hotel) {
      return res.status(404).json({
        message: "Hotel not found."
      });
    }

    return res.status(200).json({ hotel });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid hotel ID."
      });
    }

    console.error("Get hotel error:", error);
    return res.status(500).json({
      message: "Failed to retrieve hotel."
    });
  }
};

const getMyHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find({
      ownerId: req.userId
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      count: hotels.length,
      hotels
    });
  } catch (error) {
    console.error("Get my hotels error:", error);
    return res.status(500).json({
      message: "Failed to retrieve your hotels."
    });
  }
};

const updateHotel = async (req, res) => {
  try {
    const {
      hotelName,
      description,
      location,
      amenities,
      images
    } = req.body;

    if (
      !hotelName?.trim() ||
      !description?.trim() ||
      !location?.trim()
    ) {
      return res.status(400).json({
        message: "Hotel name, description and location are required."
      });
    }

    const hotel = await Hotel.findOneAndUpdate(
      {
        _id: req.params.id,
        ownerId: req.userId
      },
      {
        hotelName: hotelName.trim(),
        description: description.trim(),
        location: location.trim(),
        amenities: Array.isArray(amenities) ? amenities : [],
        images: Array.isArray(images) ? images : []
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!hotel) {
      return res.status(404).json({
        message: "Hotel not found or you are not authorized to edit it."
      });
    }

    return res.status(200).json({
      message: "Hotel updated successfully.",
      hotel
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid hotel ID."
      });
    }

    console.error("Update hotel error:", error);
    return res.status(500).json({
      message: "Failed to update hotel."
    });
  }
};

const deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findOne({
      _id: req.params.id,
      ownerId: req.userId
    });

    if (!hotel) {
      return res.status(404).json({
        message: "Hotel not found or you are not authorized to delete it."
      });
    }

    const existingRooms = await Room.countDocuments({
      hotelId: hotel._id
    });

    if (existingRooms > 0) {
      return res.status(409).json({
        message: "Please delete or manage this hotel's rooms before deleting the hotel."
      });
    }

    await Hotel.deleteOne({ _id: hotel._id });

    return res.status(200).json({
      message: "Hotel deleted successfully."
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid hotel ID."
      });
    }

    console.error("Delete hotel error:", error);
    return res.status(500).json({
      message: "Failed to delete hotel."
    });
  }
};

module.exports = {
  createHotel,
  getAllHotels,
  getHotelById,
  getMyHotels,
  updateHotel,
  deleteHotel
};
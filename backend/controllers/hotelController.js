const Hotel = require("../models/hotel");

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

module.exports = {
  createHotel,
  getAllHotels,
  getHotelById
};

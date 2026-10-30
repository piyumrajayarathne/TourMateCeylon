const Room = require("../models/room");
const Hotel = require("../models/hotel");
const Booking = require("../models/booking");

const createRoom = async (req, res) => {
  try {
    const {
      hotelId,
      roomType,
      pricePerNight,
      maximumGuests,
      images
    } = req.body;

    if (
      !hotelId ||
      !roomType ||
      pricePerNight == null ||
      maximumGuests == null
    ) {
      return res.status(400).json({
        message: "Please provide all required room details."
      });
    }

    const price = Number(pricePerNight);
    const guests = Number(maximumGuests);

    if (
      !Number.isFinite(price) ||
      price < 0 ||
      !Number.isInteger(guests) ||
      guests < 1
    ) {
      return res.status(400).json({
        message: "Please provide a valid room price and maximum guest count."
      });
    }

    const hotel = await Hotel.findOne({
      _id: hotelId,
      ownerId: req.userId
    });

    if (!hotel) {
      return res.status(404).json({
        message: "Hotel not found or you do not own this hotel."
      });
    }

    const room = await Room.create({
      hotelId,
      roomType,
      pricePerNight: price,
      maximumGuests: guests,
      images
    });

    return res.status(201).json({
      message: "Room created successfully.",
      room
    });
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid room details."
      });
    }

    console.error("Create room error:", error);

    return res.status(500).json({
      message: "Failed to create room."
    });
  }
};

const getAllAvailableRooms = async (req, res) => {
  try {
    const rooms = await Room.find({
      availabilityStatus: "Available"
    })
      .populate("hotelId", "hotelName location images averageRating")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: rooms.length,
      rooms
    });
  } catch (error) {
    console.error("Get rooms error:", error);

    return res.status(500).json({
      message: "Failed to retrieve rooms."
    });
  }
};

const getRoomsByHotel = async (req, res) => {
  try {
    const rooms = await Room.find({
      hotelId: req.params.hotelId,
      availabilityStatus: "Available"
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      count: rooms.length,
      rooms
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid hotel ID."
      });
    }

    console.error("Get hotel rooms error:", error);

    return res.status(500).json({
      message: "Failed to retrieve hotel rooms."
    });
  }
};

const getMyRooms = async (req, res) => {
  try {
    const hotels = await Hotel.find({
      ownerId: req.userId
    }).select("_id");

    const hotelIds = hotels.map((hotel) => hotel._id);

    const rooms = await Room.find({
      hotelId: { $in: hotelIds }
    })
      .populate("hotelId", "hotelName location")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: rooms.length,
      rooms
    });
  } catch (error) {
    console.error("Get owner rooms error:", error);

    return res.status(500).json({
      message: "Failed to retrieve your rooms."
    });
  }
};


const updateRoom = async (req, res) => {
  try {
    const {
      roomType,
      pricePerNight,
      maximumGuests,
      images
    } = req.body;

    const room = await Room.findById(req.params.roomId);

    if (!room) {
      return res.status(404).json({
        message: "Room not found."
      });
    }

    const hotel = await Hotel.findOne({
      _id: room.hotelId,
      ownerId: req.userId
    });

    if (!hotel) {
      return res.status(403).json({
        message: "You are not authorized to update this room."
      });
    }

    if (roomType !== undefined) {
      room.roomType = roomType;
    }

    if (pricePerNight !== undefined) {
      const price = Number(pricePerNight);

      if (!Number.isFinite(price) || price < 0) {
        return res.status(400).json({
          message: "Please provide a valid room price."
        });
      }

      room.pricePerNight = price;
    }

    if (maximumGuests !== undefined) {
      const guests = Number(maximumGuests);

      if (!Number.isInteger(guests) || guests < 1) {
        return res.status(400).json({
          message: "Please provide a valid maximum guest count."
        });
      }

      room.maximumGuests = guests;
    }

    if (images !== undefined) {
      if (!Array.isArray(images)) {
        return res.status(400).json({
          message: "Images must be an array."
        });
      }

      room.images = images;
    }

    await room.save();

    return res.status(200).json({
      message: "Room updated successfully.",
      room
    });
  } catch (error) {
    console.error("Update room error:", error);

    return res.status(500).json({
      message: "Failed to update room."
    });
  }
};


// Change room availability
const updateRoomAvailability = async (req, res) => {
  try {
    const { availabilityStatus } = req.body;

    if (!["Available", "Unavailable"].includes(availabilityStatus)) {
      return res.status(400).json({
        message: "Invalid availability status."
      });
    }

    const room = await Room.findById(req.params.roomId);

    if (!room) {
      return res.status(404).json({
        message: "Room not found."
      });
    }

    const hotel = await Hotel.findOne({
      _id: room.hotelId,
      ownerId: req.userId
    });

    if (!hotel) {
      return res.status(403).json({
        message: "You are not authorized to update this room."
      });
    }

    room.availabilityStatus = availabilityStatus;

    await room.save();

    return res.status(200).json({
      message: "Room availability updated successfully.",
      room
    });
  } catch (error) {
    console.error("Update room availability error:", error);

    return res.status(500).json({
      message: "Failed to update room availability."
    });
  }
};

const deleteRoom = async (req, res) => {
  try {
    const existingBooking = await Booking.findOne({
      serviceId: req.params.roomId,
      bookingType: "Hotel",
      bookingStatus: { $in: ["Pending", "Confirmed"] }
    });

    console.log("Active booking found:", existingBooking);

    if (existingBooking) {
      return res.status(400).json({
        message: "This room cannot be deleted because it has active bookings."
      });
    }

    const room = await Room.findById(req.params.roomId);

    if (!room) {
      return res.status(404).json({
        message: "Room not found."
      });
    }

    const hotel = await Hotel.findOne({
      _id: room.hotelId,
      ownerId: req.userId
    });

    if (!hotel) {
      return res.status(403).json({
        message: "You are not authorized to delete this room."
      });
    }

    await Room.findByIdAndDelete(req.params.roomId);

    return res.status(200).json({
      message: "Room deleted successfully."
    });

  } catch (error) {
    console.error("Delete room error:", error);

    return res.status(500).json({
      message: "Failed to delete room."
    });
  }
};

module.exports = {
  createRoom,
  getAllAvailableRooms,
  getRoomsByHotel,
  getMyRooms,
  updateRoom,
  updateRoomAvailability,
  deleteRoom
};

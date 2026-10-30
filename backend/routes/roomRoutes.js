const express = require("express");
const router = express.Router();

const {
  protect,
  authorizeRoles
} = require("../middleware/authMiddleware");

const {
  createRoom,
  getAllAvailableRooms,
  getRoomsByHotel,
  getMyRooms,
  updateRoom,
  updateRoomAvailability,
  deleteRoom
} = require("../controllers/roomController");

router.post(
  "/",
  protect,
  authorizeRoles("Hotel Owner"),
  createRoom
);

router.get(
  "/my-rooms",
  protect,
  authorizeRoles("Hotel Owner"),
  getMyRooms
);

router.put(
  "/:roomId",
  protect,
  authorizeRoles("Hotel Owner"),
  updateRoom
);

router.patch(
  "/:roomId/availability",
  protect,
  authorizeRoles("Hotel Owner"),
  updateRoomAvailability
);

router.delete(
  "/:roomId",
  protect,
  authorizeRoles("Hotel Owner"),
  deleteRoom
);

router.get("/", getAllAvailableRooms);
router.get("/hotel/:hotelId", getRoomsByHotel);

module.exports = router;

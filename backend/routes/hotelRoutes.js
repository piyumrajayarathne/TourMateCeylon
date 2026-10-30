const express = require("express");
const router = express.Router();

const {
  protect,
  authorizeRoles
} = require("../middleware/authMiddleware");

const {
  createHotel,
  getAllHotels,
  getHotelById,
  getMyHotels,
  updateHotel,
  deleteHotel
} = require("../controllers/hotelController");

router.post(
  "/",
  protect,
  authorizeRoles("Hotel Owner"),
  createHotel
);

router.get(
  "/my-hotels",
  protect,
  authorizeRoles("Hotel Owner"),
  getMyHotels
);

router.put(
  "/:id",
  protect,
  authorizeRoles("Hotel Owner"),
  updateHotel
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("Hotel Owner"),
  deleteHotel
);

router.get("/", getAllHotels);
router.get("/:id", getHotelById);

module.exports = router;

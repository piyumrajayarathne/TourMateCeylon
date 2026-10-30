const express = require("express");
const router = express.Router();

const {
  protect,
  authorizeRoles
} = require("../middleware/authMiddleware");

const {
  createHotel,
  getAllHotels,
  getHotelById
} = require("../controllers/hotelController");

router.post(
  "/",
  protect,
  authorizeRoles("Hotel Owner"),
  createHotel
);

router.get("/", getAllHotels);

router.get("/:id", getHotelById);

module.exports = router;

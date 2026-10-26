const express = require("express");
const router = express.Router();

const {
  createTrip,
  getMyTrips
} = require("../controllers/tripController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createTrip);

router.get("/my-trips", protect, getMyTrips);

module.exports = router;

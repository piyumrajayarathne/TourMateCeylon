const express = require("express");
const router = express.Router();

const {
  createTrip,
  getMyTrips,
  updateTrip,
  deleteTrip
} = require("../controllers/tripController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createTrip);
router.get("/my-trips", protect, getMyTrips);
router.put("/:tripId", protect, updateTrip);
router.delete("/:tripId", protect, deleteTrip);

module.exports = router;

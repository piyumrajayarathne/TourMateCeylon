
const express = require("express");
const router = express.Router();

const {
  createDestination,
  getAllDestinations,
  getDestinationById
} = require("../controllers/destinationController");

router.post("/", createDestination);
router.get("/", getAllDestinations);
router.get("/:id", getDestinationById);

module.exports = router;

const Event = require("../models/event");

const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ startDate: 1 });

    res.status(200).json({
      count: events.length,
      events
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve events.",
      error: error.message
    });
  }
};

const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found."
      });
    }

    res.status(200).json({ event });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve event.",
      error: error.message
    });
  }
};

module.exports = {
  getAllEvents,
  getEventById
};

import { Event } from "../models/events.models.js";

// Add Event
export const addEvents = async (req, res) => {
  try {
    const photos = req.files
      ? req.files.map(file => `${req.protocol}://${req.get("host")}/uploads/${file.filename}`)
      : [];

    const eventData = JSON.parse(req.body.eventData || "{}");
    let tickets = JSON.parse(req.body.tickets || "[]");
    const questions = JSON.parse(req.body.questions || "[]");

    const {
      eventName,
      location,
      category,
      description,
      startDate,
      startTime,
      endDate,
      endTime,
      registrationStartDate,
      registrationStartTime,
      registrationEndDate,
      registrationEndTime,
      publishEvent
    } = eventData;

    if (!eventName || !location || !category) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    tickets = tickets.map(ticket => ({
      ...ticket,
      salesStart: ticket.salesStart ? new Date(ticket.salesStart) : null,
      salesEnd: ticket.salesEnd ? new Date(ticket.salesEnd) : null
    }));

    const newEvent = await Event.create({
      eventName,
      location,
      category,
      description,
      startDate: new Date(`${startDate} ${startTime}`),
      endDate: new Date(`${endDate} ${endTime}`),
      registrationStart: new Date(`${registrationStartDate} ${registrationStartTime}`),
      registrationEnd: new Date(`${registrationEndDate} ${registrationEndTime}`),
      publishEvent: publishEvent || false,
      tickets,
      questions,
      photos,
      organizer: req.user._id
    });

    res.status(201).json({
      success: true,
      message: "New event added successfully!",
      event: newEvent
    });

  } catch (error) {
    console.error("Add Event Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single event by ID
export const getEventById = async (req, res) => {
  try {
    const { id } = req.params; // must match route
    if (!id) return res.status(400).json({ success: false, message: "Event ID is required" });

    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });

    res.status(200).json({ success: true, event });
  } catch (err) {
    console.error("Get Event By ID Error:", err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// Get all events
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: events.length, events });
  } catch (error) {
    console.error("Get All Events Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Event
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedEvent = await Event.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

    if (!updatedEvent) return res.status(404).json({ success: false, message: "Event not found" });

    res.status(200).json({ success: true, message: "Event updated successfully", event: updatedEvent });
  } catch (error) {
    console.error("Update Event Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

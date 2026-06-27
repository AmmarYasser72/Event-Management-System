import crypto from "crypto";
import { Event } from "../models/events.models.js";
import { serializeEvent } from "../utils/eventSerializer.js";

function parseJsonField(value, fallback) {
  if (!value) {
    return fallback;
  }

  if (typeof value !== "string") {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function toDateOnly(value) {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function toTimeString(value) {
  if (!value) {
    return "";
  }

  return String(value).slice(0, 5);
}

function normalizeTickets(tickets) {
  return (tickets || []).map((ticket) => ({
    name: String(ticket.name || ticket.type || "General").trim(),
    price: Number(ticket.price || 0),
    salesStart: toDateOnly(ticket.salesStart),
    salesEnd: toDateOnly(ticket.salesEnd),
    maxTicketsPerUser: Number(ticket.maxTicketsPerUser || ticket.maxPerUser || 1),
    maxTickets: Number(ticket.maxTickets || ticket.available || 0),
    registrations: Number(ticket.registrations || ticket.sold || 0),
  }));
}

function normalizeQuestions(questions) {
  return (questions || []).map((question) => ({
    title: String(question.title || question.label || "").trim(),
    mandatory: Boolean(question.mandatory || question.required),
    oncePerOrder: Boolean(question.oncePerOrder),
    type: question.type || "Text",
    answers: question.answers || "",
  }));
}

function buildEventCode() {
  return `EVT-${crypto.randomBytes(5).toString("hex").toUpperCase()}`;
}

// Add Event
export const addEvents = async (req, res) => {
  try {
    const photos = req.files
      ? req.files.map((file) => `${req.protocol}://${req.get("host")}/uploads/${file.filename}`)
      : [];

    const eventData = parseJsonField(req.body.eventData, req.body);
    const tickets = normalizeTickets(parseJsonField(req.body.tickets, req.body.tickets || []));
    const questions = normalizeQuestions(parseJsonField(req.body.questions, []));

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
      return res.status(400).json({ success: false, message: "Required fields missing" });
    }

    const normalizedStartDate = toDateOnly(startDate);
    const normalizedEndDate = toDateOnly(endDate);
    if (!normalizedStartDate || !normalizedEndDate || !startTime || !endTime) {
      return res.status(400).json({ success: false, message: "Invalid event date or time" });
    }

    const newEvent = await Event.create({
      eventCode: buildEventCode(),
      eventName,
      location,
      category,
      description,
      startDate: normalizedStartDate,
      startTime: toTimeString(startTime),
      endDate: normalizedEndDate,
      endTime: toTimeString(endTime),
      registrationStartDate: toDateOnly(registrationStartDate),
      registrationStartTime: toTimeString(registrationStartTime),
      registrationEndDate: toDateOnly(registrationEndDate),
      registrationEndTime: toTimeString(registrationEndTime),
      publishEvent: Boolean(publishEvent),
      tickets,
      questions,
      photos,
      organizer: req.user._id
    });

    res.status(201).json({
      success: true,
      message: "New event added successfully!",
      event: serializeEvent(newEvent)
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

    const event = await Event.findById(id).populate("organizer", "username email");
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });

    res.status(200).json({ success: true, event: serializeEvent(event) });
  } catch (err) {
    console.error("Get Event By ID Error:", err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// Get all events
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("organizer", "username email").sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: events.length, events: events.map(serializeEvent) });
  } catch (error) {
    console.error("Get All Events Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Event
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = {
      ...req.body,
      startDate: req.body.startDate ? toDateOnly(req.body.startDate) : undefined,
      endDate: req.body.endDate ? toDateOnly(req.body.endDate) : undefined,
      registrationStartDate: req.body.registrationStartDate ? toDateOnly(req.body.registrationStartDate) : undefined,
      registrationEndDate: req.body.registrationEndDate ? toDateOnly(req.body.registrationEndDate) : undefined,
    };

    const updatedEvent = await Event.findByIdAndUpdate(id, payload, { new: true, runValidators: true })
      .populate("organizer", "username email");

    if (!updatedEvent) return res.status(404).json({ success: false, message: "Event not found" });

    res.status(200).json({ success: true, message: "Event updated successfully", event: serializeEvent(updatedEvent) });
  } catch (error) {
    console.error("Update Event Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

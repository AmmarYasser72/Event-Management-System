import { Event } from "../models/events.models.js";
import { serializeEvent } from "../utils/eventSerializer.js";

function toDateTime(dateValue, timeValue) {
  if (!dateValue || !timeValue) {
    return null;
  }

  const isoDate =
    dateValue instanceof Date
      ? dateValue.toISOString().slice(0, 10)
      : String(dateValue).slice(0, 10);

  const dateTime = new Date(`${isoDate}T${String(timeValue).slice(0, 5)}:00`);
  return Number.isNaN(dateTime.getTime()) ? null : dateTime;
}

function computeStatus(event) {
  const now = new Date();
  const end = toDateTime(event.endDate, event.endTime);

  if (end && end < now) {
    return "closed";
  }

  if (event.publishEvent === false) {
    return "pending";
  }

  return "upcoming";
}

function ticketAgg(event) {
  let sold = 0;
  let capacity = 0;
  let revenue = 0;

  for (const ticket of event.tickets || []) {
    const registrations = Number(ticket.registrations || 0);
    const price = Number(ticket.price || 0);
    const maxTickets = Number(ticket.maxTickets || 0);
    sold += registrations;
    capacity += maxTickets;
    revenue += registrations * price;
  }

  return { sold, capacity, revenue };
}

function iconForCategory(category) {
  switch ((category || "").toLowerCase()) {
    case "music":
      return "🎵";
    case "sports matches":
      return "🏟️";
    case "exhibition":
      return "🖼️";
    case "conference":
      return "🎤";
    default:
      return "🎫";
  }
}

export const getEventBoard = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user._id }).sort({ createdAt: -1 });
    const board = { upcoming: [], pending: [], closed: [] };

    for (const eventDocument of events) {
      const event = serializeEvent(eventDocument);
      const { sold, capacity, revenue } = ticketAgg(eventDocument);
      const status = computeStatus(eventDocument);

      board[status].push({
        id: event.id,
        title: event.title,
        venue: event.location,
        date: `${event.startDate}${event.endDate ? ` -> ${event.endDate}` : ""}`,
        time: `${event.startTime}${event.endTime ? ` -> ${event.endTime}` : ""}`,
        revenue,
        sold,
        capacity,
        icon: iconForCategory(event.category),
      });
    }

    return res.status(200).json({ success: true, board });
  } catch (error) {
    console.error("board error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

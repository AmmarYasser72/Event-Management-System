// backend/src/controllers/events.board.controllers.js
import { Event } from "../models/events.models.js";

// combine date + time strings to Date
function toDate(d, t) {
  if (!d || !t) return null;
  const x = new Date(`${d}T${t}`);
  return isNaN(x.getTime()) ? null : x;
}

function computeStatus(ev) {
  const now = new Date();
  const start = toDate(ev.startDate, ev.startTime);
  const end = toDate(ev.endDate, ev.endTime);

  if (end && end < now) return "closed";
  // treat unpublished/unapproved as pending
  if (!ev.published || ev.publishEvent === false) return "pending";
  return "upcoming";
}

function ticketAgg(ev) {
  let sold = 0;
  let capacity = 0;
  let revenue = 0;
  for (const t of ev.tickets || []) {
    const reg = Number(t.registrations || 0);
    const price = Number(t.price || 0);
    const max = Number(t.maxTickets || 0);
    sold += reg;
    capacity += max;
    revenue += reg * price;
  }
  return { sold, capacity, revenue };
}

function iconForCategory(cat) {
  switch ((cat || "").toLowerCase()) {
    case "music": return "🎵";
    case "sports matches": return "🏟️";
    case "exhibition": return "🖼️";
    case "conference": return "🎤";
    default: return "🎫";
  }
}

export const getEventBoard = async (req, res) => {
  try {
    // If you want only this admin’s events: { organizer: req.user._id }
    const events = await Event.find({}).sort({ createdAt: -1 });

    const board = { upcoming: [], pending: [], closed: [] };

    for (const ev of events) {
      const { sold, capacity, revenue } = ticketAgg(ev);
      const status = computeStatus(ev);

      board[status].push({
        id: String(ev._id),
        title: ev.eventName,
        venue: ev.location,
        date: `${ev.startDate ?? "-"} ${ev.endDate ? `→ ${ev.endDate}` : ""}`.trim(),
        time: `${ev.startTime ?? "-"} ${ev.endTime ? `→ ${ev.endTime}` : ""}`.trim(),
        revenue,
        sold,
        capacity,
        icon: iconForCategory(ev.category),
      });
    }

    return res.status(200).json({ success: true, board });
  } catch (err) {
    console.error("board error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
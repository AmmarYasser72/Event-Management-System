import crypto from "crypto";
import { Event } from "../models/events.models.js";
import { Booking } from "../models/booking.models.js";
import { buildBookingQrValue } from "../utils/qr.js";

function ensureEventCode(event) {
  if (event.eventCode) {
    return event.eventCode;
  }

  event.eventCode = `EVT-${String(event._id).slice(-8).toUpperCase()}`;
  return event.eventCode;
}

export const createBooking = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const { eventId, ticketTypeId, seatNumber } = req.body;

    const ev = await Event.findById(eventId);
    if (!ev) return res.status(404).json({ success: false, message: "Event not found" });

    const ticket = (ev.tickets || []).find(t => String(t._id) === String(ticketTypeId));
    if (!ticket) return res.status(400).json({ success: false, message: "Ticket type not found" });

    const sold = Number(ticket.registrations || 0);
    const cap = Number(ticket.maxTickets || 0);
    if (cap && sold >= cap) {
      return res.status(400).json({ success: false, message: "Sold out" });
    }

    const existingCount = await Booking.countDocuments({
      user: userId,
      event: ev._id,
      ticketTypeId,
    });
    const maxPerUser = Number(ticket.maxTicketsPerUser || 0);
    if (maxPerUser && existingCount >= maxPerUser) {
      return res.status(400).json({ success: false, message: "Ticket limit reached for this event" });
    }

    const eventCode = ensureEventCode(ev);
    const qrToken = crypto.randomBytes(12).toString("hex");
    let booking = await Booking.create({
      user: userId,
      event: ev._id,
      ticketTypeId,
      seatNumber: seatNumber || null,
      pricePaid: Number(ticket.price || 0),
      qrToken,
    });

    ticket.registrations = sold + 1;
    await ev.save();
    booking = await Booking.findById(booking._id).populate("event", "eventName eventCode location startDate startTime");

    const qrCode = buildBookingQrValue(eventCode, booking._id, booking.qrToken);

    return res.status(201).json({
      success: true,
      message: "Booked successfully",
      booking: {
        ...booking.toObject(),
        qrCode,
      },
    });
  } catch (err) {
    console.error("createBooking error:", err);
    return res.status(500).json({ success: false, message: "Booking failed" });
  }
};

export const myBookings = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const bookings = await Booking.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("event", "eventName eventCode description location startDate startTime endDate endTime tickets");

    return res.status(200).json({
      success: true,
      bookings: bookings.map((booking) => ({
        ...booking.toObject(),
        qrCode: buildBookingQrValue(booking.event?.eventCode, booking._id, booking.qrToken),
      })),
    });
  } catch (err) {
    console.error("myBookings error:", err);
    return res.status(500).json({ success: false, message: "Failed to load tickets" });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const { id } = req.params;
    const b = await Booking.findById(id)
      .populate("event", "eventName eventCode description location startDate startTime endDate endTime tickets")
      .populate("user", "username email role");

    if (!b) return res.status(404).json({ success: false, message: "Booking not found" });
    if (String(b.user._id) !== String(userId) && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const t = b.event?.tickets?.find(tt => String(tt._id) === String(b.ticketTypeId));
    return res.status(200).json({
      success: true,
      booking: {
        id: b._id,
        qrToken: b.qrToken,
        qrCode: buildBookingQrValue(b.event?.eventCode, b._id, b.qrToken),
        redeemedAt: b.redeemedAt,
        seatNumber: b.seatNumber,
        pricePaid: b.pricePaid,
        createdAt: b.createdAt,
        event: {
          id: b.event?._id,
          eventCode: b.event?.eventCode,
          name: b.event?.eventName,
          description: b.event?.description,
          location: b.event?.location,
          startDate: b.event?.startDate,
          startTime: b.event?.startTime,
          endDate: b.event?.endDate,
          endTime: b.event?.endTime,
        },
        user: b.user ? { username: b.user.username, email: b.user.email, role: b.user.role } : null,
        ticketType: t ? { id: t._id, name: t.name, price: t.price } : null,
      }
    });
  } catch (err) {
    console.error("getBookingById error:", err);
    return res.status(500).json({ success: false, message: "Failed to load ticket details" });
  }
};

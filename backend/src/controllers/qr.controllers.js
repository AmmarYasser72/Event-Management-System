import { Booking } from "../models/booking.models.js";

export const verifyQR = async (req, res) => {
  try {
    const { token } = req.body || {};
    if (!token) return res.status(400).json({ success: false, message: "QR token is required" });

    const booking = await Booking.findOne({ qrToken: token }).populate(
      "event",
      "eventName location startDate startTime"
    );

    if (!booking) return res.status(404).json({ success: false, message: "Invalid QR" });

    if (booking.redeemedAt) {
      return res.status(200).json({
        success: true, valid: true, alreadyRedeemed: true, message: "Ticket already used",
        booking: { id: booking._id, event: booking.event?.eventName, seatNumber: booking.seatNumber }
      });
    }

    booking.redeemedAt = new Date();
    await booking.save();

    return res.status(200).json({
      success: true, valid: true, alreadyRedeemed: false, message: "QR verified",
      booking: { id: booking._id, event: booking.event?.eventName, seatNumber: booking.seatNumber }
    });
  } catch (err) {
    console.error("verifyQR error:", err);
    return res.status(500).json({ success: false, message: "Verification failed" });
  }
};
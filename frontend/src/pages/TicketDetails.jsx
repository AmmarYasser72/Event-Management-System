import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import QRCode from "react-qr-code";

export default function TicketDetails() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const stored = JSON.parse(localStorage.getItem("userToken") || "{}");
        const token = stored.token;
        const { data } = await axios.get(`http://localhost:5000/api/v1/bookings/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        if (data?.success) setBooking(data.booking);
      } catch (e) { console.error(e); }
    })();
  }, [id]);

  if (!booking) return <div className="min-h-screen grid place-items-center bg-black text-white">Loading…</div>;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-3xl mx-auto">
        <div className="rounded-2xl bg-gray-900 p-6 border border-gray-800">
          <h1 className="text-xl font-semibold">Ticket Details</h1>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <div className="text-sm text-gray-400">Event</div>
              <div className="font-medium">{booking.event?.name}</div>
              <div className="text-sm text-gray-400">{booking.event?.location}</div>
              <div className="text-sm text-gray-400">
                {booking.event?.startDate} {booking.event?.startTime}
                {booking.event?.endDate ? ` → ${booking.event?.endDate} ${booking.event?.endTime || ""}` : ""}
              </div>
              {booking.event?.description && (
                <p className="mt-2 text-sm text-gray-300 whitespace-pre-wrap">{booking.event.description}</p>
              )}
            </div>
            <div className="flex flex-col items-center">
              <div className="rounded-lg bg-white p-3">
                <QRCode value={booking.qrToken} size={140} />
              </div>
              <div className="mt-2 text-xs text-gray-400">
                {booking.redeemedAt ? `Used at: ${new Date(booking.redeemedAt).toLocaleString()}` : "Not used yet"}
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-gray-800 p-3">
              <div className="text-xs text-gray-400">Seat</div>
              <div className="text-lg font-semibold">{booking.seatNumber || "General"}</div>
            </div>
            <div className="rounded-xl bg-gray-800 p-3">
              <div className="text-xs text-gray-400">Ticket Type</div>
              <div className="text-lg font-semibold">{booking.ticketType?.name || "-"}</div>
            </div>
            <div className="rounded-xl bg-gray-800 p-3">
              <div className="text-xs text-gray-400">Price Paid</div>
              <div className="text-lg font-semibold">{(booking.pricePaid || 0).toLocaleString()} LKR</div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="text-xs text-gray-400">Booked at {new Date(booking.createdAt).toLocaleString()}</div>
            <Link to="/my-tickets" className="underline text-sm">Back to My Tickets</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

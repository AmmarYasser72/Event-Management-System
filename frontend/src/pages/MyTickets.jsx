import React, { useEffect, useState } from "react";
import axios from "axios";
import QRCode from "react-qr-code";
import { Link } from "react-router-dom";

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const stored = JSON.parse(localStorage.getItem("userToken") || "{}");
        const token = stored.token;
        const { data } = await axios.get("http://localhost:5000/api/v1/bookings/mine", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        if (data?.success) setTickets(data.bookings || []);
      } catch (e) { console.error(e); }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">My Tickets</h1>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tickets.map(b => (
            <div key={b._id} className="rounded-xl bg-gray-900 p-4 border border-gray-800">
              <div className="text-lg font-semibold">{b.event?.eventName || "Event"}</div>
              <div className="text-sm text-gray-400 mt-1">{b.event?.location}</div>
              <div className="text-sm text-gray-400">
                {b.event?.startDate} {b.event?.startTime}
              </div>
              <div className="mt-3 p-3 rounded-lg bg-white inline-block">
                <QRCode value={b.qrToken} size={120} />
              </div>
              <div className="text-xs text-gray-400 mt-2">Seat: {b.seatNumber || "General"}</div>
              <div className="text-xs text-gray-400">Paid: {b.pricePaid} LKR</div>

              <Link to={`/ticket/${b._id}`} className="mt-3 inline-block underline text-sm">
                View details
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function BrowseEvents() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/v1/events/all");
        if (data?.success) setEvents(data.events || data.data || []);
      } catch (e) { console.error(e); }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Upcoming Events</h1>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map(ev => (
            <div key={ev._id} className="rounded-xl bg-gray-900 p-4 border border-gray-800">
              <div className="text-lg font-semibold">{ev.eventName}</div>
              <div className="text-sm text-gray-400 mt-1">{ev.location}</div>
              <div className="text-sm text-gray-400">Date: {ev.startDate} {ev.startTime}</div>
              <Link
                to={`/eventDetails?id=${ev._id}`}
                className="inline-block mt-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-3 py-1 text-sm"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
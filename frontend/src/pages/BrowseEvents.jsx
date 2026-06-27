import React, { useEffect, useState } from "react";
import { CalendarDays, MapPin, Ticket } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";

export default function BrowseEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/events/all");
        if (data?.success) {
          setEvents(data.events || []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-[#0d1320] text-white grid place-items-center">Loading events...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0d1320] px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-300/80">Discover</p>
            <h1 className="mt-2 text-4xl font-semibold">Upcoming events</h1>
          </div>
          <Link to="/" className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/80 hover:bg-white/5">
            Back home
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {events.map((event) => (
            <article key={event.id} className="overflow-hidden rounded-[28px] border border-white/10 bg-white/5 shadow-2xl shadow-black/20">
              <div className="h-52 bg-gradient-to-br from-emerald-300/20 via-cyan-300/10 to-transparent">
                {event.images?.[0] ? (
                  <img src={event.images[0]} alt={event.title} className="h-full w-full object-cover" />
                ) : null}
              </div>
              <div className="space-y-4 p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-emerald-300/15 px-3 py-1 text-xs font-medium text-emerald-200">
                    {event.category}
                  </span>
                  <span className="text-xs text-white/55">{event.eventCode}</span>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">{event.title}</h2>
                  <p className="mt-2 line-clamp-2 text-sm text-white/65">{event.description || "Event details coming soon."}</p>
                </div>
                <div className="space-y-2 text-sm text-white/70">
                  <div className="flex items-center gap-2">
                    <CalendarDays size={16} className="text-emerald-300" />
                    <span>{event.startDate} at {event.startTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-emerald-300" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Ticket size={16} className="text-emerald-300" />
                    <span>{event.tickets?.length || 0} ticket types available</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Link to={`/event/${event.id}`} className="flex-1 rounded-full bg-white px-4 py-3 text-center text-sm font-medium text-[#0d1320]">
                    View details
                  </Link>
                  <Link to={`/booking/${event.id}`} className="flex-1 rounded-full border border-white/15 px-4 py-3 text-center text-sm font-medium text-white/85 hover:bg-white/5">
                    Book now
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

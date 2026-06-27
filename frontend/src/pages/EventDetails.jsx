import React, { useEffect, useMemo, useState } from "react";
import { CalendarDays, Clock3, MapPin, ShieldCheck, Ticket } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { api } from "../lib/api";

function formatPrice(value) {
  const amount = Number(value || 0);
  return amount === 0 ? "Free" : `${amount.toLocaleString()} EGP`;
}

export default function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/events/${id}`);
        if (data?.success) {
          setEvent(data.event);
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const cheapestTicket = useMemo(() => {
    if (!event?.tickets?.length) {
      return null;
    }

    return [...event.tickets].sort((a, b) => Number(a.price || 0) - Number(b.price || 0))[0];
  }, [event]);

  if (loading) {
    return <div className="min-h-screen bg-[#0d1320] text-white grid place-items-center">Loading event details...</div>;
  }

  if (!event) {
    return <div className="min-h-screen bg-[#0d1320] text-white grid place-items-center">Event not found.</div>;
  }

  return (
    <div className="min-h-screen bg-[#0d1320] px-6 py-10 text-white">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.4fr_0.8fr]">
        <section className="overflow-hidden rounded-[32px] border border-white/10 bg-white/5 shadow-2xl shadow-black/25">
          <div className="h-72 bg-gradient-to-br from-emerald-300/20 via-cyan-300/10 to-transparent">
            {event.images?.[0] ? (
              <img src={event.images[0]} alt={event.title} className="h-full w-full object-cover" />
            ) : null}
          </div>
          <div className="space-y-8 p-7">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-emerald-300/15 px-3 py-1 text-xs font-medium text-emerald-200">
                {event.category}
              </span>
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60">
                {event.eventCode}
              </span>
            </div>
            <div>
              <h1 className="text-4xl font-semibold">{event.title}</h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-white/72">{event.longDescription || event.description}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-black/15 p-4">
                <div className="flex items-center gap-3 text-white/75">
                  <CalendarDays size={18} className="text-emerald-300" />
                  <span>{event.startDate} to {event.endDate}</span>
                </div>
              </div>
              <div className="rounded-2xl bg-black/15 p-4">
                <div className="flex items-center gap-3 text-white/75">
                  <Clock3 size={18} className="text-emerald-300" />
                  <span>{event.startTime} to {event.endTime}</span>
                </div>
              </div>
              <div className="rounded-2xl bg-black/15 p-4 sm:col-span-2">
                <div className="flex items-center gap-3 text-white/75">
                  <MapPin size={18} className="text-emerald-300" />
                  <span>{event.location}</span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold">Available tickets</h2>
              <div className="mt-4 space-y-3">
                {event.tickets?.map((ticket) => (
                  <div key={ticket.id} className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="text-lg font-medium">{ticket.name}</div>
                      <div className="mt-1 text-sm text-white/60">
                        Limit {ticket.maxTicketsPerUser} per attendee • {ticket.maxTickets - ticket.sold} left
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-lg font-semibold text-emerald-200">{formatPrice(ticket.price)}</div>
                      <Link to={`/booking/${event.id}`} className="rounded-full bg-white px-4 py-2 text-sm font-medium text-[#0d1320]">
                        Select
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <aside className="space-y-5">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20">
            <div className="text-sm uppercase tracking-[0.25em] text-white/45">Quick booking</div>
            <div className="mt-3 text-3xl font-semibold">{formatPrice(cheapestTicket?.price)}</div>
            <p className="mt-2 text-sm text-white/65">
              {cheapestTicket ? `Starts with ${cheapestTicket.name}.` : "Tickets will appear here once published."}
            </p>
            <Link to={`/booking/${event.id}`} className="mt-6 block rounded-full bg-emerald-300 px-4 py-3 text-center text-sm font-semibold text-[#07111e]">
              Continue to booking
            </Link>
            <div className="mt-4 flex items-center gap-2 text-xs text-white/60">
              <ShieldCheck size={15} className="text-emerald-300" />
              <span>Unique QR ticket generated for each confirmed booking.</span>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <div className="flex items-center gap-3">
              <Ticket size={18} className="text-emerald-300" />
              <h2 className="text-lg font-semibold">Organizer</h2>
            </div>
            <p className="mt-4 text-base font-medium">{event.organizer?.name || "Event organizer"}</p>
            <p className="mt-2 text-sm text-white/65">{event.organizer?.email || "Organizer contact will appear here."}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

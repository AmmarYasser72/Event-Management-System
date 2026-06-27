import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../lib/api";

function formatPrice(value) {
  return Number(value || 0).toLocaleString();
}

export default function BookingPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [ticketTypeId, setTicketTypeId] = useState("");
  const [seatNumber, setSeatNumber] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/events/${eventId}`);
        if (data?.success) {
          setEvent(data.event);
          setTicketTypeId(data.event.tickets?.[0]?.id || "");
        }
      } catch (error) {
        console.error(error);
        toast.error("Unable to load the event");
      } finally {
        setLoading(false);
      }
    })();
  }, [eventId]);

  const selectedTicket = useMemo(
    () => event?.tickets?.find((ticket) => ticket.id === ticketTypeId) || null,
    [event, ticketTypeId]
  );

  async function handleBooking() {
    if (!ticketTypeId) {
      toast.error("Please choose a ticket type");
      return;
    }

    try {
      setSubmitting(true);
      const { data } = await api.post("/bookings", {
        eventId,
        ticketTypeId,
        seatNumber: seatNumber.trim() || null,
      });

      if (data?.success) {
        toast.success("Ticket booked successfully");
        navigate(`/ticket/${data.booking._id || data.booking.id}`, { replace: true });
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Booking failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-[#0d1320] text-white grid place-items-center">Loading booking page...</div>;
  }

  if (!event) {
    return <div className="min-h-screen bg-[#0d1320] text-white grid place-items-center">Event not found.</div>;
  }

  return (
    <div className="min-h-screen bg-[#0d1320] px-6 py-10 text-white">
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[30px] border border-white/10 bg-white/5 p-7">
          <p className="text-sm uppercase tracking-[0.25em] text-emerald-300/80">Booking</p>
          <h1 className="mt-3 text-4xl font-semibold">{event.title}</h1>
          <p className="mt-3 text-white/65">{event.location} • {event.startDate} at {event.startTime}</p>

          <div className="mt-8 space-y-4">
            <label className="block text-sm text-white/70">Choose ticket</label>
            <select
              value={ticketTypeId}
              onChange={(eventChange) => setTicketTypeId(eventChange.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-[#111827] px-4 py-3 text-white outline-none"
            >
              {event.tickets?.map((ticket) => (
                <option key={ticket.id} value={ticket.id}>
                  {ticket.name} - {formatPrice(ticket.price)} EGP
                </option>
              ))}
            </select>
          </div>

          <div className="mt-6 space-y-4">
            <label className="block text-sm text-white/70">Seat number (optional)</label>
            <input
              value={seatNumber}
              onChange={(seatEvent) => setSeatNumber(seatEvent.target.value)}
              placeholder="Example: A12 or General"
              className="w-full rounded-2xl border border-white/10 bg-[#111827] px-4 py-3 text-white outline-none placeholder:text-white/35"
            />
          </div>
        </section>

        <aside className="rounded-[30px] border border-white/10 bg-white/5 p-7">
          <h2 className="text-2xl font-semibold">Summary</h2>
          <div className="mt-6 space-y-4 text-sm text-white/70">
            <div className="flex items-center justify-between">
              <span>Event code</span>
              <span>{event.eventCode}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Ticket type</span>
              <span>{selectedTicket?.name || "-"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Price</span>
              <span>{formatPrice(selectedTicket?.price || 0)} EGP</span>
            </div>
          </div>

          <button
            onClick={handleBooking}
            disabled={submitting}
            className="mt-8 w-full rounded-full bg-emerald-300 px-4 py-3 text-sm font-semibold text-[#07111e] disabled:opacity-60"
          >
            {submitting ? "Creating ticket..." : "Confirm booking"}
          </button>
        </aside>
      </div>
    </div>
  );
}

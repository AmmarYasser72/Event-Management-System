import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  PlusCircle,
  ChevronDown,
  Filter,
  Search,
  Calendar as CalendarIcon,
  MoreVertical,
  ArrowRightCircle,
  MapPin,
  Calendar,
  Clock,
} from "lucide-react";

function currency(n) {
  return (n ?? 0).toLocaleString() + " LKR";
}

function Pill({ color, children }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{ background: color.bg, color: color.text }}
    >
      {children}
    </span>
  );
}

function EventCard({ event }) {
  // event fields provided by backend board endpoint
  const sold = event.sold ?? 0;
  const left = Math.max(0, (event.capacity ?? 0) - sold);
  const revenue = event.revenue ?? 0;

  return (
    <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          {/* tiny emoji by category, feel free to replace with svg */}
          <div className="h-8 w-8 grid place-items-center rounded-full bg-gray-100 text-lg">
            {event.icon ?? "🎫"}
          </div>
          <div className="font-semibold">{event.title}</div>
        </div>
        <button className="h-8 w-8 grid place-items-center rounded-full hover:bg-gray-100">
          <MoreVertical className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      <div className="mt-3 flex items-center gap-4 text-sm">
        <Pill color={{ bg: "#E6F5EC", text: "#0F8A3C" }}>{currency(revenue)}</Pill>
        <Pill color={{ bg: "#FDECEC", text: "#D0302F" }}>
          {sold} <span className="ml-1">sold</span>
        </Pill>
        <Pill color={{ bg: "#EEF2FF", text: "#4F46E5" }}>
          {left} <span className="ml-1">left</span>
        </Pill>
      </div>

      <div className="mt-4 space-y-1 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-500" />
          <span className="truncate">Venue : {event.venue}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span>Date : {event.date}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <span>Time : {event.time}</span>
        </div>
      </div>

      <div className="mt-3 flex justify-end">
        <button className="h-9 w-9 grid place-items-center rounded-full border hover:bg-gray-50">
          <ArrowRightCircle className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function Column({ title, dotColor, items }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-1">
        <span
          className="inline-block h-2 w-2 rounded-full"
          style={{ background: dotColor }}
        />
        <span className="text-sm font-medium text-gray-800">{title}</span>
      </div>
      <div className="grid gap-4">
        {items.length === 0 ? (
          <div className="rounded-xl border border-dashed p-6 text-center text-gray-500">
            No events
          </div>
        ) : (
          items.map((ev) => <EventCard key={ev.id} event={ev} />)
        )}
      </div>
    </div>
  );
}

export default function ManageEvents() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [board, setBoard] = useState({ upcoming: [], pending: [], closed: [] });
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const stored = JSON.parse(localStorage.getItem("userToken") || "{}");
        const token = stored.token;
        const { data } = await axios.get(
          "http://localhost:5000/api/v1/events/board",
          { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
        );
        if (data?.success) setBoard(data.board);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchBoard();
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return board;
    const f = (arr) =>
      arr.filter((e) =>
        `${e.title} ${e.venue}`.toLowerCase().includes(query.toLowerCase())
      );
    return {
      upcoming: f(board.upcoming || []),
      pending: f(board.pending || []),
      closed: f(board.closed || []),
    };
  }, [board, query]);

  return (
    <div className="min-h-screen bg-[#0c0c0d]">
      <div className="mx-auto max-w-[1200px] px-6 py-6">
        {/* Header */}
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold mr-auto">Event Management Section</h1>

            <button
              onClick={() => nav("/addnewevent")}
              className="inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm hover:bg-gray-50"
            >
              <PlusCircle className="w-4 h-4" />
              New Event
            </button>

            <button className="inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm hover:bg-gray-50">
              Attendee Insights <ChevronDown className="w-4 h-4" />
            </button>

            <div className="inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              Filter
            </div>

            <div className="inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm hover:bg-gray-50">
              Sort By: <span className="font-medium">Status</span>
              <ChevronDown className="w-4 h-4" />
            </div>

            <div className="inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm hover:bg-gray-50">
              <CalendarIcon className="w-4 h-4" />
              Pick Date
            </div>

            <div className="flex items-center gap-2 rounded-xl border px-3.5 py-2">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                placeholder="Search…"
                className="outline-none text-sm w-40"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Columns */}
        <div className="mt-4 rounded-2xl bg-[#f4f5f7] p-5">
          {loading ? (
            <div className="py-20 text-center text-white/70">Loading…</div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-3">
              <Column title="Up-Coming Events" dotColor="#2563EB" items={filtered.upcoming || []} />
              <Column title="Pending Events" dotColor="#16A34A" items={filtered.pending || []} />
              <Column title="Closed Events" dotColor="#DC2626" items={filtered.closed || []} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
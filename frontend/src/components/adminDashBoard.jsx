// frontend/src/components/adminDashBoard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, BarChart, Bar, CartesianGrid
} from "recharts";
import QRCode from "react-qr-code";

/* ---------- small UI helpers ---------- */
function StatCard({ title, value, icon, accent = false }) {
  return (
    <div className={`rounded-2xl p-5 shadow ${accent ? "bg-[#122c20]" : "bg-[#111214]"}`}>
      <div className="text-sm text-white/70">{title}</div>
      <div className="mt-1 flex items-center gap-2">
        <span className="text-2xl">{icon}</span>
        <div className="text-2xl font-semibold">{value}</div>
      </div>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div>
      <div className="text-xs text-white/60">{label}</div>
      <div className="text-sm font-semibold text-[#ef4444]">{value}</div>
    </div>
  );
}

function SideCard({ title, children }) {
  return (
    <div className="rounded-2xl bg-[#111214] p-5 shadow">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <span className="text-white/40">—</span>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Row({ left, right, sub }) {
  return (
    <div className="rounded-xl bg-[#0e0f11] px-3 py-2">
      <div className="flex items-center justify-between text-sm">
        <span>{left}</span>
        {right && <span className="text-white/60">{right}</span>}
      </div>
      {sub && <div className="text-xs text-white/60">{sub}</div>}
    </div>
  );
}

function FooterLink({ children }) {
  return <div className="pt-1 text-right text-xs text-white/60 underline">{children}</div>;
}

function LegendDot({ className, label }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`h-3 w-3 rounded-sm ${className}`} />
      <span>{label}</span>
    </div>
  );
}

function downloadQr(value) {
  const svg = document.querySelector("#qr-wrap svg");
  if (!svg) return;
  const data = new XMLSerializer().serializeToString(svg);
  const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(data);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${value}.svg`;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/* ----- simple seat grid placeholder to match mock visuals ------ */
function SeatMapCard() {
  const seatGrid = Array.from({ length: 8 * 13 }, (_, i) => ({
    id: i,
    status: i % 7 === 0 ? "reserved" : i % 5 === 0 ? "sold" : "free",
  }));
  return (
    <div className="rounded-2xl bg-[#111214] p-5 shadow">
      <h3 className="mb-2 text-xl font-semibold">Latest Event</h3>
      <div className="mb-4 text-sm">
        <p className="font-medium">Alan Walker EDM Festival</p>
        <p className="text-white/70">Event Date: 28 March 2025</p>
      </div>
      <div className="grid grid-cols-13 gap-2">
        {seatGrid.map((seat) => (
          <div
            key={seat.id}
            className={[
              "h-6 w-6 rounded-md",
              seat.status === "sold" ? "bg-[#6b21a8]" :
              seat.status === "reserved" ? "bg-[#a78bfa]" : "bg-[#9ca3af]",
            ].join(" ")}
          />
        ))}
      </div>
      <div className="mt-4 flex items-center gap-4 text-xs text-white/70">
        <LegendDot className="bg-[#6b21a8]" label="Paid Seats" />
        <LegendDot className="bg-[#a78bfa]" label="Reserved Seats" />
        <LegendDot className="bg-[#9ca3af]" label="To be sold" />
      </div>
    </div>
  );
}

/* ---------- main admin dashboard ---------- */
export default function AdminDashBoard() {
  const nav = useNavigate();

  const [adminName, setAdminName] = useState("Admin");
  const [totals, setTotals] = useState({ events: 0, tickets: 0, revenue: 0 });
  const [netSales, setNetSales] = useState([]);
  const [locations, setLocations] = useState([]);
  const [engagement, setEngagement] = useState([]);

  useEffect(() => {
    // load admin name from login payload stored in localStorage
    try {
      const u = JSON.parse(localStorage.getItem("user") || "{}");
      if (u?.username) setAdminName(u.username);
      else if (u?.email) setAdminName(u.email.split("@")[0]);
    } catch {}

    // fetch analytics
    const fetchOverview = async () => {
      try {
        const stored = JSON.parse(localStorage.getItem("userToken") || "{}");
        const token = stored.token;
        const res = await axios.get("http://localhost:5000/api/v1/analytics/overview", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        if (res.data?.success) {
          setTotals(res.data.totals);
          setNetSales(res.data.charts.netSales);
          setLocations(res.data.charts.locations);
          setEngagement(res.data.charts.engagement);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchOverview();
  }, []);

  return (
    <div className="min-h-screen bg-[#0c0c0d] text-white">
      <div className="mx-auto max-w-[1200px] px-6 py-6">
        {/* Welcome / Header */}
        <div className="rounded-2xl bg-[#111214] p-5 shadow">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-white/10" />
            <div className="flex-1">
              <p className="text-xl font-semibold">Welcome {adminName}</p>
              <p className="text-xs text-white/60">System Administrator</p>
            </div>

            {/* right controls — includes + New Event */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => nav("/addnewevent")}
                className="rounded-xl bg-white/10 hover:bg-white/15 px-4 py-2 text-sm"
              >
                + New Event
              </button>
              <div className="rounded-full bg-[#1b1c1f] px-4 py-2 text-sm text-white/70">
                Search …
              </div>
              <div className="h-10 w-10 rounded-full bg-[#1b1c1f]" />
              <div className="h-10 w-10 rounded-full bg-[#1b1c1f]" />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <StatCard title="EVENTS" value={`${totals.events} Events`} icon="🕺" />
          <StatCard title="BOOKINGS" value={totals.tickets.toLocaleString()} icon="🧩" />
          <StatCard
            title="REVENUE"
            value={`${totals.revenue.toLocaleString()} LKR`}
            icon="💸"
            accent
          />
        </div>

        {/* Main grid */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left column */}
          <div className="lg:col-span-8 space-y-6">
            {/* Net Sales */}
            <div className="rounded-2xl bg-[#111214] p-5 shadow">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-semibold">NET SALES</h3>
                <div className="rounded-full bg-[#1b1c1f] px-3 py-1 text-xs">Filter • Monthly</div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={netSales} margin={{ top: 10, right: 20, bottom: 0, left: -20 }}>
                    <XAxis dataKey="name" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={3} dot />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-3 text-sm">
                <Metric label="Total Revenue" value={`${totals.revenue.toLocaleString()} LKR`} />
                <Metric label="Total Tickets" value={`${totals.tickets.toLocaleString()} Tickets`} />
                <Metric label="Total Events" value={`${totals.events} Events`} />
              </div>
            </div>

            {/* Latest Event seat map */}
            <SeatMapCard />
          </div>

          {/* Right column */}
          <div className="lg:col-span-4 space-y-6">
            {/* QR Section */}
            <div className="rounded-2xl bg-[#111214] p-5 shadow">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Ticket QR</h3>
                <button
                  className="rounded-lg bg-white/10 px-3 py-1 text-xs hover:bg-white/15"
                  onClick={() => downloadQr("EVENTX-EXAMPLE-TICKET")}
                >
                  Download
                </button>
              </div>
              <div className="flex justify-center">
                <div id="qr-wrap" className="rounded-xl bg-white p-3">
                  <QRCode value="EVENTX-EXAMPLE-TICKET" size={150} />
                </div>
              </div>
              <p className="mt-3 text-center text-xs text-white/60">
                Scan at the gate to validate the ticket
              </p>
            </div>

            {/* Engagement donut */}
            <div className="rounded-2xl bg-[#111214] p-5 shadow">
              <h3 className="mb-2 text-lg font-semibold">Customer Engagement</h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie dataKey="value" data={engagement} innerRadius={60} outerRadius={90} paddingAngle={3}>
                      {engagement.map((_, i) => <Cell key={i} />)}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Locations bar */}
            <div className="rounded-2xl bg-[#111214] p-5 shadow">
              <h3 className="mb-2 text-lg font-semibold">All Attendee Locations</h3>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={locations}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Notifications (placeholder) */}
            <SideCard title="Notifications">
              {[
                "Paycheck released for artists @Wayo Event",
                "Total revenue has been transferred to bank",
                "@Alan Walker Event in 3 days",
                "Paycheck released for artists @Cyndrex Event",
                "Paycheck released for artists @Get Together Event",
              ].map((t, i) => <Row key={i} left={t} />)}
              <FooterLink>See All</FooterLink>
            </SideCard>
          </div>
        </div>
      </div>
    </div>
  );
}

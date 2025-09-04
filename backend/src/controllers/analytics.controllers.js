// backend/src/controllers/analytics.controllers.js
import { Event } from "../models/events.models.js";

export const getOverview = async (req, res) => {
  try {
    const events = await Event.find({});
    const totalEvents = events.length;

    let totalTickets = 0;
    let totalRevenue = 0;

    for (const ev of events) {
      for (const t of ev.tickets || []) {
        const sold = Number(t.registrations || 0);
        totalTickets += sold;
        totalRevenue += sold * Number(t.price || 0);
      }
    }

    // Monthly rollup by createdAt
    const monthly = {};
    for (const ev of events) {
      const d = new Date(ev.createdAt || ev.updatedAt || Date.now());
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      monthly[key] ??= { name: key, value: 0 };

      let evRevenue = 0;
      for (const t of ev.tickets || []) {
        evRevenue += Number(t.registrations || 0) * Number(t.price || 0);
      }
      monthly[key].value += evRevenue;
    }
    const netSales = Object.values(monthly).sort((a, b) => a.name.localeCompare(b.name));

    // Locations count
    const locationsMap = {};
    for (const ev of events) {
      const loc = ev.location || "Unknown";
      locationsMap[loc] = (locationsMap[loc] || 0) + 1;
    }
    const locations = Object.entries(locationsMap).map(([name, value]) => ({ name, value }));

    // Simple engagement buckets derived from tickets (placeholder)
    const engagement = [
      { name: "Event - A", value: Math.max(50, Math.round(totalTickets * 0.2)) },
      { name: "Event - B", value: Math.max(50, Math.round(totalTickets * 0.25)) },
      { name: "Event - C", value: Math.max(50, Math.round(totalTickets * 0.15)) },
      { name: "Event - D", value: Math.max(50, Math.round(totalTickets * 0.18)) },
      { name: "Event - E", value: Math.max(50, Math.round(totalTickets * 0.22)) },
    ];

    return res.status(200).json({
      success: true,
      totals: { events: totalEvents, tickets: totalTickets, revenue: totalRevenue },
      charts: { netSales, locations, engagement },
    });
  } catch (err) {
    console.error("Analytics overview error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

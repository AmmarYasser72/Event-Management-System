import { Event } from "../models/events.models.js";
import User from "../models/user.models.js";

export const getOverview = async (_req, res) => {
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

    const locationsMap = {};
    for (const ev of events) {
      const loc = ev.location || "Unknown";
      locationsMap[loc] = (locationsMap[loc] || 0) + 1;
    }
    const locations = Object.entries(locationsMap).map(([name, value]) => ({ name, value }));

    const [byGenderAgg, byAgeAgg, byInterestAgg] = await Promise.all([
      User.aggregate([
        { $group: { _id: { $ifNull: ["$gender", "unknown"] }, count: { $sum: 1 } } },
        { $project: { _id: 0, name: "$_id", value: "$count" } }
      ]),
      User.aggregate([
        { $bucket: {
            groupBy: "$age",
            boundaries: [0, 18, 25, 35, 45, 60, 200],
            default: "unknown",
            output: { count: { $sum: 1 } }
        }},
        { $project: { _id: 0, name: "$_id", value: "$count" } }
      ]),
      User.aggregate([
        { $unwind: { path: "$interests", preserveNullAndEmptyArrays: true } },
        { $group: { _id: { $ifNull: ["$interests", "unknown"] }, count: { $sum: 1 } } },
        { $project: { _id: 0, name: "$_id", value: "$count" } },
        { $sort: { value: -1 } }, { $limit: 10 }
      ])
    ]);

    return res.status(200).json({
      success: true,
      totals: { events: totalEvents, tickets: totalTickets, revenue: totalRevenue },
      charts: { netSales, locations, engagement: byInterestAgg },
      demographics: { gender: byGenderAgg, age: byAgeAgg, interests: byInterestAgg }
    });
  } catch (err) {
    console.error("Analytics overview error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, Legend
} from "recharts";

function StatCard({ title, big, trend="↑ 0% Increase", value="0" }) {
  return (
    <div className="rounded-2xl bg-white dark:bg-[#111214] p-4 shadow flex items-center justify-between">
      <div>
        <div className="text-xs text-gray-500 dark:text-white/60">{title}</div>
        <div className="text-2xl font-extrabold mt-1">{big}</div>
        <div className={`text-xs mt-1 ${trend.includes("decrease") ? "text-red-500" : "text-emerald-500"}`}>{trend}</div>
      </div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  );
}

export default function AttendeeInsights() {
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState({ attendees: 0 });
  const [locations, setLocations] = useState([]);
  const [gender, setGender] = useState([]);
  const [age, setAge] = useState([]);
  const [interests, setInterests] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const stored = JSON.parse(localStorage.getItem("userToken") || "{}");
        const token = stored.token;
        const { data } = await axios.get("http://localhost:5000/api/v1/analytics/overview", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        if (data?.success) {
          setLocations(data.charts?.locations || []);
          setInterests(data.demographics?.interests || data.charts?.engagement || []);
          setGender(data.demographics?.gender || []);
          setAge(data.demographics?.age || []);
          // attendees ~ sum of age buckets (or gender)
          const attendeesCount =
            (data.demographics?.age || []).reduce((s, x) => s + Number(x.value || 0), 0) ||
            (data.demographics?.gender || []).reduce((s, x) => s + Number(x.value || 0), 0);
          setTotals({ attendees: attendeesCount });
        }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  const topAge = useMemo(() => {
    if (!age.length) return { label: "-", value: 0 };
    const map = {
      "0": "0 - 17 Years",
      "18": "18 - 24 Years",
      "25": "25 - 34 Years",
      "35": "35 - 44 Years",
      "45": "45 - 59 Years",
      "60": "60+ Years",
      "unknown": "Unknown",
    };
    const sorted = [...age].sort((a,b) => Number(b.value)-Number(a.value));
    const a = sorted[0];
    return { label: map[a.name] || a.name, value: a.value };
  }, [age]);

  const topGender = useMemo(() => {
    if (!gender.length) return { label: "-", value: 0 };
    const map = { male: "Male", female: "Female", other: "Other", unknown: "Unknown" };
    const sorted = [...gender].sort((a,b)=>Number(b.value)-Number(a.value));
    const g = sorted[0];
    return { label: map[g.name] || g.name, value: g.value };
  }, [gender]);

  const topLocation = useMemo(() => {
    if (!locations.length) return { label: "-", value: 0 };
    const sorted = [...locations].sort((a,b)=>Number(b.value)-Number(a.value));
    const l = sorted[0];
    return { label: l.name, value: l.value };
  }, [locations]);

  const topInterest = useMemo(() => {
    if (!interests.length) return { label: "-", value: 0 };
    const sorted = [...interests].sort((a,b)=>Number(b.value)-Number(a.value));
    const it = sorted[0];
    return { label: it.name, value: it.value };
  }, [interests]);

  // pie colors (let recharts auto colors if you prefer)
  const pieColors = ["#6366F1", "#10B981", "#F59E0B", "#EF4444", "#06B6D4", "#84CC16", "#A855F7", "#F97316"];

  if (loading) {
    return <div className="min-h-[400px] grid place-items-center text-gray-400">Loading insights…</div>;
  }

  return (
    <div className="space-y-6">
      {/* header strip */}
      <div className="rounded-2xl bg-white dark:bg-[#111214] p-4 shadow flex items-center gap-3">
        <div className="text-lg font-semibold">All Attendee Insights</div>
        <div className="ml-auto flex items-center gap-2">
          <div className="rounded-full bg-black/5 dark:bg-white/10 px-3 py-1 text-sm">
            Attendees: {totals.attendees.toLocaleString()}
          </div>
          <button className="rounded-xl border px-3 py-1 text-sm hover:bg-black/5 dark:hover:bg-white/10">Filter ▾</button>
          <div className="hidden md:flex items-center gap-2 rounded-full px-3 py-1 bg-black/5 dark:bg-white/10">
            <span className="opacity-50">🔎</span>
            <input className="bg-transparent outline-none text-sm w-56" placeholder="Search..." />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* left column cards */}
        <div className="lg:col-span-4 space-y-4">
          <StatCard title="ATTENDEE AGE" big={topAge.label} trend="↑ 30% Increase" value={String(topAge.value)} />
          <StatCard title="ATTENDEE GENDER" big={topGender.label} trend="↑ 18% Increase" value={String(topGender.value)} />
          <StatCard title="ATTENDEE LOCATION" big={topLocation.label} trend="↓ 15% decrease" value={String(topLocation.value)} />
          <StatCard title="ATTENDEE INTERESTS" big={topInterest.label} trend="↑ 63% Increase" value={String(topInterest.value)} />
          <StatCard title="TOTAL ENGAGEMENT" big="Facebook ADS" trend="↓ 21% decrease" value="21" />
        </div>

        {/* right column charts */}
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-2xl bg-white dark:bg-[#111214] p-4 shadow">
            <div className="text-sm font-semibold mb-2">ALL ATTENDEE LOCATIONS</div>
            <div className="h-64">
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

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-white dark:bg-[#111214] p-4 shadow">
              <div className="text-sm font-semibold mb-2">ATTENDEE INTERESTS</div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie dataKey="value" data={interests} innerRadius={60} outerRadius={90} paddingAngle={2}>
                      {interests.map((_, i) => <Cell key={i} fill={pieColors[i % pieColors.length]} />)}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-2xl bg-white dark:bg-[#111214] p-4 shadow">
              <div className="text-sm font-semibold mb-2">ATTENDEE AGES</div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie dataKey="value" data={age} innerRadius={50} outerRadius={85} paddingAngle={1}>
                      {age.map((_, i) => <Cell key={i} fill={pieColors[i % pieColors.length]} />)}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
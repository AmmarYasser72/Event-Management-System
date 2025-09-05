import React, { useState } from "react";
import { Plus, Bell, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

/**
 * Helper: combine date + time to ISO (backend expects Date for ticket sales* fields)
 */
function toISO(date, time) {
  if (!date || !time) return null;
  const d = new Date(`${date}T${time}`);
  return isNaN(d.getTime()) ? null : d.toISOString();
}

export default function AddNewEventForm() {
  const navigate = useNavigate();

  // --------- Event base fields ----------
  const [formData, setFormData] = useState({
    eventName: "",
    location: "",
    description: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    category: "music", // valid enums: "sports matches" | "music" | "exhibition" | "conference"
    publishEvent: true,
    published: true,
    registrationStartDate: "",
    registrationStartTime: "",
    registrationEndDate: "",
    registrationEndTime: "",
  });

  // --------- Tickets ----------
  const [ticketTypes, setTicketTypes] = useState([
    {
      name: "General",
      price: 100,
      salesStart: "",
      salesStartTime: "",
      salesEnd: "",
      salesEndTime: "",
      maxTicketsPerUser: 4,
      maxTickets: 100,
      registrations: 0, // sold count
    },
  ]);

  // --------- Questions (optional) ----------
  const [questions, setQuestions] = useState([
    // { label: "T-shirt size?", required: false, type: "text" }
  ]);

  // --------- Photos ----------
  const [photos, setPhotos] = useState([]);

  // Update handlers
  const setField = (k, v) => setFormData((p) => ({ ...p, [k]: v }));

  const updateTicket = (idx, key, val) => {
    setTicketTypes((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [key]: val };
      return copy;
    });
  };

  const addTicket = () =>
    setTicketTypes((p) => [
      ...p,
      {
        name: `Ticket ${p.length + 1}`,
        price: 0,
        salesStart: "",
        salesStartTime: "",
        salesEnd: "",
        salesEndTime: "",
        maxTicketsPerUser: 1,
        maxTickets: 10,
        registrations: 0,
      },
    ]);

  const removeTicket = (idx) =>
    setTicketTypes((p) => p.filter((_, i) => i !== idx));

  const onPhotosChange = (e) => {
    setPhotos(Array.from(e.target.files || []));
  };

  const validate = () => {
    const errors = [];
    if (!formData.eventName.trim()) errors.push("Event name is required");
    if (!formData.location.trim()) errors.push("Location is required");
    if (!formData.category) errors.push("Category is required");

    const startISO = toISO(formData.startDate, formData.startTime);
    const endISO = toISO(formData.endDate, formData.endTime);
    if (!startISO) errors.push("Invalid start date/time");
    if (!endISO) errors.push("Invalid end date/time");
    if (startISO && endISO && new Date(startISO) >= new Date(endISO)) {
      errors.push("End date must be after start date");
    }

    // ticket date ranges
    ticketTypes.forEach((t, i) => {
      const ss = toISO(t.salesStart, t.salesStartTime);
      const se = toISO(t.salesEnd, t.salesEndTime);
      if (!ss) errors.push(`Invalid sales start for ticket ${i + 1}`);
      if (!se) errors.push(`Invalid sales end for ticket ${i + 1}`);
      if (ss && se && new Date(ss) >= new Date(se)) {
        errors.push(`Ticket ${i + 1}: sales end must be after sales start`);
      }
      if (Number.isNaN(+t.price) || +t.price < 0)
        errors.push(`Ticket ${i + 1}: invalid price`);
    });

    if (errors.length) {
      errors.forEach((m) => toast.error(m));
      return false;
    }
    return true;
  };

  // --------- POST to backend (admins only) ----------
  const submitToServer = async () => {
    try {
      const ok = validate();
      if (!ok) return;

      // build final eventData (send strings as-is; backend stores strings for dates in event,
      // but ticket dates are Date)
      const eventData = {
        ...formData,
      };

      const ticketsPayload = ticketTypes.map((t) => ({
        name: t.name,
        price: Number(t.price),
        salesStart: toISO(t.salesStart, t.salesStartTime),
        salesEnd: toISO(t.salesEnd, t.salesEndTime),
        maxTicketsPerUser: Number(t.maxTicketsPerUser),
        maxTickets: Number(t.maxTickets),
        registrations: Number(t.registrations || 0),
      }));

      const stored = JSON.parse(localStorage.getItem("userToken") || "{}");
      const token = stored.token;
      if (!token) {
        toast.error("Please login as admin first");
        return;
      }

      const fd = new FormData();
      fd.append("eventData", JSON.stringify(eventData));
      fd.append("tickets", JSON.stringify(ticketsPayload));
      fd.append("questions", JSON.stringify(questions));
      photos.forEach((file) => fd.append("photos", file));

      const res = await axios.post(
        "http://localhost:5000/api/v1/events/add-newEvents",
        fd,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (res.data?.success) {
        toast.success(res.data.message || "Event created");
        navigate("/adminDashBoard"); // or keep current page
      } else {
        toast.error(res.data?.message || "Failed to create event");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create event");
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    submitToServer();
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gray-900 rounded-2xl border border-gray-700 overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <div className="flex items-center space-x-2">
              <Plus className="w-5 h-5 text-red-500" />
              <h1 className="text-xl font-semibold">Add New Event</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Bell className="w-6 h-6 text-gray-400 cursor-pointer hover:text-white" />
              <MapPin className="w-6 h-6 text-gray-400 cursor-pointer hover:text-white" />
            </div>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="p-6 space-y-8">
            {/* Basic Info */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300">Event Name</label>
                <input
                  className="mt-1 w-full rounded-lg bg-gray-800 border border-gray-700 p-2"
                  value={formData.eventName}
                  onChange={(e) => setField("eventName", e.target.value)}
                  placeholder="My Awesome Concert"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300">Location</label>
                <input
                  className="mt-1 w-full rounded-lg bg-gray-800 border border-gray-700 p-2"
                  value={formData.location}
                  onChange={(e) => setField("location", e.target.value)}
                  placeholder="Cairo, Egypt"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-gray-300">Description</label>
                <textarea
                  className="mt-1 w-full rounded-lg bg-gray-800 border border-gray-700 p-2"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setField("description", e.target.value)}
                  placeholder="Event details..."
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300">Category</label>
                <select
                  className="mt-1 w-full rounded-lg bg-gray-800 border border-gray-700 p-2"
                  value={formData.category}
                  onChange={(e) => setField("category", e.target.value)}
                >
                  <option value="sports matches">Sports matches</option>
                  <option value="music">Music</option>
                  <option value="exhibition">Exhibition</option>
                  <option value="conference">Conference</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="publishEvent"
                  type="checkbox"
                  className="h-4 w-4"
                  checked={formData.publishEvent}
                  onChange={(e) => setField("publishEvent", e.target.checked)}
                />
                <label htmlFor="publishEvent" className="text-sm text-gray-300">
                  Publish Event
                </label>
              </div>
            </section>

            {/* Event Dates */}
            <section>
              <h2 className="text-lg font-semibold mb-2">Event Timing</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm text-gray-300">Start Date</label>
                  <input
                    type="date"
                    className="mt-1 w-full rounded-lg bg-gray-800 border border-gray-700 p-2"
                    value={formData.startDate}
                    onChange={(e) => setField("startDate", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300">Start Time</label>
                  <input
                    type="time"
                    className="mt-1 w-full rounded-lg bg-gray-800 border border-gray-700 p-2"
                    value={formData.startTime}
                    onChange={(e) => setField("startTime", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300">End Date</label>
                  <input
                    type="date"
                    className="mt-1 w-full rounded-lg bg-gray-800 border border-gray-700 p-2"
                    value={formData.endDate}
                    onChange={(e) => setField("endDate", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300">End Time</label>
                  <input
                    type="time"
                    className="mt-1 w-full rounded-lg bg-gray-800 border border-gray-700 p-2"
                    value={formData.endTime}
                    onChange={(e) => setField("endTime", e.target.value)}
                  />
                </div>
              </div>
            </section>

            {/* Registration window (optional) */}
            <section>
              <h2 className="text-lg font-semibold mb-2">Registration Window (optional)</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm text-gray-300">Reg. Start Date</label>
                  <input
                    type="date"
                    className="mt-1 w-full rounded-lg bg-gray-800 border border-gray-700 p-2"
                    value={formData.registrationStartDate}
                    onChange={(e) => setField("registrationStartDate", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300">Reg. Start Time</label>
                  <input
                    type="time"
                    className="mt-1 w-full rounded-lg bg-gray-800 border border-gray-700 p-2"
                    value={formData.registrationStartTime}
                    onChange={(e) => setField("registrationStartTime", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300">Reg. End Date</label>
                  <input
                    type="date"
                    className="mt-1 w-full rounded-lg bg-gray-800 border border-gray-700 p-2"
                    value={formData.registrationEndDate}
                    onChange={(e) => setField("registrationEndDate", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300">Reg. End Time</label>
                  <input
                    type="time"
                    className="mt-1 w-full rounded-lg bg-gray-800 border border-gray-700 p-2"
                    value={formData.registrationEndTime}
                    onChange={(e) => setField("registrationEndTime", e.target.value)}
                  />
                </div>
              </div>
            </section>

            {/* Tickets */}
            <section>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Tickets</h2>
                <button
                  type="button"
                  onClick={addTicket}
                  className="rounded-lg bg-blue-600 hover:bg-blue-700 px-3 py-1 text-sm"
                >
                  + Add ticket
                </button>
              </div>

              <div className="mt-3 space-y-4">
                {ticketTypes.map((t, idx) => (
                  <div key={idx} className="rounded-xl border border-gray-700 p-4 bg-gray-900">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-sm text-gray-300">Name</label>
                        <input
                          className="mt-1 w-full rounded-lg bg-gray-800 border border-gray-700 p-2"
                          value={t.name}
                          onChange={(e) => updateTicket(idx, "name", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-300">Price</label>
                        <input
                          type="number"
                          className="mt-1 w-full rounded-lg bg-gray-800 border border-gray-700 p-2"
                          value={t.price}
                          onChange={(e) => updateTicket(idx, "price", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-300">Registrations (sold)</label>
                        <input
                          type="number"
                          className="mt-1 w-full rounded-lg bg-gray-800 border border-gray-700 p-2"
                          value={t.registrations}
                          onChange={(e) => updateTicket(idx, "registrations", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-sm text-gray-300">Sales Start (date)</label>
                          <input
                            type="date"
                            className="mt-1 w-full rounded-lg bg-gray-800 border border-gray-700 p-2"
                            value={t.salesStart}
                            onChange={(e) => updateTicket(idx, "salesStart", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-300">Sales Start (time)</label>
                          <input
                            type="time"
                            className="mt-1 w-full rounded-lg bg-gray-800 border border-gray-700 p-2"
                            value={t.salesStartTime}
                            onChange={(e) => updateTicket(idx, "salesStartTime", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-sm text-gray-300">Sales End (date)</label>
                          <input
                            type="date"
                            className="mt-1 w-full rounded-lg bg-gray-800 border border-gray-700 p-2"
                            value={t.salesEnd}
                            onChange={(e) => updateTicket(idx, "salesEnd", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-300">Sales End (time)</label>
                          <input
                            type="time"
                            className="mt-1 w-full rounded-lg bg-gray-800 border border-gray-700 p-2"
                            value={t.salesEndTime}
                            onChange={(e) => updateTicket(idx, "salesEndTime", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-sm text-gray-300">Max / user</label>
                          <input
                            type="number"
                            className="mt-1 w-full rounded-lg bg-gray-800 border border-gray-700 p-2"
                            value={t.maxTicketsPerUser}
                            onChange={(e) =>
                              updateTicket(idx, "maxTicketsPerUser", e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-300">Max total</label>
                          <input
                            type="number"
                            className="mt-1 w-full rounded-lg bg-gray-800 border border-gray-700 p-2"
                            value={t.maxTickets}
                            onChange={(e) => updateTicket(idx, "maxTickets", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex justify-between">
                      <button
                        type="button"
                        onClick={() => removeTicket(idx)}
                        className="text-sm text-red-400 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Photos */}
            <section>
              <h2 className="text-lg font-semibold mb-2">Photos</h2>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={onPhotosChange}
                className="w-full rounded-lg bg-gray-800 border border-gray-700 p-2"
              />
              {!!photos.length && (
                <p className="text-xs text-gray-400 mt-1">{photos.length} file(s) selected</p>
              )}
            </section>

            {/* Submit */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="rounded-lg bg-emerald-600 hover:bg-emerald-700 px-5 py-2"
              >
                Create Event
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
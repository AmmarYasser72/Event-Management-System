import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const EditEvent = () => {
  const { id } = useParams(); // event id from route
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // fetch event by ID
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/v1/events/singleEvent/${id}`);
        setEventData(res.data.event);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEvent();
  }, [id]);

  // update handler
  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/v1/events/updateEvent/${id}`, eventData);
      alert("Event updated successfully!");
      navigate("/adminDashBoard");
    } catch (err) {
      console.error(err);
      alert("Failed to update event.");
    }
  };

  if (loading) return <div className="text-white p-6">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto bg-gray-900 text-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Edit Event</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Event Name & Location */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm mb-1">Event Name</label>
            <input
              type="text"
              name="eventName"
              value={eventData.eventName}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={eventData.location}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm mb-1">Description</label>
          <textarea
            name="description"
            value={eventData.description}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm mb-1">Start Date</label>
            <input
              type="datetime-local"
              name="startDate"
              value={eventData.startDate}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">End Date</label>
            <input
              type="datetime-local"
              name="endDate"
              value={eventData.endDate}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700"
            />
          </div>
        </div>

        {/* Category & Publish */}
        <div className="grid grid-cols-2 gap-6 items-center">
          <div>
            <label className="block text-sm mb-1">Category</label>
            <select
              name="category"
              value={eventData.category}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700"
            >
              <option value="Music">Music</option>
              <option value="Sports">Sports</option>
              <option value="Exhibition">Exhibition</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm">Publish Event</label>
            <input
              type="checkbox"
              checked={eventData.published}
              onChange={(e) =>
                setEventData({ ...eventData, published: e.target.checked })
              }
            />
          </div>
        </div>

        {/* Photos */}
        <div>
          <label className="block text-sm mb-1">Photos</label>
          <input type="file" multiple className="block w-full text-sm" />
          <div className="flex gap-2 mt-2">
            {eventData.photos?.map((p, i) => (
              <img
                key={i}
                src={p}
                alt="event"
                className="w-20 h-20 rounded object-cover"
              />
            ))}
          </div>
        </div>

        {/* Tickets Section (basic loop display) */}
        <div>
          <label className="block text-sm mb-2">Ticket Types</label>
          {eventData.tickets?.map((ticket, i) => (
            <div key={i} className="grid grid-cols-6 gap-3 mb-2">
              <input
                type="text"
                value={ticket.name}
                onChange={(e) => {
                  const updated = [...eventData.tickets];
                  updated[i].name = e.target.value;
                  setEventData({ ...eventData, tickets: updated });
                }}
                className="p-2 rounded bg-gray-800 border border-gray-700"
              />
              <input
                type="number"
                value={ticket.price}
                onChange={(e) => {
                  const updated = [...eventData.tickets];
                  updated[i].price = e.target.value;
                  setEventData({ ...eventData, tickets: updated });
                }}
                className="p-2 rounded bg-gray-800 border border-gray-700"
              />
              <input
                type="number"
                value={ticket.maxPerUser}
                onChange={(e) => {
                  const updated = [...eventData.tickets];
                  updated[i].maxPerUser = e.target.value;
                  setEventData({ ...eventData, tickets: updated });
                }}
                className="p-2 rounded bg-gray-800 border border-gray-700"
              />
              <input
                type="number"
                value={ticket.totalAvailable}
                onChange={(e) => {
                  const updated = [...eventData.tickets];
                  updated[i].totalAvailable = e.target.value;
                  setEventData({ ...eventData, tickets: updated });
                }}
                className="p-2 rounded bg-gray-800 border border-gray-700"
              />
            </div>
          ))}
        </div>

        {/* Submit */}
        <div className="text-right">
          <button
            type="submit"
            className="bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-700 transition"
          >
            Update Event
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditEvent;

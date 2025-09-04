import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const BookingPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [ticketType, setTicketType] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
  });

  // fetch event details
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/v1/events/singleEvent/${eventId}`
        );
        const data = await res.json();
        if (res.ok && data.success) {
          setEvent(data.event);
          if (data.event.tickets && data.event.tickets.length > 0) {
            setTicketType(data.event.tickets[0].type); // default select first ticket
          }
        }
      } catch (err) {
        console.error("Error fetching event:", err);
      }
    };
    fetchEvent();
  }, [eventId]);

  const handleBooking = () => {
    if (!userDetails.name || !userDetails.email) {
      toast.error("Please fill in your details");
      return;
    }

    // Mock booking success
    toast.success("🎉 Booking successful!");
    navigate(`/events/${eventId}/confirmation`);
  };

  if (!event) return <p className="p-6">Loading booking page...</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Book Ticket for {event.eventName}</h1>

      <div className="border p-4 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-2">Choose Ticket</h2>
        {event.tickets?.length > 0 ? (
          <select
            value={ticketType}
            onChange={(e) => setTicketType(e.target.value)}
            className="border p-2 w-full rounded"
          >
            {event.tickets.map((ticket, idx) => (
              <option key={idx} value={ticket.type}>
                {ticket.type} - ₹{ticket.price}
              </option>
            ))}
          </select>
        ) : (
          <p className="text-gray-500">No tickets available</p>
        )}
      </div>

      <div className="border p-4 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-2">Quantity</h2>
        <input
          type="number"
          value={quantity}
          min="1"
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="border p-2 w-full rounded"
        />
      </div>

      <div className="border p-4 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-2">Your Details</h2>
        <input
          type="text"
          placeholder="Your Name"
          value={userDetails.name}
          onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })}
          className="border p-2 w-full rounded mb-3"
        />
        <input
          type="email"
          placeholder="Your Email"
          value={userDetails.email}
          onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
          className="border p-2 w-full rounded"
        />
      </div>

      <button
        onClick={handleBooking}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        Confirm Booking
      </button>
    </div>
  );
};

export default BookingPage;

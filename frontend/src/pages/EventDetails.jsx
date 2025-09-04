import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  Star,
  Share2,
  Heart,
  Users,
  Ticket,
  Plus,
  Minus,
  CreditCard,
  Shield,
  CheckCircle,
  Phone,
  Mail,
  Globe,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Axios from "axios";

const EventDetailPage = () => {
  const { id } = useParams(); // Event ID from URL
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [selectedTickets, setSelectedTickets] = useState({});
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const goback = () => navigate(-1);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await Axios.get(
          `http://localhost:5000/api/v1/events/${id}`,
          { withCredentials: true }
        );
        setEvent(response.data);
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };
    fetchEvent();
  }, [id]);

  const handleTicketChange = (ticketId, change) => {
    setSelectedTickets((prev) => {
      const current = prev[ticketId] || 0;
      const ticket = event.tickets.find((t) => t.id === ticketId);
      const maxAllowed = Math.min(ticket.maxPerUser, ticket.available - ticket.sold);
      const newValue = Math.max(0, Math.min(current + change, maxAllowed));
      return { ...prev, [ticketId]: newValue };
    });
  };

  const getTotalTickets = () =>
    Object.values(selectedTickets).reduce((total, qty) => total + qty, 0);

  const getTotalPrice = () =>
    Object.entries(selectedTickets).reduce((total, [ticketId, qty]) => {
      const ticket = event.tickets.find((t) => t.id === parseInt(ticketId));
      return total + ticket.price * qty;
    }, 0);

  const handleBookNow = () => {
    if (getTotalTickets() > 0) setShowBookingModal(true);
  };

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading event details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center">
          <button
            onClick={goback}
            className="mr-4 p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-semibold">Event Details</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="relative">
                <img
                  src={event.images[currentImageIndex]}
                  alt={event.title}
                  className="w-full h-64 md:h-96 object-cover"
                />
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button className="bg-white/80 p-2 rounded-full hover:bg-white">
                    <Heart size={20} className="text-red-500" />
                  </button>
                  <button className="bg-white/80 p-2 rounded-full hover:bg-white">
                    <Share2 size={20} className="text-gray-600" />
                  </button>
                </div>
                {event.featured && (
                  <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Featured
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              <div className="p-4 flex space-x-2">
                {event.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                      currentImageIndex === index
                        ? "border-blue-500"
                        : "border-gray-200"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`View ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Event Info */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center mb-4">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {event.category}
                </span>
                <div className="flex items-center ml-auto">
                  <Star className="text-yellow-400 fill-current" size={16} />
                  <span className="text-sm text-gray-600 ml-1">{event.rating}</span>
                  <span className="text-sm text-gray-400 ml-2">
                    ({event.totalAttendees} attendees)
                  </span>
                </div>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <Calendar className="mr-3 text-blue-500" size={20} />
                  <div>
                    <div className="font-medium">{event.date} - {event.endDate}</div>
                    <div className="text-sm">{event.time} - {event.endTime}</div>
                  </div>
                </div>

                <div className="flex items-center text-gray-600">
                  <MapPin className="mr-3 text-blue-500" size={20} />
                  <div>
                    <div className="font-medium">{event.venue}</div>
                    <div className="text-sm">{event.location}</div>
                  </div>
                </div>

                <div className="flex items-center text-gray-600">
                  <Users className="mr-3 text-blue-500" size={20} />
                  <div>
                    <div className="font-medium">{event.totalAttendees} Registered</div>
                    <div className="text-sm">{event.maxCapacity} Max Capacity</div>
                  </div>
                </div>

                <div className="flex items-center text-gray-600">
                  <Clock className="mr-3 text-blue-500" size={20} />
                  <div>
                    <div className="font-medium">3 Days Event</div>
                    <div className="text-sm">9+ Hours Daily</div>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 mb-4">{event.description}</p>

              <div className="border-t pt-4">
                <h3 className="font-semibold text-lg mb-3">About This Event</h3>
                <div className="prose prose-sm text-gray-700 whitespace-pre-line">
                  {event.longDescription}
                </div>
              </div>

              {/* Tags */}
              <div className="mt-6">
                <h4 className="font-medium mb-3">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Organizer Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-lg mb-4">Organized By</h3>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white font-semibold">
                  {event.organizer.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-lg">{event.organizer.name}</h4>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center text-gray-600">
                      <Mail size={16} className="mr-2" />
                      <span className="text-sm">{event.organizer.email}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Phone size={16} className="mr-2" />
                      <span className="text-sm">{event.organizer.phone}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Globe size={16} className="mr-2" />
                      <span className="text-sm">{event.organizer.website}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h3 className="font-semibold text-xl mb-6">Select Tickets</h3>

              <div className="space-y-4 mb-6">
                {event.tickets.map((ticket) => {
                  const isAvailable = ticket.available - ticket.sold > 0;
                  const selectedQuantity = selectedTickets[ticket.id] || 0;

                  return (
                    <div
                      key={ticket.id}
                      className={`border rounded-lg p-4 ${!isAvailable ? "opacity-50" : ""}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{ticket.type}</h4>
                          {ticket.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">
                              ₹{ticket.originalPrice}
                            </span>
                          )}
                          <div className="text-lg font-bold text-blue-600">
                            ₹{ticket.price}
                          </div>
                        </div>
                        {isAvailable && (
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleTicketChange(ticket.id, -1)}
                              disabled={selectedQuantity === 0}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-8 text-center font-medium">{selectedQuantity}</span>
                            <button
                              onClick={() => handleTicketChange(ticket.id, 1)}
                              disabled={
                                selectedQuantity >= Math.min(
                                  ticket.maxPerUser,
                                  ticket.available - ticket.sold
                                )
                              }
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        )}
                      </div>

                      <p className="text-sm text-gray-600 mb-2">{ticket.description}</p>

                      <div className="text-sm text-gray-500 mb-3">
                        Available: {ticket.available - ticket.sold} | Max per person:{" "}
                        {ticket.maxPerUser}
                      </div>

                      <div className="space-y-1">
                        <h5 className="text-xs font-medium text-gray-700">Includes:</h5>
                        {ticket.benefits.map((benefit, index) => (
                          <div key={index} className="flex items-center text-xs text-gray-600">
                            <CheckCircle size={12} className="text-green-500 mr-2" />
                            {benefit}
                          </div>
                        ))}
                      </div>

                      {!isAvailable && (
                        <div className="mt-2 text-sm text-red-500 font-medium">Sold Out</div>
                      )}
                    </div>
                  );
                })}
              </div>

              {getTotalTickets() > 0 && (
                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Total Tickets:</span>
                    <span className="font-bold">{getTotalTickets()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Amount:</span>
                    <span className="font-bold text-xl text-blue-600">₹{getTotalPrice()}</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleBookNow}
                disabled={getTotalTickets() === 0}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center"
              >
                <Ticket className="mr-2" size={20} />
                {getTotalTickets() === 0
                  ? "Select Tickets"
                  : `Book ${getTotalTickets()} Ticket${getTotalTickets() > 1 ? "s" : ""}`}
              </button>

              <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
                <Shield className="mr-2" size={16} />
                Secure payment powered by Razorpay
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Refund Policy</h4>
                <p className="text-sm text-gray-600">{event.refundPolicy}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Confirm Booking</h3>
              <button
                onClick={() => setShowBookingModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className="border-b pb-4">
                <h4 className="font-medium mb-2">{event.title}</h4>
                <p className="text-sm text-gray-600">
                  {event.date} at {event.time}
                </p>
                <p className="text-sm text-gray-600">{event.location}</p>
              </div>

              <div className="space-y-2">
                {Object.entries(selectedTickets).map(([ticketId, quantity]) => {
                  if (quantity === 0) return null;
                  const ticket = event.tickets.find((t) => t.id === parseInt(ticketId));
                  return (
                    <div key={ticketId} className="flex justify-between">
                      <span className="text-sm">
                        {ticket.type} × {quantity}
                      </span>
                      <span className="text-sm font-medium">₹{ticket.price * quantity}</span>
                    </div>
                  );
                })}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between font-semibold">
                  <span>Total Amount:</span>
                  <span className="text-blue-600">₹{getTotalPrice()}</span>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center">
                  <CreditCard className="mr-2" size={16} />
                  Pay Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetailPage;

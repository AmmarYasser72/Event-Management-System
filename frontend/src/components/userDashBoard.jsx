import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Star, 
  Heart,
  Share2,
  Ticket,
  Eye,
  LogOut,
  User,
  Bell,
  TrendingUp
} from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const UserDashboard = () => {
  const navigate = (path) => {
    window.location.href = path;
  };

  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // ✅ Mock events
  const mockEvents = [
    {
      id: '1',
      title: 'React Conference 2025',
      description: 'A full-day conference exploring React 19, new hooks, and ecosystem updates.',
      category: 'Conference',
      date: '2025-09-15T10:00:00',
      time: '10:00 AM',
      location: 'Mumbai',
      image: 'https://imgs.search.brave.com/8UfGTDoP3AcFc5zT5TsIoQMlbzUi3avzlJvBk96nJq8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9yZWFj/dC5wYXJpcy9fbmV4/dC9pbWFnZT91cmw9/aHR0cHM6Ly9pbWFn/ZXMucmVhY3Ricmlj/a3MuY29tL29yaWdp/bmFsL2RjYmQ4MGMx/LTQ2N2ItNDNlMi05/MDEyLTkxZTU5Y2Ji/ZTM3NS53ZWJwJnc9/Mzg0MCZxPTc1',
      organizer: 'TechMeetup',
      price: 1500,
      originalPrice: 2500,
      rating: 4.7,
      attendees: 150,
      maxAttendees: 300,
      tags: ['React', 'JavaScript'],
      trending: true,
      featured: true
    },
    {
      id: '2',
      title: 'Sunburn Music Festival',
      description: 'India’s biggest EDM music festival with top DJs from around the world.',
      category: 'Music',
      date: '2025-12-20T18:00:00',
      time: '6:00 PM',
      location: 'Goa',
      image: 'https://imgs.search.brave.com/D9_1wQ6EOZyA9HnbFmIsavwTB1xKwfLe2RRSE6sdfuQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvNjcx/NzEyMDIzL3Bob3Rv/L2ZyaWVuZHMtd2l0/aC1hcm1zLWluLXRo/ZS1haXItYXQtZmVz/dGl2YWwtY29uY2Vy/dC5qcGc_cz02MTJ4/NjEyJnc9MCZrPTIw/JmM9b1ZKXzR2a21m/dUl1ZFV6cFN2MHI1/NEZDaUF4MEdsaGw5/ZHpmVlR2Y1NyOD0',
      organizer: 'Sunburn',
      price: 5000,
      originalPrice: 6500,
      rating: 4.9,
      attendees: 2000,
      maxAttendees: 5000,
      tags: ['EDM', 'Party'],
      trending: true,
      featured: false
    },
    {
      id: '3',
      title: 'Startup Pitch Workshop',
      description: 'Learn how to pitch your startup idea to investors and get funding.',
      category: 'Business',
      date: '2025-10-05T09:00:00',
      time: '9:00 AM',
      location: 'Bangalore',
      image: 'https://imgs.search.brave.com/DUUeJXQod2lG6GNDrApLspSXFEDEg44Xpmc5jeMYQ0U/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGFy/dHVwc2Qub3JnL3dw/LWNvbnRlbnQvdXBs/b2Fkcy8yMDI0LzA4/L1NjcmVlbnNob3Qt/MjAyNC0wOC0xNC0x/NjExNTgucG5n',
      organizer: 'StartupHub',
      price: 0, // Free event
      originalPrice: 0,
      rating: 4.5,
      attendees: 80,
      maxAttendees: 100,
      tags: ['Business', 'Entrepreneurship'],
      trending: false,
      featured: true
    }
  ];

  const fetchEvents = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/v1/events/all');
      const backendEvents = res.data?.events || [];

      // Format backend events to match our structure
      const formattedBackendEvents = backendEvents.map(event => ({
        id: event._id,
        title: event.eventName || event.title,
        description: event.description || '',
        category: event.category || 'Other',
        date: event.startDate || event.date,
        time: event.time || '10:00 AM',
        location: event.location || 'Online',
        image: event.photos?.[0] || 'https://via.placeholder.com/400x250',
        organizer: event.organizer || 'Admin',
        price: event.price || 0,
        originalPrice: event.originalPrice || event.price || 0,
        rating: event.rating || 4.5,
        attendees: event.attendees || 0,
        maxAttendees: event.maxAttendees || 100,
        tags: event.tags || [],
        trending: event.trending || false,
        featured: event.featured || false
      }));

      // ✅ Merge mock + backend events
      const allEvents = [...mockEvents, ...formattedBackendEvents];

      setEvents(allEvents);
      setFilteredEvents(allEvents);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to fetch backend events, showing mock events');
      setEvents(mockEvents);
      setFilteredEvents(mockEvents);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();

    // Load user from localStorage
    const userToken = localStorage.getItem('userToken');
    if (userToken) {
      const userData = JSON.parse(userToken);
      setUser(userData.user);
    }
  }, []);

  useEffect(() => {
    filterEvents();
  }, [searchTerm, selectedCategory, selectedLocation, priceRange, events]);

  const filterEvents = () => {
    let filtered = events;

    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.organizer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(event => event.category === selectedCategory);
    }

    if (selectedLocation !== 'all') {
      filtered = filtered.filter(event => event.location.toLowerCase().includes(selectedLocation.toLowerCase()));
    }

    if (priceRange !== 'all') {
      if (priceRange === 'free') filtered = filtered.filter(event => event.price === 0);
      else if (priceRange === '0-1000') filtered = filtered.filter(event => event.price >= 0 && event.price <= 1000);
      else if (priceRange === '1000-3000') filtered = filtered.filter(event => event.price > 1000 && event.price <= 3000);
      else if (priceRange === '3000+') filtered = filtered.filter(event => event.price > 3000);
    }

    setFilteredEvents(filtered);
  };

  const handleBookEvent = (eventId) => {
    navigate(`/booking/${eventId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    toast.success("Logout Successfully");
    navigate('/');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' 
    });
  };

  const EventCard = ({ event }) => (
    <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
      <div className="relative">
        <img src={event.image} alt={event.title} className="w-full h-48 object-cover" />
        {event.trending && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <TrendingUp size={12} /> Trending
          </div>
        )}
        {event.featured && (
          <div className="absolute top-3 right-3 bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-semibold">
            Featured
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-purple-400 bg-purple-400/20 px-2 py-1 rounded">{event.category}</span>
          <div className="flex items-center gap-1 text-yellow-400">
            <Star size={14} fill="currentColor" />
            <span className="text-sm">{event.rating}</span>
          </div>
        </div>
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{event.title}</h3>
        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{event.description}</p>
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-gray-300 text-sm">
            <Calendar size={14} />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300 text-sm">
            <Clock size={14} />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300 text-sm">
            <MapPin size={14} />
            <span className="line-clamp-1">{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300 text-sm">
            <Users size={14} />
            <span>{event.attendees}/{event.maxAttendees} attendees</span>
          </div>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div>
            {event.price === 0 ? (
              <span className="text-lg font-bold text-green-400">FREE</span>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-white">EGP{event.price}</span>
                {event.originalPrice > event.price && (
                  <span className="text-sm text-gray-400 line-through">EGP{event.originalPrice}</span>
                )}
              </div>
            )}
          </div>
          <span className="text-xs text-gray-400">by Ammar Yasser</span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate(`/event/${event.id}`)} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
            <Eye size={16} /> View Details
          </button>
          <button onClick={() => handleBookEvent(event.id)} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
            <Ticket size={16} /> Book Now
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-purple-400">EventX-studio</h1>
              <span className="text-gray-400">|</span>
              <span className="text-gray-300">Dashboard</span>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700"><Bell size={20} /></button>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-300">Welcome, {user?.name || 'User'}</span>
                <button onClick={() => navigate('/profile')} className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700"><User size={20} /></button>
                <button onClick={handleLogout} className="p-2 text-red-400 hover:text-red-300 rounded-lg hover:bg-red-900/20"><LogOut size={20} /></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Events Grid/List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-16">
            <div className="mb-4">
              <Calendar size={64} className="mx-auto text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No events found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or filters</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
            : "space-y-4"
          }>
            {filteredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;

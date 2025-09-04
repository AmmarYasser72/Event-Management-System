import React, { useState } from 'react';
import { Search, MapPin, Calendar, Star, Heart, TrendingUp, Filter, Map, List } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Homepage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const [selectedCategory, setSelectedCategory] = useState('all');

  const navigate = useNavigate();

  const handleBooking = async () => {
    try {
        const token = localStorage.getItem("token");
        if(!token) {
            toast.error("please Login First !!! ");
        } else {
            navigate("/eventDetails");
        }
    } catch (error) {
        console.log(error);
    }
  }

  // Mock data for featured events
  const featuredEvents = [
    {
      id: 1,
      title: "Tech Conference 2025",
      description: "Join industry leaders for cutting-edge tech discussions",
      date: "2025-09-15",
      time: "09:00",
      location: "Convention Center, Mumbai",
      category: "Conference",
      price: 2500,
      rating: 4.8,
      attendees: 250,
      image: "https://imgs.search.brave.com/4SKT4JFe4XymdQsxA2eBq5fcSDgx0qR1qqgZx7ijJPc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/bW1jY29udmVydC5j/b20vYmxvZy93cC1j/b250ZW50L3VwbG9h/ZHMvMjAyMy8xMC9v/ZG9vLWV4cGVyaWVu/Y2UzLmpwZw"
    },
    {
      id: 2,
      title: "Music Festival",
      description: "3-day music extravaganza with top artists",
      date: "2025-10-20",
      time: "18:00",
      location: "Open Grounds, Delhi",
      category: "Concert",
      price: 3500,
      rating: 4.9,
      attendees: 500,
      image: "https://imgs.search.brave.com/ckQZWwGYMU6hzNODqmEJq_vlcT8o1CdNv6c_vHPfLU0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMjAz/OTMyMjcwNS9waG90/by9tYW4tcGhvdG9n/cmFwaGluZy10aHJv/dWdoLXNtYXJ0LXBo/b25lLXdpdGgtZnJp/ZW5kcy5qcGc_cz02/MTJ4NjEyJnc9MCZr/PTIwJmM9OGFvZW1j/dF95TlRzVlRDSmhu/RWRaZTVQOTBMc0lu/amRwcWpPQkVLYlN4/OD0"
    },
    {
      id: 3,
      title: "Startup Hackathon",
      description: "48-hour coding challenge for innovators",
      date: "2025-09-25",
      time: "10:00",
      location: "Tech Hub, Bangalore",
      category: "Hackathon",
      price: 500,
      rating: 4.7,
      attendees: 100,
      image: "https://imgs.search.brave.com/hflGWrfEqFxhzxbz2sVxl8ixuo1KUXRdH1EyD9pzzKo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTQy/NTIwMTI4OC9waG90/by9hZnJpY2FuLXdv/bWFuLWFkZHJlc3Np/bmctYXVkaWVuY2Ut/YXQtc3RhcnR1cC1s/YXVuY2gtZXZlbnQu/anBnP3M9NjEyeDYx/MiZ3PTAmaz0yMCZj/PXFEVTYxcDlLNGxt/cWVvR0lVQmd2MXl3/MVBOZ1dmTjhNRFI3/cFdubGtFSzg9"
    },
    {
      id: 4,
      title: "Cricket Championship",
      description: "Regional cricket tournament finals",
      date: "2025-09-30",
      time: "14:00",
      location: "Sports Complex, Chennai",
      category: "Sports",
      price: 1500,
      rating: 4.6,
      attendees: 300,
      image: "https://imgs.search.brave.com/OyzqnrUYRAFnzKcNuTc0s3xIB8hWLwIgtdUQtLRYoI4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvNzM1/NTQ3NzAvcGhvdG8v/c3VzcGVuZGVkLXBs/YXktZHVlLXRvLXJh/aW4tZHVyaW5nLWEt/Y3JpY2tldC1nYW1l/LmpwZz9zPTYxMng2/MTImdz0wJms9MjAm/Yz1seWc5YkQxaG5O/ZEMzNWV6RlNuYlFG/VURhZUlaVjd6QjFC/QklSWWZPRlljPQ"
    }
  ];

  const categories = [
    'All', 'Conference', 'Concert', 'Sports', 'Hackathon', 'Workshop', 'Seminar'
  ];

  const filteredEvents = featuredEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           event.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-blue-600">EventX-studio</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">Home</Link>
              <Link href="#" className="text-gray-700 hover:text-blue-600 font-medium">Events</Link>
              <Link href="#" className="text-gray-700 hover:text-blue-600 font-medium">Create Event</Link>
              <Link href="#" className="text-gray-700 hover:text-blue-600 font-medium">My Tickets</Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link to={"/login"} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Sign In
              </Link>
              <Link to={"/register"} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold mb-6">Discover Amazing Events</h2>
          <p className="text-xl mb-8 opacity-90">
            Find and book tickets for conferences, concerts, sports events, and more
          </p>
          
          {/* Search Bar */}
          <div className="max-w-4xl mx-auto bg-white rounded-full p-2 shadow-lg">
            <div className="flex items-center">
              <div className="flex-1 flex items-center px-4">
                <Search className="text-gray-400 mr-3" size={20} />
                <input
                  type="text"
                  placeholder="Search events, locations, or categories..."
                  className="w-full py-3 text-gray-700 outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 font-medium">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Filter and View Controls */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <Filter className="text-gray-600" size={20} />
            <div className="flex space-x-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category.toLowerCase())}
                  className={`px-4 py-2 rounded-full transition-colors ${
                    selectedCategory === category.toLowerCase()
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${
                viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              <List size={20} />
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-2 rounded-lg ${
                viewMode === 'map' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              <Map size={20} />
            </button>
          </div>
        </div>

        {/* Trending Badge */}
        <div className="flex items-center mb-6">
          <TrendingUp className="text-orange-500 mr-2" size={24} />
          <h3 className="text-2xl font-bold text-gray-800">Featured Events</h3>
        </div>

        {/* Events Grid */}
        {viewMode === 'list' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <button className="absolute top-3 right-3 bg-white/80 p-2 rounded-full hover:bg-white">
                    <Heart size={16} className="text-gray-600" />
                  </button>
                  <div className="absolute bottom-3 left-3 bg-blue-600 text-white px-2 py-1 rounded text-sm">
                    {event.category}
                  </div>
                </div>
                
                <div className="p-4">
                  <h4 className="font-semibold text-lg mb-2 line-clamp-2">{event.title}</h4>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{event.description}</p>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Calendar size={14} className="mr-1" />
                    <span className="mr-4">{event.date}</span>
                    <MapPin size={14} className="mr-1" />
                    <span className="truncate">{event.location}</span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <Star className="text-yellow-400 fill-current" size={14} />
                      <span className="text-sm text-gray-600 ml-1">{event.rating}</span>
                      <span className="text-sm text-gray-400 ml-2">({event.attendees})</span>
                    </div>
                    <span className="text-lg font-bold text-blue-600">₹{event.price}</span>
                  </div>
                  
                  <button onClick={handleBooking} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Map View */}
        {viewMode === 'map' && (
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Map size={48} className="text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Map view will be integrated here</p>
                <p className="text-sm text-gray-500">Events will be shown as pins on the map</p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Stats Section */}
      <section className="bg-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">10K+</div>
              <div className="text-gray-600">Events Hosted</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">500K+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">1M+</div>
              <div className="text-gray-600">Tickets Sold</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600">Cities Covered</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">EventX-studio</h3>
              <p className="text-gray-300">
                Your ultimate platform for discovering and booking amazing events.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Organizers</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white">Create Event</a></li>
                <li><a href="#" className="hover:text-white">Manage Events</a></li>
                <li><a href="#" className="hover:text-white">Analytics</a></li>
                <li><a href="#" className="hover:text-white">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Attendees</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white">Browse Events</a></li>
                <li><a href="#" className="hover:text-white">My Tickets</a></li>
                <li><a href="#" className="hover:text-white">Refunds</a></li>
                <li><a href="#" className="hover:text-white">Help</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; copyrights. All rights reserved by Ammar Yasser</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
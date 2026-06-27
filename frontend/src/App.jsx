import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Homepage from './pages/Home';
import RegisterPage from './pages/Register';
import LoginPage from './pages/Login';
import UserDashboard from './components/userDashBoard';
import AdminDashboardPage from "./pages/AdminDashboardPage";
import ManageEvents from "./pages/ManageEvents";
import AddNewEventForm from "./pages/AddNewEvent";
import Settings from "./pages/Settings";
import EventDetailPage from './pages/EventDetails';
import EventBookingPage from './pages/EventBooking';
import BrowseEvents from './pages/BrowseEvents';
import MyTickets from './pages/MyTickets';
import TicketDetails from './pages/TicketDetails';
import AttendeeInsightsPage from "./pages/AttendeeInsightsPage";
import { Toaster } from 'react-hot-toast';
import { getStoredAuth } from "./lib/api";

function RequireAdmin({ children }) {
  const { token, user } = getStoredAuth();
  const role = user?.role || "";
  if (!token) return <Navigate to="/login" replace />;
  if (role !== "admin") return <Navigate to="/login" replace />;
  return children;
}
function RequireUser({ children }) {
  const { token } = getStoredAuth();
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <div>
      <Routes>
        {/* Public */}
        <Route path='/' element={<Homepage />} />
        <Route path='/browse' element={<BrowseEvents />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/login' element={<LoginPage />} />

        {/* User */}
        <Route path='/userDashBoard' element={<UserDashboard />} />
        <Route path='/event/:id' element={<EventDetailPage />} />
        <Route path='/booking/:eventId' element={<RequireUser><EventBookingPage /></RequireUser>} />
        <Route path='/my-tickets' element={<RequireUser><MyTickets /></RequireUser>} />
        <Route path='/ticket/:id' element={<RequireUser><TicketDetails /></RequireUser>} />
        <Route path='/attendee-insights' element={<RequireAdmin><AttendeeInsightsPage /></RequireAdmin>} />


        {/* Admin (use page wrapped with DashboardLayout) */}
        <Route path='/adminDashBoard' element={<RequireAdmin><AdminDashboardPage /></RequireAdmin>} />
        <Route path='/manage-events' element={<RequireAdmin><ManageEvents /></RequireAdmin>} />
        <Route path='/addnewevent' element={<RequireAdmin><AddNewEventForm /></RequireAdmin>} />
        <Route path='/settings' element={<RequireAdmin><Settings /></RequireAdmin>} />

        {/* Fallback */}
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>

      <Toaster position="top-right" />
    </div>
  );
}

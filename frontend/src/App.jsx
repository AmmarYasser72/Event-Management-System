import { Router, Routes, Route} from 'react-router-dom'
import './App.css'
import Register from './pages/Register'
import UserDashboard from './components/userDashBoard'
import Homepage from './pages/Home'
import { Toaster } from 'react-hot-toast';
import EventDetailPage from './pages/EventDetails'
import LoginPage from './pages/Login'
import AdminDashBoard from './components/adminDashBoard'
import AddNewEventForm from './pages/AddNewEvent'
import RegisterPage from './pages/Register'
import EditEvent from './pages/EditEvent'
import EventBookingPage from './pages/EventBooking'
import EventPage from './pages/EventBooking'
import ManageEvents from "./pages/ManageEvents";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import Settings from "./pages/Settings";



function App() {

  return (
    <div>
      <Routes>
        <Route path='/' element={<Homepage/>} />
        <Route path='/register' element={<RegisterPage/>} />
        <Route path='/userDashBoard' element={<UserDashboard />} />
        <Route path='/adminDashBoard' element={<AdminDashBoard />} />
        <Route path="/manage-events" element={<ManageEvents />} />
        <Route path='/addnewevent' element={<AddNewEventForm />} />
        <Route  path='/eventDetails' element={<EventDetailPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path="/edit-event/:id" element={<EditEvent />} />
        <Route path='/booking/:id' element={<EventPage />} />
        <Route path="/adminDashBoard" element={<AdminDashboardPage />} />

      </Routes>
      <Toaster />
    </div>
  )
}

export default App
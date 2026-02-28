import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Flights from './pages/Flights';
import Hotels from './pages/Hotels';
import Trains from './pages/Trains';
import Buses from './pages/Buses';
import Metro from './pages/Metro';
import MapExplore from './pages/MapExplore';
import Destinations from './pages/Destinations';
import MyBookings from './pages/MyBookings';
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminBookings from './pages/admin/Bookings';
import './index.css';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="loader"></div></div>;
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <div className="loading-screen"><div className="loader"></div></div>;
  if (!user) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/" />;
  return children;
};

const Layout = ({ children, noFooter }) => (
  <>
    <Navbar />
    <main>{children}</main>
    {!noFooter && <Footer />}
  </>
);

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/destinations" element={<Layout><Destinations /></Layout>} />
      <Route path="/map" element={<Layout noFooter><MapExplore /></Layout>} />
      <Route path="/flights" element={<Layout><ProtectedRoute><Flights /></ProtectedRoute></Layout>} />
      <Route path="/hotels" element={<Layout><ProtectedRoute><Hotels /></ProtectedRoute></Layout>} />
      <Route path="/trains" element={<Layout><ProtectedRoute><Trains /></ProtectedRoute></Layout>} />
      <Route path="/buses" element={<Layout><ProtectedRoute><Buses /></ProtectedRoute></Layout>} />
      <Route path="/metro" element={<Layout><ProtectedRoute><Metro /></ProtectedRoute></Layout>} />
      <Route path="/my-bookings" element={<Layout><ProtectedRoute><MyBookings /></ProtectedRoute></Layout>} />
      <Route path="/profile" element={<Layout><ProtectedRoute><Profile /></ProtectedRoute></Layout>} />
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
      <Route path="/admin/bookings" element={<AdminRoute><AdminBookings /></AdminRoute>} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ style: { background: '#1a1814', color: '#f5f0e8', border: '1px solid rgba(201,169,110,0.3)' } }} />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

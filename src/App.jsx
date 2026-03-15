import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext'; // IMPORTANTE
import { AccountProvider } from './context/AccountContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Accounts from './pages/Accounts';
import AccountForm from './pages/AccountForm';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ChangePassword from './pages/ChangePassword';
import RoomMap from './modules/hotel/pages/RoomMap';
import RoomList from './modules/hotel/pages/RoomList';
import BookingList from './modules/hotel/pages/BookingList';
import GuestList from './modules/hotel/pages/GuestList';
import AvailabilityCalendar from './modules/hotel/pages/AvailabilityCalendar';
import HotelDashboard from './modules/hotel/pages/HotelDashboard';
import Consumption from './modules/hotel/pages/Consumption';
import Reports from './modules/hotel/pages/Reports';

function PrivateRoute({ children }) {
    const { user, loading } = useAuth();
    
    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
    }
    
    return user ? children : <Navigate to="/login" />;
}

function AppContent() {
    const { user } = useAuth();
    
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 dracula:bg-[#282a36] transition-colors duration-300">
            <Navbar />
            <div className="pt-16">
                <Routes>
                    {/* Rotas Públicas */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    
                    {/* Rotas Privadas */}
                    <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                    <Route path="/accounts" element={<PrivateRoute><Accounts /></PrivateRoute>} />
                    <Route path="/accounts/new" element={<PrivateRoute><AccountForm /></PrivateRoute>} />
                    <Route path="/accounts/edit/:id" element={<PrivateRoute><AccountForm /></PrivateRoute>} />
                    <Route path="/change-password" element={<PrivateRoute><ChangePassword /></PrivateRoute>} />
                    
                    {/* Rotas do Hotel */}
                    <Route path="/hotel/dashboard" element={<PrivateRoute><HotelDashboard /></PrivateRoute>} />
                    <Route path="/hotel/map" element={<PrivateRoute><RoomMap /></PrivateRoute>} />
                    <Route path="/hotel/rooms" element={<PrivateRoute><RoomList /></PrivateRoute>} />
                    <Route path="/hotel/calendar" element={<PrivateRoute><AvailabilityCalendar /></PrivateRoute>} />
                    <Route path="/hotel/bookings" element={<PrivateRoute><BookingList /></PrivateRoute>} />
                    <Route path="/hotel/guests" element={<PrivateRoute><GuestList /></PrivateRoute>} />
                    <Route path="/hotel/consumption" element={<PrivateRoute><Consumption /></PrivateRoute>} />
                    <Route path="/hotel/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
                    
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                </Routes>
            </div>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <ThemeProvider>  {/* ThemeProvider envolvendo TUDO */}
                <AuthProvider>
                    <AccountProvider>
                        <AppContent />
                    </AccountProvider>
                </AuthProvider>
            </ThemeProvider>
        </BrowserRouter>
    );
}

export default App;
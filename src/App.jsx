import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import NavbarSistema from './components/NavbarSistema'; // <-- NOVO

// Landing Pages (sem navbar)
import Home from './landing/pages/Home';
import About from './landing/pages/About';
import Flats from './landing/pages/Flats';
import Porto from './landing/pages/Porto';
import PreBooking from './landing/pages/PreBooking';
import Login from './pages/Login';
import Register from './pages/Register';

// Sistema (com navbar)
import Dashboard from './pages/Dashboard';
import HotelDashboard from './modules/hotel/pages/HotelDashboard';
import RoomMap from './modules/hotel/pages/RoomMap';
import RoomList from './modules/hotel/pages/RoomList';
import BookingList from './modules/hotel/pages/BookingList';
import GuestList from './modules/hotel/pages/GuestList';
import Accounts from './pages/Accounts';
import AccountForm from './pages/AccountForm';
import AdminLeads from './pages/admin/Leads';
import AdminUsers from './pages/admin/Users';
import MyBookings from './pages/hospede/MyBookings';
import MyProfile from './pages/hospede/MyProfile';
import ChangePassword from './pages/ChangePassword';

// Layout para rotas do sistema (com navbar)
function SistemaLayout({ children }) {
    return (
        <>
            <NavbarSistema />
            <div className="pt-16"> {/* Espaço para a navbar fixa */}
                {children}
            </div>
        </>
    );
}

function App() {
    return (
        <BrowserRouter>
            <ThemeProvider>
                <AuthProvider>
                    <Routes>
                        {/* Landing Pages (sem navbar) */}
                        <Route path="/" element={<Home />} />
                        <Route path="/sobre" element={<About />} />
                        <Route path="/flats" element={<Flats />} />
                        <Route path="/porto-de-galinhas" element={<Porto />} />
                        <Route path="/pre-reserva" element={<PreBooking />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* Sistema (com navbar) */}
                        <Route path="/dashboard" element={
                            <PrivateRoute>
                                <SistemaLayout>
                                    <Dashboard />
                                </SistemaLayout>
                            </PrivateRoute>
                        } />
                        
                        <Route path="/hotel/*" element={
                            <PrivateRoute requiredRole="colaborador">
                                <SistemaLayout>
                                    <HotelDashboard />
                                </SistemaLayout>
                            </PrivateRoute>
                        } />
                        
                        <Route path="/hotel/map" element={
                            <PrivateRoute requiredRole="colaborador">
                                <SistemaLayout>
                                    <RoomMap />
                                </SistemaLayout>
                            </PrivateRoute>
                        } />
                        
                        <Route path="/hotel/rooms" element={
                            <PrivateRoute requiredRole="colaborador">
                                <SistemaLayout>
                                    <RoomList />
                                </SistemaLayout>
                            </PrivateRoute>
                        } />
                        
                        <Route path="/hotel/bookings" element={
                            <PrivateRoute requiredPermission="ver_todas_reservas">
                                <SistemaLayout>
                                    <BookingList />
                                </SistemaLayout>
                            </PrivateRoute>
                        } />
                        
                        <Route path="/hotel/guests" element={
                            <PrivateRoute requiredPermission="ver_hospedes">
                                <SistemaLayout>
                                    <GuestList />
                                </SistemaLayout>
                            </PrivateRoute>
                        } />
                        
                        <Route path="/accounts" element={
                            <PrivateRoute requiredPermission="ver_todas_contas">
                                <SistemaLayout>
                                    <Accounts />
                                </SistemaLayout>
                            </PrivateRoute>
                        } />
                        
                        <Route path="/accounts/new" element={
                            <PrivateRoute requiredPermission="criar_conta">
                                <SistemaLayout>
                                    <AccountForm />
                                </SistemaLayout>
                            </PrivateRoute>
                        } />
                        
                        <Route path="/accounts/edit/:id" element={
                            <PrivateRoute requiredPermission="editar_conta">
                                <SistemaLayout>
                                    <AccountForm />
                                </SistemaLayout>
                            </PrivateRoute>
                        } />
                        
                        <Route path="/admin/leads" element={
                            <PrivateRoute requiredPermission="ver_leads">
                                <SistemaLayout>
                                    <AdminLeads />
                                </SistemaLayout>
                            </PrivateRoute>
                        } />
                        
                        <Route path="/admin/users" element={
                            <PrivateRoute requiredPermission="gerenciar_usuarios">
                                <SistemaLayout>
                                    <AdminUsers />
                                </SistemaLayout>
                            </PrivateRoute>
                        } />
                        
                        <Route path="/my-bookings" element={
                            <PrivateRoute requiredRole="hospede">
                                <SistemaLayout>
                                    <MyBookings />
                                </SistemaLayout>
                            </PrivateRoute>
                        } />
                        
                        <Route path="/my-profile" element={
                            <PrivateRoute requiredRole="hospede">
                                <SistemaLayout>
                                    <MyProfile />
                                </SistemaLayout>
                            </PrivateRoute>
                        } />
                        
                        <Route path="/change-password" element={
                            <PrivateRoute>
                                <SistemaLayout>
                                    <ChangePassword />
                                </SistemaLayout>
                            </PrivateRoute>
                        } />
                    </Routes>
                </AuthProvider>
            </ThemeProvider>
        </BrowserRouter>
    );
}

export default App;
import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import NavbarSistema from './components/NavbarSistema';

// Landing Pages   
import Home from './landing/pages/Home';
import About from './landing/pages/About';
import Flats from './landing/pages/Flats';
import Porto from './landing/pages/Porto';
import PreBooking from './landing/pages/PreBooking';
import ResetPassword from './landing/pages/ResetPassword';
import ForgotPassword from './landing/pages/ForgotPassword';
import Login from './pages/Login';
import Register from './pages/Register';
import CompleteRegistration from './pages/CompleteRegistration';
import ConfirmEmail from './pages/ConfirmEmail';
import SocialFacebook from './landing/pages/SocialFacebook';
import SocialInstagram from './landing/pages/SocialInstagram';
import Chatbot from './components/Chatbot';
import CookieConsent from './components/CookieConsent';

// Sistema
import Dashboard from './pages/Dashboard';
import HotelDashboard from './modules/hotel/pages/HotelDashboard';
import RoomMap from './modules/hotel/pages/RoomMap';
import RoomList from './modules/hotel/pages/RoomList';
import RoomTypeList from './modules/hotel/pages/RoomTypeList';
import BookingList from './modules/hotel/pages/BookingList';
import BookingForm from './modules/hotel/pages/BookingForm';
import GuestList from './modules/hotel/pages/GuestList';
import Accounts from './pages/Accounts';
import AccountForm from './pages/AccountForm';
import AdminLeads from './pages/admin/Leads';
import AdminUsers from './pages/admin/Users';
import WhatsAppMessages from './pages/admin/WhatsAppMessages';
import VisitorDashboard from './pages/admin/VisitorDashboard';
import MyBookings from './pages/hospede/MyBookings';
import MyProfile from './pages/hospede/MyProfile';
import ChangePassword from './pages/ChangePassword';
import FinancialDashboard from './pages/FinancialDashboard';

// Módulo de Manutenção
import MaintenanceDashboard from './modules/maintenance/pages/MaintenanceDashboard';
import EquipmentList from './modules/maintenance/pages/EquipmentList';
import EquipmentDetail from './modules/maintenance/pages/EquipmentDetail';
import WorkOrderList from './modules/maintenance/pages/WorkOrderList';
import WorkOrderDetail from './modules/maintenance/pages/WorkOrderDetail';
import StockList from './modules/maintenance/pages/StockList';
import MaintenanceReports from './modules/maintenance/pages/Reports';
import MaterialCategoryList from './modules/maintenance/pages/MaterialCategoryList';
import WhatsAppButton from './components/WhatsAppButton';


// Layout para rotas do sistema (com navbar)
function SistemaLayout({ children }) {
    return (
        <>
            <NavbarSistema />
            <div className="pt-16">
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
                        {/* Landing Pages */}
                        <Route path="/" element={<Home />} />
                        <Route path="/sobre" element={<About />} />
                        <Route path="/flats" element={<Flats />} />
                        <Route path="/porto-de-galinhas" element={<Porto />} />
                        <Route path="/pre-reserva" element={<PreBooking />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/complete-registration" element={<CompleteRegistration />} />
                        <Route path="/confirm-email" element={<ConfirmEmail />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password" element={<ResetPassword />} />
                        <Route path="/facebook" element={<SocialFacebook />} />
                        <Route path="/instagram" element={<SocialInstagram />} />
                        {/* Sistema */}
                        <Route path="/dashboard" element={
                            <PrivateRoute>
                                <SistemaLayout>
                                    <Dashboard />
                                </SistemaLayout>
                            </PrivateRoute>
                        } />

                        {/* Módulo Hotel */}
                        <Route path="/hotel" element={
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
                        <Route path="/hotel/room-types" element={
                            <PrivateRoute requiredRole="colaborador">
                                <SistemaLayout>
                                    <RoomTypeList />
                                </SistemaLayout>
                            </PrivateRoute>
                        } />
                        <Route path="/hotel/bookings/new" element={
                            <PrivateRoute requiredPermission="criar_reserva">
                                <SistemaLayout>
                                    <BookingForm onClose={() => window.location.href = '/hotel/bookings'} />
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
                        {/* Módulo Financeiro */}
                        <Route path="/financial" element={
                            <PrivateRoute requiredPermission="ver_todas_contas">
                                <SistemaLayout>
                                    <FinancialDashboard />
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

                        {/* Módulo Admin */}
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
                        <Route path="/admin/whatsapp" element={
                            <PrivateRoute requiredPermission="ver_leads">
                                <SistemaLayout>
                                    <WhatsAppMessages />
                                </SistemaLayout>
                            </PrivateRoute>
                        } />
                        <Route path="/admin/visitors" element={
                            <PrivateRoute requiredPermission="admin">
                                <SistemaLayout>
                                    <VisitorDashboard />
                                </SistemaLayout>
                            </PrivateRoute>
                        } />
                        {/* Módulo Hóspede */}
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

                        {/* ===================================================== */}
                        {/* MÓDULO DE MANUTENÇÃO */}
                        {/* ===================================================== */}
                        
                        {/* Dashboard Principal de Manutenção */}
                        <Route path="/maintenance" element={
                            <PrivateRoute requiredPermission="ver_manutencao">
                                <SistemaLayout>
                                    <MaintenanceDashboard />
                                </SistemaLayout>
                            </PrivateRoute>
                        } />
                        {/* Categorias de Materiais*/}
                        <Route path="/maintenance/material-categories" element={
                            <PrivateRoute requiredPermission="ver_almoxarifado">
                                <SistemaLayout>
                                    <MaterialCategoryList />
                                </SistemaLayout>
                            </PrivateRoute>
                        } />
                        {/* Equipamentos */}
                        <Route path="/maintenance/equipment" element={
                            <PrivateRoute requiredPermission="ver_manutencao">
                                <SistemaLayout>
                                    <EquipmentList />
                                </SistemaLayout>
                            </PrivateRoute>
                        } />
                        <Route path="/maintenance/equipment/:id" element={
                            <PrivateRoute requiredPermission="ver_manutencao">
                                <SistemaLayout>
                                    <EquipmentDetail />
                                </SistemaLayout>
                            </PrivateRoute>
                        } />

                        {/* Ordens de Serviço */}
                        <Route path="/maintenance/work-orders" element={
                            <PrivateRoute requiredPermission="ver_manutencao">
                                <SistemaLayout>
                                    <WorkOrderList />
                                </SistemaLayout>
                            </PrivateRoute>
                        } />
                        <Route path="/maintenance/work-orders/:id" element={
                            <PrivateRoute requiredPermission="ver_manutencao">
                                <SistemaLayout>
                                    <WorkOrderDetail />
                                </SistemaLayout>
                            </PrivateRoute>
                        } />

                        {/* Almoxarifado */}
                        <Route path="/maintenance/stock" element={
                            <PrivateRoute requiredPermission="ver_almoxarifado">
                                <SistemaLayout>
                                    <StockList />
                                </SistemaLayout>
                            </PrivateRoute>
                        } />

                        {/* Relatórios */}
                        <Route path="/maintenance/reports" element={
                            <PrivateRoute requiredPermission="ver_relatorios_manutencao">
                                <SistemaLayout>
                                    <MaintenanceReports />
                                </SistemaLayout>
                            </PrivateRoute>
                        } />
                    </Routes>
                </AuthProvider>
                <WhatsAppButton />
                <Chatbot />
                <CookieConsent />
            </ThemeProvider>
        </BrowserRouter>
        
    );
}

export default App;

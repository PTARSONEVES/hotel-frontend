import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
    const { user, logout } = useAuth();
    const { theme } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Função para determinar classes ativas
    const getLinkClasses = (path) => {
        const isActive = location.pathname === path;
        const baseClasses = "inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200";
        
        if (isActive) {
            switch(theme) {
                case 'dracula':
                    return `${baseClasses} bg-[#bd93f9] text-white shadow-md`;
                case 'dark':
                    return `${baseClasses} bg-blue-900 text-blue-200`;
                default:
                    return `${baseClasses} bg-blue-100 text-blue-700`;
            }
        }
        
        switch(theme) {
            case 'dracula':
                return `${baseClasses} text-[#f8f8f2] hover:bg-[#44475a] hover:text-[#ff79c6]`;
            case 'dark':
                return `${baseClasses} text-gray-300 hover:bg-gray-700 hover:text-white`;
            default:
                return `${baseClasses} text-gray-700 hover:bg-gray-100 hover:text-gray-900`;
        }
    };

    // Links de navegação principais
    const navLinks = [
        { path: '/dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        { path: '/accounts', label: 'Contas', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
        { path: '/accounts/new', label: 'Nova Conta', icon: 'M12 4v16m8-8H4' },
        { path: '/change-password', label: 'Alterar Senha', icon: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z' },
    ];

    // Links do módulo hotel
    const hotelLinks = [
        { path: '/hotel/dashboard', label: 'Hotel', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        { path: '/hotel/map', label: 'Mapa', icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7' },
        { path: '/hotel/calendar', label: 'Calendário', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
        { path: '/hotel/bookings', label: 'Reservas', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
        { path: '/hotel/guests', label: 'Hóspedes', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    ];

    // Renderizar ícone SVG
    const Icon = ({ d }) => (
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d} />
        </svg>
    );

    // Determinar cores baseadas no tema
    const getThemeClasses = () => {
        switch(theme) {
            case 'dracula':
                return {
                    nav: 'bg-[#282a36] border-b border-[#44475a]',
                    text: 'text-[#f8f8f2]',
                    hover: 'hover:text-[#ff79c6]',
                    active: 'text-[#ff79c6]',
                    breadcrumb: 'bg-[#282a36] border-t border-[#44475a]',
                    breadcrumbText: 'text-[#f8f8f2]',
                    breadcrumbHover: 'hover:text-[#ff79c6]',
                    logout: 'text-[#ff5555] hover:text-[#ff5555] hover:bg-[#44475a]',
                };
            case 'dark':
                return {
                    nav: 'bg-gray-800 border-b border-gray-700',
                    text: 'text-gray-300',
                    hover: 'hover:text-white',
                    active: 'text-white',
                    breadcrumb: 'bg-gray-900 border-t border-gray-700',
                    breadcrumbText: 'text-gray-400',
                    breadcrumbHover: 'hover:text-gray-200',
                    logout: 'text-red-400 hover:text-red-300 hover:bg-gray-700',
                };
            default:
                return {
                    nav: 'bg-white border-b border-gray-200',
                    text: 'text-gray-700',
                    hover: 'hover:text-blue-600',
                    active: 'text-blue-600',
                    breadcrumb: 'bg-gray-50 border-t border-gray-200',
                    breadcrumbText: 'text-gray-600',
                    breadcrumbHover: 'hover:text-blue-600',
                    logout: 'text-red-600 hover:text-red-700 hover:bg-red-50',
                };
        }
    };

    const themeClasses = getThemeClasses();

    return (
        <nav className={`${themeClasses.nav} shadow-lg fixed top-0 left-0 right-0 z-40 transition-colors duration-300`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo e Links Principais */}
                    <div className="flex items-center space-x-4">
                        {/* Logo */}
                        <Link
                            to="/dashboard"
                            className={`flex items-center space-x-2 ${themeClasses.text} ${themeClasses.hover} transition-colors`}
                        >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-bold text-xl">Sistema</span>
                        </Link>

                        {/* Links de Navegação - Desktop */}
                        {user && (
                            <div className="hidden lg:flex lg:items-center lg:space-x-1">
                                {/* Links Financeiros */}
                                <div className="flex items-center space-x-1">
                                    {navLinks.map(link => (
                                        <Link
                                            key={link.path}
                                            to={link.path}
                                            className={getLinkClasses(link.path)}
                                        >
                                            <Icon d={link.icon} />
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>

                                {/* Separador */}
                                <div className={`w-px h-6 mx-2 ${theme === 'dracula' ? 'bg-[#44475a]' : 'bg-gray-300 dark:bg-gray-600'}`} />

                                {/* Links do Hotel */}
                                <div className="flex items-center space-x-1">
                                    {hotelLinks.map(link => (
                                        <Link
                                            key={link.path}
                                            to={link.path}
                                            className={getLinkClasses(link.path)}
                                        >
                                            <Icon d={link.icon} />
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Área do Usuário, Tema e Logout */}
                    <div className="flex items-center space-x-3">
                        <ThemeToggle />
                        
                        {user ? (
                            <>
                                <span className={`text-sm hidden md:block ${themeClasses.text}`}>
                                    Olá, <span className="font-semibold">{user.name || user.email}</span>
                                </span>
                                
                                <button
                                    onClick={handleLogout}
                                    className={`inline-flex items-center px-3 py-2 text-sm font-medium 
                                             rounded-md transition-colors ${themeClasses.logout}`}
                                >
                                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    <span className="hidden md:inline">Sair</span>
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Link
                                    to="/login"
                                    className={`inline-flex items-center px-3 py-2 text-sm font-medium 
                                             rounded-md transition-colors ${
                                        theme === 'dracula' 
                                            ? 'text-[#f8f8f2] hover:bg-[#44475a] hover:text-[#ff79c6]' 
                                            : theme === 'dark'
                                            ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                            : 'text-blue-600 hover:bg-blue-50'
                                    }`}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className={`inline-flex items-center px-3 py-2 text-sm font-medium 
                                             rounded-md transition-colors ${
                                        theme === 'dracula'
                                            ? 'bg-[#bd93f9] text-white hover:bg-[#ff79c6]'
                                            : theme === 'dark'
                                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                                    }`}
                                >
                                    Registrar
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Breadcrumb */}
            {user && (
                <div className={`${themeClasses.breadcrumb} transition-colors duration-300`}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
                        <div className={`flex items-center text-sm ${themeClasses.breadcrumbText}`}>
                            <Link to="/dashboard" className={`${themeClasses.breadcrumbHover} transition-colors`}>
                                Início
                            </Link>
                            <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            <span className={`font-medium ${
                                theme === 'dracula' ? 'text-[#ff79c6]' : 
                                theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>
                                {location.pathname === '/dashboard' && 'Dashboard'}
                                {location.pathname === '/accounts' && 'Contas'}
                                {location.pathname === '/accounts/new' && 'Nova Conta'}
                                {location.pathname.startsWith('/accounts/edit/') && 'Editar Conta'}
                                {location.pathname === '/hotel/dashboard' && 'Hotel'}
                                {location.pathname === '/hotel/map' && 'Mapa'}
                                {location.pathname === '/hotel/calendar' && 'Calendário'}
                                {location.pathname === '/hotel/bookings' && 'Reservas'}
                                {location.pathname === '/hotel/guests' && 'Hóspedes'}
                                {location.pathname === '/change-password' && 'Alterar Senha'}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
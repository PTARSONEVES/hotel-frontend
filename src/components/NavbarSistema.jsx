import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from './ThemeToggle';
import AlertBell from './AlertBell';

export default function NavbarSistema() {
    const { user, logout, hasPermission, hasMinRole } = useAuth();
    const { theme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [openSubmenu, setOpenSubmenu] = useState(null);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getThemeClasses = () => {
        if (theme === 'dracula') {
            return {
                nav: 'bg-[#282a36] border-b border-[#44475a]',
                text: 'text-[#f8f8f2]',
                hover: 'hover:text-[#ff79c6]',
                active: 'text-[#ff79c6] border-b-2 border-[#ff79c6]',
                button: 'bg-[#44475a] hover:bg-[#6272a4] text-[#f8f8f2]',
                dropdown: 'bg-[#44475a] border border-[#6272a4]'
            };
        }
        if (theme === 'dark') {
            return {
                nav: 'bg-gray-800 border-b border-gray-700',
                text: 'text-gray-300',
                hover: 'hover:text-white',
                active: 'text-white border-b-2 border-blue-500',
                button: 'bg-gray-700 hover:bg-gray-600 text-white',
                dropdown: 'bg-gray-700 border border-gray-600'
            };
        }
        return {
            nav: 'bg-white border-b border-gray-200',
            text: 'text-gray-700',
            hover: 'hover:text-blue-600',
            active: 'text-blue-600 border-b-2 border-blue-600',
            button: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
            dropdown: 'bg-white border border-gray-200'
        };
    };

    const classes = getThemeClasses();

    // Links baseados nas permissões
    const menuItems = [
        {
            label: 'Dashboard',
            path: '/dashboard',
            icon: '📊',
            show: true // Sempre mostra
        },
        {
            label: 'Reservas',
            path: '/hotel/bookings',
            icon: '📅',
            show: hasPermission('ver_todas_reservas') || hasMinRole('colaborador')
        },
        {
            label: 'Apartamentos',
            path: '/hotel/rooms',
            icon: '🏨',
            show: hasPermission('ver_todas_reservas') || hasMinRole('colaborador')
        },
        {
            label: 'Hóspedes',
            path: '/hotel/guests',
            icon: '👥',
            show: hasPermission('ver_hospedes')
        },
        {
            label: 'Financeiro',
            path: '/financial',
            icon: '💰',
            show: hasPermission('ver_todas_contas')
        },
        {
            label: 'Manutenção',
            path: '/maintenance',
            icon: '🔧',
            show: hasPermission('ver_manutencao'),
            submenu: [
                {
                    label: 'Dashboard',
                    path: '/maintenance',
                    icon: '📊',
                    show: true
                },
                {
                    label: 'Equipamentos',
                    path: '/maintenance/equipment',
                    icon: '⚙️',
                    show: true
                },
                {
                    label: 'Ordens de Serviço',
                    path: '/maintenance/work-orders',
                    icon: '📋',
                    show: true
                },
                {
                    label: 'Almoxarifado',
                    path: '/maintenance/stock',
                    icon: '📦',
                    show: hasPermission('ver_almoxarifado')
                },
                {
                    label: 'Relatórios',
                    path: '/maintenance/reports',
                    icon: '📈',
                    show: hasPermission('ver_relatorios_manutencao')
                }
            ]
        },
        {
            label: 'Leads',
            path: '/admin/leads',
            icon: '📋',
            show: hasPermission('ver_leads')
        },
        {
            label: 'Usuários',
            path: '/admin/users',
            icon: '👤',
            show: hasPermission('gerenciar_usuarios')
        },
        {
            label: 'Minhas Reservas',
            path: '/my-bookings',
            icon: '📋',
            show: user?.role === 'hospede'
        }
/*
        {
            label: 'Manutenção',
            path: '/maintenance',
            icon: '🔧',
            show: hasPermission('ver_manutencao')
        }
*/
        ].filter(item => item.show);

    // Menu do usuário
    const userMenuItems = [
        {
            label: 'Meu Perfil',
            path: '/my-profile',
            icon: '👤',
            show: true
        },
        {
            label: 'Alterar Senha',
            path: '/change-password',
            icon: '🔒',
            show: true
        }
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav className={`${classes.nav} fixed top-0 left-0 right-0 z-40 transition-colors duration-300`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/dashboard" className="flex items-center space-x-2">
                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Ancorar
                            </span>
                        </Link>
                    </div>

                    {/* Menu Desktop */}
                    <div className="hidden md:flex items-center space-x-1">
                        {menuItems.map(item => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                    isActive(item.path)
                                        ? classes.active
                                        : `${classes.text} ${classes.hover}`
                                }`}
                            >
                                <span className="mr-1">{item.icon}</span>
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* Área Direita */}
                    <div className="flex items-center space-x-3">
                        <AlertBell />
                        <ThemeToggle />

                        {/* Menu do Usuário */}
                        <div className="relative">
                            <button
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                className={`flex items-center space-x-2 px-3 py-2 rounded-md ${classes.button} transition-colors`}
                            >
                                <span className="text-sm font-medium">
                                    {user?.name?.split(' ')[0] || 'Usuário'}
                                </span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {isUserMenuOpen && (
                                <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg ${classes.dropdown} z-50`}>
                                    {userMenuItems.map(item => (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            className={`block px-4 py-2 text-sm ${classes.text} ${classes.hover}`}
                                            onClick={() => setIsUserMenuOpen(false)}
                                        >
                                            <span className="mr-2">{item.icon}</span>
                                            {item.label}
                                        </Link>
                                    ))}
                                    <div className={`border-t ${theme === 'dracula' ? 'border-[#6272a4]' : 'border-gray-200'}`}></div>
                                    <button
                                        onClick={handleLogout}
                                        className={`block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30`}
                                    >
                                        <span className="mr-2">🚪</span>
                                        Sair
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Botão Menu Mobile */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 rounded-md"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Menu Mobile */}
            {isMenuOpen && (
                <div className={`md:hidden ${classes.dropdown} border-t`}>
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        {menuItems.map(item => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`block px-3 py-2 rounded-md text-base font-medium ${
                                    isActive(item.path)
                                        ? classes.active
                                        : `${classes.text} ${classes.hover}`
                                }`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <span className="mr-2">{item.icon}</span>
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
}
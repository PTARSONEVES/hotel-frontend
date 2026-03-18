import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function RoleBasedDashboard() {
    const { user, hasPermission } = useAuth();
    const { theme } = useTheme();

    const getThemeClasses = () => {
        if (theme === 'dracula') {
            return {
                card: 'bg-[#44475a]',
                text: 'text-[#f8f8f2]',
                accent: 'text-[#bd93f9]'
            };
        }
        if (theme === 'dark') {
            return {
                card: 'bg-gray-800',
                text: 'text-white',
                accent: 'text-blue-400'
            };
        }
        return {
            card: 'bg-white',
            text: 'text-gray-900',
            accent: 'text-blue-600'
        };
    };

    const classes = getThemeClasses();

    // Módulos disponíveis baseados nas permissões
    const modules = [
        {
            name: 'Dashboard Principal',
            icon: '📊',
            path: '/dashboard',
            permission: null, // Sempre disponível
            description: 'Visão geral do sistema'
        },
        {
            name: 'Reservas',
            icon: '📅',
            path: '/hotel/bookings',
            permission: 'ver_todas_reservas',
            description: 'Gerenciar reservas'
        },
        {
            name: 'Apartamentos',
            icon: '🏨',
            path: '/hotel/rooms',
            permission: 'ver_todas_reservas',
            description: 'Mapa e status dos aptos'
        },
        {
            name: 'Hóspedes',
            icon: '👥',
            path: '/hotel/guests',
            permission: 'ver_hospedes',
            description: 'Cadastro de hóspedes'
        },
        {
            name: 'Financeiro',
            icon: '💰',
            path: '/accounts',
            permission: 'ver_todas_contas',
            description: 'Contas a pagar/receber'
        },
        {
            name: 'Leads',
            icon: '📋',
            path: '/admin/leads',
            permission: 'ver_leads',
            description: 'Leads captados do site'
        },
        {
            name: 'Manutenção',
            icon: '🔧',
            path: '/maintenance',
            permission: 'ver_ordens_manutencao',
            description: 'Ordens de serviço'
        },
        {
            name: 'Usuários',
            icon: '👤',
            path: '/admin/users',
            permission: 'gerenciar_usuarios',
            description: 'Gerenciar usuários'
        }
    ];

    // Filtrar módulos baseado nas permissões
    const availableModules = modules.filter(module => 
        !module.permission || hasPermission(module.permission)
    );

    return (
        <div className="p-6">
            <h1 className={`text-3xl font-bold mb-2 ${classes.text}`}>
                Olá, {user?.name}!
            </h1>
            <p className={`text-lg mb-8 ${classes.text} opacity-80`}>
                {user?.role === 'admin' && '👑 Administrador'}
                {user?.role === 'colaborador' && `👨‍💼 Colaborador - ${user?.department || 'Geral'}`}
                {user?.role === 'hospede' && '🧳 Hóspede'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableModules.map((module, index) => (
                    <Link
                        key={index}
                        to={module.path}
                        className={`${classes.card} p-6 rounded-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-2`}
                    >
                        <div className="text-4xl mb-4">{module.icon}</div>
                        <h3 className={`text-xl font-bold mb-2 ${classes.text}`}>{module.name}</h3>
                        <p className={classes.text}>{module.description}</p>
                    </Link>
                ))}
            </div>

            {availableModules.length === 0 && (
                <div className={`${classes.card} p-8 rounded-lg text-center`}>
                    <p className={`text-xl ${classes.text}`}>
                        Você não tem permissão para acessar nenhum módulo.
                        Entre em contato com o administrador.
                    </p>
                </div>
            )}
        </div>
    );
}
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/api';
import { useTheme } from '../../../context/ThemeContext';
import ThemeToggle from '../../../components/ThemeToggle';

export default function MaintenanceDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { theme } = useTheme();

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            const response = await api.get('/maintenance/reports/dashboard');
            setData(response.data);
        } catch (error) {
            console.error('Erro ao carregar dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const getThemeClasses = () => {
        if (theme === 'dracula') {
            return {
                card: 'bg-[#44475a]',
                text: 'text-[#f8f8f2]',
                accent: 'text-[#bd93f9]',
                danger: 'text-[#ff5555]',
                warning: 'text-[#f1fa8c]',
                success: 'text-[#50fa7b]'
            };
        }
        if (theme === 'dark') {
            return {
                card: 'bg-gray-800',
                text: 'text-white',
                accent: 'text-blue-400',
                danger: 'text-red-400',
                warning: 'text-yellow-400',
                success: 'text-green-400'
            };
        }
        return {
            card: 'bg-white',
            text: 'text-gray-900',
            accent: 'text-blue-600',
            danger: 'text-red-600',
            warning: 'text-yellow-600',
            success: 'text-green-600'
        };
    };

    const classes = getThemeClasses();

    const modules = [
        {
            name: 'Equipamentos',
            path: '/maintenance/equipment',
            icon: '🔧',
            description: 'Gerenciar equipamentos e ativos',
            color: 'bg-blue-500'
        },
        {
            name: 'Ordens de Serviço',
            path: '/maintenance/work-orders',
            icon: '📋',
            description: 'Acompanhar OS abertas e concluídas',
            color: 'bg-purple-500'
        },
        {
            name: 'Almoxarifado',
            path: '/maintenance/stock',
            icon: '📦',
            description: 'Controle de estoque e materiais',
            color: 'bg-green-500'
        },
        {
            name: 'Relatórios',
            path: '/maintenance/reports',
            icon: '📊',
            description: 'Indicadores e estatísticas',
            color: 'bg-orange-500'
        }
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                <ThemeToggle />
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pt-20 pb-8">
            <ThemeToggle />
            
            <div className="max-w-7xl mx-auto px-4">
                <h1 className={`text-3xl font-bold mb-8 ${classes.text}`}>
                    Manutenção
                </h1>

                {/* Cards de Resumo */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className={`${classes.card} p-6 rounded-lg shadow`}>
                        <p className={`text-sm ${classes.text} opacity-70`}>OS Abertas</p>
                        <p className={`text-3xl font-bold ${classes.accent}`}>
                            {data?.summary?.open_orders || 0}
                        </p>
                    </div>
                    
                    <div className={`${classes.card} p-6 rounded-lg shadow`}>
                        <p className={`text-sm ${classes.text} opacity-70`}>Em Andamento</p>
                        <p className={`text-3xl font-bold ${classes.warning}`}>
                            {data?.summary?.in_progress || 0}
                        </p>
                    </div>
                    
                    <div className={`${classes.card} p-6 rounded-lg shadow`}>
                        <p className={`text-sm ${classes.text} opacity-70`}>Concluídas (mês)</p>
                        <p className={`text-3xl font-bold ${classes.success}`}>
                            {data?.summary?.completed_month || 0}
                        </p>
                    </div>
                    
                    <div className={`${classes.card} p-6 rounded-lg shadow`}>
                        <p className={`text-sm ${classes.text} opacity-70`}>Estoque Baixo</p>
                        <p className={`text-3xl font-bold ${classes.danger}`}>
                            {data?.summary?.low_stock_items || 0}
                        </p>
                    </div>
                </div>

                {/* Módulos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {modules.map((module, index) => (
                        <Link
                            key={index}
                            to={module.path}
                            className={`${classes.card} p-6 rounded-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-2`}
                        >
                            <div className="flex items-start space-x-4">
                                <div className={`${module.color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl text-white`}>
                                    {module.icon}
                                </div>
                                <div>
                                    <h3 className={`text-xl font-bold mb-2 ${classes.text}`}>{module.name}</h3>
                                    <p className={classes.text}>{module.description}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Próximas manutenções */}
                {data?.upcoming && data.upcoming.length > 0 && (
                    <div className={`${classes.card} p-6 rounded-lg shadow`}>
                        <h2 className={`text-xl font-bold mb-4 ${classes.text}`}>Próximas Manutenções</h2>
                        <div className="space-y-3">
                            {data.upcoming.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center border-b pb-2">
                                    <div>
                                        <p className={`font-medium ${classes.text}`}>{item.equipment}</p>
                                        <p className={`text-sm ${classes.text} opacity-70`}>{item.description}</p>
                                    </div>
                                    <span className={`text-sm ${classes.accent}`}>
                                        {new Date(item.due_date).toLocaleDateString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
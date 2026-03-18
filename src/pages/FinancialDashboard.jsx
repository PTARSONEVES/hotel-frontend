import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';

export default function FinancialDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState({
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
    });
    const { theme } = useTheme();

    useEffect(() => {
        loadData();
    }, [period]);

    const loadData = async () => {
        try {
            setLoading(true);
            // CORRIGIDO: usar /financial/dashboard em vez de /accounts/dashboard
            const response = await api.get('/financial/dashboard', { params: period });
            console.log('📊 Dados financeiros:', response.data);
            setData(response.data);
        } catch (error) {
            console.error('❌ Erro ao carregar dados financeiros:', error);
        } finally {
            setLoading(false);
        }
    };

    const getThemeClasses = () => {
        if (theme === 'dracula') {
            return {
                card: 'bg-[#44475a]',
                text: 'text-[#f8f8f2]',
                positive: 'text-[#50fa7b]',
                negative: 'text-[#ff5555]',
                accent: 'text-[#bd93f9]'
            };
        }
        if (theme === 'dark') {
            return {
                card: 'bg-gray-800',
                text: 'text-white',
                positive: 'text-green-400',
                negative: 'text-red-400',
                accent: 'text-blue-400'
            };
        }
        return {
            card: 'bg-white',
            text: 'text-gray-900',
            positive: 'text-green-600',
            negative: 'text-red-600',
            accent: 'text-blue-600'
        };
    };

    const classes = getThemeClasses();

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value || 0);
    };

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
                <div className="flex justify-between items-center mb-8">
                    <h1 className={`text-3xl font-bold ${classes.text}`}>
                        Dashboard Financeiro
                    </h1>
                    
                    <div className="flex space-x-2">
                        <input
                            type="date"
                            value={period.startDate}
                            onChange={(e) => setPeriod({...period, startDate: e.target.value})}
                            className="px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                        <input
                            type="date"
                            value={period.endDate}
                            onChange={(e) => setPeriod({...period, endDate: e.target.value})}
                            className="px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>
                </div>

                {/* Cards de Resumo */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className={`${classes.card} p-6 rounded-lg shadow`}>
                        <h3 className={`text-sm mb-2 ${classes.text} opacity-70`}>Recebido</h3>
                        <p className={`text-2xl font-bold ${classes.positive}`}>
                            {formatCurrency(data?.summary?.recebido)}
                        </p>
                    </div>
                    
                    <div className={`${classes.card} p-6 rounded-lg shadow`}>
                        <h3 className={`text-sm mb-2 ${classes.text} opacity-70`}>A Receber</h3>
                        <p className={`text-2xl font-bold ${classes.accent}`}>
                            {formatCurrency(data?.summary?.a_receber)}
                        </p>
                    </div>
                    
                    <div className={`${classes.card} p-6 rounded-lg shadow`}>
                        <h3 className={`text-sm mb-2 ${classes.text} opacity-70`}>Pago</h3>
                        <p className={`text-2xl font-bold ${classes.negative}`}>
                            {formatCurrency(data?.summary?.pago)}
                        </p>
                    </div>
                    
                    <div className={`${classes.card} p-6 rounded-lg shadow`}>
                        <h3 className={`text-sm mb-2 ${classes.text} opacity-70`}>A Pagar</h3>
                        <p className={`text-2xl font-bold ${classes.text}`}>
                            {formatCurrency(data?.summary?.a_pagar)}
                        </p>
                    </div>
                </div>

                {/* Saldo do Período */}
                <div className={`${classes.card} p-6 rounded-lg shadow mb-8`}>
                    <h2 className={`text-xl font-bold mb-4 ${classes.text}`}>Saldo do Período</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className={`text-sm ${classes.text} opacity-70`}>Total Receitas</p>
                            <p className={`text-2xl font-bold ${classes.positive}`}>
                                {formatCurrency(data?.summary?.recebido + data?.summary?.a_receber)}
                            </p>
                        </div>
                        <div>
                            <p className={`text-sm ${classes.text} opacity-70`}>Total Despesas</p>
                            <p className={`text-2xl font-bold ${classes.negative}`}>
                                {formatCurrency(data?.summary?.pago + data?.summary?.a_pagar)}
                            </p>
                        </div>
                        <div className="col-span-2 pt-4 border-t">
                            <p className={`text-sm ${classes.text} opacity-70`}>Saldo Previsto</p>
                            <p className={`text-3xl font-bold ${classes.accent}`}>
                                {formatCurrency(
                                    (data?.summary?.recebido + data?.summary?.a_receber) - 
                                    (data?.summary?.pago + data?.summary?.a_pagar)
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Contas a Receber Recentes */}
                {data?.receivables?.length > 0 && (
                    <div className={`${classes.card} p-6 rounded-lg shadow mb-8`}>
                        <h2 className={`text-xl font-bold mb-4 ${classes.text}`}>Contas a Receber</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-2">Descrição</th>
                                        <th className="text-left py-2">Hóspede</th>
                                        <th className="text-left py-2">Vencimento</th>
                                        <th className="text-right py-2">Valor</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.receivables.slice(0, 5).map(item => (
                                        <tr key={item.id} className="border-b">
                                            <td className="py-2">{item.title || 'Reserva'}</td>
                                            <td className="py-2">{item.guest_name || '-'}</td>
                                            <td className="py-2">{new Date(item.due_date).toLocaleDateString()}</td>
                                            <td className="text-right py-2">{formatCurrency(item.amount)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Contas a Pagar Recentes */}
                {data?.payables?.length > 0 && (
                    <div className={`${classes.card} p-6 rounded-lg shadow`}>
                        <h2 className={`text-xl font-bold mb-4 ${classes.text}`}>Contas a Pagar</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-2">Descrição</th>
                                        <th className="text-left py-2">Fornecedor</th>
                                        <th className="text-left py-2">Vencimento</th>
                                        <th className="text-right py-2">Valor</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.payables.slice(0, 5).map(item => (
                                        <tr key={item.id} className="border-b">
                                            <td className="py-2">{item.description}</td>
                                            <td className="py-2">{item.supplier || '-'}</td>
                                            <td className="py-2">{new Date(item.due_date).toLocaleDateString()}</td>
                                            <td className="text-right py-2">{formatCurrency(item.amount)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
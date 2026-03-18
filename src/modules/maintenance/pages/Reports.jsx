import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { useTheme } from '../../../context/ThemeContext';
import ThemeToggle from '../../../components/ThemeToggle';

export default function MaintenanceReports() {
    const [period, setPeriod] = useState({
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
    });
    const [indicators, setIndicators] = useState([]);
    const [consumption, setConsumption] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('indicators');
    const { theme } = useTheme();

    useEffect(() => {
        loadData();
    }, [period]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [indicatorsRes, consumptionRes] = await Promise.all([
                api.get('/maintenance/reports/indicators', { params: period }),
                api.get('/maintenance/reports/material-consumption', { params: period })
            ]);
            setIndicators(indicatorsRes.data);
            setConsumption(consumptionRes.data);
        } catch (error) {
            console.error('Erro ao carregar relatórios:', error);
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
                success: 'text-[#50fa7b]',
                border: 'border-[#6272a4]'
            };
        }
        if (theme === 'dark') {
            return {
                card: 'bg-gray-800',
                text: 'text-white',
                accent: 'text-blue-400',
                danger: 'text-red-400',
                warning: 'text-yellow-400',
                success: 'text-green-400',
                border: 'border-gray-700'
            };
        }
        return {
            card: 'bg-white',
            text: 'text-gray-900',
            accent: 'text-blue-600',
            danger: 'text-red-600',
            warning: 'text-yellow-600',
            success: 'text-green-600',
            border: 'border-gray-200'
        };
    };

    const classes = getThemeClasses();

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value || 0);
    };

    const formatNumber = (value) => {
        return new Intl.NumberFormat('pt-BR').format(value || 0);
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
                        Relatórios de Manutenção
                    </h1>
                    
                    <div className="flex space-x-2">
                        <input
                            type="date"
                            value={period.startDate}
                            onChange={(e) => setPeriod({...period, startDate: e.target.value})}
                            className={`px-3 py-2 border rounded ${classes.border} ${classes.text}`}
                        />
                        <input
                            type="date"
                            value={period.endDate}
                            onChange={(e) => setPeriod({...period, endDate: e.target.value})}
                            className={`px-3 py-2 border rounded ${classes.border} ${classes.text}`}
                        />
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b mb-6">
                    <nav className="flex space-x-4">
                        <button
                            onClick={() => setActiveTab('indicators')}
                            className={`px-4 py-2 font-medium ${activeTab === 'indicators' ? classes.accent + ' border-b-2 border-current' : classes.text}`}
                        >
                            Indicadores
                        </button>
                        <button
                            onClick={() => setActiveTab('consumption')}
                            className={`px-4 py-2 font-medium ${activeTab === 'consumption' ? classes.accent + ' border-b-2 border-current' : classes.text}`}
                        >
                            Consumo de Materiais
                        </button>
                        <button
                            onClick={() => setActiveTab('costs')}
                            className={`px-4 py-2 font-medium ${activeTab === 'costs' ? classes.accent + ' border-b-2 border-current' : classes.text}`}
                        >
                            Custos por Equipamento
                        </button>
                    </nav>
                </div>

                {/* Tab Content */}
                {activeTab === 'indicators' && (
                    <div className="space-y-6">
                        {/* Cards de Resumo */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className={`${classes.card} p-6 rounded-lg shadow`}>
                                <p className={`text-sm ${classes.text} opacity-70`}>MTBF Médio</p>
                                <p className={`text-3xl font-bold ${classes.text}`}>
                                    {indicators.reduce((acc, i) => acc + (parseFloat(i.mtbf) || 0), 0) / indicators.length || 0} h
                                </p>
                                <p className={`text-xs ${classes.text} opacity-70`}>Tempo médio entre falhas</p>
                            </div>
                            <div className={`${classes.card} p-6 rounded-lg shadow`}>
                                <p className={`text-sm ${classes.text} opacity-70`}>MTTR Médio</p>
                                <p className={`text-3xl font-bold ${classes.text}`}>
                                    {indicators.reduce((acc, i) => acc + (i.mttr || 0), 0) / indicators.length || 0} h
                                </p>
                                <p className={`text-xs ${classes.text} opacity-70`}>Tempo médio de reparo</p>
                            </div>
                            <div className={`${classes.card} p-6 rounded-lg shadow`}>
                                <p className={`text-sm ${classes.text} opacity-70`}>Disponibilidade</p>
                                <p className={`text-3xl font-bold ${classes.success}`}>
                                    {indicators.length > 0 ? 
                                        ((indicators.reduce((acc, i) => acc + (parseFloat(i.mtbf) || 0), 0) / 
                                          (indicators.reduce((acc, i) => acc + (parseFloat(i.mtbf) || 0), 0) + 
                                           indicators.reduce((acc, i) => acc + (i.mttr || 0), 0))) * 100 || 0).toFixed(1) 
                                        : 0}%
                                </p>
                            </div>
                        </div>

                        {/* Tabela de Indicadores por Equipamento */}
                        <div className={`${classes.card} rounded-lg shadow overflow-hidden`}>
                            <div className="p-4 border-b">
                                <h2 className={`text-lg font-bold ${classes.text}`}>Indicadores por Equipamento</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th className={`px-4 py-2 text-left ${classes.text}`}>Equipamento</th>
                                            <th className={`px-4 py-2 text-right ${classes.text}`}>Falhas</th>
                                            <th className={`px-4 py-2 text-right ${classes.text}`}>MTBF (h)</th>
                                            <th className={`px-4 py-2 text-right ${classes.text}`}>MTTR (h)</th>
                                            <th className={`px-4 py-2 text-right ${classes.text}`}>OS Realizadas</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {indicators.map((item, idx) => (
                                            <tr key={idx} className="border-t">
                                                <td className={`px-4 py-2 ${classes.text}`}>{item.name}</td>
                                                <td className={`px-4 py-2 text-right ${classes.text}`}>{item.failure_count || 0}</td>
                                                <td className={`px-4 py-2 text-right ${classes.text}`}>{item.mtbf || 0}</td>
                                                <td className={`px-4 py-2 text-right ${classes.text}`}>{item.mttr || 0}</td>
                                                <td className={`px-4 py-2 text-right ${classes.text}`}>{item.total_orders || 0}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'consumption' && (
                    <div className={`${classes.card} rounded-lg shadow overflow-hidden`}>
                        <div className="p-4 border-b">
                            <h2 className={`text-lg font-bold ${classes.text}`}>Consumo de Materiais no Período</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className={`px-4 py-2 text-left ${classes.text}`}>Material</th>
                                        <th className={`px-4 py-2 text-left ${classes.text}`}>Categoria</th>
                                        <th className={`px-4 py-2 text-right ${classes.text}`}>Quantidade</th>
                                        <th className={`px-4 py-2 text-right ${classes.text}`}>Custo Total</th>
                                        <th className={`px-4 py-2 text-right ${classes.text}`}>OS Utilizadas</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {consumption.map((item, idx) => (
                                        <tr key={idx} className="border-t">
                                            <td className={`px-4 py-2 ${classes.text}`}>{item.name}</td>
                                            <td className={`px-4 py-2 ${classes.text}`}>{item.category}</td>
                                            <td className={`px-4 py-2 text-right ${classes.text}`}>
                                                {formatNumber(item.total_quantity)} {item.unit}
                                            </td>
                                            <td className={`px-4 py-2 text-right ${classes.text}`}>
                                                {formatCurrency(item.total_cost)}
                                            </td>
                                            <td className={`px-4 py-2 text-right ${classes.text}`}>{item.orders_used}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <td colSpan="3" className={`px-4 py-2 text-right font-bold ${classes.text}`}>Total</td>
                                        <td className={`px-4 py-2 text-right font-bold ${classes.accent}`}>
                                            {formatCurrency(consumption.reduce((acc, i) => acc + i.total_cost, 0))}
                                        </td>
                                        <td></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'costs' && (
                    <div className="grid gap-4">
                        {/* Gráfico de Custos - Simulado com Cards */}
                        <div className={`${classes.card} p-6 rounded-lg shadow`}>
                            <h2 className={`text-lg font-bold mb-4 ${classes.text}`}>Custos por Tipo de Manutenção</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className={`text-sm ${classes.text} opacity-70`}>Preventiva</p>
                                    <p className={`text-2xl font-bold ${classes.success}`}>
                                        {formatCurrency(indicators.reduce((acc, i) => acc + (i.preventive_cost || 0), 0))}
                                    </p>
                                </div>
                                <div>
                                    <p className={`text-sm ${classes.text} opacity-70`}>Corretiva</p>
                                    <p className={`text-2xl font-bold ${classes.danger}`}>
                                        {formatCurrency(indicators.reduce((acc, i) => acc + (i.corrective_cost || 0), 0))}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className={classes.text}>Relação Preventiva/Corretiva</span>
                                    <span className={classes.text}>
                                        {indicators.reduce((acc, i) => acc + (i.preventive_cost || 0), 0) > 0 ?
                                            ((indicators.reduce((acc, i) => acc + (i.preventive_cost || 0), 0) /
                                              (indicators.reduce((acc, i) => acc + (i.corrective_cost || 0), 0) + 
                                               indicators.reduce((acc, i) => acc + (i.preventive_cost || 0), 0))) * 100 || 0).toFixed(1)
                                            : 0}% Preventiva
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div 
                                        className="bg-green-600 h-2.5 rounded-full" 
                                        style={{ 
                                            width: `${indicators.reduce((acc, i) => acc + (i.preventive_cost || 0), 0) > 0 ?
                                                (indicators.reduce((acc, i) => acc + (i.preventive_cost || 0), 0) /
                                                 (indicators.reduce((acc, i) => acc + (i.corrective_cost || 0), 0) + 
                                                  indicators.reduce((acc, i) => acc + (i.preventive_cost || 0), 0))) * 100 || 0
                                                : 0}%` 
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        {/* Tabela de Custos por Equipamento */}
                        <div className={`${classes.card} rounded-lg shadow overflow-hidden`}>
                            <div className="p-4 border-b">
                                <h2 className={`text-lg font-bold ${classes.text}`}>Custos por Equipamento</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th className={`px-4 py-2 text-left ${classes.text}`}>Equipamento</th>
                                            <th className={`px-4 py-2 text-right ${classes.text}`}>Custo Total</th>
                                            <th className={`px-4 py-2 text-right ${classes.text}`}>Custo Preventiva</th>
                                            <th className={`px-4 py-2 text-right ${classes.text}`}>Custo Corretiva</th>
                                            <th className={`px-4 py-2 text-right ${classes.text}`}>Nº OS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {indicators.map((item, idx) => (
                                            <tr key={idx} className="border-t">
                                                <td className={`px-4 py-2 ${classes.text}`}>{item.name}</td>
                                                <td className={`px-4 py-2 text-right ${classes.text}`}>
                                                    {formatCurrency((item.preventive_cost || 0) + (item.corrective_cost || 0))}
                                                </td>
                                                <td className={`px-4 py-2 text-right ${classes.success}`}>
                                                    {formatCurrency(item.preventive_cost || 0)}
                                                </td>
                                                <td className={`px-4 py-2 text-right ${classes.danger}`}>
                                                    {formatCurrency(item.corrective_cost || 0)}
                                                </td>
                                                <td className={`px-4 py-2 text-right ${classes.text}`}>{item.total_orders || 0}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
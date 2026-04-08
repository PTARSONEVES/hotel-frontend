import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import ThemeToggle from '../../components/ThemeToggle';
import { useTheme } from '../../context/ThemeContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

export default function VisitorDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('30d');
    const [selectedVisitor, setSelectedVisitor] = useState(null);
    const { theme } = useTheme();

    useEffect(() => {
        loadData();
    }, [period]);

    const loadData = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/visitors/dashboard', { params: { period } });
            setData(response.data);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatNumber = (num) => {
        return new Intl.NumberFormat('pt-BR').format(num || 0);
    };

    const getThemeClasses = () => {
        if (theme === 'dracula') {
            return {
                card: 'bg-[#44475a]',
                text: 'text-[#f8f8f2]',
                border: 'border-[#6272a4]',
                accent: 'text-[#bd93f9]',
                success: 'text-[#50fa7b]',
                warning: 'text-[#f1fa8c]',
                danger: 'text-[#ff5555]',
                button: 'bg-[#bd93f9] hover:bg-[#ff79c6] text-white',
                input: 'bg-[#282a36] border-[#6272a4] text-[#f8f8f2]',
                tableHeader: 'bg-[#6272a4] text-[#f8f8f2]',
                tableRow: 'hover:bg-[#6272a4]',
                modalBg: 'bg-[#282a36]',
                chartText: '#f8f8f2',
                chartGrid: '#6272a4',
                chartTooltipBg: '#282a36'
            };
        }
        if (theme === 'dark') {
            return {
                card: 'bg-gray-800',
                text: 'text-white',
                border: 'border-gray-700',
                accent: 'text-blue-400',
                success: 'text-green-400',
                warning: 'text-yellow-400',
                danger: 'text-red-400',
                button: 'bg-blue-600 hover:bg-blue-700 text-white',
                input: 'bg-gray-700 border-gray-600 text-white',
                tableHeader: 'bg-gray-700 text-white',
                tableRow: 'hover:bg-gray-700',
                modalBg: 'bg-gray-800',
                chartText: '#ffffff',
                chartGrid: '#4b5563',
                chartTooltipBg: '#1f2937'
            };
        }
        return {
            card: 'bg-white',
            text: 'text-gray-900',
            border: 'border-gray-200',
            accent: 'text-blue-600',
            success: 'text-green-600',
            warning: 'text-yellow-600',
            danger: 'text-red-600',
            button: 'bg-blue-600 hover:bg-blue-700 text-white',
            input: 'bg-white border-gray-300 text-gray-900',
            tableHeader: 'bg-gray-50 text-gray-900',
            tableRow: 'hover:bg-gray-50',
            modalBg: 'bg-white',
            chartText: '#374151',
            chartGrid: '#e5e7eb',
            chartTooltipBg: '#ffffff'
        };
    };

    const classes = getThemeClasses();
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

    // Custom Tooltip para gráficos
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className={`p-2 rounded shadow-lg border ${classes.border} ${classes.chartTooltipBg}`}>
                    <p className={`text-sm font-bold ${classes.text}`}>{label}</p>
                    {payload.map((p, idx) => (
                        <p key={idx} className={`text-sm ${classes.text}`}>
                            {p.name}: {formatNumber(p.value)}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
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
                        Painel de Visitantes
                    </h1>
                    
                    <div className="flex items-center space-x-4">
                        <select
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                            className={`px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${classes.input}`}
                        >
                            <option value="7d">Últimos 7 dias</option>
                            <option value="30d">Últimos 30 dias</option>
                            <option value="90d">Últimos 90 dias</option>
                        </select>
                        
                        <button
                            onClick={loadData}
                            className={`px-3 py-2 rounded ${classes.button}`}
                        >
                            Atualizar
                        </button>
                    </div>
                </div>

                {/* Cards de Resumo */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className={`${classes.card} p-6 rounded-lg shadow`}>
                        <p className={`text-sm ${classes.text} opacity-70`}>Visitantes Únicos</p>
                        <p className={`text-3xl font-bold ${classes.accent}`}>
                            {formatNumber(data?.summary?.unique_visitors)}
                        </p>
                    </div>
                    <div className={`${classes.card} p-6 rounded-lg shadow`}>
                        <p className={`text-sm ${classes.text} opacity-70`}>Total de Visitas</p>
                        <p className={`text-3xl font-bold ${classes.text}`}>
                            {formatNumber(data?.summary?.total_visits)}
                        </p>
                    </div>
                    <div className={`${classes.card} p-6 rounded-lg shadow`}>
                        <p className={`text-sm ${classes.text} opacity-70`}>Taxa de Conversão</p>
                        <p className={`text-3xl font-bold ${classes.success}`}>
                            {data?.conversion?.conversion_rate || 0}%
                        </p>
                    </div>
                    <div className={`${classes.card} p-6 rounded-lg shadow`}>
                        <p className={`text-sm ${classes.text} opacity-70`}>Leads Gerados</p>
                        <p className={`text-3xl font-bold ${classes.warning}`}>
                            {formatNumber(data?.conversion?.converted)}
                        </p>
                    </div>
                </div>

                {/* Gráficos */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Visitantes por dia */}
                    <div className={`${classes.card} p-6 rounded-lg shadow`}>
                        <h2 className={`text-lg font-bold mb-4 ${classes.text}`}>Visitantes por Dia</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={data?.daily}>
                                <CartesianGrid strokeDasharray="3 3" stroke={classes.chartGrid} />
                                <XAxis dataKey="date" stroke={classes.chartText} />
                                <YAxis stroke={classes.chartText} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend wrapperStyle={{ color: classes.chartText }} />
                                <Line type="monotone" dataKey="new_visitors" name="Novos Visitantes" stroke="#8884d8" />
                                <Line type="monotone" dataKey="visits" name="Visitas" stroke="#82ca9d" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Por dispositivo */}
                    <div className={`${classes.card} p-6 rounded-lg shadow`}>
                        <h2 className={`text-lg font-bold mb-4 ${classes.text}`}>Dispositivos</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={data?.byDevice}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="total"
                                    nameKey="device_type"
                                >
                                    {data?.byDevice?.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend wrapperStyle={{ color: classes.chartText }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Por navegador */}
                    <div className={`${classes.card} p-6 rounded-lg shadow`}>
                        <h2 className={`text-lg font-bold mb-4 ${classes.text}`}>Navegadores</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={data?.byBrowser} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke={classes.chartGrid} />
                                <XAxis type="number" stroke={classes.chartText} />
                                <YAxis type="category" dataKey="browser" stroke={classes.chartText} width={100} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="total" name="Visitantes" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Por país */}
                    <div className={`${classes.card} p-6 rounded-lg shadow`}>
                        <h2 className={`text-lg font-bold mb-4 ${classes.text}`}>Origem Geográfica</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={data?.byCountry} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke={classes.chartGrid} />
                                <XAxis type="number" stroke={classes.chartText} />
                                <YAxis type="category" dataKey="country" stroke={classes.chartText} width={100} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="total" name="Visitantes" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Páginas mais visitadas */}
                <div className={`${classes.card} p-6 rounded-lg shadow mb-8`}>
                    <h2 className={`text-lg font-bold mb-4 ${classes.text}`}>Páginas Mais Visitadas</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className={classes.tableHeader}>
                                    <th className={`text-left py-2 px-4 ${classes.text}`}>Página</th>
                                    <th className={`text-right py-2 px-4 ${classes.text}`}>Visualizações</th>
                                    <th className={`text-right py-2 px-4 ${classes.text}`}>Visitantes Únicos</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.topPages?.map(page => (
                                    <tr key={page.page_url} className={`border-t ${classes.border} ${classes.tableRow}`}>
                                        <td className={`py-2 px-4 ${classes.text}`}>{page.page_url || '/'}</td>
                                        <td className={`py-2 px-4 text-right ${classes.text}`}>{formatNumber(page.views)}</td>
                                        <td className={`py-2 px-4 text-right ${classes.text}`}>{formatNumber(page.unique_visitors)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Últimos Visitantes */}
                <div className={`${classes.card} p-6 rounded-lg shadow`}>
                    <h2 className={`text-lg font-bold mb-4 ${classes.text}`}>Últimos Visitantes</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className={classes.tableHeader}>
                                    <th className={`text-left py-2 px-4 ${classes.text}`}>Navegador/OS</th>
                                    <th className={`text-left py-2 px-4 ${classes.text}`}>Localização</th>
                                    <th className={`text-right py-2 px-4 ${classes.text}`}>Visitas</th>
                                    <th className={`text-left py-2 px-4 ${classes.text}`}>Último Acesso</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.recent?.map(visitor => (
                                    <tr key={visitor.id} className={`border-t ${classes.border} ${classes.tableRow} cursor-pointer`}
                                        onClick={() => setSelectedVisitor(visitor)}>
                                        <td className={`py-2 px-4 ${classes.text}`}>
                                            {visitor.browser} / {visitor.os}
                                        </td>
                                        <td className={`py-2 px-4 ${classes.text}`}>
                                            {visitor.city ? `${visitor.city}, ${visitor.state}` : visitor.country || 'Desconhecido'}
                                        </td>
                                        <td className={`py-2 px-4 text-right ${classes.text}`}>{visitor.visit_count}</td>
                                        <td className={`py-2 px-4 ${classes.text}`}>
                                            {new Date(visitor.last_visit).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal de Detalhes do Visitante */}
            {selectedVisitor && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className={`${classes.modalBg} rounded-lg p-6 w-[500px] max-h-[90vh] overflow-y-auto shadow-xl`}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className={`text-xl font-bold ${classes.text}`}>Detalhes do Visitante</h3>
                            <button onClick={() => setSelectedVisitor(null)} className="text-gray-500 hover:text-gray-700">✕</button>
                        </div>
                        
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-2">
                                <span className="font-semibold">ID da Sessão:</span>
                                <span className="font-mono text-sm break-all">{selectedVisitor.session_id}</span>
                                
                                <span className="font-semibold">Navegador:</span>
                                <span>{selectedVisitor.browser}</span>
                                
                                <span className="font-semibold">Sistema Operacional:</span>
                                <span>{selectedVisitor.os}</span>
                                
                                <span className="font-semibold">Dispositivo:</span>
                                <span>{selectedVisitor.device_type}</span>
                                
                                <span className="font-semibold">Localização:</span>
                                <span>{selectedVisitor.city ? `${selectedVisitor.city}, ${selectedVisitor.state}` : selectedVisitor.country || 'Desconhecido'}</span>
                                
                                <span className="font-semibold">Primeira Visita:</span>
                                <span>{new Date(selectedVisitor.first_visit).toLocaleString()}</span>
                                
                                <span className="font-semibold">Última Visita:</span>
                                <span>{new Date(selectedVisitor.last_visit).toLocaleString()}</span>
                                
                                <span className="font-semibold">Total de Visitas:</span>
                                <span>{selectedVisitor.visit_count}</span>
                                
                                <span className="font-semibold">Origem:</span>
                                <span>{selectedVisitor.referrer_url || 'Direto'}</span>
                            </div>
                        </div>
                        
                        <button
                            onClick={() => setSelectedVisitor(null)}
                            className={`w-full mt-6 py-2 rounded ${classes.button}`}
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
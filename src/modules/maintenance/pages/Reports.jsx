import React, { useState, useEffect, useRef } from 'react';
import api from '../../../services/api';
import { useTheme } from '../../../context/ThemeContext';
import ThemeToggle from '../../../components/ThemeToggle';
import ExportPDF from '../components/ExportPDF';
import { OSStatusChart, MonthlyCostsChart, TopMaterialsChart, TopEquipmentChart } from '../components/Charts';

export default function MaintenanceReports() {
    const [period, setPeriod] = useState({
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        year: new Date().getFullYear()
    });
    const [statusData, setStatusData] = useState(null);
    const [costsData, setCostsData] = useState([]);
    const [topMaterials, setTopMaterials] = useState([]);
    const [topEquipment, setTopEquipment] = useState([]);
    const [loading, setLoading] = useState(true);
    const reportRef = useRef(null);
    const { theme } = useTheme();

    useEffect(() => {
        loadData();
    }, [period]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [statusRes, costsRes, materialsRes, equipmentRes] = await Promise.all([
                api.get('/maintenance/reports/os-by-status', { params: { startDate: period.startDate, endDate: period.endDate } }),
                api.get('/maintenance/reports/monthly-costs', { params: { year: period.year } }),
                api.get('/maintenance/reports/top-materials', { params: { startDate: period.startDate, endDate: period.endDate, limit: 10 } }),
                api.get('/maintenance/reports/top-equipment', { params: { startDate: period.startDate, endDate: period.endDate, limit: 10 } })
            ]);
            
            const aggregated = {
                abertas: 0, em_andamento: 0, concluidas: 0, canceladas: 0
            };
            statusRes.data.forEach(item => {
                if (item.status === 'aberta') aggregated.abertas = item.total;
                else if (item.status === 'em_andamento') aggregated.em_andamento = item.total;
                else if (item.status === 'concluida') aggregated.concluidas = item.total;
                else if (item.status === 'cancelada') aggregated.canceladas = item.total;
            });
            setStatusData(aggregated);
            setCostsData(costsRes.data);
            setTopMaterials(materialsRes.data);
            setTopEquipment(equipmentRes.data);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        } finally {
            setLoading(false);
        }
    };

    const getThemeClasses = () => {
        if (theme === 'dracula') {
            return {
                card: 'bg-[#44475a]',
                text: 'text-[#f8f8f2]',
                border: 'border-[#6272a4]',
                header: 'border-b border-[#6272a4]'
            };
        }
        if (theme === 'dark') {
            return {
                card: 'bg-gray-800',
                text: 'text-white',
                border: 'border-gray-700',
                header: 'border-b border-gray-700'
            };
        }
        return {
            card: 'bg-white',
            text: 'text-gray-900',
            border: 'border-gray-200',
            header: 'border-b border-gray-200'
        };
    };

    const classes = getThemeClasses();

    const totalOS = (statusData?.abertas || 0) + (statusData?.em_andamento || 0) + 
                    (statusData?.concluidas || 0) + (statusData?.canceladas || 0);
    const taxaConclusao = ((statusData?.concluidas || 0) / (totalOS - (statusData?.canceladas || 0)) * 100 || 0).toFixed(1);
    const custoMedio = (costsData.reduce((sum, c) => sum + c.custo_mao_obra + c.custo_materiais, 0) / (statusData?.concluidas || 1) || 0).toFixed(2);
    const eficiencia = ((statusData?.concluidas || 0) / totalOS * 100 || 0).toFixed(1);

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
                        Relatórios e Indicadores
                    </h1>
                    
                    <div className="flex items-center space-x-4">
                        <div className="flex space-x-2">
                            <input
                                type="date"
                                value={period.startDate}
                                onChange={(e) => setPeriod({...period, startDate: e.target.value})}
                                className={`px-3 py-2 border rounded ${classes.border} ${classes.text} bg-white dark:bg-gray-700`}
                            />
                            <input
                                type="date"
                                value={period.endDate}
                                onChange={(e) => setPeriod({...period, endDate: e.target.value})}
                                className={`px-3 py-2 border rounded ${classes.border} ${classes.text} bg-white dark:bg-gray-700`}
                            />
                            <input
                                type="number"
                                value={period.year}
                                onChange={(e) => setPeriod({...period, year: parseInt(e.target.value)})}
                                className={`px-3 py-2 border rounded w-24 ${classes.border} ${classes.text} bg-white dark:bg-gray-700`}
                            />
                        </div>
                        
                        <ExportPDF 
                            targetRef={reportRef} 
                            fileName="relatorio-manutencao"
                            title="Relatório de Manutenção"
                        />
                    </div>
                </div>

                {/* Conteúdo do Relatório */}
                <div ref={reportRef}>
                    {/* Cabeçalho do Relatório */}
                    <div className={`${classes.card} p-6 rounded-lg shadow mb-6`}>
                        <div className="text-center">
                            <h2 className={`text-2xl font-bold ${classes.text}`}>Relatório de Manutenção</h2>
                            <p className={`${classes.text} opacity-70 mt-2`}>
                                Período: {new Date(period.startDate).toLocaleDateString()} a {new Date(period.endDate).toLocaleDateString()}
                            </p>
                            <p className={`${classes.text} opacity-70`}>
                                Gerado em: {new Date().toLocaleString()}
                            </p>
                        </div>
                    </div>

                    {/* Cards de Resumo */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        <div className={`${classes.card} p-4 rounded-lg shadow text-center`}>
                            <p className={`text-sm ${classes.text} opacity-70`}>Total de OS no Período</p>
                            <p className={`text-2xl font-bold ${classes.text}`}>{totalOS}</p>
                        </div>
                        <div className={`${classes.card} p-4 rounded-lg shadow text-center`}>
                            <p className={`text-sm ${classes.text} opacity-70`}>Taxa de Conclusão</p>
                            <p className={`text-2xl font-bold text-green-600`}>{taxaConclusao}%</p>
                        </div>
                        <div className={`${classes.card} p-4 rounded-lg shadow text-center`}>
                            <p className={`text-sm ${classes.text} opacity-70`}>Custo Médio por OS</p>
                            <p className={`text-2xl font-bold ${classes.text}`}>R$ {custoMedio}</p>
                        </div>
                        <div className={`${classes.card} p-4 rounded-lg shadow text-center`}>
                            <p className={`text-sm ${classes.text} opacity-70`}>Eficiência</p>
                            <p className={`text-2xl font-bold text-blue-600`}>{eficiencia}%</p>
                        </div>
                    </div>

                    {/* Gráficos */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        <div className={`${classes.card} p-6 rounded-lg shadow`}>
                            <h2 className={`text-lg font-bold mb-4 ${classes.text}`}>OS por Status</h2>
                            <OSStatusChart data={statusData} />
                            <div className={`mt-4 pt-4 ${classes.header}`}>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className={classes.text}>Abertas:</span>
                                        <span className={`font-bold ${classes.text}`}>{statusData?.abertas || 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className={classes.text}>Em Andamento:</span>
                                        <span className={`font-bold ${classes.text}`}>{statusData?.em_andamento || 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className={classes.text}>Concluídas:</span>
                                        <span className={`font-bold ${classes.text}`}>{statusData?.concluidas || 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className={classes.text}>Canceladas:</span>
                                        <span className={`font-bold ${classes.text}`}>{statusData?.canceladas || 0}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className={`${classes.card} p-6 rounded-lg shadow`}>
                            <h2 className={`text-lg font-bold mb-4 ${classes.text}`}>Custos Mensais</h2>
                            <MonthlyCostsChart data={costsData} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        <div className={`${classes.card} p-6 rounded-lg shadow`}>
                            <h2 className={`text-lg font-bold mb-4 ${classes.text}`}>Top 10 Materiais Mais Utilizados</h2>
                            <TopMaterialsChart data={topMaterials} />
                            <div className={`mt-4 pt-4 ${classes.header}`}>
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className={`text-left py-1 ${classes.text}`}>Material</th>
                                            <th className={`text-right py-1 ${classes.text}`}>Quantidade</th>
                                            <th className={`text-right py-1 ${classes.text}`}>Custo</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {topMaterials.slice(0, 5).map(mat => (
                                            <tr key={mat.id} className="border-b">
                                                <td className={`py-1 ${classes.text}`}>{mat.name}</td>
                                                <td className={`py-1 text-right ${classes.text}`}>{mat.total_quantidade}</td>
                                                <td className={`py-1 text-right ${classes.text}`}>R$ {mat.total_custo.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        
                        <div className={`${classes.card} p-6 rounded-lg shadow`}>
                            <h2 className={`text-lg font-bold mb-4 ${classes.text}`}>Top 10 Equipamentos com Mais OS</h2>
                            <TopEquipmentChart data={topEquipment} />
                            <div className={`mt-4 pt-4 ${classes.header}`}>
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className={`text-left py-1 ${classes.text}`}>Equipamento</th>
                                            <th className={`text-right py-1 ${classes.text}`}>Total OS</th>
                                            <th className={`text-right py-1 ${classes.text}`}>Concluídas</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {topEquipment.slice(0, 5).map(eq => (
                                            <tr key={eq.id} className="border-b">
                                                <td className={`py-1 ${classes.text}`}>{eq.name}</td>
                                                <td className={`py-1 text-right ${classes.text}`}>{eq.total_os}</td>
                                                <td className={`py-1 text-right ${classes.text}`}>{eq.concluidas}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
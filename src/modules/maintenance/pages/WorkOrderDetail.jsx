import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import { useTheme } from '../../../context/ThemeContext';
import ThemeToggle from '../../../components/ThemeToggle';

export default function WorkOrderDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [workOrder, setWorkOrder] = useState(null);
    const [materials, setMaterials] = useState([]);
    const [allMaterials, setAllMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showMaterialForm, setShowMaterialForm] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState('');
    const [materialQuantity, setMaterialQuantity] = useState(1);
    const [materialPrice, setMaterialPrice] = useState(0);
    const [addingMaterial, setAddingMaterial] = useState(false);
    const { theme } = useTheme();

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            const [orderRes, materialsRes, allMaterialsRes] = await Promise.all([
                api.get(`/maintenance/work-orders/${id}`),
                api.get(`/maintenance/work-orders/${id}/materials`),
                api.get('/maintenance/materials')
            ]);
            setWorkOrder(orderRes.data);
            setMaterials(materialsRes.data);
            setAllMaterials(allMaterialsRes.data.filter(m => m.current_stock > 0));
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddMaterial = async (e) => {
        e.preventDefault();
        if (!selectedMaterial || materialQuantity <= 0) return;

        setAddingMaterial(true);
        try {
            await api.post(`/maintenance/work-orders/${id}/materials`, {
                material_id: selectedMaterial,
                quantity: materialQuantity,
                unit_price: materialPrice
            });
            loadData();
            setShowMaterialForm(false);
            setSelectedMaterial('');
            setMaterialQuantity(1);
            setMaterialPrice(0);
        } catch (error) {
            alert(error.response?.data?.error || 'Erro ao adicionar material');
        } finally {
            setAddingMaterial(false);
        }
    };

    const handleRemoveMaterial = async (materialId) => {
        if (!confirm('Remover este material da OS?')) return;
        try {
            await api.delete(`/maintenance/work-orders/${id}/materials/${materialId}`);
            loadData();
        } catch (error) {
            alert(error.response?.data?.error || 'Erro ao remover material');
        }
    };

    const handleStart = async () => {
        try {
            await api.post(`/maintenance/work-orders/${id}/start`);
            loadData();
        } catch (error) {
            alert(error.response?.data?.error || 'Erro ao iniciar OS');
        }
    };

    const handleComplete = async () => {
        const findings = prompt('Constatações da execução:');
        if (!findings) return;

        const totalHours = prompt('Horas trabalhadas:');
        if (!totalHours) return;

        try {
            await api.post(`/maintenance/work-orders/${id}/complete`, {
                findings,
                recommendations: '',
                total_hours: parseFloat(totalHours),
                actual_cost: workOrder?.actual_cost || 0
            });
            loadData();
        } catch (error) {
            alert(error.response?.data?.error || 'Erro ao concluir OS');
        }
    };

    const handleCancel = async () => {
        const reason = prompt('Motivo do cancelamento:');
        if (!reason) return;
        try {
            await api.post(`/maintenance/work-orders/${id}/cancel`, { reason });
            navigate('/maintenance/work-orders');
        } catch (error) {
            alert(error.response?.data?.error || 'Erro ao cancelar OS');
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value || 0);
    };

    const getThemeClasses = () => {
        if (theme === 'dracula') {
            return {
                card: 'bg-[#44475a]',
                text: 'text-[#f8f8f2]',
                border: 'border-[#6272a4]',
                input: 'bg-[#282a36] border-[#6272a4] text-[#f8f8f2] placeholder-[#6272a4]',
                button: 'bg-[#bd93f9] hover:bg-[#ff79c6] text-white',
                cancelButton: 'bg-[#6272a4] hover:bg-[#44475a] text-[#f8f8f2]',
                success: 'bg-[#50fa7b] text-[#282a36]',
                warning: 'bg-[#f1fa8c] text-[#282a36]',
                danger: 'bg-[#ff5555] text-white'
            };
        }
        if (theme === 'dark') {
            return {
                card: 'bg-gray-800',
                text: 'text-white',
                border: 'border-gray-700',
                input: 'bg-gray-700 border-gray-600 text-white placeholder-gray-400',
                button: 'bg-blue-600 hover:bg-blue-700 text-white',
                cancelButton: 'bg-gray-600 hover:bg-gray-500 text-white',
                success: 'bg-green-600 text-white',
                warning: 'bg-yellow-600 text-white',
                danger: 'bg-red-600 text-white'
            };
        }
        return {
            card: 'bg-white',
            text: 'text-gray-900',
            border: 'border-gray-200',
            input: 'bg-white border-gray-300 text-gray-900 placeholder-gray-400',
            button: 'bg-blue-600 hover:bg-blue-700 text-white',
            cancelButton: 'bg-gray-500 hover:bg-gray-600 text-white',
            success: 'bg-green-100 text-green-700',
            warning: 'bg-yellow-100 text-yellow-700',
            danger: 'bg-red-100 text-red-700'
        };
    };

    const classes = getThemeClasses();

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                <ThemeToggle />
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!workOrder) {
        return (
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pt-20">
                <div className="max-w-7xl mx-auto px-4">
                    <div className={`${classes.card} p-8 rounded-lg text-center`}>
                        <p className={classes.text}>Ordem de serviço não encontrada</p>
                        <button
                            onClick={() => navigate('/maintenance/work-orders')}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
                        >
                            Voltar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const totalMaterialsCost = materials.reduce((sum, m) => sum + m.total_price, 0);
    const totalCost = (workOrder.actual_cost || 0) + totalMaterialsCost;

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pt-20 pb-8">
            <ThemeToggle />
            
            <div className="max-w-7xl mx-auto px-4">
                {/* Header com ações */}
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className={`text-3xl font-bold ${classes.text}`}>{workOrder.title}</h1>
                        <p className={`${classes.text} opacity-70`}>OS #{workOrder.id}</p>
                    </div>
                    <div className="flex space-x-3">
                        {workOrder.status === 'aberta' && (
                            <>
                                <button
                                    onClick={handleStart}
                                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                >
                                    Iniciar OS
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                >
                                    Cancelar
                                </button>
                            </>
                        )}
                        {workOrder.status === 'em_andamento' && (
                            <button
                                onClick={handleComplete}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Concluir OS
                            </button>
                        )}
                    </div>
                </div>

                {/* Informações da OS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className={`${classes.card} p-6 rounded-lg shadow`}>
                        <h2 className={`text-xl font-bold mb-4 ${classes.text}`}>Informações Gerais</h2>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className={classes.text}>Equipamento:</span>
                                <span className={`font-medium ${classes.text}`}>{workOrder.equipment_name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className={classes.text}>Tipo:</span>
                                <span className={`font-medium ${classes.text}`}>{workOrder.type}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className={classes.text}>Prioridade:</span>
                                <span className={`font-medium ${classes.text}`}>{workOrder.priority}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className={classes.text}>Status:</span>
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                    workOrder.status === 'aberta' ? classes.warning :
                                    workOrder.status === 'em_andamento' ? classes.success :
                                    workOrder.status === 'concluida' ? 'bg-green-100 text-green-800' :
                                    classes.danger
                                }`}>
                                    {workOrder.status?.replace('_', ' ')}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className={classes.text}>Responsável:</span>
                                <span className={`font-medium ${classes.text}`}>{workOrder.assigned_to_name || 'Não atribuído'}</span>
                            </div>
                        </div>
                    </div>

                    <div className={`${classes.card} p-6 rounded-lg shadow`}>
                        <h2 className={`text-xl font-bold mb-4 ${classes.text}`}>Custos</h2>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className={classes.text}>Mão de Obra:</span>
                                <span className={`font-medium ${classes.text}`}>{formatCurrency(workOrder.actual_cost || 0)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className={classes.text}>Materiais:</span>
                                <span className={`font-medium ${classes.text}`}>{formatCurrency(totalMaterialsCost)}</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t">
                                <span className={`font-bold ${classes.text}`}>Total:</span>
                                <span className={`font-bold text-lg ${classes.text}`}>{formatCurrency(totalCost)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Descrição */}
                <div className={`${classes.card} p-6 rounded-lg shadow mb-8`}>
                    <h2 className={`text-xl font-bold mb-4 ${classes.text}`}>Descrição</h2>
                    <p className={classes.text}>{workOrder.description}</p>
                </div>

                {/* Materiais Utilizados */}
                <div className={`${classes.card} p-6 rounded-lg shadow`}>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className={`text-xl font-bold ${classes.text}`}>Materiais Utilizados</h2>
                        {workOrder.status === 'em_andamento' && (
                            <button
                                onClick={() => setShowMaterialForm(true)}
                                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                            >
                                + Adicionar Material
                            </button>
                        )}
                    </div>

                    {materials.length === 0 ? (
                        <p className={`text-center py-8 ${classes.text} opacity-70`}>
                            Nenhum material utilizado nesta OS
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className={`text-left py-2 ${classes.text}`}>Material</th>
                                        <th className={`text-left py-2 ${classes.text}`}>Código</th>
                                        <th className={`text-right py-2 ${classes.text}`}>Quantidade</th>
                                        <th className={`text-right py-2 ${classes.text}`}>Vlr Unit</th>
                                        <th className={`text-right py-2 ${classes.text}`}>Total</th>
                                        {workOrder.status === 'em_andamento' && (
                                            <th className={`text-center py-2 ${classes.text}`}>Ações</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {materials.map(mat => (
                                        <tr key={mat.id} className="border-b">
                                            <td className={`py-2 ${classes.text}`}>{mat.material_name}</td>
                                            <td className={`py-2 ${classes.text}`}>{mat.material_code}</td>
                                            <td className={`py-2 text-right ${classes.text}`}>{mat.quantity} {mat.unit}</td>
                                            <td className={`py-2 text-right ${classes.text}`}>{formatCurrency(mat.unit_price)}</td>
                                            <td className={`py-2 text-right ${classes.text}`}>{formatCurrency(mat.total_price)}</td>
                                            {workOrder.status === 'em_andamento' && (
                                                <td className="py-2 text-center">
                                                    <button
                                                        onClick={() => handleRemoveMaterial(mat.material_id)}
                                                        className="text-red-600 hover:text-red-800"
                                                        title="Remover"
                                                    >
                                                        🗑️
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="border-t font-bold">
                                        <td colSpan="4" className={`py-2 text-right ${classes.text}`}>Total:</td>
                                        <td className={`py-2 text-right ${classes.text}`}>{formatCurrency(totalMaterialsCost)}</td>
                                        {workOrder.status === 'em_andamento' && <td></td>}
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    )}
                </div>

                {/* Modal Adicionar Material */}
                {showMaterialForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className={`${classes.card} rounded-lg p-6 w-96`}>
                            <h3 className={`text-xl font-bold mb-4 ${classes.text}`}>Adicionar Material</h3>
                            <form onSubmit={handleAddMaterial} className="space-y-4">
                                <div>
                                    <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                        Material *
                                    </label>
                                    <select
                                        className={`w-full p-2 border rounded focus:outline-none focus:ring-2 ${classes.input}`}
                                        value={selectedMaterial}
                                        onChange={(e) => {
                                            setSelectedMaterial(e.target.value);
                                            const mat = allMaterials.find(m => m.id === parseInt(e.target.value));
                                            if (mat) setMaterialPrice(mat.cost_price || 0);
                                        }}
                                        required
                                    >
                                        <option value="">Selecione</option>
                                        {allMaterials.map(mat => (
                                            <option key={mat.id} value={mat.id}>
                                                {mat.name} ({mat.code}) - Estoque: {mat.current_stock} {mat.unit}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                        Quantidade *
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        step="1"
                                        className={`w-full p-2 border rounded focus:outline-none focus:ring-2 ${classes.input}`}
                                        value={materialQuantity}
                                        onChange={(e) => setMaterialQuantity(parseInt(e.target.value))}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                        Preço Unitário (R$)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className={`w-full p-2 border rounded focus:outline-none focus:ring-2 ${classes.input}`}
                                        value={materialPrice}
                                        onChange={(e) => setMaterialPrice(parseFloat(e.target.value))}
                                    />
                                </div>

                                <div className="flex space-x-3 pt-4">
                                    <button
                                        type="submit"
                                        disabled={addingMaterial}
                                        className={`flex-1 py-2 rounded ${classes.button} disabled:opacity-50`}
                                    >
                                        {addingMaterial ? 'Adicionando...' : 'Adicionar'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowMaterialForm(false)}
                                        className={`flex-1 py-2 rounded ${classes.cancelButton}`}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
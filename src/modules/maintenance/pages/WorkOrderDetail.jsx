import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import { useTheme } from '../../../context/ThemeContext';
import ThemeToggle from '../../../components/ThemeToggle';

export default function WorkOrderDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [workOrder, setWorkOrder] = useState(null);
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [completionData, setCompletionData] = useState({
        findings: '',
        recommendations: '',
        total_hours: '',
        actual_cost: '',
        checklist_items: [],
        materials_used: []
    });
    const [showCompletionForm, setShowCompletionForm] = useState(false);
    const { theme } = useTheme();

    useEffect(() => {
        loadWorkOrder();
        loadMaterials();
    }, [id]);

    const loadWorkOrder = async () => {
        try {
            const response = await api.get(`/maintenance/work-orders/${id}`);
            setWorkOrder(response.data);
            
            // Preparar checklist se existir
            if (response.data.checklist) {
                setCompletionData(prev => ({
                    ...prev,
                    checklist_items: response.data.checklist.map(item => ({
                        ...item,
                        actual: item.actual_result || '',
                        status: item.status || 'ok'
                    }))
                }));
            }
        } catch (error) {
            console.error('Erro ao carregar OS:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadMaterials = async () => {
        try {
            const response = await api.get('/maintenance/materials');
            setMaterials(response.data);
        } catch (error) {
            console.error('Erro ao carregar materiais:', error);
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

    const getStatusColor = (status) => {
        const colors = {
            aberta: 'bg-blue-100 text-blue-800',
            planejada: 'bg-purple-100 text-purple-800',
            em_andamento: 'bg-yellow-100 text-yellow-800',
            aguardando_pecas: 'bg-orange-100 text-orange-800',
            concluida: 'bg-green-100 text-green-800',
            cancelada: 'bg-gray-100 text-gray-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const handleStart = async () => {
        try {
            await api.post(`/maintenance/work-orders/${id}/start`);
            loadWorkOrder();
        } catch (error) {
            alert(error.response?.data?.error || 'Erro ao iniciar OS');
        }
    };

    const handleCancel = async () => {
        const reason = prompt('Motivo do cancelamento:');
        if (!reason) return;

        try {
            await api.post(`/maintenance/work-orders/${id}/cancel`, { reason });
            loadWorkOrder();
        } catch (error) {
            alert(error.response?.data?.error || 'Erro ao cancelar OS');
        }
    };

    const addChecklistItem = () => {
        setCompletionData(prev => ({
            ...prev,
            checklist_items: [
                ...prev.checklist_items,
                { item: '', expected: '', actual: '', status: 'ok', observations: '' }
            ]
        }));
    };

    const updateChecklistItem = (index, field, value) => {
        const updated = [...completionData.checklist_items];
        updated[index][field] = value;
        setCompletionData(prev => ({ ...prev, checklist_items: updated }));
    };

    const removeChecklistItem = (index) => {
        setCompletionData(prev => ({
            ...prev,
            checklist_items: prev.checklist_items.filter((_, i) => i !== index)
        }));
    };

    const addMaterial = () => {
        setCompletionData(prev => ({
            ...prev,
            materials_used: [
                ...prev.materials_used,
                { material_id: '', quantity: 1, unit_price: 0 }
            ]
        }));
    };

    const updateMaterial = (index, field, value) => {
        const updated = [...completionData.materials_used];
        updated[index][field] = value;
        
        // Se mudou material, buscar preço
        if (field === 'material_id') {
            const material = materials.find(m => m.id === parseInt(value));
            if (material) {
                updated[index].unit_price = material.cost_price || 0;
            }
        }
        
        setCompletionData(prev => ({ ...prev, materials_used: updated }));
    };

    const removeMaterial = (index) => {
        setCompletionData(prev => ({
            ...prev,
            materials_used: prev.materials_used.filter((_, i) => i !== index)
        }));
    };

    const calculateTotalCost = () => {
        const materialsCost = completionData.materials_used.reduce(
            (sum, m) => sum + (m.quantity * m.unit_price), 0
        );
        return materialsCost + (parseFloat(completionData.actual_cost) || 0);
    };

    const handleComplete = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/maintenance/work-orders/${id}/complete`, completionData);
            loadWorkOrder();
            setShowCompletionForm(false);
        } catch (error) {
            alert(error.response?.data?.error || 'Erro ao concluir OS');
        }
    };

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

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pt-20 pb-8">
            <ThemeToggle />
            
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
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
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                >
                                    Iniciar OS
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                >
                                    Cancelar
                                </button>
                            </>
                        )}
                        {workOrder.status === 'em_andamento' && (
                            <button
                                onClick={() => setShowCompletionForm(true)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Concluir OS
                            </button>
                        )}
                    </div>
                </div>

                {/* Status */}
                <div className={`${classes.card} p-6 rounded-lg shadow mb-8`}>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <p className={`text-sm ${classes.text} opacity-70`}>Status</p>
                            <span className={`mt-1 px-2 py-1 text-xs rounded-full ${getStatusColor(workOrder.status)}`}>
                                {workOrder.status?.replace('_', ' ')}
                            </span>
                        </div>
                        <div>
                            <p className={`text-sm ${classes.text} opacity-70`}>Prioridade</p>
                            <p className={`text-lg font-bold ${classes.text}`}>{workOrder.priority}</p>
                        </div>
                        <div>
                            <p className={`text-sm ${classes.text} opacity-70`}>Tipo</p>
                            <p className={`text-lg font-bold ${classes.text}`}>{workOrder.type}</p>
                        </div>
                        <div>
                            <p className={`text-sm ${classes.text} opacity-70`}>Responsável</p>
                            <p className={`text-lg font-bold ${classes.text}`}>{workOrder.assigned_to_name || 'Não atribuído'}</p>
                        </div>
                    </div>
                </div>

                {/* Informações do Equipamento */}
                <div className={`${classes.card} p-6 rounded-lg shadow mb-8`}>
                    <h2 className={`text-xl font-bold mb-4 ${classes.text}`}>Equipamento</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className={`text-sm ${classes.text} opacity-70`}>Nome</p>
                            <p className={`text-lg font-bold ${classes.accent}`}>{workOrder.equipment_name}</p>
                        </div>
                        <div>
                            <p className={`text-sm ${classes.text} opacity-70`}>Série</p>
                            <p className={`text-lg font-bold ${classes.text}`}>{workOrder.serial_number}</p>
                        </div>
                        <div>
                            <p className={`text-sm ${classes.text} opacity-70`}>Modelo</p>
                            <p className={classes.text}>{workOrder.model || 'N/A'}</p>
                        </div>
                        <div>
                            <p className={`text-sm ${classes.text} opacity-70`}>Fabricante</p>
                            <p className={classes.text}>{workOrder.manufacturer || 'N/A'}</p>
                        </div>
                    </div>
                </div>

                {/* Descrição */}
                <div className={`${classes.card} p-6 rounded-lg shadow mb-8`}>
                    <h2 className={`text-xl font-bold mb-4 ${classes.text}`}>Descrição</h2>
                    <p className={classes.text}>{workOrder.description}</p>
                </div>

                {/* Materiais Utilizados (se já concluída) */}
                {workOrder.materials && workOrder.materials.length > 0 && (
                    <div className={`${classes.card} p-6 rounded-lg shadow mb-8`}>
                        <h2 className={`text-xl font-bold mb-4 ${classes.text}`}>Materiais Utilizados</h2>
                        <table className="min-w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className={`text-left py-2 ${classes.text}`}>Material</th>
                                    <th className={`text-left py-2 ${classes.text}`}>Código</th>
                                    <th className={`text-right py-2 ${classes.text}`}>Qtd</th>
                                    <th className={`text-right py-2 ${classes.text}`}>Vlr Unit</th>
                                    <th className={`text-right py-2 ${classes.text}`}>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {workOrder.materials.map((item, idx) => (
                                    <tr key={idx} className="border-b">
                                        <td className={`py-2 ${classes.text}`}>{item.material_name}</td>
                                        <td className={`py-2 ${classes.text}`}>{item.material_code}</td>
                                        <td className={`py-2 text-right ${classes.text}`}>{item.quantity}</td>
                                        <td className={`py-2 text-right ${classes.text}`}>R$ {item.unit_price}</td>
                                        <td className={`py-2 text-right ${classes.text}`}>R$ {item.total_price}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Checklist (se já concluída) */}
                {workOrder.checklist && workOrder.checklist.length > 0 && (
                    <div className={`${classes.card} p-6 rounded-lg shadow mb-8`}>
                        <h2 className={`text-xl font-bold mb-4 ${classes.text}`}>Checklist Executado</h2>
                        <div className="space-y-3">
                            {workOrder.checklist.map((item, idx) => (
                                <div key={idx} className={`p-3 border rounded ${classes.border}`}>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <p className={`font-medium ${classes.text}`}>{item.item}</p>
                                            <p className={`text-sm ${classes.text} opacity-70`}>Esperado: {item.expected_result}</p>
                                            <p className={`text-sm ${classes.text}`}>Realizado: {item.actual_result}</p>
                                            {item.observations && (
                                                <p className={`text-sm ${classes.text} opacity-70`}>Obs: {item.observations}</p>
                                            )}
                                        </div>
                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                            item.status === 'ok' ? 'bg-green-100 text-green-800' : 
                                            item.status === 'falha' ? 'bg-red-100 text-red-800' : 
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {item.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Modal de Conclusão */}
            {showCompletionForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
                    <div className={`${classes.card} rounded-lg p-6 w-[800px] max-h-[90vh] overflow-y-auto m-4`}>
                        <h2 className={`text-xl font-bold mb-4 ${classes.text}`}>Concluir Ordem de Serviço</h2>
                        
                        <form onSubmit={handleComplete} className="space-y-6">
                            {/* Checklist */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className={`font-medium ${classes.text}`}>Checklist de Execução</label>
                                    <button
                                        type="button"
                                        onClick={addChecklistItem}
                                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                                    >
                                        + Adicionar Item
                                    </button>
                                </div>
                                
                                {completionData.checklist_items.map((item, index) => (
                                    <div key={index} className={`p-4 border rounded mb-3 ${classes.border}`}>
                                        <div className="flex justify-between mb-2">
                                            <h4 className={`font-medium ${classes.text}`}>Item {index + 1}</h4>
                                            <button
                                                type="button"
                                                onClick={() => removeChecklistItem(index)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                Remover
                                            </button>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-3">
                                            <input
                                                type="text"
                                                placeholder="Item a verificar"
                                                className={`p-2 border rounded ${classes.border} ${classes.text}`}
                                                value={item.item}
                                                onChange={(e) => updateChecklistItem(index, 'item', e.target.value)}
                                                required
                                            />
                                            <input
                                                type="text"
                                                placeholder="Resultado esperado"
                                                className={`p-2 border rounded ${classes.border} ${classes.text}`}
                                                value={item.expected}
                                                onChange={(e) => updateChecklistItem(index, 'expected', e.target.value)}
                                                required
                                            />
                                            <input
                                                type="text"
                                                placeholder="Resultado obtido"
                                                className={`p-2 border rounded ${classes.border} ${classes.text}`}
                                                value={item.actual}
                                                onChange={(e) => updateChecklistItem(index, 'actual', e.target.value)}
                                                required
                                            />
                                            <select
                                                className={`p-2 border rounded ${classes.border} ${classes.text}`}
                                                value={item.status}
                                                onChange={(e) => updateChecklistItem(index, 'status', e.target.value)}
                                            >
                                                <option value="ok">OK</option>
                                                <option value="falha">Falha</option>
                                                <option value="nao_aplicavel">Não Aplicável</option>
                                            </select>
                                            <input
                                                type="text"
                                                placeholder="Observações"
                                                className={`p-2 border rounded ${classes.border} ${classes.text} col-span-2`}
                                                value={item.observations || ''}
                                                onChange={(e) => updateChecklistItem(index, 'observations', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Materiais Utilizados */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className={`font-medium ${classes.text}`}>Materiais Utilizados</label>
                                    <button
                                        type="button"
                                        onClick={addMaterial}
                                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                                    >
                                        + Adicionar Material
                                    </button>
                                </div>
                                
                                {completionData.materials_used.map((material, index) => (
                                    <div key={index} className={`p-4 border rounded mb-3 ${classes.border}`}>
                                        <div className="flex justify-between mb-2">
                                            <h4 className={`font-medium ${classes.text}`}>Material {index + 1}</h4>
                                            <button
                                                type="button"
                                                onClick={() => removeMaterial(index)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                Remover
                                            </button>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-3">
                                            <select
                                                className={`p-2 border rounded ${classes.border} ${classes.text}`}
                                                value={material.material_id}
                                                onChange={(e) => updateMaterial(index, 'material_id', e.target.value)}
                                                required
                                            >
                                                <option value="">Selecione...</option>
                                                {materials.map(m => (
                                                    <option key={m.id} value={m.id}>
                                                        {m.name} (Est: {m.current_stock} {m.unit})
                                                    </option>
                                                ))}
                                            </select>
                                            <input
                                                type="number"
                                                placeholder="Quantidade"
                                                min="1"
                                                className={`p-2 border rounded ${classes.border} ${classes.text}`}
                                                value={material.quantity}
                                                onChange={(e) => updateMaterial(index, 'quantity', parseInt(e.target.value))}
                                                required
                                            />
                                            <input
                                                type="number"
                                                placeholder="Valor Unitário"
                                                step="0.01"
                                                className={`p-2 border rounded ${classes.border} ${classes.text}`}
                                                value={material.unit_price}
                                                onChange={(e) => updateMaterial(index, 'unit_price', parseFloat(e.target.value))}
                                                required
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Dados de Execução */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={`block font-medium mb-1 ${classes.text}`}>
                                        Horas Trabalhadas
                                    </label>
                                    <input
                                        type="number"
                                        step="0.5"
                                        className={`w-full p-2 border rounded ${classes.border} ${classes.text}`}
                                        value={completionData.total_hours}
                                        onChange={(e) => setCompletionData({...completionData, total_hours: e.target.value})}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className={`block font-medium mb-1 ${classes.text}`}>
                                        Custo Mão de Obra (R$)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className={`w-full p-2 border rounded ${classes.border} ${classes.text}`}
                                        value={completionData.actual_cost}
                                        onChange={(e) => setCompletionData({...completionData, actual_cost: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className={`block font-medium mb-1 ${classes.text}`}>
                                    Constatações / Achados
                                </label>
                                <textarea
                                    rows="3"
                                    className={`w-full p-2 border rounded ${classes.border} ${classes.text}`}
                                    value={completionData.findings}
                                    onChange={(e) => setCompletionData({...completionData, findings: e.target.value})}
                                    required
                                />
                            </div>

                            <div>
                                <label className={`block font-medium mb-1 ${classes.text}`}>
                                    Recomendações
                                </label>
                                <textarea
                                    rows="3"
                                    className={`w-full p-2 border rounded ${classes.border} ${classes.text}`}
                                    value={completionData.recommendations}
                                    onChange={(e) => setCompletionData({...completionData, recommendations: e.target.value})}
                                />
                            </div>

                            {/* Resumo de Custos */}
                            <div className={`p-4 border rounded ${classes.border}`}>
                                <h3 className={`font-bold mb-2 ${classes.text}`}>Resumo de Custos</h3>
                                <div className="space-y-1">
                                    <div className="flex justify-between">
                                        <span className={classes.text}>Materiais:</span>
                                        <span className={classes.text}>
                                            R$ {completionData.materials_used.reduce((sum, m) => sum + (m.quantity * m.unit_price), 0).toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className={classes.text}>Mão de Obra:</span>
                                        <span className={classes.text}>R$ {parseFloat(completionData.actual_cost || 0).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between font-bold pt-2 border-t">
                                        <span className={classes.text}>Total:</span>
                                        <span className={classes.accent}>R$ {calculateTotalCost().toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Concluir OS
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowCompletionForm(false)}
                                    className="flex-1 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
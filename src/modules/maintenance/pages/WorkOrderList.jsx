import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/api';
import { useTheme } from '../../../context/ThemeContext';
import ThemeToggle from '../../../components/ThemeToggle';

export default function WorkOrderList() {
    const [orders, setOrders] = useState([]);
    const [equipment, setEquipment] = useState([]);
    const [technicians, setTechnicians] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchCode, setSearchCode] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [showDetails, setShowDetails] = useState(null);
    const [formData, setFormData] = useState({
        equipment_id: '',
        title: '',
        description: '',
        type: 'corretiva',
        priority: 'media',
        scheduled_date: '',
        assigned_to: '',
        estimated_hours: '',
        cost_estimate: ''
    });
    const [formLoading, setFormLoading] = useState(false);
    const { theme } = useTheme();

    useEffect(() => {
        loadData();
    }, [searchCode]);

    const loadData = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (searchCode) params.append('code', searchCode);
            
            const [ordersRes, equipmentRes] = await Promise.all([
                api.get(`/maintenance/work-orders?${params}`),
                api.get('/maintenance/equipment')
            ]);
            setOrders(ordersRes.data);
            setEquipment(equipmentRes.data);
            
            const usersRes = await api.get('/admin/users');
            setTechnicians(usersRes.data.filter(u => u.role === 'colaborador' || u.role === 'admin'));
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClearSearch = () => {
        setSearchCode('');
    };

    const copyToClipboard = (code) => {
        navigator.clipboard.writeText(code);
        alert('Código copiado!');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            const response = await api.post('/maintenance/work-orders', formData);
            alert('Ordem de serviço criada com sucesso!');
            setShowForm(false);
            resetForm();
            loadData();
        } catch (error) {
            alert(error.response?.data?.error || 'Erro ao criar OS');
        } finally {
            setFormLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            equipment_id: '',
            title: '',
            description: '',
            type: 'corretiva',
            priority: 'media',
            scheduled_date: '',
            assigned_to: '',
            estimated_hours: '',
            cost_estimate: ''
        });
    };

    const getStatusColor = (status) => {
        if (theme === 'dracula') {
            const colors = {
                aberta: 'bg-[#6272a4] text-[#f8f8f2]',
                planejada: 'bg-[#bd93f9] text-[#282a36]',
                em_andamento: 'bg-[#f1fa8c] text-[#282a36]',
                aguardando_pecas: 'bg-[#ffb86c] text-[#282a36]',
                concluida: 'bg-[#50fa7b] text-[#282a36]',
                cancelada: 'bg-[#ff5555] text-[#f8f8f2]'
            };
            return colors[status] || 'bg-[#44475a] text-[#f8f8f2]';
        }
        const colors = {
            aberta: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
            planejada: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
            em_andamento: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
            aguardando_pecas: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
            concluida: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            cancelada: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getPriorityColor = (priority) => {
        if (theme === 'dracula') {
            const colors = {
                baixa: 'bg-[#6272a4] text-[#f8f8f2]',
                media: 'bg-[#50fa7b] text-[#282a36]',
                alta: 'bg-[#ffb86c] text-[#282a36]',
                urgente: 'bg-[#ff5555] text-[#f8f8f2]'
            };
            return colors[priority] || 'bg-[#44475a] text-[#f8f8f2]';
        }
        const colors = {
            baixa: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
            media: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            alta: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
            urgente: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        };
        return colors[priority] || 'bg-gray-100 text-gray-800';
    };

    const getThemeClasses = () => {
        if (theme === 'dracula') {
            return {
                card: 'bg-[#44475a]',
                text: 'text-[#f8f8f2]',
                border: 'border-[#6272a4]',
                code: 'font-mono text-sm text-[#bd93f9]',
                input: 'bg-[#282a36] border-[#6272a4] text-[#f8f8f2] placeholder-[#6272a4] focus:ring-[#bd93f9] focus:border-[#bd93f9]',
                select: 'bg-[#282a36] border-[#6272a4] text-[#f8f8f2]',
                button: 'bg-[#bd93f9] hover:bg-[#ff79c6] text-white',
                cancelButton: 'bg-[#6272a4] hover:bg-[#44475a] text-[#f8f8f2]',
                modalBg: 'bg-[#282a36]'
            };
        }
        if (theme === 'dark') {
            return {
                card: 'bg-gray-800',
                text: 'text-white',
                border: 'border-gray-700',
                code: 'font-mono text-sm text-blue-400',
                input: 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500',
                select: 'bg-gray-700 border-gray-600 text-white',
                button: 'bg-blue-600 hover:bg-blue-700 text-white',
                cancelButton: 'bg-gray-600 hover:bg-gray-500 text-white',
                modalBg: 'bg-gray-800'
            };
        }
        return {
            card: 'bg-white',
            text: 'text-gray-900',
            border: 'border-gray-200',
            code: 'font-mono text-sm text-blue-600',
            input: 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500',
            select: 'bg-white border-gray-300 text-gray-900',
            button: 'bg-blue-600 hover:bg-blue-700 text-white',
            cancelButton: 'bg-gray-500 hover:bg-gray-600 text-white',
            modalBg: 'bg-white'
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

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pt-20 pb-8">
            <ThemeToggle />
            
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <h1 className={`text-3xl font-bold ${classes.text}`}>
                        Ordens de Serviço
                    </h1>
                    <button
                        onClick={() => setShowForm(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        + Nova OS
                    </button>
                </div>

                {/* Busca por Código */}
                <div className={`${classes.card} p-4 rounded-lg shadow mb-6`}>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Buscar por código EAN-13..."
                            value={searchCode}
                            onChange={(e) => setSearchCode(e.target.value)}
                            className={`w-full p-2 border rounded focus:outline-none focus:ring-2 ${classes.input}`}
                        />
                        {searchCode && (
                            <button
                                onClick={handleClearSearch}
                                className={`absolute right-2 top-2 ${
                                    theme === 'dracula' ? 'text-[#6272a4] hover:text-[#f8f8f2]' : 'text-gray-400 hover:text-gray-600'
                                }`}
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>

                {/* Lista de Ordens de Serviço */}
                <div className="grid gap-4">
                    {orders.map(order => (
                        <div key={order.id} className={`${classes.card} p-4 rounded-lg shadow hover:shadow-lg transition-shadow`}>
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-2">
                                        {/* Código */}
                                        <div className="flex items-center space-x-1">
                                            <code className={`text-xs font-mono ${classes.code}`}>
                                                {order.operation_code || '-'}
                                            </code>
                                            {order.operation_code && (
                                                <button
                                                    onClick={() => copyToClipboard(order.operation_code)}
                                                    className="text-xs opacity-50 hover:opacity-100"
                                                    title="Copiar código"
                                                >
                                                    📋
                                                </button>
                                            )}
                                        </div>
                                        <h3 className={`text-lg font-bold ${classes.text}`}>{order.title}</h3>
                                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                                            {order.status?.replace('_', ' ')}
                                        </span>
                                        <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(order.priority)}`}>
                                            {order.priority}
                                        </span>
                                    </div>
                                    
                                    <p className={`text-sm ${classes.text} mb-2`}>{order.description}</p>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-sm">
                                        <p className={classes.text}>
                                            <span className="opacity-70">Equipamento:</span> {order.equipment_name}
                                        </p>
                                        <p className={classes.text}>
                                            <span className="opacity-70">Tipo:</span> {order.type}
                                        </p>
                                        <p className={classes.text}>
                                            <span className="opacity-70">Responsável:</span> {order.assigned_to_name || 'Não atribuído'}
                                        </p>
                                        <p className={classes.text}>
                                            <span className="opacity-70">Previsto:</span> {order.scheduled_date ? new Date(order.scheduled_date).toLocaleDateString() : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex space-x-2 mt-4 md:mt-0">
                                    <button
                                        onClick={() => setShowDetails(order)}
                                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                                    >
                                        Detalhes
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {orders.length === 0 && (
                        <div className={`${classes.card} p-8 text-center rounded-lg`}>
                            <p className={classes.text}>Nenhuma ordem de serviço encontrada</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de Criação de OS */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className={`${classes.card} rounded-lg p-6 w-[500px] max-h-[90vh] overflow-y-auto`}>
                        <h3 className={`text-xl font-bold mb-4 ${classes.text}`}>Nova Ordem de Serviço</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                    Equipamento *
                                </label>
                                <select
                                    className={`w-full p-2 border rounded focus:outline-none focus:ring-2 ${classes.input}`}
                                    value={formData.equipment_id}
                                    onChange={(e) => setFormData({...formData, equipment_id: e.target.value})}
                                    required
                                >
                                    <option value="">Selecione...</option>
                                    {equipment.map(eq => (
                                        <option key={eq.id} value={eq.id}>{eq.name} - {eq.serial_number}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                    Título *
                                </label>
                                <input
                                    type="text"
                                    className={`w-full p-2 border rounded focus:outline-none focus:ring-2 ${classes.input}`}
                                    value={formData.title}
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    required
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                    Descrição
                                </label>
                                <textarea
                                    rows="3"
                                    className={`w-full p-2 border rounded focus:outline-none focus:ring-2 ${classes.input}`}
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                        Tipo
                                    </label>
                                    <select
                                        className={`w-full p-2 border rounded focus:outline-none focus:ring-2 ${classes.input}`}
                                        value={formData.type}
                                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                                    >
                                        <option value="preventiva">Preventiva</option>
                                        <option value="corretiva">Corretiva</option>
                                        <option value="preditiva">Preditiva</option>
                                        <option value="instalacao">Instalação</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                        Prioridade
                                    </label>
                                    <select
                                        className={`w-full p-2 border rounded focus:outline-none focus:ring-2 ${classes.input}`}
                                        value={formData.priority}
                                        onChange={(e) => setFormData({...formData, priority: e.target.value})}
                                    >
                                        <option value="baixa">Baixa</option>
                                        <option value="media">Média</option>
                                        <option value="alta">Alta</option>
                                        <option value="urgente">Urgente</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                        Data Prevista
                                    </label>
                                    <input
                                        type="date"
                                        className={`w-full p-2 border rounded focus:outline-none focus:ring-2 ${classes.input}`}
                                        value={formData.scheduled_date}
                                        onChange={(e) => setFormData({...formData, scheduled_date: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                        Responsável
                                    </label>
                                    <select
                                        className={`w-full p-2 border rounded focus:outline-none focus:ring-2 ${classes.input}`}
                                        value={formData.assigned_to}
                                        onChange={(e) => setFormData({...formData, assigned_to: e.target.value})}
                                    >
                                        <option value="">Selecione...</option>
                                        {technicians.map(tec => (
                                            <option key={tec.id} value={tec.id}>{tec.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                        Horas Estimadas
                                    </label>
                                    <input
                                        type="number"
                                        step="0.5"
                                        className={`w-full p-2 border rounded focus:outline-none focus:ring-2 ${classes.input}`}
                                        value={formData.estimated_hours}
                                        onChange={(e) => setFormData({...formData, estimated_hours: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                        Custo Estimado (R$)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className={`w-full p-2 border rounded focus:outline-none focus:ring-2 ${classes.input}`}
                                        value={formData.cost_estimate}
                                        onChange={(e) => setFormData({...formData, cost_estimate: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className={`flex-1 py-2 rounded ${classes.button} disabled:opacity-50`}
                                >
                                    {formLoading ? 'Salvando...' : 'Salvar'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForm(false);
                                        resetForm();
                                    }}
                                    className={`flex-1 py-2 rounded ${classes.cancelButton}`}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de Detalhes */}
            {showDetails && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className={`${classes.card} rounded-lg p-6 w-[500px] max-h-[90vh] overflow-y-auto`}>
                        <h3 className={`text-xl font-bold mb-4 ${classes.text}`}>Detalhes da OS</h3>
                        
                        {/* Código da OS */}
                        {showDetails.operation_code && (
                            <div className={`mb-4 p-3 rounded-lg bg-gray-100 dark:bg-gray-700`}>
                                <p className={`text-xs ${classes.text} opacity-70`}>Código da OS</p>
                                <div className="flex items-center justify-between">
                                    <code className={`text-lg font-bold font-mono ${classes.code}`}>
                                        {showDetails.operation_code}
                                    </code>
                                    <button
                                        onClick={() => copyToClipboard(showDetails.operation_code)}
                                        className="px-2 py-1 bg-blue-600 text-white rounded text-sm"
                                    >
                                        Copiar
                                    </button>
                                </div>
                                <p className={`text-xs ${classes.text} opacity-50 mt-1`}>
                                    Padrão EAN-13 | Leitura por código de barras
                                </p>
                            </div>
                        )}
                        
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-2">
                                <span className="font-semibold">Título:</span>
                                <span>{showDetails.title}</span>
                                
                                <span className="font-semibold">Equipamento:</span>
                                <span>{showDetails.equipment_name}</span>
                                
                                <span className="font-semibold">Tipo:</span>
                                <span>{showDetails.type}</span>
                                
                                <span className="font-semibold">Prioridade:</span>
                                <span>{showDetails.priority}</span>
                                
                                <span className="font-semibold">Status:</span>
                                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(showDetails.status)}`}>
                                    {showDetails.status?.replace('_', ' ')}
                                </span>
                                
                                {showDetails.scheduled_date && (
                                    <>
                                        <span className="font-semibold">Data Prevista:</span>
                                        <span>{new Date(showDetails.scheduled_date).toLocaleDateString()}</span>
                                    </>
                                )}
                                
                                {showDetails.start_date && (
                                    <>
                                        <span className="font-semibold">Início:</span>
                                        <span>{new Date(showDetails.start_date).toLocaleString()}</span>
                                    </>
                                )}
                                
                                {showDetails.completion_date && (
                                    <>
                                        <span className="font-semibold">Conclusão:</span>
                                        <span>{new Date(showDetails.completion_date).toLocaleString()}</span>
                                    </>
                                )}
                                
                                <span className="font-semibold">Horas Estimadas:</span>
                                <span>{showDetails.estimated_hours || 'N/A'} h</span>
                                
                                <span className="font-semibold">Horas Reais:</span>
                                <span>{showDetails.total_hours || 'N/A'} h</span>
                                
                                <span className="font-semibold">Custo Estimado:</span>
                                <span>R$ {showDetails.cost_estimate || '0'}</span>
                                
                                <span className="font-semibold">Custo Real:</span>
                                <span>R$ {showDetails.actual_cost || '0'}</span>
                                
                                <span className="font-semibold">Criado por:</span>
                                <span>{showDetails.created_by_name}</span>
                            </div>
                            
                            {showDetails.description && (
                                <div>
                                    <span className="font-semibold">Descrição:</span>
                                    <p className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded">
                                        {showDetails.description}
                                    </p>
                                </div>
                            )}
                            
                            {showDetails.findings && (
                                <div>
                                    <span className="font-semibold">Constatações:</span>
                                    <p className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded">
                                        {showDetails.findings}
                                    </p>
                                </div>
                            )}
                        </div>
                        
                        <button
                            onClick={() => setShowDetails(null)}
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
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
    const [filters, setFilters] = useState({
        status: '',
        priority: '',
        search: ''
    });
    const [showForm, setShowForm] = useState(false);
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

    const { theme } = useTheme();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [ordersRes, equipmentRes] = await Promise.all([
                api.get('/maintenance/work-orders'),
                api.get('/maintenance/equipment')
            ]);
            setOrders(ordersRes.data);
            setEquipment(equipmentRes.data);
            
            // Buscar técnicos (usuários com permissão)
            const usersRes = await api.get('/admin/users');
            setTechnicians(usersRes.data.filter(u => u.role === 'colaborador' || u.role === 'admin'));
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
                accent: 'text-[#bd93f9]',
                border: 'border-[#6272a4]'
            };
        }
        if (theme === 'dark') {
            return {
                card: 'bg-gray-800',
                text: 'text-white',
                accent: 'text-blue-400',
                border: 'border-gray-700'
            };
        }
        return {
            card: 'bg-white',
            text: 'text-gray-900',
            accent: 'text-blue-600',
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

    const getPriorityColor = (priority) => {
        const colors = {
            baixa: 'bg-blue-100 text-blue-800',
            media: 'bg-green-100 text-green-800',
            alta: 'bg-orange-100 text-orange-800',
            urgente: 'bg-red-100 text-red-800'
        };
        return colors[priority] || 'bg-gray-100 text-gray-800';
    };

    const filteredOrders = orders.filter(order => {
        if (filters.status && order.status !== filters.status) return false;
        if (filters.priority && order.priority !== filters.priority) return false;
        if (filters.search) {
            const search = filters.search.toLowerCase();
            return order.title.toLowerCase().includes(search) ||
                   order.equipment_name?.toLowerCase().includes(search);
        }
        return true;
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/maintenance/work-orders', formData);
            loadData();
            setShowForm(false);
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
        } catch (error) {
            alert(error.response?.data?.error || 'Erro ao criar OS');
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

                {/* Filtros */}
                <div className={`${classes.card} p-4 rounded-lg shadow mb-6`}>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <input
                            type="text"
                            placeholder="Buscar..."
                            className={`px-3 py-2 border rounded ${classes.border} ${classes.text}`}
                            value={filters.search}
                            onChange={(e) => setFilters({...filters, search: e.target.value})}
                        />
                        <select
                            className={`px-3 py-2 border rounded ${classes.border} ${classes.text}`}
                            value={filters.status}
                            onChange={(e) => setFilters({...filters, status: e.target.value})}
                        >
                            <option value="">Todos status</option>
                            <option value="aberta">Aberta</option>
                            <option value="planejada">Planejada</option>
                            <option value="em_andamento">Em Andamento</option>
                            <option value="aguardando_pecas">Aguardando Peças</option>
                            <option value="concluida">Concluída</option>
                            <option value="cancelada">Cancelada</option>
                        </select>
                        <select
                            className={`px-3 py-2 border rounded ${classes.border} ${classes.text}`}
                            value={filters.priority}
                            onChange={(e) => setFilters({...filters, priority: e.target.value})}
                        >
                            <option value="">Todas prioridades</option>
                            <option value="baixa">Baixa</option>
                            <option value="media">Média</option>
                            <option value="alta">Alta</option>
                            <option value="urgente">Urgente</option>
                        </select>
                    </div>
                </div>

                {/* Lista de OS */}
                <div className="grid gap-4">
                    {filteredOrders.map(order => (
                        <div key={order.id} className={`${classes.card} p-4 rounded-lg shadow hover:shadow-lg transition-shadow`}>
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-2">
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
                                    <Link
                                        to={`/maintenance/work-orders/${order.id}`}
                                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                                    >
                                        Detalhes
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}

                    {filteredOrders.length === 0 && (
                        <div className={`${classes.card} p-8 text-center rounded-lg`}>
                            <p className={classes.text}>Nenhuma ordem de serviço encontrada</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Nova OS */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className={`${classes.card} rounded-lg p-6 w-[500px]`}>
                        <h3 className={`text-xl font-bold mb-4 ${classes.text}`}>Nova Ordem de Serviço</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                    Equipamento *
                                </label>
                                <select
                                    className={`w-full p-2 border rounded ${classes.border} ${classes.text}`}
                                    value={formData.equipment_id}
                                    onChange={(e) => setFormData({...formData, equipment_id: e.target.value})}
                                    required
                                >
                                    <option value="">Selecione</option>
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
                                    className={`w-full p-2 border rounded ${classes.border} ${classes.text}`}
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
                                    className={`w-full p-2 border rounded ${classes.border} ${classes.text}`}
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
                                        className={`w-full p-2 border rounded ${classes.border} ${classes.text}`}
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
                                        className={`w-full p-2 border rounded ${classes.border} ${classes.text}`}
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
                                        className={`w-full p-2 border rounded ${classes.border} ${classes.text}`}
                                        value={formData.scheduled_date}
                                        onChange={(e) => setFormData({...formData, scheduled_date: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                        Responsável
                                    </label>
                                    <select
                                        className={`w-full p-2 border rounded ${classes.border} ${classes.text}`}
                                        value={formData.assigned_to}
                                        onChange={(e) => setFormData({...formData, assigned_to: e.target.value})}
                                    >
                                        <option value="">Selecione</option>
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
                                        className={`w-full p-2 border rounded ${classes.border} ${classes.text}`}
                                        value={formData.estimated_hours}
                                        onChange={(e) => setFormData({...formData, estimated_hours: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                        Custo Estimado
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className={`w-full p-2 border rounded ${classes.border} ${classes.text}`}
                                        value={formData.cost_estimate}
                                        onChange={(e) => setFormData({...formData, cost_estimate: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Criar OS
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
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
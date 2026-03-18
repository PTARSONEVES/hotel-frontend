import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/api';
import { useTheme } from '../../../context/ThemeContext';
import ThemeToggle from '../../../components/ThemeToggle';

export default function EquipmentList() {
    const [equipment, setEquipment] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: '',
        category_id: '',
        search: ''
    });
    const [showForm, setShowForm] = useState(false);
    const [editingEquipment, setEditingEquipment] = useState(null);
    const [formData, setFormData] = useState({
        category_id: '',
        name: '',
        description: '',
        serial_number: '',
        model: '',
        manufacturer: '',
        location: '',
        room_id: '',
        acquisition_date: '',
        warranty_end: '',
        useful_life: '',
        criticality: 'medio',
        technical_specs: {}
    });

    const { theme } = useTheme();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [equipmentRes, categoriesRes] = await Promise.all([
                api.get('/maintenance/equipment'),
                api.get('/maintenance/equipment-categories')
            ]);
            setEquipment(equipmentRes.data);
            setCategories(categoriesRes.data);
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
            operacional: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            manutencao: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
            inativo: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
            baixado: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getCriticalityColor = (criticality) => {
        const colors = {
            baixo: 'bg-blue-100 text-blue-800',
            medio: 'bg-green-100 text-green-800',
            alto: 'bg-orange-100 text-orange-800',
            critico: 'bg-red-100 text-red-800'
        };
        return colors[criticality] || 'bg-gray-100 text-gray-800';
    };

    const filteredEquipment = equipment.filter(item => {
        if (filters.status && item.status !== filters.status) return false;
        if (filters.category_id && item.category_id !== parseInt(filters.category_id)) return false;
        if (filters.search) {
            const search = filters.search.toLowerCase();
            return item.name.toLowerCase().includes(search) ||
                   item.serial_number?.toLowerCase().includes(search) ||
                   item.model?.toLowerCase().includes(search);
        }
        return true;
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingEquipment) {
                await api.put(`/maintenance/equipment/${editingEquipment.id}`, formData);
            } else {
                await api.post('/maintenance/equipment', formData);
            }
            loadData();
            setShowForm(false);
            resetForm();
        } catch (error) {
            alert(error.response?.data?.error || 'Erro ao salvar');
        }
    };

    const resetForm = () => {
        setFormData({
            category_id: '',
            name: '',
            description: '',
            serial_number: '',
            model: '',
            manufacturer: '',
            location: '',
            room_id: '',
            acquisition_date: '',
            warranty_end: '',
            useful_life: '',
            criticality: 'medio',
            technical_specs: {}
        });
        setEditingEquipment(null);
    };

    const handleEdit = (item) => {
        setEditingEquipment(item);
        setFormData({
            category_id: item.category_id,
            name: item.name,
            description: item.description || '',
            serial_number: item.serial_number || '',
            model: item.model || '',
            manufacturer: item.manufacturer || '',
            location: item.location || '',
            room_id: item.room_id || '',
            acquisition_date: item.acquisition_date ? item.acquisition_date.split('T')[0] : '',
            warranty_end: item.warranty_end ? item.warranty_end.split('T')[0] : '',
            useful_life: item.useful_life || '',
            criticality: item.criticality || 'medio',
            technical_specs: item.technical_specs || {}
        });
        setShowForm(true);
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
                        Equipamentos
                    </h1>
                    <button
                        onClick={() => {
                            resetForm();
                            setShowForm(true);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        + Novo Equipamento
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
                            value={filters.category_id}
                            onChange={(e) => setFilters({...filters, category_id: e.target.value})}
                        >
                            <option value="">Todas categorias</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                        <select
                            className={`px-3 py-2 border rounded ${classes.border} ${classes.text}`}
                            value={filters.status}
                            onChange={(e) => setFilters({...filters, status: e.target.value})}
                        >
                            <option value="">Todos status</option>
                            <option value="operacional">Operacional</option>
                            <option value="manutencao">Em Manutenção</option>
                            <option value="inativo">Inativo</option>
                            <option value="baixado">Baixado</option>
                        </select>
                    </div>
                </div>

                {/* Lista de Equipamentos */}
                <div className="grid gap-4">
                    {filteredEquipment.map(item => (
                        <div key={item.id} className={`${classes.card} p-4 rounded-lg shadow hover:shadow-lg transition-shadow`}>
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <h3 className={`text-lg font-bold ${classes.text}`}>{item.name}</h3>
                                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(item.status)}`}>
                                            {item.status}
                                        </span>
                                        <span className={`px-2 py-1 text-xs rounded-full ${getCriticalityColor(item.criticality)}`}>
                                            {item.criticality}
                                        </span>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                                        <p className={classes.text}>
                                            <span className="opacity-70">Série:</span> {item.serial_number || 'N/A'}
                                        </p>
                                        <p className={classes.text}>
                                            <span className="opacity-70">Modelo:</span> {item.model || 'N/A'}
                                        </p>
                                        <p className={classes.text}>
                                            <span className="opacity-70">Fabricante:</span> {item.manufacturer || 'N/A'}
                                        </p>
                                        <p className={classes.text}>
                                            <span className="opacity-70">Local:</span> {item.location || 'N/A'}
                                        </p>
                                        <p className={classes.text}>
                                            <span className="opacity-70">OS abertas:</span> {item.open_orders || 0}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex space-x-2 mt-4 md:mt-0">
                                    <Link
                                        to={`/maintenance/equipment/${item.id}`}
                                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                                    >
                                        Detalhes
                                    </Link>
                                    <button
                                        onClick={() => handleEdit(item)}
                                        className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
                                    >
                                        Editar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {filteredEquipment.length === 0 && (
                        <div className={`${classes.card} p-8 text-center rounded-lg`}>
                            <p className={classes.text}>Nenhum equipamento encontrado</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Formulário */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className={`${classes.card} rounded-lg p-6 w-[600px] max-h-[90vh] overflow-y-auto`}>
                        <h3 className={`text-xl font-bold mb-4 ${classes.text}`}>
                            {editingEquipment ? 'Editar' : 'Novo'} Equipamento
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                        Categoria *
                                    </label>
                                    <select
                                        className={`w-full p-2 border rounded ${classes.border} ${classes.text}`}
                                        value={formData.category_id}
                                        onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                                        required
                                    >
                                        <option value="">Selecione</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                        Nome *
                                    </label>
                                    <input
                                        type="text"
                                        className={`w-full p-2 border rounded ${classes.border} ${classes.text}`}
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        required
                                    />
                                </div>
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
                                        Número de Série
                                    </label>
                                    <input
                                        type="text"
                                        className={`w-full p-2 border rounded ${classes.border} ${classes.text}`}
                                        value={formData.serial_number}
                                        onChange={(e) => setFormData({...formData, serial_number: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                        Modelo
                                    </label>
                                    <input
                                        type="text"
                                        className={`w-full p-2 border rounded ${classes.border} ${classes.text}`}
                                        value={formData.model}
                                        onChange={(e) => setFormData({...formData, model: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                        Fabricante
                                    </label>
                                    <input
                                        type="text"
                                        className={`w-full p-2 border rounded ${classes.border} ${classes.text}`}
                                        value={formData.manufacturer}
                                        onChange={(e) => setFormData({...formData, manufacturer: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                        Localização
                                    </label>
                                    <input
                                        type="text"
                                        className={`w-full p-2 border rounded ${classes.border} ${classes.text}`}
                                        value={formData.location}
                                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                        Data de Aquisição
                                    </label>
                                    <input
                                        type="date"
                                        className={`w-full p-2 border rounded ${classes.border} ${classes.text}`}
                                        value={formData.acquisition_date}
                                        onChange={(e) => setFormData({...formData, acquisition_date: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                        Fim da Garantia
                                    </label>
                                    <input
                                        type="date"
                                        className={`w-full p-2 border rounded ${classes.border} ${classes.text}`}
                                        value={formData.warranty_end}
                                        onChange={(e) => setFormData({...formData, warranty_end: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                        Vida Útil (meses)
                                    </label>
                                    <input
                                        type="number"
                                        className={`w-full p-2 border rounded ${classes.border} ${classes.text}`}
                                        value={formData.useful_life}
                                        onChange={(e) => setFormData({...formData, useful_life: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                        Criticidade
                                    </label>
                                    <select
                                        className={`w-full p-2 border rounded ${classes.border} ${classes.text}`}
                                        value={formData.criticality}
                                        onChange={(e) => setFormData({...formData, criticality: e.target.value})}
                                    >
                                        <option value="baixo">Baixo</option>
                                        <option value="medio">Médio</option>
                                        <option value="alto">Alto</option>
                                        <option value="critico">Crítico</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Salvar
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForm(false);
                                        resetForm();
                                    }}
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
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/api';
import { useTheme } from '../../../context/ThemeContext';
import ThemeToggle from '../../../components/ThemeToggle';

export default function EquipmentList() {
    const [equipment, setEquipment] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchCode, setSearchCode] = useState('');
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
    const [formLoading, setFormLoading] = useState(false);
    const [showDetails, setShowDetails] = useState(null);
    const { theme } = useTheme();

    useEffect(() => {
        loadData();
    }, [searchCode]);

    const loadData = async () => {
        try {
            const params = new URLSearchParams();
            if (searchCode) params.append('code', searchCode);
            
            const [equipmentRes, categoriesRes] = await Promise.all([
                api.get(`/maintenance/equipment?${params}`),
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
        } finally {
            setFormLoading(false);
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

    const handleDelete = async (id) => {
        if (!confirm('Tem certeza que deseja excluir este equipamento?')) return;
        try {
            await api.delete(`/maintenance/equipment/${id}`);
            loadData();
        } catch (error) {
            alert(error.response?.data?.error || 'Erro ao excluir');
        }
    };

    const getStatusColor = (status) => {
        if (theme === 'dracula') {
            const colors = {
                operacional: 'bg-[#50fa7b] text-[#282a36]',
                manutencao: 'bg-[#f1fa8c] text-[#282a36]',
                inativo: 'bg-[#6272a4] text-[#f8f8f2]',
                baixado: 'bg-[#ff5555] text-[#f8f8f2]'
            };
            return colors[status] || 'bg-[#44475a] text-[#f8f8f2]';
        }
        const colors = {
            operacional: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            manutencao: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
            inativo: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
            baixado: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getCriticalityColor = (criticality) => {
        if (theme === 'dracula') {
            const colors = {
                baixo: 'bg-[#6272a4] text-[#f8f8f2]',
                medio: 'bg-[#50fa7b] text-[#282a36]',
                alto: 'bg-[#ffb86c] text-[#282a36]',
                critico: 'bg-[#ff5555] text-[#f8f8f2]'
            };
            return colors[criticality] || 'bg-[#44475a] text-[#f8f8f2]';
        }
        const colors = {
            baixo: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
            medio: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            alto: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
            critico: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        };
        return colors[criticality] || 'bg-gray-100 text-gray-800';
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
                cancelButton: 'bg-[#6272a4] hover:bg-[#44475a] text-[#f8f8f2]'
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
                cancelButton: 'bg-gray-600 hover:bg-gray-500 text-white'
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
            cancelButton: 'bg-gray-500 hover:bg-gray-600 text-white'
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

                {/* Lista de Equipamentos */}
                <div className="grid gap-4">
                    {equipment.map(item => (
                        <div key={item.id} className={`${classes.card} p-4 rounded-lg shadow hover:shadow-lg transition-shadow`}>
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-2">
                                        {/* Código */}
                                        <div className="flex items-center space-x-1">
                                            <code className={`text-xs font-mono ${classes.code}`}>
                                                {item.operation_code || '-'}
                                            </code>
                                            {item.operation_code && (
                                                <button
                                                    onClick={() => copyToClipboard(item.operation_code)}
                                                    className="text-xs opacity-50 hover:opacity-100"
                                                    title="Copiar código"
                                                >
                                                    📋
                                                </button>
                                            )}
                                        </div>
                                        <h3 className={`text-lg font-bold ${classes.text}`}>{item.name}</h3>
                                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(item.status)}`}>
                                            {item.status}
                                        </span>
                                        <span className={`px-2 py-1 text-xs rounded-full ${getCriticalityColor(item.criticality)}`}>
                                            {item.criticality}
                                        </span>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-sm">
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
                                    <button
                                        onClick={() => setShowDetails(item)}
                                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                                    >
                                        Detalhes
                                    </button>
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

                    {equipment.length === 0 && (
                        <div className={`${classes.card} p-8 text-center rounded-lg`}>
                            <p className={classes.text}>Nenhum equipamento encontrado</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de Criação/Edição */}
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
                                        className={`w-full p-2 border rounded focus:outline-none focus:ring-2 ${classes.select}`}
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
                                        className={`w-full p-2 border rounded focus:outline-none focus:ring-2 ${classes.input}`}
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
                                    className={`w-full p-2 border rounded focus:outline-none focus:ring-2 ${classes.input}`}
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
                                        className={`w-full p-2 border rounded focus:outline-none focus:ring-2 ${classes.input}`}
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
                                        className={`w-full p-2 border rounded focus:outline-none focus:ring-2 ${classes.input}`}
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
                                        className={`w-full p-2 border rounded focus:outline-none focus:ring-2 ${classes.input}`}
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
                                        className={`w-full p-2 border rounded focus:outline-none focus:ring-2 ${classes.input}`}
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
                                        className={`w-full p-2 border rounded focus:outline-none focus:ring-2 ${classes.input}`}
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
                                        className={`w-full p-2 border rounded focus:outline-none focus:ring-2 ${classes.input}`}
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
                                        className={`w-full p-2 border rounded focus:outline-none focus:ring-2 ${classes.input}`}
                                        value={formData.useful_life}
                                        onChange={(e) => setFormData({...formData, useful_life: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                        Criticidade
                                    </label>
                                    <select
                                        className={`w-full p-2 border rounded focus:outline-none focus:ring-2 ${classes.select}`}
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
                                    disabled={formLoading}
                                    className={`flex-1 py-2 rounded ${classes.button} disabled:opacity-50`}
                                >
                                    {formLoading ? 'Salvando...' : (editingEquipment ? 'Atualizar' : 'Salvar')}
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
                    <div className={`${classes.card} rounded-lg p-6 w-96`}>
                        <h3 className={`text-xl font-bold mb-4 ${classes.text}`}>Detalhes do Equipamento</h3>
                        
                        {showDetails.operation_code && (
                            <div className="mb-4 p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
                                <p className={`text-xs ${classes.text} opacity-70`}>Código do Equipamento</p>
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
                                <span className="font-semibold">Nome:</span>
                                <span>{showDetails.name}</span>
                                
                                <span className="font-semibold">Categoria:</span>
                                <span>{showDetails.category_name}</span>
                                
                                <span className="font-semibold">Série:</span>
                                <span>{showDetails.serial_number || 'N/A'}</span>
                                
                                <span className="font-semibold">Modelo:</span>
                                <span>{showDetails.model || 'N/A'}</span>
                                
                                <span className="font-semibold">Fabricante:</span>
                                <span>{showDetails.manufacturer || 'N/A'}</span>
                                
                                <span className="font-semibold">Localização:</span>
                                <span>{showDetails.location || 'N/A'}</span>
                                
                                <span className="font-semibold">Status:</span>
                                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(showDetails.status)}`}>
                                    {showDetails.status}
                                </span>
                                
                                <span className="font-semibold">Criticidade:</span>
                                <span className={`px-2 py-1 text-xs rounded-full ${getCriticalityColor(showDetails.criticality)}`}>
                                    {showDetails.criticality}
                                </span>
                                
                                {showDetails.acquisition_date && (
                                    <>
                                        <span className="font-semibold">Aquisição:</span>
                                        <span>{new Date(showDetails.acquisition_date).toLocaleDateString()}</span>
                                    </>
                                )}
                                
                                {showDetails.warranty_end && (
                                    <>
                                        <span className="font-semibold">Garantia até:</span>
                                        <span>{new Date(showDetails.warranty_end).toLocaleDateString()}</span>
                                    </>
                                )}
                            </div>
                            
                            {showDetails.description && (
                                <div>
                                    <span className="font-semibold">Descrição:</span>
                                    <p className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded">
                                        {showDetails.description}
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
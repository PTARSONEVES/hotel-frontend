import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { useTheme } from '../../../context/ThemeContext';
import ThemeToggle from '../../../components/ThemeToggle';

export default function RoomTypeList() {
    const [types, setTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingType, setEditingType] = useState(null);
    const [showDetails, setShowDetails] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        capacity: 2,
        size_sqm: '',
        notes: ''
    });
    const [formLoading, setFormLoading] = useState(false);
    const { theme } = useTheme();

    useEffect(() => {
        loadTypes();
    }, []);

    const loadTypes = async () => {
        try {
            const response = await api.get('/hotel/room-types');
            setTypes(response.data);
        } catch (error) {
            console.error('Erro ao carregar tipos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            if (editingType) {
                await api.put(`/hotel/room-types/${editingType.id}`, formData);
            } else {
                await api.post('/hotel/room-types', formData);
            }
            loadTypes();
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
            name: '',
            description: '',
            capacity: 2,
            size_sqm: '',
            notes: ''
        });
        setEditingType(null);
    };

    const handleEdit = (type) => {
        setEditingType(type);
        setFormData({
            name: type.name,
            description: type.description || '',
            capacity: type.capacity,
            size_sqm: type.size_sqm || '',
            notes: type.notes || ''
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Tem certeza que deseja excluir este tipo? Isso não afetará apartamentos existentes.')) return;
        try {
            await api.delete(`/hotel/room-types/${id}`);
            loadTypes();
        } catch (error) {
            alert(error.response?.data?.error || 'Erro ao excluir');
        }
    };

    const getThemeClasses = () => {
        if (theme === 'dracula') {
            return {
                card: 'bg-[#44475a]',
                text: 'text-[#f8f8f2]',
                border: 'border-[#6272a4]',
                input: 'bg-[#282a36] border-[#6272a4] text-[#f8f8f2] placeholder-[#6272a4]',
                button: 'bg-[#bd93f9] hover:bg-[#ff79c6] text-white',
                cancelButton: 'bg-[#6272a4] hover:bg-[#44475a] text-[#f8f8f2]'
            };
        }
        if (theme === 'dark') {
            return {
                card: 'bg-gray-800',
                text: 'text-white',
                border: 'border-gray-700',
                input: 'bg-gray-700 border-gray-600 text-white placeholder-gray-400',
                button: 'bg-blue-600 hover:bg-blue-700 text-white',
                cancelButton: 'bg-gray-600 hover:bg-gray-500 text-white'
            };
        }
        return {
            card: 'bg-white',
            text: 'text-gray-900',
            border: 'border-gray-200',
            input: 'bg-white border-gray-300 text-gray-900 placeholder-gray-400',
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
                        Tipos de Apartamento
                    </h1>
                    <button
                        onClick={() => {
                            resetForm();
                            setShowForm(true);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        + Novo Tipo
                    </button>
                </div>

                {/* Lista de Tipos */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {types.map(type => (
                        <div key={type.id} className={`${classes.card} p-4 rounded-lg shadow hover:shadow-lg transition-shadow`}>
                            <div className="flex justify-between items-start mb-2">
                                <h3 className={`text-lg font-bold ${classes.text}`}>{type.name}</h3>
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                    {type.total_rooms || 0} apartamentos
                                </span>
                            </div>
                            
                            {type.description && (
                                <p className={`text-sm ${classes.text} opacity-70 mb-2`}>{type.description}</p>
                            )}
                            
                            <div className="flex space-x-4 text-sm mb-3">
                                <span className={classes.text}>
                                    👥 Capacidade: {type.capacity} pessoas
                                </span>
                                {type.size_sqm && (
                                    <span className={classes.text}>
                                        📏 {type.size_sqm} m²
                                    </span>
                                )}
                            </div>
                            
                            {type.notes && (
                                <p className={`text-xs ${classes.text} opacity-50 mb-3`}>{type.notes}</p>
                            )}
                            
                            <div className="flex space-x-2 mt-2">
                                <button
                                    onClick={() => setShowDetails(type)}
                                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                                >
                                    Detalhes
                                </button>
                                <button
                                    onClick={() => handleEdit(type)}
                                    className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDelete(type.id)}
                                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                                >
                                    Excluir
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {types.length === 0 && (
                    <div className={`${classes.card} p-8 text-center rounded-lg`}>
                        <p className={classes.text}>Nenhum tipo de apartamento cadastrado</p>
                    </div>
                )}
            </div>

            {/* Modal de Formulário */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className={`${classes.card} rounded-lg p-6 w-96`}>
                        <h3 className={`text-xl font-bold mb-4 ${classes.text}`}>
                            {editingType ? 'Editar' : 'Novo'} Tipo de Apartamento
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
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

                            <div>
                                <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                    Descrição
                                </label>
                                <textarea
                                    rows="2"
                                    className={`w-full p-2 border rounded focus:outline-none focus:ring-2 ${classes.input}`}
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                        Capacidade (pessoas)
                                    </label>
                                    <select
                                        className={`w-full p-2 border rounded focus:outline-none focus:ring-2 ${classes.input}`}
                                        value={formData.capacity}
                                        onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value)})}
                                    >
                                        {[1, 2, 3, 4, 5, 6].map(n => (
                                            <option key={n} value={n}>{n}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                        Tamanho (m²)
                                    </label>
                                    <input
                                        type="number"
                                        step="1"
                                        className={`w-full p-2 border rounded focus:outline-none focus:ring-2 ${classes.input}`}
                                        value={formData.size_sqm}
                                        onChange={(e) => setFormData({...formData, size_sqm: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                    Observações
                                </label>
                                <textarea
                                    rows="2"
                                    className={`w-full p-2 border rounded focus:outline-none focus:ring-2 ${classes.input}`}
                                    value={formData.notes}
                                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                                />
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className={`flex-1 py-2 rounded ${classes.button} disabled:opacity-50`}
                                >
                                    {formLoading ? 'Salvando...' : (editingType ? 'Atualizar' : 'Salvar')}
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
                        <h3 className={`text-xl font-bold mb-4 ${classes.text}`}>Detalhes do Tipo</h3>
                        
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-2">
                                <span className="font-semibold">Nome:</span>
                                <span>{showDetails.name}</span>
                                
                                <span className="font-semibold">Capacidade:</span>
                                <span>{showDetails.capacity} pessoas</span>
                                
                                {showDetails.size_sqm && (
                                    <>
                                        <span className="font-semibold">Tamanho:</span>
                                        <span>{showDetails.size_sqm} m²</span>
                                    </>
                                )}
                                
                                <span className="font-semibold">Apartamentos:</span>
                                <span>{showDetails.total_rooms || 0}</span>
                            </div>
                            
                            {showDetails.description && (
                                <div>
                                    <span className="font-semibold">Descrição:</span>
                                    <p className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded">
                                        {showDetails.description}
                                    </p>
                                </div>
                            )}
                            
                            {showDetails.notes && (
                                <div>
                                    <span className="font-semibold">Observações:</span>
                                    <p className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded">
                                        {showDetails.notes}
                                    </p>
                                </div>
                            )}
                            
                            {showDetails.rooms && showDetails.rooms.length > 0 && (
                                <div>
                                    <span className="font-semibold">Apartamentos:</span>
                                    <div className="mt-1 flex flex-wrap gap-1">
                                        {showDetails.rooms.map(room => (
                                            <span key={room.id} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                                                {room.room_number}
                                            </span>
                                        ))}
                                    </div>
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
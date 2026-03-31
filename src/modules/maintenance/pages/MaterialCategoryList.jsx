import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { useTheme } from '../../../context/ThemeContext';
import ThemeToggle from '../../../components/ThemeToggle';

export default function MaterialCategoryList() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [showDetails, setShowDetails] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });
    const [formLoading, setFormLoading] = useState(false);
    const { theme } = useTheme();

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const response = await api.get('/maintenance/material-categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Erro ao carregar categorias:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            if (editingCategory) {
                await api.put(`/maintenance/material-categories/${editingCategory.id}`, formData);
            } else {
                await api.post('/maintenance/material-categories', formData);
            }
            loadCategories();
            setShowForm(false);
            resetForm();
        } catch (error) {
            alert(error.response?.data?.error || 'Erro ao salvar');
        } finally {
            setFormLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({ name: '', description: '' });
        setEditingCategory(null);
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            description: category.description || ''
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Tem certeza que deseja excluir esta categoria?')) return;
        try {
            await api.delete(`/maintenance/material-categories/${id}`);
            loadCategories();
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
                input: 'bg-[#282a36] border-[#6272a4] text-[#f8f8f2] placeholder-[#6272a4] focus:ring-[#bd93f9]',
                button: 'bg-[#bd93f9] hover:bg-[#ff79c6] text-white',
                cancelButton: 'bg-[#6272a4] hover:bg-[#44475a] text-[#f8f8f2]'
            };
        }
        if (theme === 'dark') {
            return {
                card: 'bg-gray-800',
                text: 'text-white',
                border: 'border-gray-700',
                input: 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500',
                button: 'bg-blue-600 hover:bg-blue-700 text-white',
                cancelButton: 'bg-gray-600 hover:bg-gray-500 text-white'
            };
        }
        return {
            card: 'bg-white',
            text: 'text-gray-900',
            border: 'border-gray-200',
            input: 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500',
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
                        Categorias de Materiais
                    </h1>
                    <button
                        onClick={() => {
                            resetForm();
                            setShowForm(true);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        + Nova Categoria
                    </button>
                </div>

                {/* Lista de Categorias */}
                <div className="grid gap-4">
                    {categories.map(cat => (
                        <div key={cat.id} className={`${classes.card} p-4 rounded-lg shadow hover:shadow-lg transition-shadow`}>
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <h3 className={`text-lg font-bold ${classes.text}`}>{cat.name}</h3>
                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                            {cat.material_count || 0} materiais
                                        </span>
                                    </div>
                                    {cat.description && (
                                        <p className={`text-sm ${classes.text} opacity-70`}>{cat.description}</p>
                                    )}
                                </div>
                                
                                <div className="flex space-x-2 mt-4 md:mt-0">
                                    <button
                                        onClick={() => setShowDetails(cat)}
                                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                                    >
                                        Detalhes
                                    </button>
                                    <button
                                        onClick={() => handleEdit(cat)}
                                        className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(cat.id)}
                                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                                    >
                                        Excluir
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {categories.length === 0 && (
                        <div className={`${classes.card} p-8 text-center rounded-lg`}>
                            <p className={classes.text}>Nenhuma categoria encontrada</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de Criação/Edição */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className={`${classes.card} rounded-lg p-6 w-96`}>
                        <h3 className={`text-xl font-bold mb-4 ${classes.text}`}>
                            {editingCategory ? 'Editar' : 'Nova'} Categoria
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
                                    rows="3"
                                    className={`w-full p-2 border rounded focus:outline-none focus:ring-2 ${classes.input}`}
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                />
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className={`flex-1 py-2 rounded ${classes.button} disabled:opacity-50`}
                                >
                                    {formLoading ? 'Salvando...' : (editingCategory ? 'Atualizar' : 'Salvar')}
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
                        <h3 className={`text-xl font-bold mb-4 ${classes.text}`}>Detalhes da Categoria</h3>
                        
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-2">
                                <span className="font-semibold">Nome:</span>
                                <span>{showDetails.name}</span>
                                
                                <span className="font-semibold">Descrição:</span>
                                <span>{showDetails.description || 'N/A'}</span>
                                
                                <span className="font-semibold">Total de Materiais:</span>
                                <span>{showDetails.material_count || 0}</span>
                                
                                <span className="font-semibold">Criado em:</span>
                                <span>{new Date(showDetails.created_at).toLocaleDateString()}</span>
                            </div>
                            
                            {showDetails.materials && showDetails.materials.length > 0 && (
                                <div>
                                    <span className="font-semibold">Materiais:</span>
                                    <ul className="mt-2 space-y-1">
                                        {showDetails.materials.map(mat => (
                                            <li key={mat.id} className="text-sm">
                                                {mat.name} ({mat.code}) - Estoque: {mat.current_stock} {mat.unit}
                                            </li>
                                        ))}
                                    </ul>
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
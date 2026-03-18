import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/api';
import { useTheme } from '../../../context/ThemeContext';
import ThemeToggle from '../../../components/ThemeToggle';

export default function StockList() {
    const [materials, setMaterials] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        category_id: '',
        low_stock: false,
        search: ''
    });
    const [showForm, setShowForm] = useState(false);
    const [showMovement, setShowMovement] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [movementData, setMovementData] = useState({
        type: 'entrada',
        quantity: '',
        unit_price: '',
        reason: '',
        notes: ''
    });

    const [formData, setFormData] = useState({
        category_id: '',
        code: '',
        name: '',
        description: '',
        unit: 'un',
        min_stock: 5,
        max_stock: '',
        location: '',
        supplier: '',
        cost_price: '',
        selling_price: ''
    });

    const { theme } = useTheme();

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        loadData();
    }, [filters]);

    const loadData = async () => {
        try {
            const params = new URLSearchParams();
            if (filters.category_id) params.append('category_id', filters.category_id);
            if (filters.low_stock) params.append('low_stock', 'true');
            if (filters.search) params.append('search', filters.search);

            const [materialsRes, categoriesRes] = await Promise.all([
                api.get(`/maintenance/materials?${params}`),
                api.get('/maintenance/material-categories')
            ]);
            setMaterials(materialsRes.data);
            setCategories(categoriesRes.data);
        } catch (error) {
            console.error('Erro ao carregar materiais:', error);
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

    const getStockStatus = (current, min) => {
        if (current <= 0) return { color: 'text-red-600', label: 'Esgotado' };
        if (current <= min) return { color: 'text-yellow-600', label: 'Estoque Baixo' };
        return { color: 'text-green-600', label: 'Normal' };
    };

    const handleMovement = (material) => {
        setSelectedMaterial(material);
        setMovementData({
            type: 'entrada',
            quantity: '',
            unit_price: material.cost_price || '',
            reason: '',
            notes: ''
        });
        setShowMovement(true);
    };

    const submitMovement = async () => {
        try {
            const data = {
                material_id: selectedMaterial.id,
                quantity: parseFloat(movementData.quantity),
                unit_price: parseFloat(movementData.unit_price),
                reason: movementData.reason,
                notes: movementData.notes
            };

            if (movementData.type === 'entrada') {
                await api.post('/maintenance/stock/entry', data);
            } else {
                await api.post('/maintenance/stock/exit', data);
            }

            loadData();
            setShowMovement(false);
            setSelectedMaterial(null);
        } catch (error) {
            alert(error.response?.data?.error || 'Erro ao registrar movimentação');
        }
    };

    const handleInventory = async (materialId, countedQuantity) => {
        const quantity = prompt('Quantidade contada:', '0');
        if (quantity === null) return;

        try {
            await api.post('/maintenance/stock/inventory', {
                material_id: materialId,
                counted_quantity: parseInt(quantity),
                notes: 'Inventário rotativo'
            });
            loadData();
        } catch (error) {
            alert(error.response?.data?.error || 'Erro ao realizar inventário');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/maintenance/materials', formData);
            loadData();
            setShowForm(false);
            resetForm();
        } catch (error) {
            alert(error.response?.data?.error || 'Erro ao cadastrar material');
        }
    };

    const resetForm = () => {
        setFormData({
            category_id: '',
            code: '',
            name: '',
            description: '',
            unit: 'un',
            min_stock: 5,
            max_stock: '',
            location: '',
            supplier: '',
            cost_price: '',
            selling_price: ''
        });
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
                        Almoxarifado
                    </h1>
                    <div className="flex space-x-3">
                        <button
                            onClick={() => setShowForm(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            + Novo Material
                        </button>
                        <Link
                            to="/maintenance/stock/report"
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                            Relatório
                        </Link>
                    </div>
                </div>

                {/* Filtros */}
                <div className={`${classes.card} p-4 rounded-lg shadow mb-6`}>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <input
                            type="text"
                            placeholder="Buscar por nome ou código..."
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
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={filters.low_stock}
                                onChange={(e) => setFilters({...filters, low_stock: e.target.checked})}
                                className="w-4 h-4"
                            />
                            <span className={classes.text}>Apenas estoque baixo</span>
                        </label>
                    </div>
                </div>

                {/* Resumo do Estoque */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className={`${classes.card} p-4 rounded-lg shadow`}>
                        <p className={`text-sm ${classes.text} opacity-70`}>Total de Itens</p>
                        <p className={`text-2xl font-bold ${classes.text}`}>{materials.length}</p>
                    </div>
                    <div className={`${classes.card} p-4 rounded-lg shadow`}>
                        <p className={`text-sm ${classes.text} opacity-70`}>Valor em Estoque</p>
                        <p className={`text-2xl font-bold ${classes.accent}`}>
                            R$ {materials.reduce((acc, m) => acc + (m.current_stock * (m.cost_price || 0)), 0).toFixed(2)}
                        </p>
                    </div>
                    <div className={`${classes.card} p-4 rounded-lg shadow`}>
                        <p className={`text-sm ${classes.text} opacity-70`}>Itens em Baixa</p>
                        <p className={`text-2xl font-bold ${classes.warning}`}>
                            {materials.filter(m => m.current_stock <= m.min_stock).length}
                        </p>
                    </div>
                    <div className={`${classes.card} p-4 rounded-lg shadow`}>
                        <p className={`text-sm ${classes.text} opacity-70`}>Itens Esgotados</p>
                        <p className={`text-2xl font-bold ${classes.danger}`}>
                            {materials.filter(m => m.current_stock <= 0).length}
                        </p>
                    </div>
                </div>

                {/* Lista de Materiais */}
                <div className="grid gap-4">
                    {materials.map(material => {
                        const stockStatus = getStockStatus(material.current_stock, material.min_stock);
                        return (
                            <div key={material.id} className={`${classes.card} p-4 rounded-lg shadow hover:shadow-lg transition-shadow`}>
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <h3 className={`text-lg font-bold ${classes.text}`}>{material.name}</h3>
                                            <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-xs rounded">
                                                {material.code}
                                            </span>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-sm mb-2">
                                            <p className={classes.text}>
                                                <span className="opacity-70">Categoria:</span> {material.category_name}
                                            </p>
                                            <p className={classes.text}>
                                                <span className="opacity-70">Local:</span> {material.location || 'N/A'}
                                            </p>
                                            <p className={classes.text}>
                                                <span className="opacity-70">Fornecedor:</span> {material.supplier || 'N/A'}
                                            </p>
                                            <p className={classes.text}>
                                                <span className="opacity-70">Unidade:</span> {material.unit}
                                            </p>
                                        </div>

                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center space-x-2">
                                                <span className={`text-sm ${classes.text}`}>Estoque:</span>
                                                <span className={`text-lg font-bold ${stockStatus.color}`}>
                                                    {material.current_stock}
                                                </span>
                                                <span className={`text-xs ${classes.text}`}>
                                                    (min: {material.min_stock})
                                                </span>
                                            </div>
                                            {material.current_stock <= material.min_stock && (
                                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                                                    Repor estoque
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="flex space-x-2 mt-4 md:mt-0">
                                        <button
                                            onClick={() => handleMovement(material)}
                                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                                        >
                                            Movimentar
                                        </button>
                                        <button
                                            onClick={() => handleInventory(material.id)}
                                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                                        >
                                            Inventário
                                        </button>
                                        <Link
                                            to={`/maintenance/stock/${material.id}`}
                                            className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
                                        >
                                            Histórico
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {materials.length === 0 && (
                        <div className={`${classes.card} p-8 text-center rounded-lg`}>
                            <p className={classes.text}>Nenhum material encontrado</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Movimentação */}
            {showMovement && selectedMaterial && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className={`${classes.card} rounded-lg p-6 w-96`}>
                        <h3 className={`text-xl font-bold mb-4 ${classes.text}`}>
                            Movimentar: {selectedMaterial.name}
                        </h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                    Tipo de Movimentação
                                </label>
                                <select
                                    className={`w-full p-2 border rounded ${classes.border} ${classes.text}`}
                                    value={movementData.type}
                                    onChange={(e) => setMovementData({...movementData, type: e.target.value})}
                                >
                                    <option value="entrada">Entrada</option>
                                    <option value="saida">Saída</option>
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
                                    className={`w-full p-2 border rounded ${classes.border} ${classes.text}`}
                                    value={movementData.quantity}
                                    onChange={(e) => setMovementData({...movementData, quantity: e.target.value})}
                                    required
                                />
                            </div>

                            {movementData.type === 'entrada' && (
                                <div>
                                    <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                        Preço Unitário (R$)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        className={`w-full p-2 border rounded ${classes.border} ${classes.text}`}
                                        value={movementData.unit_price}
                                        onChange={(e) => setMovementData({...movementData, unit_price: e.target.value})}
                                    />
                                </div>
                            )}

                            <div>
                                <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                    Motivo
                                </label>
                                <input
                                    type="text"
                                    className={`w-full p-2 border rounded ${classes.border} ${classes.text}`}
                                    value={movementData.reason}
                                    onChange={(e) => setMovementData({...movementData, reason: e.target.value})}
                                    placeholder="Ex: Compra, Consumo em OS"
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                    Observações
                                </label>
                                <textarea
                                    rows="3"
                                    className={`w-full p-2 border rounded ${classes.border} ${classes.text}`}
                                    value={movementData.notes}
                                    onChange={(e) => setMovementData({...movementData, notes: e.target.value})}
                                />
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    onClick={submitMovement}
                                    className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Confirmar
                                </button>
                                <button
                                    onClick={() => {
                                        setShowMovement(false);
                                        setSelectedMaterial(null);
                                    }}
                                    className="flex-1 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Novo Material */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className={`${classes.card} rounded-lg p-6 w-[600px] max-h-[90vh] overflow-y-auto`}>
                        <h3 className={`text-xl font-bold mb-4 ${classes.text}`}>Novo Material</h3>
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
                                        Código *
                                    </label>
                                    <input
                                        type="text"
                                        className={`w-full p-2 border rounded ${classes.border} ${classes.text}`}
                                        value={formData.code}
                                        onChange={(e) => setFormData({...formData, code: e.target.value})}
                                        required
                                    />
                                </div>
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
                                        Unidade *
                                    </label>
                                    <select
                                        className={`w-full p-2 border rounded ${classes.border} ${classes.text}`}
                                        value={formData.unit}
                                        onChange={(e) => setFormData({...formData, unit: e.target.value})}
                                    >
                                        <option value="un">Unidade</option>
                                        <option value="kg">Quilograma</option>
                                        <option value="g">Grama</option>
                                        <option value="l">Litro</option>
                                        <option value="ml">Mililitro</option>
                                        <option value="m">Metro</option>
                                        <option value="m2">Metro²</option>
                                    </select>
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
                                        placeholder="Prateleira A1"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                        Estoque Mínimo
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        className={`w-full p-2 border rounded ${classes.border} ${classes.text}`}
                                        value={formData.min_stock}
                                        onChange={(e) => setFormData({...formData, min_stock: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                        Estoque Máximo
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        className={`w-full p-2 border rounded ${classes.border} ${classes.text}`}
                                        value={formData.max_stock}
                                        onChange={(e) => setFormData({...formData, max_stock: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                        Preço de Custo (R$)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        className={`w-full p-2 border rounded ${classes.border} ${classes.text}`}
                                        value={formData.cost_price}
                                        onChange={(e) => setFormData({...formData, cost_price: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                        Fornecedor
                                    </label>
                                    <input
                                        type="text"
                                        className={`w-full p-2 border rounded ${classes.border} ${classes.text}`}
                                        value={formData.supplier}
                                        onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                                    />
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
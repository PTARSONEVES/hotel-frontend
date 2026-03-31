import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/api';
import { useTheme } from '../../../context/ThemeContext';
import ThemeToggle from '../../../components/ThemeToggle';

export default function StockList() {
    const [materials, setMaterials] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchCode, setSearchCode] = useState('');
    const [filters, setFilters] = useState({
        category_id: '',
        low_stock: false
    });
    const [showForm, setShowForm] = useState(false);
    const [editingMaterial, setEditingMaterial] = useState(null);
    const [showDetails, setShowDetails] = useState(null);
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
    const [formLoading, setFormLoading] = useState(false);
    const { theme } = useTheme();

    // Estados para movimentação
    const [showMovementModal, setShowMovementModal] = useState(false);
    const [movementType, setMovementType] = useState('entrada');
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [movementData, setMovementData] = useState({
        quantity: '',
        unit_price: '',
        reason: '',
        notes: ''
    });
    const [movementLoading, setMovementLoading] = useState(false);
    const [showInventoryModal, setShowInventoryModal] = useState(false);
    const [inventoryData, setInventoryData] = useState({
        counted_quantity: '',
        notes: ''
    });

    // Funções
    const handleOpenMovement = (material, type) => {
        setSelectedMaterial(material);
        setMovementType(type);
        setMovementData({
            quantity: '',
            unit_price: type === 'entrada' ? material.cost_price || '' : '',
            reason: '',
            notes: ''
        });
        setShowMovementModal(true);
    };

    const handleOpenInventory = (material) => {
        setSelectedMaterial(material);
        setInventoryData({
            counted_quantity: material.current_stock,
            notes: ''
        });
        setShowInventoryModal(true);
    };

    const handleSubmitMovement = async (e) => {
        e.preventDefault();
        setMovementLoading(true);
        try {
            const endpoint = movementType === 'entrada' ? '/maintenance/stock/entry' : '/maintenance/stock/exit';
            await api.post(endpoint, {
                material_id: selectedMaterial.id,
                quantity: parseInt(movementData.quantity),
                unit_price: parseFloat(movementData.unit_price) || undefined,
                reason: movementData.reason,
                notes: movementData.notes
            });
            loadData();
            setShowMovementModal(false);
        } catch (error) {
            alert(error.response?.data?.error || 'Erro ao registrar movimentação');
        } finally {
            setMovementLoading(false);
        }
    };

    const handleSubmitInventory = async (e) => {
        e.preventDefault();
        try {
            await api.post('/maintenance/stock/inventory', {
                material_id: selectedMaterial.id,
                counted_quantity: parseInt(inventoryData.counted_quantity),
                notes: inventoryData.notes
            });
            loadData();
            setShowInventoryModal(false);
        } catch (error) {
            alert(error.response?.data?.error || 'Erro ao realizar inventário');
        }
    };

    useEffect(() => {
        loadData();
    }, [searchCode, filters]);

    const loadData = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (searchCode) params.append('code', searchCode);
            if (filters.category_id) params.append('category_id', filters.category_id);
            if (filters.low_stock) params.append('low_stock', 'true');

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
            if (editingMaterial) {
                await api.put(`/maintenance/materials/${editingMaterial.id}`, formData);
            } else {
                await api.post('/maintenance/materials', formData);
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
        setEditingMaterial(null);
    };

    const handleEdit = (material) => {
        setEditingMaterial(material);
        setFormData({
            category_id: material.category_id,
            code: material.code,
            name: material.name,
            description: material.description || '',
            unit: material.unit,
            min_stock: material.min_stock,
            max_stock: material.max_stock || '',
            location: material.location || '',
            supplier: material.supplier || '',
            cost_price: material.cost_price || '',
            selling_price: material.selling_price || ''
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Tem certeza que deseja excluir este material?')) return;
        try {
            await api.delete(`/maintenance/materials/${id}`);
            loadData();
        } catch (error) {
            alert(error.response?.data?.error || 'Erro ao excluir');
        }
    };

    const getStockStatus = (current, min) => {
        if (current <= 0) return { color: 'text-red-600', label: 'Esgotado', bg: 'bg-red-100' };
        if (current <= min) return { color: 'text-yellow-600', label: 'Estoque Baixo', bg: 'bg-yellow-100' };
        return { color: 'text-green-600', label: 'Normal', bg: 'bg-green-100' };
    };

    const getThemeClasses = () => {
        if (theme === 'dracula') {
            return {
                card: 'bg-[#44475a]',
                text: 'text-[#f8f8f2]',
                border: 'border-[#6272a4]',
                code: 'font-mono text-sm text-[#bd93f9]',
                input: 'bg-[#282a36] border-[#6272a4] text-[#f8f8f2] placeholder-[#6272a4] focus:ring-[#bd93f9]',
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
                input: 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500',
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
            input: 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500',
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

    const totalValue = materials.reduce((sum, m) => sum + (m.current_stock * (m.cost_price || 0)), 0);
    const lowStockCount = materials.filter(m => m.current_stock <= m.min_stock).length;

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pt-20 pb-8">
            <ThemeToggle />
            
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <h1 className={`text-3xl font-bold ${classes.text}`}>
                        Almoxarifado
                    </h1>
                    <button
                        onClick={() => {
                            resetForm();
                            setShowForm(true);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        + Novo Material
                    </button>
                </div>

                {/* Cards de Resumo */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className={`${classes.card} p-4 rounded-lg shadow`}>
                        <p className={`text-sm ${classes.text} opacity-70`}>Total de Itens</p>
                        <p className={`text-2xl font-bold ${classes.text}`}>{materials.length}</p>
                    </div>
                    <div className={`${classes.card} p-4 rounded-lg shadow`}>
                        <p className={`text-sm ${classes.text} opacity-70`}>Valor em Estoque</p>
                        <p className={`text-2xl font-bold ${classes.text}`}>
                            R$ {totalValue.toFixed(2)}
                        </p>
                    </div>
                    <div className={`${classes.card} p-4 rounded-lg shadow`}>
                        <p className={`text-sm ${classes.text} opacity-70`}>Itens em Baixa</p>
                        <p className={`text-2xl font-bold text-yellow-600`}>{lowStockCount}</p>
                    </div>
                    <div className={`${classes.card} p-4 rounded-lg shadow`}>
                        <p className={`text-sm ${classes.text} opacity-70`}>Itens Esgotados</p>
                        <p className={`text-2xl font-bold text-red-600`}>
                            {materials.filter(m => m.current_stock <= 0).length}
                        </p>
                    </div>
                </div>

                {/* Busca e Filtros */}
                <div className={`${classes.card} p-4 rounded-lg shadow mb-6`}>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Buscar por código..."
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
                        <select
                            className={`p-2 border rounded focus:outline-none focus:ring-2 ${classes.select}`}
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

                {/* Lista de Materiais */}
                <div className="grid gap-4">
                    {materials.map(material => {
                        const stockStatus = getStockStatus(material.current_stock, material.min_stock);
                        return (
                            <div key={material.id} className={`${classes.card} p-4 rounded-lg shadow hover:shadow-lg transition-shadow`}>
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <div className="flex items-center space-x-1">
                                                <code className={`text-xs font-mono ${classes.code}`}>
                                                    {material.operation_code || '-'}
                                                </code>
                                                {material.operation_code && (
                                                    <button
                                                        onClick={() => copyToClipboard(material.operation_code)}
                                                        className="text-xs opacity-50 hover:opacity-100"
                                                        title="Copiar código"
                                                    >
                                                        📋
                                                    </button>
                                                )}
                                            </div>

                                            <div className="flex space-x-2 mt-4 md:mt-0">
                                                <button
                                                    onClick={() => handleOpenMovement(material, 'entrada')}
                                                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                                                >
                                                    + Entrada
                                                </button>
                                                <button
                                                    onClick={() => handleOpenMovement(material, 'saida')}
                                                    className="px-3 py-1 bg-orange-600 text-white rounded hover:bg-orange-700 text-sm"
                                                >
                                                    - Saída
                                                </button>
                                                <button
                                                    onClick={() => handleOpenInventory(material)}
                                                    className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
                                                >
                                                    📊 Inventário
                                                </button>
                                                <button
                                                    onClick={() => setShowDetails(material)}
                                                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                                                >
                                                    Detalhes
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(material)}
                                                    className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
                                                >
                                                    Editar
                                                </button>
                                            </div>

                                            <h3 className={`text-lg font-bold ${classes.text}`}>{material.name}</h3>
                                            <span className="px-2 py-1 bg-gray-200 text-gray-800 text-xs rounded-full">
                                                {material.code}
                                            </span>
                                            <span className={`px-2 py-1 text-xs rounded-full ${stockStatus.bg} ${stockStatus.color}`}>
                                                {stockStatus.label}
                                            </span>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-sm">
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
                                                <span className="opacity-70">Estoque:</span> 
                                                <span className={`font-bold ml-1 ${stockStatus.color}`}>
                                                    {material.current_stock} {material.unit}
                                                </span>
                                                <span className="opacity-70 ml-1">(min: {material.min_stock})</span>
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex space-x-2 mt-4 md:mt-0">
                                        <button
                                            onClick={() => setShowDetails(material)}
                                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                                        >
                                            Detalhes
                                        </button>
                                        <button
                                            onClick={() => handleEdit(material)}
                                            className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
                                        >
                                            Editar
                                        </button>
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

            {/* Modal de Criação/Edição */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className={`${classes.card} rounded-lg p-6 w-[600px] max-h-[90vh] overflow-y-auto`}>
                        <h3 className={`text-xl font-bold mb-4 ${classes.text}`}>
                            {editingMaterial ? 'Editar' : 'Novo'} Material
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
                                        Código *
                                    </label>
                                    <input
                                        type="text"
                                        className={`w-full p-2 border rounded focus:outline-none focus:ring-2 ${classes.input}`}
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
                                        Unidade *
                                    </label>
                                    <select
                                        className={`w-full p-2 border rounded focus:outline-none focus:ring-2 ${classes.select}`}
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
                                        className={`w-full p-2 border rounded focus:outline-none focus:ring-2 ${classes.input}`}
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
                                        className={`w-full p-2 border rounded focus:outline-none focus:ring-2 ${classes.input}`}
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
                                        className={`w-full p-2 border rounded focus:outline-none focus:ring-2 ${classes.input}`}
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
                                        step="0.01"
                                        min="0"
                                        className={`w-full p-2 border rounded focus:outline-none focus:ring-2 ${classes.input}`}
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
                                        className={`w-full p-2 border rounded focus:outline-none focus:ring-2 ${classes.input}`}
                                        value={formData.supplier}
                                        onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className={`flex-1 py-2 rounded ${classes.button} disabled:opacity-50`}
                                >
                                    {formLoading ? 'Salvando...' : (editingMaterial ? 'Atualizar' : 'Salvar')}
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
                        <h3 className={`text-xl font-bold mb-4 ${classes.text}`}>Detalhes do Material</h3>
                        
                        {showDetails.operation_code && (
                            <div className="mb-4 p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
                                <p className={`text-xs ${classes.text} opacity-70`}>Código do Material</p>
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
                            </div>
                        )}
                        
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-2">
                                <span className="font-semibold">Nome:</span>
                                <span>{showDetails.name}</span>
                                
                                <span className="font-semibold">Código:</span>
                                <span>{showDetails.code}</span>
                                
                                <span className="font-semibold">Categoria:</span>
                                <span>{showDetails.category_name}</span>
                                
                                <span className="font-semibold">Unidade:</span>
                                <span>{showDetails.unit}</span>
                                
                                <span className="font-semibold">Estoque Atual:</span>
                                <span className={`font-bold ${
                                    showDetails.current_stock <= showDetails.min_stock ? 'text-red-600' : 'text-green-600'
                                }`}>
                                    {showDetails.current_stock} {showDetails.unit}
                                </span>
                                
                                <span className="font-semibold">Estoque Mínimo:</span>
                                <span>{showDetails.min_stock} {showDetails.unit}</span>
                                
                                <span className="font-semibold">Localização:</span>
                                <span>{showDetails.location || 'N/A'}</span>
                                
                                <span className="font-semibold">Fornecedor:</span>
                                <span>{showDetails.supplier || 'N/A'}</span>
                                
                                <span className="font-semibold">Preço de Custo:</span>
                                <span>R$ {showDetails.cost_price || '0'}</span>
                                
                                <span className="font-semibold">Valor em Estoque:</span>
                                <span>R$ {((showDetails.current_stock || 0) * (showDetails.cost_price || 0)).toFixed(2)}</span>
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
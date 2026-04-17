import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/api';
import { useTheme } from '../../../context/ThemeContext';
import { useAuth } from '../../../context/AuthContext';
import ThemeToggle from '../../../components/ThemeToggle';

export default function GuestList() {
    const [guests, setGuests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchCode, setSearchCode] = useState('');
    const [showDetails, setShowDetails] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingGuest, setEditingGuest] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        document: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        country: 'Brasil'
    });
    const [formLoading, setFormLoading] = useState(false);
    const { theme } = useTheme();
    const { user, hasPermission } = useAuth();

    const canEdit = user?.role === 'admin' || user?.role === 'colaborador';

    useEffect(() => {
        loadGuests();
    }, [searchCode]);

    const loadGuests = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (searchCode) params.append('code', searchCode);
            
            const response = await api.get(`/hotel/guests?${params}`);
            setGuests(response.data);
        } catch (error) {
            console.error('Erro ao carregar hóspedes:', error);
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
            await api.post('/hotel/guests', formData);
            alert('Hóspede cadastrado com sucesso!');
            setShowForm(false);
            resetForm();
            loadGuests();
        } catch (error) {
            alert(error.response?.data?.error || 'Erro ao cadastrar hóspede');
        } finally {
            setFormLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            document: '',
            email: '',
            phone: '',
            address: '',
            city: '',
            state: '',
            country: 'Brasil'
        });
    };

    // =====================================================
    // FUNÇÕES DE CRUD
    // =====================================================
    
    const handleEdit = (guest) => {
        setEditingGuest(guest);
        setFormData({
            name: guest.name,
            document: guest.document,
            email: guest.email || '',
            phone: guest.phone || '',
            address: guest.address || '',
            city: guest.city || '',
            state: guest.state || '',
            country: guest.country || 'Brasil'
        });
        setShowEditModal(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        
        try {
            await api.put(`/hotel/guests/${editingGuest.id}`, formData);
            alert('Hóspede atualizado com sucesso!');
            setShowEditModal(false);
            setEditingGuest(null);
            loadGuests();
        } catch (error) {
            alert(error.response?.data?.error || 'Erro ao atualizar hóspede');
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Tem certeza que deseja excluir este hóspede?')) return;
        
        try {
            await api.delete(`/hotel/guests/${id}`);
            loadGuests();
        } catch (error) {
            alert(error.response?.data?.error || 'Erro ao excluir hóspede');
        }
    };


    const getThemeClasses = () => {
        if (theme === 'dracula') {
            return {
                card: 'bg-[#44475a]',
                text: 'text-[#f8f8f2]',
                border: 'border-[#6272a4]',
                code: 'font-mono text-sm text-[#bd93f9]',
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
                code: 'font-mono text-sm text-blue-400',
                input: 'bg-gray-700 border-gray-600 text-white placeholder-gray-400',
                button: 'bg-blue-600 hover:bg-blue-700 text-white',
                cancelButton: 'bg-gray-600 hover:bg-gray-500 text-white'
            };
        }
        return {
            card: 'bg-white',
            text: 'text-gray-900',
            border: 'border-gray-200',
            code: 'font-mono text-sm text-blue-600',
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
                        Hóspedes
                    </h1>
                    <button
                        onClick={() => setShowForm(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        + Novo Hóspede
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
                            className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${classes.input}`}
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

                {/* Lista de Hóspedes */}
                <div className={`${classes.card} rounded-lg shadow overflow-hidden`}>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${classes.text}`}>
                                        Código
                                    </th>
                                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${classes.text}`}>
                                        Nome
                                    </th>
                                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${classes.text}`}>
                                        Documento
                                    </th>
                                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${classes.text}`}>
                                        Contato
                                    </th>
                                    <th className={`px-6 py-3 text-center text-xs font-medium uppercase tracking-wider ${classes.text}`}>
                                        Reservas
                                    </th>
                                    <th className={`px-6 py-3 text-center text-xs font-medium uppercase tracking-wider ${classes.text}`}>
                                        Ações
                                    </th>
                                  </tr>
                            </thead>
                            <tbody className="divide-y">
                                {guests.map(guest => (
                                    <tr key={guest.id} className={`${classes.text} hover:bg-gray-50 dark:hover:bg-gray-700`}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center space-x-2">
                                                <code className={`${classes.code} cursor-pointer`}
                                                      onClick={() => copyToClipboard(guest.operation_code)}
                                                      title="Clique para copiar">
                                                    {guest.operation_code || '-'}
                                                </code>
                                                {guest.operation_code && (
                                                    <button
                                                        onClick={() => copyToClipboard(guest.operation_code)}
                                                        className="text-xs opacity-50 hover:opacity-100"
                                                        title="Copiar código"
                                                    >
                                                        📋
                                                    </button>
                                                )}
                                            </div>
                                         </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium">
                                            {guest.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {guest.document}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>{guest.email}</div>
                                            <div className="text-sm opacity-70">{guest.phone}</div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                                {guest.total_bookings || 0} reservas
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">

                                            <div className="flex justify-center space-x-2">
                                                <button
                                                    onClick={() => setShowDetails(guest)}
                                                    className="text-blue-600 hover:text-blue-800"
                                                    title="Detalhes"
                                                >
                                                    👁️
                                                </button>
                                                {canEdit && (
                                                    <button
                                                        onClick={() => handleEdit(guest)}
                                                        className="text-green-600 hover:text-green-800"
                                                        title="Editar"
                                                    >
                                                        ✏️
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(guest.id)}
                                                    className="text-red-600 hover:text-red-800"
                                                    title="Excluir"
                                                >
                                                    🗑️
                                                </button>
                                            </div>

                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {guests.length === 0 && (
                        <div className="p-8 text-center">
                            <p className={classes.text}>Nenhum hóspede encontrado</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de Cadastro */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className={`${classes.card} rounded-lg p-6 w-[500px] max-h-[90vh] overflow-y-auto`}>
                        <h3 className={`text-xl font-bold mb-4 ${classes.text}`}>
                            Novo Hóspede
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                    Nome *
                                </label>
                                <input
                                    type="text"
                                    className={`w-full p-2 border rounded ${classes.input}`}
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    required
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                    CPF / Documento *
                                </label>
                                <input
                                    type="text"
                                    className={`w-full p-2 border rounded ${classes.input}`}
                                    value={formData.document}
                                    onChange={(e) => setFormData({...formData, document: e.target.value})}
                                    required
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                    Email
                                </label>
                                <input
                                    type="email"
                                    className={`w-full p-2 border rounded ${classes.input}`}
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                    Telefone
                                </label>
                                <input
                                    type="tel"
                                    className={`w-full p-2 border rounded ${classes.input}`}
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                    Endereço
                                </label>
                                <input
                                    type="text"
                                    className={`w-full p-2 border rounded ${classes.input}`}
                                    value={formData.address}
                                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                        Cidade
                                    </label>
                                    <input
                                        type="text"
                                        className={`w-full p-2 border rounded ${classes.input}`}
                                        value={formData.city}
                                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                        UF
                                    </label>
                                    <input
                                        type="text"
                                        maxLength="2"
                                        className={`w-full p-2 border rounded ${classes.input}`}
                                        value={formData.state}
                                        onChange={(e) => setFormData({...formData, state: e.target.value.toUpperCase()})}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                    País
                                </label>
                                <input
                                    type="text"
                                    className={`w-full p-2 border rounded ${classes.input}`}
                                    value={formData.country}
                                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                                />
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

            {/* Modal de Edição */}
            {showEditModal && editingGuest && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className={`${classes.card} rounded-lg p-6 w-96 max-h-[90vh] overflow-y-auto`}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className={`text-xl font-bold ${classes.text}`}>
                                Editar Hóspede
                            </h3>
                            <button 
                                onClick={() => {
                                    setShowEditModal(false);
                                    setEditingGuest(null);
                                }} 
                                className={classes.text}
                            >
                                ✕
                            </button>
                        </div>
                        
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div>
                                <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                    Nome *
                                </label>
                                <input
                                    type="text"
                                    className={`w-full p-2 border rounded ${classes.input}`}
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    required
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                    CPF / Documento *
                                </label>
                                <input
                                    type="text"
                                    className={`w-full p-2 border rounded ${classes.input}`}
                                    value={formData.document}
                                    onChange={(e) => setFormData({...formData, document: e.target.value})}
                                    required
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                    Email
                                </label>
                                <input
                                    type="email"
                                    className={`w-full p-2 border rounded ${classes.input}`}
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                    Telefone
                                </label>
                                <input
                                    type="tel"
                                    className={`w-full p-2 border rounded ${classes.input}`}
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                    Endereço
                                </label>
                                <input
                                    type="text"
                                    className={`w-full p-2 border rounded ${classes.input}`}
                                    value={formData.address}
                                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                        Cidade
                                    </label>
                                    <input
                                        type="text"
                                        className={`w-full p-2 border rounded ${classes.input}`}
                                        value={formData.city}
                                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                        UF
                                    </label>
                                    <input
                                        type="text"
                                        maxLength="2"
                                        className={`w-full p-2 border rounded ${classes.input}`}
                                        value={formData.state}
                                        onChange={(e) => setFormData({...formData, state: e.target.value.toUpperCase()})}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                    País
                                </label>
                                <input
                                    type="text"
                                    className={`w-full p-2 border rounded ${classes.input}`}
                                    value={formData.country}
                                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                                />
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className={`flex-1 py-2 rounded ${classes.button} disabled:opacity-50`}
                                >
                                    {formLoading ? 'Salvando...' : 'Atualizar'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setEditingGuest(null);
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
                        <h3 className={`text-xl font-bold mb-4 ${classes.text}`}>Detalhes do Hóspede</h3>
                        
                        {showDetails.operation_code && (
                            <div className={`mb-4 p-3 rounded-lg bg-gray-100 dark:bg-gray-700`}>
                                <p className={`text-xs ${classes.text} opacity-70`}>Código do Hóspede</p>
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
                                
                                <span className="font-semibold">Documento:</span>
                                <span>{showDetails.document}</span>
                                
                                <span className="font-semibold">Email:</span>
                                <span>{showDetails.email}</span>
                                
                                <span className="font-semibold">Telefone:</span>
                                <span>{showDetails.phone}</span>
                                
                                <span className="font-semibold">Endereço:</span>
                                <span>{showDetails.address || 'N/A'}</span>
                                
                                <span className="font-semibold">Cidade/UF:</span>
                                <span>{showDetails.city ? `${showDetails.city}/${showDetails.state}` : 'N/A'}</span>
                                
                                <span className="font-semibold">Cadastro:</span>
                                <span>{new Date(showDetails.created_at).toLocaleDateString()}</span>
                                
                                <span className="font-semibold">Reservas:</span>
                                <span>{showDetails.total_bookings || 0}</span>
                            </div>
                        </div>
                        
                        <button
                            onClick={() => setShowDetails(null)}
                            className="w-full mt-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
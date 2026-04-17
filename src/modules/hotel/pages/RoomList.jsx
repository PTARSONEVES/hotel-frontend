import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { useTheme } from '../../../context/ThemeContext'; // <-- ADICIONAR ESTA IMPORT
import ThemeToggle from '../../../components/ThemeToggle';

export default function RoomList() {
    const [rooms, setRooms] = useState([]);
    const [roomTypes, setRoomTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);
    const [formLoading, setFormLoading] = useState(false);
    const [showDetails, setShowDetails] = useState(null);
    const [formData, setFormData] = useState({
        room_number: '',
        floor: '',
        room_type_id: '',
        block: '',
        ownership: 'proprio',
        observations: '',
        maintenance_notes: ''
    });

    const { theme } = useTheme(); // <-- AGORA FUNCIONA

    // =====================================================
    // FUNÇÃO DE TEMAS
    // =====================================================
    const getThemeClasses = () => {
        if (theme === 'dracula') {
            return {
                card: 'bg-[#44475a]',
                text: 'text-[#f8f8f2]',
                border: 'border-[#6272a4]',
                code: 'font-mono text-sm text-[#bd93f9]',
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
                code: 'font-mono text-sm text-blue-400',
                input: 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500',
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
            button: 'bg-blue-600 hover:bg-blue-700 text-white',
            cancelButton: 'bg-gray-500 hover:bg-gray-600 text-white'
        };
    };

    const classes = getThemeClasses();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [roomsRes, typesRes] = await Promise.all([
                api.get('/hotel/rooms'),
                api.get('/hotel/room-types')
            ]);
            setRooms(roomsRes.data);
            setRoomTypes(typesRes.data);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        
        try {
            if (editingRoom) {
                await api.put(`/hotel/rooms/${editingRoom.id}`, formData);
                alert('Apartamento atualizado com sucesso!');
            } else {
                const response = await api.post('/hotel/rooms', formData);
                if (response.data.operationCode) {
                    alert(`Apartamento criado com sucesso!\nCódigo: ${response.data.operationCode}`);
                } else {
                    alert('Apartamento criado com sucesso!');
                }
            }
            
            resetForm();
            setShowForm(false);
            setEditingRoom(null);
            await loadData();
            
        } catch (error) {
            console.error('❌ Erro:', error);
            const errorMsg = error.response?.data?.error || error.message || 'Erro ao salvar';
            alert(errorMsg);
        } finally {
            setFormLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            room_number: '',
            floor: '',
            room_type_id: '',
            block: '',
            ownership: 'proprio',
            observations: '',
            maintenance_notes: ''
        });
    };

    const handleEdit = (room) => {
        setEditingRoom(room);
        setFormData({
            room_number: room.room_number,
            floor: room.floor,
            room_type_id: room.room_type_id,
            block: room.block || '',
            ownership: room.ownership || 'proprio',
            observations: room.observations || '',
            maintenance_notes: room.maintenance_notes || ''
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (confirm('Tem certeza que deseja excluir este apartamento?')) {
            try {
                await api.delete(`/hotel/rooms/${id}`);
                loadData();
            } catch (error) {
                alert(error.response?.data?.error || 'Erro ao excluir');
            }
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
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Gerenciar Apartamentos
                    </h1>
                    <button
                        onClick={() => setShowForm(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Novo Apartamento
                    </button>
                </div>

                {/* Tabela de Apartamentos */}
                <div className={`${classes.card} rounded-lg shadow overflow-hidden`}>
                    <table className="min-w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${classes.text}`}>
                                    Código
                                </th>
                                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${classes.text}`}>
                                    Número
                                </th>
                                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${classes.text}`}>
                                    Bloco
                                </th>
                                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${classes.text}`}>
                                    Andar
                                </th>
                                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${classes.text}`}>
                                    Tipo
                                </th>
                                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${classes.text}`}>
                                    Status
                                </th>
                                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${classes.text}`}>
                                    Propriedade
                                </th>
                                <th className={`px-6 py-3 text-center text-xs font-medium uppercase tracking-wider ${classes.text}`}>
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {rooms.map(room => (
                                <tr key={room.id} className={`${classes.text}`}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <code className={`text-xs font-mono ${classes.code}`}>
                                            {room.operation_code || '-'}
                                        </code>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                                        {room.room_number}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {room.block || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {room.floor}º
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {room.room_type_name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                            room.status === 'disponivel' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                            room.status === 'ocupado' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                                            room.status === 'manutencao' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                            'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                        }`}>
                                            {room.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                            room.ownership === 'proprio' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                                        }`}>
                                            {room.ownership === 'proprio' ? 'Próprio' : 'Terceiro'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <div className="flex justify-center space-x-2">
                                            <button
                                                onClick={() => setShowDetails(room)}
                                                className="text-blue-600 hover:text-blue-800"
                                                title="Detalhes"
                                            >
                                                👁️
                                            </button>
                                            <button
                                                onClick={() => handleEdit(room)}
                                                className="text-gray-600 hover:text-gray-800"
                                                title="Editar"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                onClick={() => handleDelete(room.id)}
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
            </div>

            {/* Modal Formulário */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className={`${classes.card} rounded-lg p-6 w-96`}>
                        <h3 className={`text-xl font-bold mb-4 ${classes.text}`}>
                            {editingRoom ? 'Editar' : 'Novo'} Apartamento
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <input
                                type="text"
                                placeholder="Número (ex: 101)"
                                className={`w-full p-2 border rounded ${classes.input}`}
                                value={formData.room_number}
                                onChange={(e) => setFormData({...formData, room_number: e.target.value})}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Bloco (ex: A, B, C)"
                                className={`w-full p-2 border rounded ${classes.input}`}
                                value={formData.block}
                                onChange={(e) => setFormData({...formData, block: e.target.value})}
                            />
                            <input
                                type="number"
                                placeholder="Andar"
                                className={`w-full p-2 border rounded ${classes.input}`}
                                value={formData.floor}
                                onChange={(e) => setFormData({...formData, floor: e.target.value})}
                                required
                            />
                            <select
                                className={`w-full p-2 border rounded ${classes.input}`}
                                value={formData.room_type_id}
                                onChange={(e) => setFormData({...formData, room_type_id: e.target.value})}
                                required
                            >
                                <option value="">Selecione o tipo</option>
                                {roomTypes.map(type => (
                                    <option key={type.id} value={type.id}>
                                        {type.name}
                                    </option>
                                ))}
                            </select>
                            <select
                                className={`w-full p-2 border rounded ${classes.input}`}
                                value={formData.ownership}
                                onChange={(e) => setFormData({...formData, ownership: e.target.value})}
                            >
                                <option value="proprio">Próprio</option>
                                <option value="terceiro">Terceiro</option>
                            </select>
                            <textarea
                                placeholder="Observações (opcional)"
                                rows="2"
                                className={`w-full p-2 border rounded ${classes.input}`}
                                value={formData.observations}
                                onChange={(e) => setFormData({...formData, observations: e.target.value})}
                            />
                            <textarea
                                placeholder="Observações de Manutenção (opcional)"
                                rows="2"
                                className={`w-full p-2 border rounded ${classes.input}`}
                                value={formData.maintenance_notes}
                                onChange={(e) => setFormData({...formData, maintenance_notes: e.target.value})}
                            />
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
                                        setEditingRoom(null);
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
                        <div className="flex justify-between items-center mb-4">
                            <h3 className={`text-xl font-bold ${classes.text}`}>
                                Detalhes do Apartamento
                            </h3>
                            <button 
                                onClick={() => setShowDetails(null)} 
                                className={`${classes.text} hover:opacity-70 transition-opacity`}
                            >
                                ✕
                            </button>
                        </div>
                        
                        {/* Código */}
                        {showDetails.operation_code && (
                            <div className={`mb-4 p-3 rounded-lg ${theme === 'dracula' ? 'bg-[#6272a4]' : 'bg-gray-100 dark:bg-gray-700'}`}>
                                <p className={`text-xs ${classes.text} opacity-70`}>Código do Apartamento</p>
                                <div className="flex items-center justify-between">
                                    <code className={`text-lg font-bold font-mono ${classes.code}`}>
                                        {showDetails.operation_code}
                                    </code>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(showDetails.operation_code);
                                            alert('Código copiado!');
                                        }}
                                        className={`px-2 py-1 rounded text-sm transition-colors ${classes.button}`}
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
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <p className={`text-xs ${classes.text} opacity-70`}>Número</p>
                                    <p className={`font-medium ${classes.text}`}>{showDetails.room_number}</p>
                                </div>
                                <div>
                                    <p className={`text-xs ${classes.text} opacity-70`}>Bloco</p>
                                    <p className={`font-medium ${classes.text}`}>{showDetails.block || '-'}</p>
                                </div>
                                <div>
                                    <p className={`text-xs ${classes.text} opacity-70`}>Andar</p>
                                    <p className={`font-medium ${classes.text}`}>{showDetails.floor}º</p>
                                </div>
                                <div>
                                    <p className={`text-xs ${classes.text} opacity-70`}>Tipo</p>
                                    <p className={`font-medium ${classes.text}`}>{showDetails.room_type_name}</p>
                                </div>
                                <div>
                                    <p className={`text-xs ${classes.text} opacity-70`}>Status</p>
                                    <p className={`font-medium ${classes.text}`}>
                                        <span className={`px-2 py-1 text-xs rounded-full inline-block ${
                                            showDetails.status === 'disponivel' ? 
                                                (theme === 'dracula' ? 'bg-[#50fa7b] text-[#282a36]' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200') :
                                            showDetails.status === 'ocupado' ? 
                                                (theme === 'dracula' ? 'bg-[#ff5555] text-[#f8f8f2]' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200') :
                                            showDetails.status === 'manutencao' ? 
                                                (theme === 'dracula' ? 'bg-[#f1fa8c] text-[#282a36]' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200') :
                                                (theme === 'dracula' ? 'bg-[#6272a4] text-[#f8f8f2]' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200')
                                        }`}>
                                            {showDetails.status === 'disponivel' ? 'Disponível' :
                                            showDetails.status === 'ocupado' ? 'Ocupado' :
                                            showDetails.status === 'manutencao' ? 'Manutenção' : 'Reservado'}
                                        </span>
                                    </p>
                                </div>
                                <div>
                                    <p className={`text-xs ${classes.text} opacity-70`}>Propriedade</p>
                                    <p className={`font-medium ${classes.text}`}>
                                        <span className={`px-2 py-1 text-xs rounded-full inline-block ${
                                            showDetails.ownership === 'proprio' ?
                                                (theme === 'dracula' ? 'bg-[#bd93f9] text-[#282a36]' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200') :
                                                (theme === 'dracula' ? 'bg-[#ff79c6] text-[#282a36]' : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200')
                                        }`}>
                                            {showDetails.ownership === 'proprio' ? '🏢 Próprio' : '🤝 Terceiro'}
                                        </span>
                                    </p>
                                </div>
                            </div>
                            
                            {showDetails.observations && (
                                <div className="mt-3">
                                    <p className={`text-xs ${classes.text} opacity-70`}>Observações</p>
                                    <p className={`mt-1 p-2 rounded-lg ${classes.input} ${classes.text}`}>
                                        {showDetails.observations}
                                    </p>
                                </div>
                            )}
                            
                            {showDetails.maintenance_notes && (
                                <div className="mt-3">
                                    <p className={`text-xs ${classes.text} opacity-70`}>Observações de Manutenção</p>
                                    <p className={`mt-1 p-2 rounded-lg ${classes.input} ${classes.text}`}>
                                        {showDetails.maintenance_notes}
                                    </p>
                                </div>
                            )}
                        </div>
                        
                        <button
                            onClick={() => setShowDetails(null)}
                            className={`w-full mt-6 py-2 rounded transition-colors ${classes.button}`}
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
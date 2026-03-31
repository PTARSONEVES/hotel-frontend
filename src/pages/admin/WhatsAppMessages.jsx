import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import ThemeToggle from '../../components/ThemeToggle';
import { useTheme } from '../../context/ThemeContext';

export default function WhatsAppMessages() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: '',
        startDate: '',
        endDate: ''
    });
    const { theme } = useTheme();

    useEffect(() => {
        loadMessages();
    }, [filters]);

    const loadMessages = async () => {
        try {
            const params = new URLSearchParams();
            if (filters.status) params.append('status', filters.status);
            if (filters.startDate) params.append('startDate', filters.startDate);
            if (filters.endDate) params.append('endDate', filters.endDate);
            
            const response = await api.get(`/admin/whatsapp/messages?${params}`);
            setMessages(response.data);
        } catch (error) {
            console.error('Erro ao carregar mensagens:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsReplied = async (id) => {
        try {
            await api.put(`/admin/whatsapp/messages/${id}/replied`);
            loadMessages();
        } catch (error) {
            alert('Erro ao marcar mensagem');
        }
    };

    const getThemeClasses = () => {
        if (theme === 'dracula') {
            return {
                card: 'bg-[#44475a]',
                text: 'text-[#f8f8f2]',
                border: 'border-[#6272a4]'
            };
        }
        if (theme === 'dark') {
            return {
                card: 'bg-gray-800',
                text: 'text-white',
                border: 'border-gray-700'
            };
        }
        return {
            card: 'bg-white',
            text: 'text-gray-900',
            border: 'border-gray-200'
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
                        Atendimentos WhatsApp
                    </h1>
                </div>

                {/* Filtros */}
                <div className={`${classes.card} p-4 rounded-lg shadow mb-6`}>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <select
                            className={`p-2 border rounded ${classes.border} ${classes.text}`}
                            value={filters.status}
                            onChange={(e) => setFilters({...filters, status: e.target.value})}
                        >
                            <option value="">Todos os status</option>
                            <option value="received">Recebidas</option>
                            <option value="replied">Respondidas</option>
                            <option value="pending">Pendentes</option>
                        </select>
                        
                        <input
                            type="date"
                            className={`p-2 border rounded ${classes.border} ${classes.text}`}
                            value={filters.startDate}
                            onChange={(e) => setFilters({...filters, startDate: e.target.value})}
                        />
                        
                        <input
                            type="date"
                            className={`p-2 border rounded ${classes.border} ${classes.text}`}
                            value={filters.endDate}
                            onChange={(e) => setFilters({...filters, endDate: e.target.value})}
                        />
                        
                        <button
                            onClick={() => setFilters({status: '', startDate: '', endDate: ''})}
                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                            Limpar Filtros
                        </button>
                    </div>
                </div>

                {/* Lista de Mensagens */}
                <div className="grid gap-4">
                    {messages.map(msg => (
                        <div key={msg.id} className={`${classes.card} p-4 rounded-lg shadow`}>
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <span className={`font-bold ${classes.text}`}>
                                        {msg.from_name || msg.from_number}
                                    </span>
                                    <span className={`ml-2 text-sm ${classes.text} opacity-70`}>
                                        {new Date(msg.created_at).toLocaleString()}
                                    </span>
                                </div>
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                    msg.status === 'replied' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {msg.status === 'replied' ? 'Respondida' : 'Aguardando'}
                                </span>
                            </div>
                            
                            <div className={`mb-3 p-2 bg-gray-100 dark:bg-gray-700 rounded`}>
                                <p className={`text-sm ${classes.text}`}>
                                    <span className="font-semibold">Mensagem:</span> {msg.message}
                                </p>
                            </div>
                            
                            {msg.reply && (
                                <div className={`mb-3 p-2 bg-blue-100 dark:bg-blue-900 rounded`}>
                                    <p className={`text-sm ${classes.text}`}>
                                        <span className="font-semibold">Resposta:</span> {msg.reply}
                                    </p>
                                </div>
                            )}
                            
                            {msg.status !== 'replied' && (
                                <div className="flex justify-end">
                                    <button
                                        onClick={() => markAsReplied(msg.id)}
                                        className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                                    >
                                        Marcar como respondida
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                    
                    {messages.length === 0 && (
                        <div className={`${classes.card} p-8 text-center rounded-lg`}>
                            <p className={classes.text}>Nenhuma mensagem encontrada</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
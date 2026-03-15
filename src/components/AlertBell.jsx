import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useTheme } from '../context/ThemeContext';

export default function AlertBell() {
    const [alerts, setAlerts] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const { theme } = useTheme();

    useEffect(() => {
        loadAlerts();
        // Recarregar a cada 5 minutos
        const interval = setInterval(loadAlerts, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const loadAlerts = async () => {
        try {
            const response = await api.get('/hotel/alerts');
            setAlerts(response.data);
        } catch (error) {
            console.error('Erro ao carregar alertas:', error);
        }
    };

    const resolveAlert = async (id) => {
        try {
            await api.post(`/hotel/alerts/${id}/resolve`);
            setAlerts(alerts.filter(a => a.id !== id));
        } catch (error) {
            console.error('Erro ao resolver alerta:', error);
        }
    };

    const getPriorityColor = (priority) => {
        switch(priority) {
            case 'urgente': return 'bg-red-500';
            case 'alta': return 'bg-orange-500';
            case 'media': return 'bg-yellow-500';
            default: return 'bg-blue-500';
        }
    };

    const getTypeIcon = (type) => {
        switch(type) {
            case 'upcoming_checkin': return '🔔';
            case 'overdue_checkin': return '🚨';
            case 'overdue_payment': return '💰';
            default: return '📌';
        }
    };

    const urgentCount = alerts.filter(a => a.priority === 'urgente').length;

    return (
        <div className="relative">
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className={`relative p-2 rounded-lg transition-colors
                    ${theme === 'dracula' ? 'hover:bg-[#44475a] text-[#f8f8f2]' : 
                      theme === 'dark' ? 'hover:bg-gray-700 text-gray-300' : 
                      'hover:bg-gray-100 text-gray-700'}`}
                title="Alertas"
            >
                🔔
                {urgentCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                        {urgentCount}
                    </span>
                )}
            </button>

            {showDropdown && (
                <div className={`absolute right-0 mt-2 w-96 max-h-96 overflow-y-auto rounded-lg shadow-lg z-50
                    ${theme === 'dracula' ? 'bg-[#282a36] border border-[#44475a]' : 
                      theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 
                      'bg-white border border-gray-200'}`}>
                    
                    <div className={`p-3 border-b font-bold sticky top-0
                        ${theme === 'dracula' ? 'bg-[#282a36] border-[#44475a]' : 
                          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 
                          'bg-white border-gray-200'}`}>
                        Alertas ({alerts.length})
                    </div>

                    {alerts.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                            Nenhum alerta no momento
                        </div>
                    ) : (
                        alerts.map(alert => (
                            <div key={alert.id} className={`p-3 border-b last:border-b-0
                                ${theme === 'dracula' ? 'border-[#44475a] hover:bg-[#44475a]' : 
                                  theme === 'dark' ? 'border-gray-700 hover:bg-gray-700' : 
                                  'border-gray-200 hover:bg-gray-50'}`}>
                                <div className="flex items-start space-x-2">
                                    <span className="text-xl">{getTypeIcon(alert.type)}</span>
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-1">
                                            <span className={`px-2 py-0.5 text-xs text-white rounded-full ${getPriorityColor(alert.priority)}`}>
                                                {alert.priority}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {new Date(alert.created_at).toLocaleDateString('pt-BR')}
                                            </span>
                                        </div>
                                        <p className={`text-sm ${
                                            theme === 'dracula' ? 'text-[#f8f8f2]' : 
                                            theme === 'dark' ? 'text-gray-300' : 
                                            'text-gray-700'
                                        }`}>
                                            {alert.message}
                                        </p>
                                        <div className="flex justify-end mt-2">
                                            <button
                                                onClick={() => resolveAlert(alert.id)}
                                                className="text-xs text-blue-600 hover:underline"
                                            >
                                                Marcar como resolvido
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
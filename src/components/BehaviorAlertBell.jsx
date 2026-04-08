import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { useTheme } from '../context/ThemeContext';

export default function BehaviorAlertBell() {
    const [alerts, setAlerts] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);
    const { theme } = useTheme();

    useEffect(() => {
        loadAlerts();
        const interval = setInterval(loadAlerts, 30000); // Atualizar a cada 30 segundos
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const loadAlerts = async () => {
        try {
            const response = await api.get('/admin/behavior-alerts?unread_only=true&limit=20');
            setAlerts(response.data.alerts);
            setUnreadCount(response.data.unreadCount);
        } catch (error) {
            console.error('Erro ao carregar alertas:', error);
        }
    };

    const markAsRead = async (id) => {
        try {
            await api.put(`/admin/behavior-alerts/${id}/read`);
            setAlerts(prev => prev.filter(a => a.id !== id));
            setUnreadCount(prev => prev - 1);
        } catch (error) {
            console.error('Erro ao marcar alerta:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.put('/admin/behavior-alerts/read-all');
            setAlerts([]);
            setUnreadCount(0);
        } catch (error) {
            console.error('Erro ao marcar todos:', error);
        }
    };

    const getSeverityColor = (severity) => {
        if (theme === 'dracula') {
            const colors = {
                critical: 'bg-[#ff5555] text-white',
                high: 'bg-[#ffb86c] text-[#282a36]',
                medium: 'bg-[#f1fa8c] text-[#282a36]',
                low: 'bg-[#6272a4] text-[#f8f8f2]'
            };
            return colors[severity] || colors.medium;
        }
        const colors = {
            critical: 'bg-red-500 text-white',
            high: 'bg-orange-500 text-white',
            medium: 'bg-yellow-500 text-white',
            low: 'bg-blue-500 text-white'
        };
        return colors[severity] || colors.medium;
    };

    const getAlertIcon = (type) => {
        switch(type) {
            case 'multiple_visits': return '🔄';
            case 'long_session': return '⏱️';
            case 'price_check': return '💰';
            case 'booking_attempt': return '📅';
            default: return '🔔';
        }
    };

    const getThemeClasses = () => {
        if (theme === 'dracula') {
            return {
                button: 'p-2 rounded-lg hover:bg-[#44475a] text-[#f8f8f2] transition-colors relative',
                dropdown: 'bg-[#282a36] border border-[#44475a]',
                header: 'border-b border-[#44475a]',
                alert: 'hover:bg-[#44475a] border-b border-[#44475a]',
                text: 'text-[#f8f8f2]',
                muted: 'text-[#6272a4]'
            };
        }
        if (theme === 'dark') {
            return {
                button: 'p-2 rounded-lg hover:bg-gray-700 text-gray-300 transition-colors relative',
                dropdown: 'bg-gray-800 border border-gray-700',
                header: 'border-b border-gray-700',
                alert: 'hover:bg-gray-700 border-b border-gray-700',
                text: 'text-white',
                muted: 'text-gray-400'
            };
        }
        return {
            button: 'p-2 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors relative',
            dropdown: 'bg-white border border-gray-200',
            header: 'border-b border-gray-200',
            alert: 'hover:bg-gray-50 border-b border-gray-100',
            text: 'text-gray-900',
            muted: 'text-gray-500'
        };
    };

    const classes = getThemeClasses();

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={classes.button}
                title="Alertas de Comportamento"
            >
                🚨
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className={`absolute right-0 mt-2 w-96 max-h-96 overflow-y-auto rounded-lg shadow-lg z-50 ${classes.dropdown}`}>
                    <div className={`p-3 flex justify-between items-center sticky top-0 ${classes.header} ${classes.dropdown}`}>
                        <span className={`font-bold ${classes.text}`}>
                            Alertas de Comportamento
                            {unreadCount > 0 && ` (${unreadCount} novos)`}
                        </span>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className={`text-xs ${classes.muted} hover:underline`}
                            >
                                Marcar todos como lidos
                            </button>
                        )}
                    </div>

                    {alerts.length === 0 ? (
                        <div className={`p-8 text-center ${classes.muted}`}>
                            Nenhum alerta de comportamento
                        </div>
                    ) : (
                        alerts.map(alert => (
                            <div
                                key={alert.id}
                                className={`p-3 cursor-pointer transition-colors ${classes.alert}`}
                            >
                                <div className="flex items-start space-x-3">
                                    <div className="text-2xl">{getAlertIcon(alert.alert_type)}</div>
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-1">
                                            <span className={`px-2 py-0.5 text-xs rounded-full ${getSeverityColor(alert.severity)}`}>
                                                {alert.severity}
                                            </span>
                                            <span className={`text-xs ${classes.muted}`}>
                                                {new Date(alert.created_at).toLocaleString()}
                                            </span>
                                        </div>
                                        <p className={`text-sm ${classes.text}`}>{alert.message}</p>
                                        <div className={`text-xs mt-1 ${classes.muted}`}>
                                            {alert.city || 'Localização'} | {alert.device_type} | {alert.browser}
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            markAsRead(alert.id);
                                        }}
                                        className={`text-xs ${classes.muted} hover:text-green-500`}
                                        title="Marcar como lido"
                                    >
                                        ✓
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
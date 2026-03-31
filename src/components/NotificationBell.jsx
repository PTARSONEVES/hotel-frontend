import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function NotificationBell() {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);
    const { theme } = useTheme();
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            loadNotifications();
            // Recarregar a cada 5 minutos
            const interval = setInterval(loadNotifications, 5 * 60 * 1000);
            return () => clearInterval(interval);
        }
    }, [user]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const loadNotifications = async () => {
        try {
            const response = await api.get('/maintenance/notifications?limit=30');
            setNotifications(response.data.notifications);
            setUnreadCount(response.data.unreadCount);
        } catch (error) {
            console.error('Erro ao carregar notificações:', error);
        }
    };

    const markAsRead = async (id) => {
        try {
            await api.put(`/maintenance/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => 
                n.id === id ? { ...n, read: true } : n
            ));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Erro ao marcar notificação:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.put('/maintenance/notifications/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Erro ao marcar todas:', error);
        }
    };

    const deleteNotification = async (id) => {
        try {
            await api.delete(`/maintenance/notifications/${id}`);
            setNotifications(prev => prev.filter(n => n.id !== id));
            if (!notifications.find(n => n.id === id)?.read) {
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error('Erro ao excluir notificação:', error);
        }
    };

    const getNotificationIcon = (type) => {
        switch(type) {
            case 'low_stock': return '📦';
            case 'overdue_os': return '⚠️';
            case 'os_created': return '📋';
            case 'os_completed': return '✅';
            case 'equipment_maintenance': return '🔧';
            default: return '🔔';
        }
    };

    const getNotificationColor = (type) => {
        if (theme === 'dracula') {
            switch(type) {
                case 'low_stock': return 'border-l-[#ffb86c]';
                case 'overdue_os': return 'border-l-[#ff5555]';
                case 'os_completed': return 'border-l-[#50fa7b]';
                default: return 'border-l-[#bd93f9]';
            }
        }
        switch(type) {
            case 'low_stock': return 'border-l-yellow-500';
            case 'overdue_os': return 'border-l-red-500';
            case 'os_completed': return 'border-l-green-500';
            default: return 'border-l-blue-500';
        }
    };

    const getThemeClasses = () => {
        if (theme === 'dracula') {
            return {
                button: 'p-2 rounded-lg hover:bg-[#44475a] text-[#f8f8f2] transition-colors',
                dropdown: 'bg-[#282a36] border border-[#44475a]',
                header: 'border-b border-[#44475a]',
                notification: 'hover:bg-[#44475a] border-b border-[#44475a]',
                unread: 'bg-[#44475a]',
                text: 'text-[#f8f8f2]',
                muted: 'text-[#6272a4]'
            };
        }
        if (theme === 'dark') {
            return {
                button: 'p-2 rounded-lg hover:bg-gray-700 text-gray-300 transition-colors',
                dropdown: 'bg-gray-800 border border-gray-700',
                header: 'border-b border-gray-700',
                notification: 'hover:bg-gray-700 border-b border-gray-700',
                unread: 'bg-gray-700',
                text: 'text-white',
                muted: 'text-gray-400'
            };
        }
        return {
            button: 'p-2 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors',
            dropdown: 'bg-white border border-gray-200',
            header: 'border-b border-gray-200',
            notification: 'hover:bg-gray-50 border-b border-gray-100',
            unread: 'bg-blue-50',
            text: 'text-gray-900',
            muted: 'text-gray-500'
        };
    };

    const classes = getThemeClasses();

    if (!user) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`relative ${classes.button}`}
                title="Notificações"
            >
                🔔
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
                            Notificações
                            {unreadCount > 0 && ` (${unreadCount} não lidas)`}
                        </span>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className={`text-xs ${classes.muted} hover:underline`}
                            >
                                Marcar todas como lidas
                            </button>
                        )}
                    </div>

                    {notifications.length === 0 ? (
                        <div className={`p-8 text-center ${classes.muted}`}>
                            Nenhuma notificação
                        </div>
                    ) : (
                        notifications.map(notif => (
                            <div
                                key={notif.id}
                                className={`p-3 cursor-pointer transition-colors ${classes.notification} ${!notif.read ? classes.unread : ''}`}
                                onClick={() => {
                                    if (!notif.read) markAsRead(notif.id);
                                    if (notif.link) window.location.href = notif.link;
                                }}
                            >
                                <div className="flex items-start space-x-3">
                                    <div className="text-2xl">{getNotificationIcon(notif.type)}</div>
                                    <div className="flex-1">
                                        <div className={`font-medium ${classes.text}`}>{notif.title}</div>
                                        <div className={`text-sm mt-1 ${classes.muted}`}>{notif.message}</div>
                                        <div className={`text-xs mt-2 ${classes.muted}`}>
                                            {new Date(notif.created_at).toLocaleString()}
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteNotification(notif.id);
                                        }}
                                        className={`text-xs ${classes.muted} hover:text-red-500`}
                                        title="Excluir"
                                    >
                                        ✕
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
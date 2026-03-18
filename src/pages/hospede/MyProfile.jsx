import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import ThemeToggle from '../../components/ThemeToggle';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export default function MyProfile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const { theme } = useTheme();
    const { user } = useAuth();

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const response = await api.get('/users/me');
            setProfile(response.data.user);
        } catch (error) {
            console.error('Erro ao carregar perfil:', error);
        } finally {
            setLoading(false);
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
            
            <div className="max-w-3xl mx-auto px-4">
                <h1 className={`text-3xl font-bold mb-8 ${classes.text}`}>
                    Meu Perfil
                </h1>

                <div className={`${classes.card} p-6 rounded-lg shadow`}>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Nome</label>
                            <p className={`p-2 border rounded ${classes.border}`}>{profile?.name}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <p className={`p-2 border rounded ${classes.border}`}>{profile?.email}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Papel</label>
                            <p className={`p-2 border rounded ${classes.border}`}>{profile?.role}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Membro desde</label>
                            <p className={`p-2 border rounded ${classes.border}`}>
                                {new Date(profile?.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
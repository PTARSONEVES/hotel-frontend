import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import ThemeToggle from '../../components/ThemeToggle';
import { useTheme } from '../../context/ThemeContext';

export default function AdminLeads() {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const { theme } = useTheme();

    useEffect(() => {
        loadLeads();
    }, []);

    const loadLeads = async () => {
        try {
            const response = await api.get('/admin/leads');
            setLeads(response.data.leads);
        } catch (error) {
            console.error('Erro ao carregar leads:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateLeadStatus = async (id, status) => {
        try {
            await api.put(`/admin/leads/${id}/status`, { status });
            loadLeads();
        } catch (error) {
            console.error('Erro ao atualizar lead:', error);
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
                <h1 className={`text-3xl font-bold mb-8 ${classes.text}`}>
                    Leads Captados
                </h1>

                <div className="grid gap-4">
                    {leads.map(lead => (
                        <div key={lead.id} className={`${classes.card} p-4 rounded-lg shadow`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className={`font-bold text-lg ${classes.text}`}>{lead.name}</h3>
                                    <p className={classes.text}>{lead.email}</p>
                                    <p className={classes.text}>{lead.phone}</p>
                                    <p className={`text-sm mt-2 ${classes.text}`}>
                                        Check-in: {lead.check_in} | Check-out: {lead.check_out}
                                    </p>
                                </div>
                                <select
                                    value={lead.status}
                                    onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                                    className={`px-3 py-1 border rounded ${classes.border}`}
                                >
                                    <option value="novo">Novo</option>
                                    <option value="contatado">Contatado</option>
                                    <option value="convertido">Convertido</option>
                                    <option value="perdido">Perdido</option>
                                </select>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
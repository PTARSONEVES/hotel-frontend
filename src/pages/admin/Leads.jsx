import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import ThemeToggle from '../../components/ThemeToggle';
import { useTheme } from '../../context/ThemeContext';

export default function AdminLeads() {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchCode, setSearchCode] = useState('');
    const [showDetails, setShowDetails] = useState(null);
    const { theme } = useTheme();

    useEffect(() => {
        loadLeads();
    }, [searchCode]);

    const loadLeads = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (searchCode) params.append('code', searchCode);
            
            const response = await api.get(`/admin/leads?${params}`);
            setLeads(response.data);
        } catch (error) {
            console.error('Erro ao carregar leads:', error);
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

    const updateLeadStatus = async (id, status) => {
        try {
            await api.put(`/admin/leads/${id}/status`, { status });
            loadLeads();
        } catch (error) {
            console.error('Erro ao atualizar lead:', error);
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            novo: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
            contatado: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
            convertido: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            perdido: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        };
        return styles[status] || 'bg-gray-100 text-gray-800';
    };

    const getThemeClasses = () => {
        if (theme === 'dracula') {
            return {
                card: 'bg-[#44475a]',
                text: 'text-[#f8f8f2]',
                border: 'border-[#6272a4]',
                code: 'font-mono text-sm text-[#bd93f9]',
                input: 'bg-[#282a36] border-[#6272a4] text-[#f8f8f2] placeholder-[#6272a4]',
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
                input: 'bg-gray-700 border-gray-600 text-white placeholder-gray-400',
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
            input: 'bg-white border-gray-300 text-gray-900 placeholder-gray-400',
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

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pt-20 pb-8">
            <ThemeToggle />
            
            <div className="max-w-7xl mx-auto px-4">
                <h1 className={`text-3xl font-bold mb-8 ${classes.text}`}>
                    Leads Captados
                </h1>

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

                {/* Lista de Leads */}
                <div className="grid gap-4">
                    {leads.map(lead => (
                        <div key={lead.id} className={`${classes.card} p-4 rounded-lg shadow hover:shadow-lg transition-shadow`}>
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-2">
                                        {/* Código */}
                                        <div className="flex items-center space-x-1">
                                            <code className={`text-xs font-mono ${classes.code}`}>
                                                {lead.operation_code || '-'}
                                            </code>
                                            {lead.operation_code && (
                                                <button
                                                    onClick={() => copyToClipboard(lead.operation_code)}
                                                    className="text-xs opacity-50 hover:opacity-100"
                                                    title="Copiar código"
                                                >
                                                    📋
                                                </button>
                                            )}
                                        </div>
                                        <h3 className={`text-lg font-bold ${classes.text}`}>{lead.name}</h3>
                                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(lead.status)}`}>
                                            {lead.status}
                                        </span>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                                        <p className={classes.text}>
                                            <span className="opacity-70">Email:</span> {lead.email}
                                        </p>
                                        <p className={classes.text}>
                                            <span className="opacity-70">Telefone:</span> {lead.phone}
                                            {lead.is_whatsapp && ' 📱 WhatsApp'}
                                        </p>
                                        {lead.check_in && (
                                            <p className={classes.text}>
                                                <span className="opacity-70">Período:</span> {new Date(lead.check_in).toLocaleDateString()} - {lead.check_out ? new Date(lead.check_out).toLocaleDateString() : 'N/A'}
                                            </p>
                                        )}
                                    </div>
                                    
                                    {lead.message && (
                                        <p className={`text-sm mt-2 ${classes.text} opacity-70`}>
                                            {lead.message.length > 100 ? lead.message.substring(0, 100) + '...' : lead.message}
                                        </p>
                                    )}
                                </div>
                                
                                <div className="flex space-x-2 mt-4 md:mt-0">
                                    <button
                                        onClick={() => setShowDetails(lead)}
                                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                                    >
                                        Detalhes
                                    </button>
                                    <select
                                        value={lead.status}
                                        onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                                        className={`px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500
                                            ${theme === 'dracula' 
                                                ? 'bg-[#282a36] border-[#6272a4] text-[#f8f8f2]' 
                                                : theme === 'dark' 
                                                ? 'bg-gray-700 border-gray-600 text-white' 
                                                : 'bg-white border-gray-300 text-gray-900'}`}
                                    >
                                        <option value="novo">Novo</option>
                                        <option value="contatado">Contatado</option>
                                        <option value="convertido">Convertido</option>
                                        <option value="perdido">Perdido</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}

                    {leads.length === 0 && (
                        <div className={`${classes.card} p-8 text-center rounded-lg`}>
                            <p className={classes.text}>Nenhum lead encontrado</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de Detalhes */}
            {showDetails && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className={`${classes.card} rounded-lg p-6 w-[500px] max-h-[90vh] overflow-y-auto`}>
                        <h3 className={`text-xl font-bold mb-4 ${classes.text}`}>Detalhes do Lead</h3>
                        
                        {/* Código do Lead */}
                        {showDetails.operation_code && (
                            <div className={`mb-4 p-3 rounded-lg bg-gray-100 dark:bg-gray-700`}>
                                <p className={`text-xs ${classes.text} opacity-70`}>Código do Lead</p>
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
                                
                                <span className="font-semibold">Email:</span>
                                <span>{showDetails.email}</span>
                                
                                <span className="font-semibold">Telefone:</span>
                                <span>{showDetails.phone}</span>
                                {showDetails.is_whatsapp && <span className="text-green-600">WhatsApp</span>}
                                
                                {showDetails.check_in && (
                                    <>
                                        <span className="font-semibold">Check-in:</span>
                                        <span>{new Date(showDetails.check_in).toLocaleDateString()}</span>
                                    </>
                                )}
                                
                                {showDetails.check_out && (
                                    <>
                                        <span className="font-semibold">Check-out:</span>
                                        <span>{new Date(showDetails.check_out).toLocaleDateString()}</span>
                                    </>
                                )}
                                
                                <span className="font-semibold">Adultos:</span>
                                <span>{showDetails.adults}</span>
                                
                                <span className="font-semibold">Crianças:</span>
                                <span>{showDetails.children}</span>
                                
                                <span className="font-semibold">Tipo de Flat:</span>
                                <span>{showDetails.flat_type || 'Não especificado'}</span>
                                
                                <span className="font-semibold">Status:</span>
                                <span>
                                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(showDetails.status)}`}>
                                        {showDetails.status}
                                    </span>
                                </span>
                                
                                <span className="font-semibold">Origem:</span>
                                <span>{showDetails.source || 'Website'}</span>
                                
                                <span className="font-semibold">Cadastro:</span>
                                <span>{new Date(showDetails.created_at).toLocaleString()}</span>
                            </div>
                            
                            {showDetails.message && (
                                <div>
                                    <span className="font-semibold">Mensagem:</span>
                                    <p className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded">
                                        {showDetails.message}
                                    </p>
                                </div>
                            )}
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
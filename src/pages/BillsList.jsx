import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';

export default function BillsList() {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchCode, setSearchCode] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [showDetails, setShowDetails] = useState(null);
    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        due_date: new Date().toISOString().split('T')[0],
        category_id: '',
        supplier: '',
        notes: ''
    });
    const [formLoading, setFormLoading] = useState(false);
    const { theme } = useTheme();

    useEffect(() => {
        loadBills();
    }, [searchCode]);

    const loadBills = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (searchCode) params.append('code', searchCode);
            
            const response = await api.get(`/financial/bills?${params}`);
            setBills(response.data);
        } catch (error) {
            console.error('Erro ao carregar contas:', error);
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
            const response = await api.post('/financial/bills', formData);
            alert('Conta a pagar criada com sucesso!');
            setShowForm(false);
            resetForm();
            loadBills();
        } catch (error) {
            alert(error.response?.data?.error || 'Erro ao criar conta');
        } finally {
            setFormLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            description: '',
            amount: '',
            due_date: new Date().toISOString().split('T')[0],
            category_id: '',
            supplier: '',
            notes: ''
        });
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value || 0);
    };

    const getStatusBadge = (status) => {
        const styles = {
            pendente: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
            pago: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            atrasado: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
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
                        Contas a Pagar
                    </h1>
                    <button
                        onClick={() => setShowForm(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        + Nova Conta
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

                {/* Lista de Contas */}
                <div className={`${classes.card} rounded-lg shadow overflow-hidden`}>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${classes.text}`}>
                                        Código
                                    </th>
                                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${classes.text}`}>
                                        Descrição
                                    </th>
                                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${classes.text}`}>
                                        Fornecedor
                                    </th>
                                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${classes.text}`}>
                                        Vencimento
                                    </th>
                                    <th className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${classes.text}`}>
                                        Valor
                                    </th>
                                    <th className={`px-6 py-3 text-center text-xs font-medium uppercase tracking-wider ${classes.text}`}>
                                        Status
                                    </th>
                                    <th className={`px-6 py-3 text-center text-xs font-medium uppercase tracking-wider ${classes.text}`}>
                                        Ações
                                    </th>
                                 </tr>
                            </thead>
                            <tbody className="divide-y">
                                {bills.map(bill => (
                                    <tr key={bill.id} className={`${classes.text} hover:bg-gray-50 dark:hover:bg-gray-700`}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center space-x-2">
                                                <code className={`${classes.code} cursor-pointer`}
                                                      onClick={() => copyToClipboard(bill.operation_code)}
                                                      title="Clique para copiar">
                                                    {bill.operation_code || '-'}
                                                </code>
                                                {bill.operation_code && (
                                                    <button
                                                        onClick={() => copyToClipboard(bill.operation_code)}
                                                        className="text-xs opacity-50 hover:opacity-100"
                                                        title="Copiar código"
                                                    >
                                                        📋
                                                    </button>
                                                )}
                                            </div>
                                         </td>
                                        <td className="px-6 py-4">{bill.description}</td>
                                        <td className="px-6 py-4">{bill.supplier || '-'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {new Date(bill.due_date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right font-medium">
                                            {formatCurrency(bill.amount)}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(bill.status)}`}>
                                                {bill.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => setShowDetails(bill)}
                                                className="text-blue-600 hover:text-blue-800"
                                                title="Detalhes"
                                            >
                                                👁️
                                            </button>
                                        </td>
                                     </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {bills.length === 0 && (
                        <div className="p-8 text-center">
                            <p className={classes.text}>Nenhuma conta a pagar encontrada</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de Cadastro */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className={`${classes.card} rounded-lg p-6 w-96`}>
                        <h3 className={`text-xl font-bold mb-4 ${classes.text}`}>
                            Nova Conta a Pagar
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                    Descrição *
                                </label>
                                <input
                                    type="text"
                                    className={`w-full p-2 border rounded ${classes.input}`}
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    required
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                    Valor (R$) *
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    className={`w-full p-2 border rounded ${classes.input}`}
                                    value={formData.amount}
                                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                                    required
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                    Data de Vencimento *
                                </label>
                                <input
                                    type="date"
                                    className={`w-full p-2 border rounded ${classes.input}`}
                                    value={formData.due_date}
                                    onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                                    required
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                    Fornecedor
                                </label>
                                <input
                                    type="text"
                                    className={`w-full p-2 border rounded ${classes.input}`}
                                    value={formData.supplier}
                                    onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                    Observações
                                </label>
                                <textarea
                                    rows="3"
                                    className={`w-full p-2 border rounded ${classes.input}`}
                                    value={formData.notes}
                                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
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

            {/* Modal de Detalhes */}
            {showDetails && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className={`${classes.card} rounded-lg p-6 w-96`}>
                        <h3 className={`text-xl font-bold mb-4 ${classes.text}`}>Detalhes da Conta</h3>
                        
                        {showDetails.operation_code && (
                            <div className={`mb-4 p-3 rounded-lg bg-gray-100 dark:bg-gray-700`}>
                                <p className={`text-xs ${classes.text} opacity-70`}>Código da Conta</p>
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
                                <span className="font-semibold">Descrição:</span>
                                <span>{showDetails.description}</span>
                                
                                <span className="font-semibold">Valor:</span>
                                <span className="font-bold">{formatCurrency(showDetails.amount)}</span>
                                
                                <span className="font-semibold">Vencimento:</span>
                                <span>{new Date(showDetails.due_date).toLocaleDateString()}</span>
                                
                                <span className="font-semibold">Fornecedor:</span>
                                <span>{showDetails.supplier || 'N/A'}</span>
                                
                                <span className="font-semibold">Status:</span>
                                <span>
                                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(showDetails.status)}`}>
                                        {showDetails.status}
                                    </span>
                                </span>
                                
                                {showDetails.payment_date && (
                                    <>
                                        <span className="font-semibold">Data Pagamento:</span>
                                        <span>{new Date(showDetails.payment_date).toLocaleDateString()}</span>
                                    </>
                                )}
                            </div>
                            
                            {showDetails.notes && (
                                <div>
                                    <span className="font-semibold">Observações:</span>
                                    <p className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded">
                                        {showDetails.notes}
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
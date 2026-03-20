import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';

export default function FinancialDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState({
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
    });

    // Estados para contas a pagar
    const [showBillForm, setShowBillForm] = useState(false);
    const [editingBill, setEditingBill] = useState(null);
    const [billFormData, setBillFormData] = useState({
        description: '',
        amount: '',
        due_date: new Date().toISOString().split('T')[0],
        payment_date: '',
        category_id: '',
        supplier: '',
        notes: ''
    });

    // Estados para contas a receber
    const [showReceivableForm, setShowReceivableForm] = useState(false);
    const [editingReceivable, setEditingReceivable] = useState(null);
    const [receivableFormData, setReceivableFormData] = useState({
        title: '',
        amount: '',
        due_date: new Date().toISOString().split('T')[0],
        payment_date: '',
        status: 'pendente',
        notes: ''
    });

    const { theme } = useTheme();

    useEffect(() => {
        loadData();
    }, [period]);

    const loadData = async () => {
        try {
            setLoading(true);
            
            const response = await api.get('/financial/dashboard', { params: period });
            console.log('📊 Dados financeiros:', response.data);
            
            let expenseCategories = [];
            try {
                const categoriesRes = await api.get('/financial/categories');
                expenseCategories = categoriesRes.data.filter(c => c.type === 'despesa');
            } catch (error) {
                console.error('❌ Erro ao carregar categorias:', error);
            }
            
            setData({
                ...response.data,
                expenseCategories: expenseCategories
            });
            
        } catch (error) {
            console.error('❌ Erro ao carregar dados financeiros:', error);
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // FUNÇÕES PARA CONTAS A PAGAR
    // =====================================================

    const handleCreateBill = async (e) => {
        e.preventDefault();
        try {
            const createData = { ...billFormData };
            if (createData.payment_date) {
                createData.status = 'pago';
            }
            await api.post('/financial/bills', createData);
            setShowBillForm(false);
            resetBillForm();
            loadData();
        } catch (error) {
            alert(error.response?.data?.error || 'Erro ao criar conta a pagar');
        }
    };

    const handleEditBill = (bill) => {
        setEditingBill(bill);
        setBillFormData({
            description: bill.description,
            amount: bill.amount,
            due_date: bill.due_date.split('T')[0],
            payment_date: bill.payment_date ? bill.payment_date.split('T')[0] : '',
            category_id: bill.category_id || '',
            supplier: bill.supplier || '',
            notes: bill.notes || ''
        });
        setShowBillForm(true);
    };

    const handleUpdateBill = async (e) => {
        e.preventDefault();
        try {
            const updateData = { ...billFormData };
            if (updateData.payment_date) {
                updateData.status = 'pago';
            }
            await api.put(`/financial/bills/${editingBill.id}`, updateData);
            setShowBillForm(false);
            setEditingBill(null);
            resetBillForm();
            loadData();
        } catch (error) {
            alert(error.response?.data?.error || 'Erro ao atualizar conta');
        }
    };

    const handleDeleteBill = async (billId) => {
        if (!confirm('Tem certeza que deseja excluir esta conta?')) return;
        
        try {
            await api.delete(`/financial/bills/${billId}`);
            loadData();
        } catch (error) {
            alert('Erro ao excluir conta');
        }
    };

    const handlePayBill = async (billId) => {
        const paymentDate = prompt('Data de pagamento (AAAA-MM-DD):', new Date().toISOString().split('T')[0]);
        if (!paymentDate) return;
        
        try {
            await api.put(`/financial/bills/${billId}/pay`, { payment_date: paymentDate });
            loadData();
        } catch (error) {
            alert('Erro ao registrar pagamento');
        }
    };

    const resetBillForm = () => {
        setBillFormData({
            description: '',
            amount: '',
            due_date: new Date().toISOString().split('T')[0],
            payment_date: '',
            category_id: '',
            supplier: '',
            notes: ''
        });
    };

    // =====================================================
    // FUNÇÕES PARA CONTAS A RECEBER
    // =====================================================

    const handleEditReceivable = (receivable) => {
        setEditingReceivable(receivable);
        setReceivableFormData({
            title: receivable.title || 'Reserva',
            amount: receivable.amount,
            due_date: receivable.due_date.split('T')[0],
            payment_date: receivable.payment_date ? receivable.payment_date.split('T')[0] : '',
            status: receivable.status,
            notes: receivable.notes || ''
        });
        setShowReceivableForm(true);
    };

    const handleUpdateReceivable = async (e) => {
        e.preventDefault();
        try {
            const updateData = { ...receivableFormData };
            if (updateData.payment_date) {
                updateData.status = 'pago';
            }
            await api.put(`/financial/receivables/${editingReceivable.id}`, updateData);
            setShowReceivableForm(false);
            setEditingReceivable(null);
            resetReceivableForm();
            loadData();
        } catch (error) {
            alert(error.response?.data?.error || 'Erro ao atualizar conta');
        }
    };

    const handleDeleteReceivable = async (receivableId) => {
        if (!confirm('Tem certeza que deseja excluir esta conta?')) return;
        
        try {
            await api.delete(`/financial/receivables/${receivableId}`);
            loadData();
        } catch (error) {
            alert('Erro ao excluir conta');
        }
    };

    const resetReceivableForm = () => {
        setReceivableFormData({
            title: '',
            amount: '',
            due_date: new Date().toISOString().split('T')[0],
            payment_date: '',
            status: 'pendente',
            notes: ''
        });
    };

    // =====================================================
    // TEMAS
    // =====================================================

    const getThemeClasses = () => {
        if (theme === 'dracula') {
            return {
                card: 'bg-[#44475a]',
                text: 'text-[#f8f8f2]',
                positive: 'text-[#50fa7b]',
                negative: 'text-[#ff5555]',
                accent: 'text-[#bd93f9]',
                warning: 'text-[#f1fa8c]',
                border: 'border-[#6272a4]'
            };
        }
        if (theme === 'dark') {
            return {
                card: 'bg-gray-800',
                text: 'text-white',
                positive: 'text-green-400',
                negative: 'text-red-400',
                accent: 'text-blue-400',
                warning: 'text-yellow-400',
                border: 'border-gray-700'
            };
        }
        return {
            card: 'bg-white',
            text: 'text-gray-900',
            positive: 'text-green-600',
            negative: 'text-red-600',
            accent: 'text-blue-600',
            warning: 'text-yellow-600',
            border: 'border-gray-200'
        };
    };

    const classes = getThemeClasses();

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value || 0);
    };

    // Cálculos financeiros
    const saldoPeriodo = (data?.summary?.recebido || 0) - (data?.summary?.pago || 0);
    const saldoPrevisto = (data?.summary?.a_receber || 0) - (data?.summary?.a_pagar || 0) + saldoPeriodo;
    const totalReceitas = (data?.summary?.recebido || 0) + (data?.summary?.a_receber || 0);
    const totalDespesas = (data?.summary?.pago || 0) + (data?.summary?.a_pagar || 0);

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
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className={`text-3xl font-bold ${classes.text}`}>
                        Dashboard Financeiro
                    </h1>
                    
                    <div className="flex items-center space-x-4">
                        <div className="flex space-x-2">
                            <input
                                type="date"
                                value={period.startDate}
                                onChange={(e) => setPeriod({...period, startDate: e.target.value})}
                                className={`px-3 py-2 border rounded ${classes.border} ${classes.text} bg-white dark:bg-gray-700`}
                            />
                            <input
                                type="date"
                                value={period.endDate}
                                onChange={(e) => setPeriod({...period, endDate: e.target.value})}
                                className={`px-3 py-2 border rounded ${classes.border} ${classes.text} bg-white dark:bg-gray-700`}
                            />
                        </div>
                        
                        <button
                            onClick={() => {
                                setEditingBill(null);
                                resetBillForm();
                                setShowBillForm(true);
                            }}
                            className={`px-4 py-2 rounded-lg flex items-center transition-colors
                                ${theme === 'dracula' 
                                    ? 'bg-[#bd93f9] hover:bg-[#ff79c6] text-white' 
                                    : 'bg-green-600 hover:bg-green-700 text-white'}`}
                        >
                            <span className="mr-2">+</span>
                            Nova Conta a Pagar
                        </button>
                    </div>
                </div>

                {/* Cards de Resumo */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className={`${classes.card} p-6 rounded-lg shadow`}>
                        <p className={`text-sm ${classes.text} opacity-70`}>💰 Recebido</p>
                        <p className={`text-2xl font-bold ${classes.positive}`}>
                            {formatCurrency(data?.summary?.recebido)}
                        </p>
                    </div>
                    
                    <div className={`${classes.card} p-6 rounded-lg shadow`}>
                        <p className={`text-sm ${classes.text} opacity-70`}>📅 A Receber</p>
                        <p className={`text-2xl font-bold ${classes.accent}`}>
                            {formatCurrency(data?.summary?.a_receber)}
                        </p>
                    </div>
                    
                    <div className={`${classes.card} p-6 rounded-lg shadow`}>
                        <p className={`text-sm ${classes.text} opacity-70`}>💳 Pago</p>
                        <p className={`text-2xl font-bold ${classes.negative}`}>
                            {formatCurrency(data?.summary?.pago)}
                        </p>
                    </div>
                    
                    <div className={`${classes.card} p-6 rounded-lg shadow`}>
                        <p className={`text-sm ${classes.text} opacity-70`}>⚠️ A Pagar</p>
                        <p className={`text-2xl font-bold ${classes.warning}`}>
                            {formatCurrency(data?.summary?.a_pagar)}
                        </p>
                    </div>
                </div>

                {/* Cards de Análise */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className={`${classes.card} p-6 rounded-lg shadow`}>
                        <p className={`text-sm ${classes.text} opacity-70`}>📊 Saldo do Período</p>
                        <p className={`text-2xl font-bold ${saldoPeriodo >= 0 ? classes.positive : classes.negative}`}>
                            {formatCurrency(saldoPeriodo)}
                        </p>
                        <p className={`text-xs ${classes.text} opacity-70 mt-1`}>
                            Recebido - Pago
                        </p>
                    </div>

                    <div className={`${classes.card} p-6 rounded-lg shadow`}>
                        <p className={`text-sm ${classes.text} opacity-70`}>📈 Total de Receitas</p>
                        <p className={`text-2xl font-bold ${classes.positive}`}>
                            {formatCurrency(totalReceitas)}
                        </p>
                        <p className={`text-xs ${classes.text} opacity-70 mt-1`}>
                            Recebido + A Receber
                        </p>
                    </div>

                    <div className={`${classes.card} p-6 rounded-lg shadow`}>
                        <p className={`text-sm ${classes.text} opacity-70`}>📉 Total de Despesas</p>
                        <p className={`text-2xl font-bold ${classes.negative}`}>
                            {formatCurrency(totalDespesas)}
                        </p>
                        <p className={`text-xs ${classes.text} opacity-70 mt-1`}>
                            Pago + A Pagar
                        </p>
                    </div>

                    <div className={`${classes.card} p-6 rounded-lg shadow`}>
                        <p className={`text-sm ${classes.text} opacity-70`}>🔮 Saldo Previsto</p>
                        <p className={`text-2xl font-bold ${saldoPrevisto >= 0 ? classes.positive : classes.negative}`}>
                            {formatCurrency(saldoPrevisto)}
                        </p>
                        <p className={`text-xs ${classes.text} opacity-70 mt-1`}>
                            (Receitas - Despesas) + Saldo
                        </p>
                    </div>
                </div>

                {/* Contas a Receber */}
                <div className={`${classes.card} p-6 rounded-lg shadow mb-8`}>
                    <h2 className={`text-xl font-bold mb-4 ${classes.text}`}>Contas a Receber</h2>
                    {data?.receivables && data.receivables.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className={`text-left py-2 ${classes.text}`}>Descrição</th>
                                        <th className={`text-left py-2 ${classes.text}`}>Hóspede</th>
                                        <th className={`text-left py-2 ${classes.text}`}>Vencimento</th>
                                        <th className={`text-right py-2 ${classes.text}`}>Valor</th>
                                        <th className={`text-center py-2 ${classes.text}`}>Status</th>
                                        <th className={`text-right py-2 ${classes.text}`}>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.receivables.map(item => (
                                        <tr key={item.id} className="border-b">
                                            <td className={`py-2 ${classes.text}`}>{item.title || 'Reserva'}</td>
                                            <td className={`py-2 ${classes.text}`}>{item.guest_name || '-'}</td>
                                            <td className={`py-2 ${classes.text}`}>
                                                {new Date(item.due_date).toLocaleDateString()}
                                            </td>
                                            <td className={`py-2 text-right ${classes.text}`}>
                                                {formatCurrency(item.amount)}
                                            </td>
                                            <td className="py-2 text-center">
                                                <span className={`px-2 py-1 text-xs rounded-full ${
                                                    item.status === 'pago' ? 'bg-green-100 text-green-800' : 
                                                    item.status === 'atrasado' ? 'bg-red-100 text-red-800' : 
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="py-2 text-right">
                                                <div className="flex justify-end space-x-2">
                                                    <button
                                                        onClick={() => handleEditReceivable(item)}
                                                        className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                                                        title="Editar"
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteReceivable(item.id)}
                                                        className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
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
                    ) : (
                        <p className={`text-center py-4 ${classes.text} opacity-70`}>
                            Nenhuma conta a receber encontrada
                        </p>
                    )}
                </div>

                {/* Contas a Pagar */}
                <div className={`${classes.card} p-6 rounded-lg shadow`}>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className={`text-xl font-bold ${classes.text}`}>Contas a Pagar</h2>
                        <button
                            onClick={() => {
                                setEditingBill(null);
                                resetBillForm();
                                setShowBillForm(true);
                            }}
                            className="text-sm px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                            + Nova
                        </button>
                    </div>

                    {data?.payables && data.payables.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className={`text-left py-2 ${classes.text}`}>Descrição</th>
                                        <th className={`text-left py-2 ${classes.text}`}>Fornecedor</th>
                                        <th className={`text-left py-2 ${classes.text}`}>Vencimento</th>
                                        <th className={`text-right py-2 ${classes.text}`}>Valor</th>
                                        <th className={`text-center py-2 ${classes.text}`}>Status</th>
                                        <th className={`text-right py-2 ${classes.text}`}>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.payables.map(bill => (
                                        <tr key={bill.id} className="border-b">
                                            <td className={`py-2 ${classes.text}`}>{bill.description}</td>
                                            <td className={`py-2 ${classes.text}`}>{bill.supplier || '-'}</td>
                                            <td className={`py-2 ${classes.text}`}>
                                                {new Date(bill.due_date).toLocaleDateString()}
                                            </td>
                                            <td className={`py-2 text-right ${classes.text}`}>
                                                {formatCurrency(bill.amount)}
                                            </td>
                                            <td className="py-2 text-center">
                                                <span className={`px-2 py-1 text-xs rounded-full ${
                                                    bill.status === 'pago' ? 'bg-green-100 text-green-800' : 
                                                    bill.status === 'atrasado' ? 'bg-red-100 text-red-800' : 
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {bill.status}
                                                </span>
                                            </td>
                                            <td className="py-2 text-right">
                                                <div className="flex justify-end space-x-2">
                                                    {bill.status === 'pendente' && (
                                                        <button
                                                            onClick={() => handlePayBill(bill.id)}
                                                            className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                                                            title="Pagar"
                                                        >
                                                            💰
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleEditBill(bill)}
                                                        className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                                                        title="Editar"
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteBill(bill.id)}
                                                        className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
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
                    ) : (
                        <p className={`text-center py-4 ${classes.text} opacity-70`}>
                            Nenhuma conta a pagar encontrada
                        </p>
                    )}
                </div>
            </div>

            {/* Modal Contas a Pagar (Criação e Edição) */}
            {showBillForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className={`${classes.card} rounded-lg p-6 w-96`}>
                        <h3 className={`text-xl font-bold mb-4 ${classes.text}`}>
                            {editingBill ? 'Editar' : 'Nova'} Conta a Pagar
                        </h3>
                        <form onSubmit={editingBill ? handleUpdateBill : handleCreateBill} className="space-y-4">
                            <div>
                                <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                    Descrição *
                                </label>
                                <input
                                    type="text"
                                    className={`w-full p-2 border rounded 
                                        ${theme === 'dracula' ? 'bg-[#44475a] border-[#6272a4] text-[#f8f8f2]' : 
                                          theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 
                                          'bg-white border-gray-300 text-gray-900'}
                                        focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                    value={billFormData.description}
                                    onChange={(e) => setBillFormData({...billFormData, description: e.target.value})}
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
                                    className={`w-full p-2 border rounded 
                                        ${theme === 'dracula' ? 'bg-[#44475a] border-[#6272a4] text-[#f8f8f2]' : 
                                          theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 
                                          'bg-white border-gray-300 text-gray-900'}
                                        focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                    value={billFormData.amount}
                                    onChange={(e) => setBillFormData({...billFormData, amount: e.target.value})}
                                    required
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                    Data de Vencimento *
                                </label>
                                <input
                                    type="date"
                                    className={`w-full p-2 border rounded 
                                        ${theme === 'dracula' ? 'bg-[#44475a] border-[#6272a4] text-[#f8f8f2]' : 
                                          theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 
                                          'bg-white border-gray-300 text-gray-900'}
                                        focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                    value={billFormData.due_date}
                                    onChange={(e) => setBillFormData({...billFormData, due_date: e.target.value})}
                                    required
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                    Data de Pagamento {editingBill?.status === 'pago' ? '(já pago)' : '(opcional)'}
                                </label>
                                <input
                                    type="date"
                                    className={`w-full p-2 border rounded 
                                        ${theme === 'dracula' ? 'bg-[#44475a] border-[#6272a4] text-[#f8f8f2]' : 
                                          theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 
                                          'bg-white border-gray-300 text-gray-900'}
                                        focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                    value={billFormData.payment_date}
                                    onChange={(e) => setBillFormData({...billFormData, payment_date: e.target.value})}
                                />
                                <p className={`text-xs mt-1 ${classes.text} opacity-70`}>
                                    Se a conta já foi paga, informe a data do pagamento
                                </p>
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                    Categoria
                                </label>
                                <select
                                    className={`w-full p-2 border rounded 
                                        ${theme === 'dracula' ? 'bg-[#44475a] border-[#6272a4] text-[#f8f8f2]' : 
                                          theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 
                                          'bg-white border-gray-300 text-gray-900'}
                                        focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                    value={billFormData.category_id}
                                    onChange={(e) => setBillFormData({...billFormData, category_id: e.target.value})}
                                >
                                    <option value="">Selecione...</option>
                                    {data?.expenseCategories?.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                    Fornecedor
                                </label>
                                <input
                                    type="text"
                                    className={`w-full p-2 border rounded 
                                        ${theme === 'dracula' ? 'bg-[#44475a] border-[#6272a4] text-[#f8f8f2]' : 
                                          theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 
                                          'bg-white border-gray-300 text-gray-900'}
                                        focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                    value={billFormData.supplier}
                                    onChange={(e) => setBillFormData({...billFormData, supplier: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                    Observações
                                </label>
                                <textarea
                                    rows="3"
                                    className={`w-full p-2 border rounded 
                                        ${theme === 'dracula' ? 'bg-[#44475a] border-[#6272a4] text-[#f8f8f2]' : 
                                          theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 
                                          'bg-white border-gray-300 text-gray-900'}
                                        focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                    value={billFormData.notes}
                                    onChange={(e) => setBillFormData({...billFormData, notes: e.target.value})}
                                />
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="submit"
                                    className={`flex-1 py-2 rounded transition-colors
                                        ${theme === 'dracula' 
                                            ? 'bg-[#bd93f9] hover:bg-[#ff79c6] text-white' 
                                            : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                                >
                                    {editingBill ? 'Atualizar' : 'Salvar'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowBillForm(false);
                                        setEditingBill(null);
                                        resetBillForm();
                                    }}
                                    className={`flex-1 py-2 rounded transition-colors
                                        ${theme === 'dracula' 
                                            ? 'bg-[#6272a4] hover:bg-[#44475a] text-[#f8f8f2]' 
                                            : 'bg-gray-600 hover:bg-gray-700 text-white'}`}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Contas a Receber (Edição) */}
            {showReceivableForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className={`${classes.card} rounded-lg p-6 w-96`}>
                        <h3 className={`text-xl font-bold mb-4 ${classes.text}`}>
                            Editar Conta a Receber
                        </h3>
                        <form onSubmit={handleUpdateReceivable} className="space-y-4">
                            <div>
                                <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                    Descrição *
                                </label>
                                <input
                                    type="text"
                                    className={`w-full p-2 border rounded 
                                        ${theme === 'dracula' ? 'bg-[#44475a] border-[#6272a4] text-[#f8f8f2]' : 
                                          theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 
                                          'bg-white border-gray-300 text-gray-900'}
                                        focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                    value={receivableFormData.title}
                                    onChange={(e) => setReceivableFormData({...receivableFormData, title: e.target.value})}
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
                                    className={`w-full p-2 border rounded 
                                        ${theme === 'dracula' ? 'bg-[#44475a] border-[#6272a4] text-[#f8f8f2]' : 
                                          theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 
                                          'bg-white border-gray-300 text-gray-900'}
                                        focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                    value={receivableFormData.amount}
                                    onChange={(e) => setReceivableFormData({...receivableFormData, amount: e.target.value})}
                                    required
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                    Data de Vencimento *
                                </label>
                                <input
                                    type="date"
                                    className={`w-full p-2 border rounded 
                                        ${theme === 'dracula' ? 'bg-[#44475a] border-[#6272a4] text-[#f8f8f2]' : 
                                          theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 
                                          'bg-white border-gray-300 text-gray-900'}
                                        focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                    value={receivableFormData.due_date}
                                    onChange={(e) => setReceivableFormData({...receivableFormData, due_date: e.target.value})}
                                    required
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                    Data de Pagamento {editingReceivable?.status === 'pago' ? '(já recebido)' : '(opcional)'}
                                </label>
                                <input
                                    type="date"
                                    className={`w-full p-2 border rounded 
                                        ${theme === 'dracula' ? 'bg-[#44475a] border-[#6272a4] text-[#f8f8f2]' : 
                                          theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 
                                          'bg-white border-gray-300 text-gray-900'}
                                        focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                    value={receivableFormData.payment_date}
                                    onChange={(e) => setReceivableFormData({...receivableFormData, payment_date: e.target.value})}
                                />
                                <p className={`text-xs mt-1 ${classes.text} opacity-70`}>
                                    Se já foi recebido, informe a data do recebimento
                                </p>
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                    Status
                                </label>
                                <select
                                    className={`w-full p-2 border rounded 
                                        ${theme === 'dracula' ? 'bg-[#44475a] border-[#6272a4] text-[#f8f8f2]' : 
                                          theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 
                                          'bg-white border-gray-300 text-gray-900'}
                                        focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                    value={receivableFormData.status}
                                    onChange={(e) => setReceivableFormData({...receivableFormData, status: e.target.value})}
                                >
                                    <option value="pendente">Pendente</option>
                                    <option value="pago">Pago</option>
                                    <option value="atrasado">Atrasado</option>
                                </select>
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                    Observações
                                </label>
                                <textarea
                                    rows="3"
                                    className={`w-full p-2 border rounded 
                                        ${theme === 'dracula' ? 'bg-[#44475a] border-[#6272a4] text-[#f8f8f2]' : 
                                          theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 
                                          'bg-white border-gray-300 text-gray-900'}
                                        focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                    value={receivableFormData.notes}
                                    onChange={(e) => setReceivableFormData({...receivableFormData, notes: e.target.value})}
                                />
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="submit"
                                    className={`flex-1 py-2 rounded transition-colors
                                        ${theme === 'dracula' 
                                            ? 'bg-[#bd93f9] hover:bg-[#ff79c6] text-white' 
                                            : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                                >
                                    Atualizar
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowReceivableForm(false);
                                        setEditingReceivable(null);
                                        resetReceivableForm();
                                    }}
                                    className={`flex-1 py-2 rounded transition-colors
                                        ${theme === 'dracula' 
                                            ? 'bg-[#6272a4] hover:bg-[#44475a] text-[#f8f8f2]' 
                                            : 'bg-gray-600 hover:bg-gray-700 text-white'}`}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
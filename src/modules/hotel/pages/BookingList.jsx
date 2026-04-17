import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/api';
import { useTheme } from '../../../context/ThemeContext';
import { useAuth } from '../../../context/AuthContext';
import ThemeToggle from '../../../components/ThemeToggle';
import BookingEditModal from '../components/BookingEditModal';

export default function BookingList() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDetails, setShowDetails] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [filters, setFilters] = useState({
        status: '',
        startDate: '',
        endDate: ''
    });
    const { theme } = useTheme();
    const { user, hasPermission } = useAuth();

    // Verificar se pode editar
    const canEdit = user?.role === 'admin' || user?.role === 'colaborador';

    useEffect(() => {
        loadBookings();
    }, [filters]);

    const loadBookings = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (filters.status) params.append('status', filters.status);
            if (filters.startDate) params.append('startDate', filters.startDate);
            if (filters.endDate) params.append('endDate', filters.endDate);
            
            const response = await api.get(`/hotel/bookings?${params}`);
            setBookings(response.data);
        } catch (error) {
            console.error('Erro ao carregar reservas:', error);
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // FUNÇÕES DE AÇÃO
    // =====================================================
    
    const handleEdit = (booking) => {
        setSelectedBooking(booking);
        setShowEditModal(true);
    };

    const handleCheckIn = async (bookingId) => {
        try {
            await api.post(`/hotel/bookings/${bookingId}/checkin`);
            loadBookings();
            alert('Check-in realizado com sucesso!');
        } catch (error) {
            alert(error.response?.data?.error || 'Erro ao realizar check-in');
        }
    };

    const handleCheckOut = async (bookingId) => {
        const paymentMethod = prompt('Forma de pagamento (dinheiro, cartao_credito, cartao_debito, pix, transferencia):');
        if (!paymentMethod) return;
        
        const paidAmount = prompt('Valor pago (R$):');
        if (!paidAmount) return;
        
        try {
            await api.post(`/hotel/bookings/${bookingId}/checkout`, {
                payment_method: paymentMethod,
                paid_amount: parseFloat(paidAmount)
            });
            loadBookings();
            alert('Check-out realizado com sucesso!');
        } catch (error) {
            alert(error.response?.data?.error || 'Erro ao realizar check-out');
        }
    };

    const handleCancel = async (bookingId) => {
        if (!confirm('Tem certeza que deseja cancelar esta reserva?')) return;
        
        try {
            await api.post(`/hotel/bookings/${bookingId}/cancel`);
            loadBookings();
            alert('Reserva cancelada com sucesso!');
        } catch (error) {
            alert(error.response?.data?.error || 'Erro ao cancelar reserva');
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            reservado: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
            confirmado: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
            checkin: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            checkout: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
            cancelado: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        };
        return styles[status] || 'bg-gray-100 text-gray-800';
    };

    const getStatusText = (status) => {
        const texts = {
            reservado: 'Reservado',
            confirmado: 'Confirmado',
            checkin: 'Check-in',
            checkout: 'Check-out',
            cancelado: 'Cancelado'
        };
        return texts[status] || status;
    };

    const getPaymentStatusBadge = (status) => {
        const styles = {
            aguardando_entrada: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
            entrada_paga: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
            parcial: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
            quitado: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
        };
        return styles[status] || 'bg-gray-100 text-gray-800';
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value || 0);
    };

    const getThemeClasses = () => {
        if (theme === 'dracula') {
            return {
                card: 'bg-[#44475a]',
                text: 'text-[#f8f8f2]',
                border: 'border-[#6272a4]',
                code: 'font-mono text-sm text-[#bd93f9]'
            };
        }
        if (theme === 'dark') {
            return {
                card: 'bg-gray-800',
                text: 'text-white',
                border: 'border-gray-700',
                code: 'font-mono text-sm text-blue-400'
            };
        }
        return {
            card: 'bg-white',
            text: 'text-gray-900',
            border: 'border-gray-200',
            code: 'font-mono text-sm text-blue-600'
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
                        Reservas
                    </h1>
                    <Link
                        to="/hotel/bookings/new"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        + Nova Reserva
                    </Link>
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
                            <option value="reservado">Reservado</option>
                            <option value="confirmado">Confirmado</option>
                            <option value="checkin">Check-in</option>
                            <option value="checkout">Check-out</option>
                            <option value="cancelado">Cancelado</option>
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

                {/* Lista de Reservas */}
                <div className={`${classes.card} rounded-lg shadow overflow-hidden`}>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${classes.text}`}>
                                        Código
                                    </th>
                                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${classes.text}`}>
                                        Hóspede
                                    </th>
                                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${classes.text}`}>
                                        Apartamento
                                    </th>
                                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${classes.text}`}>
                                        Check-in
                                    </th>
                                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${classes.text}`}>
                                        Check-out
                                    </th>
                                    <th className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${classes.text}`}>
                                        Valor
                                    </th>
                                    <th className={`px-6 py-3 text-center text-xs font-medium uppercase tracking-wider ${classes.text}`}>
                                        Status Pagamento
                                    </th>
                                    <th className={`px-6 py-3 text-center text-xs font-medium uppercase tracking-wider ${classes.text}`}>
                                        Status Reserva
                                    </th>
                                    <th className={`px-6 py-3 text-center text-xs font-medium uppercase tracking-wider ${classes.text}`}>
                                        Ações
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {bookings.map(booking => (
                                    <tr key={booking.id} className={`${classes.text} hover:bg-gray-50 dark:hover:bg-gray-700`}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <code className={`text-xs font-mono ${classes.code}`}>
                                                {booking.operation_code || '-'}
                                            </code>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium">{booking.guest_name}</div>
                                            <div className="text-sm opacity-70">{booking.guest_document}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>{booking.room_number}</div>
                                            <div className="text-sm opacity-70">{booking.room_type}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {new Date(booking.check_in).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {new Date(booking.check_out).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right font-medium">
                                            {formatCurrency(booking.total_amount)}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-2 py-1 text-xs rounded-full ${getPaymentStatusBadge(booking.payment_status)}`}>
                                                {booking.payment_status === 'aguardando_entrada' ? 'Aguardando' :
                                                 booking.payment_status === 'entrada_paga' ? 'Entrada Paga' :
                                                 booking.payment_status === 'parcial' ? 'Parcial' : 'Quitado'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(booking.status)}`}>
                                                {getStatusText(booking.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center space-x-2">
                                                <button
                                                    onClick={() => setShowDetails(booking)}
                                                    className="text-blue-600 hover:text-blue-800"
                                                    title="Detalhes"
                                                >
                                                    👁️
                                                </button>
                                                
                                                {canEdit && (
                                                    <button
                                                        onClick={() => handleEdit(booking)}
                                                        className="text-green-600 hover:text-green-800"
                                                        title="Editar"
                                                    >
                                                        ✏️
                                                    </button>
                                                )}
                                                
                                                {booking.status === 'reservado' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleCheckIn(booking.id)}
                                                            className="text-green-600 hover:text-green-800"
                                                            title="Check-in"
                                                        >
                                                            ✅
                                                        </button>
                                                        <button
                                                            onClick={() => handleCancel(booking.id)}
                                                            className="text-red-600 hover:text-red-800"
                                                            title="Cancelar"
                                                        >
                                                            ❌
                                                        </button>
                                                    </>
                                                )}
                                                
                                                {booking.status === 'checkin' && (
                                                    <button
                                                        onClick={() => handleCheckOut(booking.id)}
                                                        className="text-orange-600 hover:text-orange-800"
                                                        title="Check-out"
                                                    >
                                                        🏁
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal de Detalhes */}
            {showDetails && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className={`${classes.card} rounded-lg p-6 w-[500px] max-h-[90vh] overflow-y-auto`}>
                        <h3 className={`text-xl font-bold mb-4 ${classes.text}`}>Detalhes da Reserva</h3>
                        
                        {showDetails.operation_code && (
                            <div className="mb-4 p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
                                <p className={`text-xs ${classes.text} opacity-70`}>Código da Reserva</p>
                                <div className="flex items-center justify-between">
                                    <code className={`text-lg font-bold font-mono ${classes.code}`}>
                                        {showDetails.operation_code}
                                    </code>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(showDetails.operation_code);
                                            alert('Código copiado!');
                                        }}
                                        className="px-2 py-1 bg-blue-600 text-white rounded text-sm"
                                    >
                                        Copiar
                                    </button>
                                </div>
                            </div>
                        )}
                        
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-2">
                                <span className="font-semibold">Hóspede:</span>
                                <span>{showDetails.guest_name}</span>
                                
                                <span className="font-semibold">Documento:</span>
                                <span>{showDetails.guest_document}</span>
                                
                                <span className="font-semibold">Apartamento:</span>
                                <span>{showDetails.room_number} - {showDetails.room_type}</span>
                                
                                <span className="font-semibold">Check-in:</span>
                                <span>{new Date(showDetails.check_in).toLocaleDateString()}</span>
                                
                                <span className="font-semibold">Check-out:</span>
                                <span>{new Date(showDetails.check_out).toLocaleDateString()}</span>
                                
                                <span className="font-semibold">Adultos:</span>
                                <span>{showDetails.adults}</span>
                                
                                <span className="font-semibold">Crianças:</span>
                                <span>{showDetails.children}</span>
                                
                                <span className="font-semibold">Valor Total:</span>
                                <span className="font-bold text-green-600">{formatCurrency(showDetails.total_amount)}</span>
                                
                                <span className="font-semibold">Status Pagamento:</span>
                                <span>
                                    <span className={`px-2 py-1 text-xs rounded-full ${getPaymentStatusBadge(showDetails.payment_status)}`}>
                                        {showDetails.payment_status === 'aguardando_entrada' ? 'Aguardando' :
                                         showDetails.payment_status === 'entrada_paga' ? 'Entrada Paga' :
                                         showDetails.payment_status === 'parcial' ? 'Parcial' : 'Quitado'}
                                    </span>
                                </span>
                            </div>
                            
                            {showDetails.observations && (
                                <div>
                                    <span className="font-semibold">Observações:</span>
                                    <p className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded">
                                        {showDetails.observations}
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

            {/* Modal de Edição */}
            {showEditModal && selectedBooking && (
                <BookingEditModal
                    booking={selectedBooking}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedBooking(null);
                    }}
                    onSuccess={loadBookings}
                />
            )}
        </div>
    );
}
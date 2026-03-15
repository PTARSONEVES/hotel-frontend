import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import ThemeToggle from '../../../components/ThemeToggle';

export default function BookingForm({ bookingId, onClose, onSuccess }) {
    const [guests, setGuests] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [availableRooms, setAvailableRooms] = useState([]);
    
    const [formData, setFormData] = useState({
        guest_id: '',
        room_id: '',
        check_in: new Date().toISOString().split('T')[0],
        check_out: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        adults: 1,
        children: 0,
        total_amount: 0,
        down_payment_percentage: 50,
        down_payment_paid: false,
        payment_method: 'pix',
        observations: ''
    });

    const [installments, setInstallments] = useState([]);

    useEffect(() => {
        loadGuests();
        loadRooms();
        if (bookingId) {
            loadBooking(bookingId);
        }
    }, [bookingId]);

    const loadGuests = async () => {
        const response = await api.get('/hotel/guests');
        setGuests(response.data);
    };

    const loadRooms = async () => {
        const response = await api.get('/hotel/rooms');
        setRooms(response.data);
    };

    const loadBooking = async (id) => {
        const response = await api.get(`/hotel/bookings/${id}`);
        const booking = response.data;
        setFormData({
            guest_id: booking.guest_id,
            room_id: booking.room_id,
            check_in: booking.check_in.split('T')[0],
            check_out: booking.check_out.split('T')[0],
            adults: booking.adults,
            children: booking.children,
            total_amount: booking.total_amount,
            down_payment_percentage: booking.down_payment_percentage || 50,
            down_payment_paid: booking.payment_status === 'entrada_paga',
            observations: booking.observations || ''
        });

        // Carregar parcelas
        const instResponse = await api.get(`/hotel/bookings/${id}/installments`);
        setInstallments(instResponse.data.installments);
    };

    const checkAvailability = async () => {
        if (!formData.check_in || !formData.check_out) return;
        
        setLoading(true);
        try {
            const response = await api.get('/hotel/bookings/availability', {
                params: {
                    check_in: formData.check_in,
                    check_out: formData.check_out
                }
            });
            setAvailableRooms(response.data);
        } catch (error) {
            console.error('Erro ao verificar disponibilidade:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateNights = () => {
        const start = new Date(formData.check_in);
        const end = new Date(formData.check_out);
        return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    };

    const updateTotalAmount = (roomId) => {
        const room = rooms.find(r => r.id === parseInt(roomId));
        if (room) {
            const nights = calculateNights();
            const total = room.base_price * nights;
            setFormData(prev => ({ ...prev, total_amount: total }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post('/hotel/bookings', formData);
            
            // Criar parcelas automaticamente
            const bookingId = response.data.id;
            
            alert('Reserva criada com sucesso!');
            if (onSuccess) onSuccess(bookingId);
            if (onClose) onClose();
        } catch (error) {
            alert(error.response?.data?.error || 'Erro ao criar reserva');
        } finally {
            setLoading(false);
        }
    };

    const handlePayInstallment = async (installmentId, amount) => {
        if (!confirm(`Confirmar pagamento de R$ ${amount}?`)) return;

        try {
            await api.post(`/hotel/installments/${installmentId}/pay`, {
                payment_method: 'pix'
            });
            alert('Pagamento registrado!');
            if (bookingId) loadBooking(bookingId);
        } catch (error) {
            alert('Erro ao registrar pagamento');
        }
    };

    const downPaymentAmount = (formData.total_amount * formData.down_payment_percentage) / 100;
    const remainingAmount = formData.total_amount - downPaymentAmount;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-[800px] max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-6">
                    {bookingId ? 'Editar Reserva' : 'Nova Reserva'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Dados do Hóspede */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Hóspede</label>
                            <select
                                className="w-full p-2 border rounded"
                                value={formData.guest_id}
                                onChange={(e) => setFormData({...formData, guest_id: e.target.value})}
                                required
                            >
                                <option value="">Selecione...</option>
                                {guests.map(guest => (
                                    <option key={guest.id} value={guest.id}>
                                        {guest.name} - {guest.document}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Apartamento</label>
                            <select
                                className="w-full p-2 border rounded"
                                value={formData.room_id}
                                onChange={(e) => {
                                    setFormData({...formData, room_id: e.target.value});
                                    updateTotalAmount(e.target.value);
                                }}
                                required
                            >
                                <option value="">Selecione...</option>
                                {(availableRooms.length ? availableRooms : rooms).map(room => (
                                    <option key={room.id} value={room.id}>
                                        {room.room_number} - {room.room_type} (R$ {room.base_price}/noite)
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Datas */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Check-in</label>
                            <input
                                type="date"
                                className="w-full p-2 border rounded"
                                value={formData.check_in}
                                onChange={(e) => setFormData({...formData, check_in: e.target.value})}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Check-out</label>
                            <input
                                type="date"
                                className="w-full p-2 border rounded"
                                value={formData.check_out}
                                onChange={(e) => setFormData({...formData, check_out: e.target.value})}
                                required
                            />
                        </div>
                    </div>

                    {/* Botão Verificar Disponibilidade */}
                    <button
                        type="button"
                        onClick={checkAvailability}
                        className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        Verificar Disponibilidade
                    </button>

                    {/* Hóspedes */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Adultos</label>
                            <input
                                type="number"
                                min="1"
                                className="w-full p-2 border rounded"
                                value={formData.adults}
                                onChange={(e) => setFormData({...formData, adults: parseInt(e.target.value)})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Crianças</label>
                            <input
                                type="number"
                                min="0"
                                className="w-full p-2 border rounded"
                                value={formData.children}
                                onChange={(e) => setFormData({...formData, children: parseInt(e.target.value)})}
                            />
                        </div>
                    </div>

                    {/* Valores */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Valor Total (R$)</label>
                            <input
                                type="number"
                                step="0.01"
                                className="w-full p-2 border rounded bg-gray-100"
                                value={formData.total_amount}
                                readOnly
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">% de Entrada</label>
                            <select
                                className="w-full p-2 border rounded"
                                value={formData.down_payment_percentage}
                                onChange={(e) => setFormData({...formData, down_payment_percentage: parseFloat(e.target.value)})}
                            >
                                <option value="0">Sem entrada</option>
                                <option value="30">30%</option>
                                <option value="50">50%</option>
                                <option value="70">70%</option>
                                <option value="100">100%</option>
                            </select>
                        </div>
                    </div>

                    {/* Resumo dos Valores */}
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded">
                        <h3 className="font-bold mb-2">Resumo Financeiro</h3>
                        <div className="space-y-1">
                            <div className="flex justify-between">
                                <span>Valor Total:</span>
                                <span className="font-bold">R$ {formData.total_amount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-blue-600">
                                <span>Entrada ({formData.down_payment_percentage}%):</span>
                                <span className="font-bold">R$ {downPaymentAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-green-600">
                                <span>Saldo (vencimento no check-in):</span>
                                <span className="font-bold">R$ {remainingAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Opção de pagamento da entrada */}
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="down_payment_paid"
                            checked={formData.down_payment_paid}
                            onChange={(e) => setFormData({...formData, down_payment_paid: e.target.checked})}
                            className="w-4 h-4"
                        />
                        <label htmlFor="down_payment_paid">
                            Entrada já foi paga (reserva confirmada)
                        </label>
                    </div>

                    {formData.down_payment_paid && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Forma de Pagamento</label>
                            <select
                                className="w-full p-2 border rounded"
                                value={formData.payment_method}
                                onChange={(e) => setFormData({...formData, payment_method: e.target.value})}
                            >
                                <option value="dinheiro">Dinheiro</option>
                                <option value="cartao_credito">Cartão de Crédito</option>
                                <option value="cartao_debito">Cartão de Débito</option>
                                <option value="pix">PIX</option>
                                <option value="transferencia">Transferência</option>
                            </select>
                        </div>
                    )}

                    {/* Observações */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Observações</label>
                        <textarea
                            rows="3"
                            className="w-full p-2 border rounded"
                            value={formData.observations}
                            onChange={(e) => setFormData({...formData, observations: e.target.value})}
                        />
                    </div>

                    {/* Lista de Parcelas (se for edição) */}
                    {installments.length > 0 && (
                        <div className="mt-4">
                            <h3 className="font-bold mb-2">Parcelas da Reserva</h3>
                            <div className="space-y-2">
                                {installments.map(inst => (
                                    <div key={inst.id} className="flex justify-between items-center p-2 border rounded">
                                        <div>
                                            <span className="font-medium">R$ {inst.amount}</span>
                                            <span className="text-sm text-gray-500 ml-2">
                                                Venc: {new Date(inst.due_date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className={`px-2 py-1 text-xs rounded ${
                                                inst.status === 'pago' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {inst.status}
                                            </span>
                                            {inst.status === 'pendente' && (
                                                <button
                                                    type="button"
                                                    onClick={() => handlePayInstallment(inst.id, inst.amount)}
                                                    className="px-2 py-1 bg-blue-600 text-white text-xs rounded"
                                                >
                                                    Pagar
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Botões */}
                    <div className="flex space-x-3 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? 'Salvando...' : (bookingId ? 'Atualizar' : 'Salvar')}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
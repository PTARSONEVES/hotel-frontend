import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { useTheme } from '../../../context/ThemeContext';
import { useAuth } from '../../../context/AuthContext';

export default function BookingForm({ bookingId, onClose, onSuccess }) {
    const [guests, setGuests] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [availableRooms, setAvailableRooms] = useState([]);
    const [checkingAvailability, setCheckingAvailability] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const { user } = useAuth();
    const { theme } = useTheme();

    const [formData, setFormData] = useState({
        guest_id: '',
        guest_name: '',
        guest_email: '',
        guest_phone: '',
        guest_document: '',
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

    useEffect(() => {
        loadRooms();
        loadGuests();
        
        // Se o usuário logado é um hóspede, buscar seus dados
        if (user && user.role === 'hospede') {
            loadUserAsGuest();
        }
        
        if (bookingId) {
            loadBooking(bookingId);
        }
    }, []);

    // Buscar dados do usuário logado como hóspede
    const loadUserAsGuest = async () => {
        try {
            const response = await api.get(`/hotel/guests/by-user/${user.id}`);
            if (response.data) {
                setUserInfo(response.data);
                setFormData(prev => ({
                    ...prev,
                    guest_id: response.data.id,
                    guest_name: response.data.name,
                    guest_email: response.data.email,
                    guest_phone: response.data.phone || '',
                    guest_document: response.data.document || ''
                }));
            }
        } catch (error) {
            console.log('Hóspede ainda não cadastrado para este usuário');
        }
    };

    const loadRooms = async () => {
        try {
            const response = await api.get('/hotel/rooms');
            setRooms(response.data);
        } catch (error) {
            console.error('Erro ao carregar apartamentos:', error);
        }
    };

    const loadGuests = async () => {
        try {
            const response = await api.get('/hotel/guests');
            setGuests(response.data);
        } catch (error) {
            console.error('Erro ao carregar hóspedes:', error);
        }
    };

    const loadBooking = async (id) => {
        try {
            const response = await api.get(`/hotel/bookings/${id}`);
            const booking = response.data;
            setFormData({
                guest_id: booking.guest_id,
                guest_name: booking.guest_name,
                guest_email: booking.guest_email,
                guest_phone: booking.guest_phone || '',
                guest_document: booking.guest_document || '',
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
        } catch (error) {
            console.error('Erro ao carregar reserva:', error);
        }
    };

    const checkAvailability = async () => {
        if (!formData.check_in || !formData.check_out) return;
        
        setCheckingAvailability(true);
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
            setCheckingAvailability(false);
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

        // Validar dados do hóspede
        if (!formData.guest_name || !formData.guest_email) {
            alert('Por favor, preencha os dados do hóspede');
            setLoading(false);
            return;
        }

        try {
            // Se não houver guest_id, criar hóspede primeiro
            let guestId = formData.guest_id;
            
            if (!guestId) {
                const guestResponse = await api.post('/hotel/guests', {
                    name: formData.guest_name,
                    email: formData.guest_email,
                    phone: formData.guest_phone,
                    document: formData.guest_document,
                    user_id: user?.id || null
                });
                guestId = guestResponse.data.id;
                formData.guest_id = guestId;
            }

            const bookingData = {
                guest_id: guestId,
                room_id: formData.room_id,
                check_in: formData.check_in,
                check_out: formData.check_out,
                adults: formData.adults,
                children: formData.children,
                total_amount: formData.total_amount,
                down_payment_percentage: formData.down_payment_percentage,
                down_payment_paid: formData.down_payment_paid,
                payment_method: formData.payment_method,
                observations: formData.observations
            };

            const response = await api.post('/hotel/bookings', bookingData);
            
            alert('Reserva criada com sucesso!');
            if (onSuccess) onSuccess(response.data.id);
            if (onClose) onClose();
        } catch (error) {
            alert(error.response?.data?.error || 'Erro ao criar reserva');
        } finally {
            setLoading(false);
        }
    };

    const getThemeClasses = () => {
        if (theme === 'dracula') {
            return {
                card: 'bg-[#44475a]',
                text: 'text-[#f8f8f2]',
                input: 'bg-[#282a36] border-[#6272a4] text-[#f8f8f2]',
                button: 'bg-[#bd93f9] hover:bg-[#ff79c6] text-white',
                cancelButton: 'bg-[#6272a4] hover:bg-[#44475a] text-white',
                border: 'border-[#6272a4]'
            };
        }
        if (theme === 'dark') {
            return {
                card: 'bg-gray-800',
                text: 'text-white',
                input: 'bg-gray-700 border-gray-600 text-white',
                button: 'bg-blue-600 hover:bg-blue-700 text-white',
                cancelButton: 'bg-gray-600 hover:bg-gray-700 text-white',
                border: 'border-gray-700'
            };
        }
        return {
            card: 'bg-white',
            text: 'text-gray-900',
            input: 'bg-white border-gray-300 text-gray-900',
            button: 'bg-blue-600 hover:bg-blue-700 text-white',
            cancelButton: 'bg-gray-500 hover:bg-gray-600 text-white',
            border: 'border-gray-200'
        };
    };

    const classes = getThemeClasses();

    const downPaymentAmount = (formData.total_amount * formData.down_payment_percentage) / 100;
    const remainingAmount = formData.total_amount - downPaymentAmount;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`${classes.card} rounded-lg p-6 w-[800px] max-h-[90vh] overflow-y-auto`}>
                <h2 className={`text-2xl font-bold mb-6 ${classes.text}`}>
                    {bookingId ? 'Editar Reserva' : 'Nova Reserva'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Dados do Hóspede */}
                    <div>
                        <h3 className={`text-lg font-bold mb-3 ${classes.text}`}>Dados do Hóspede</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                    Nome Completo *
                                </label>
                                <input
                                    type="text"
                                    className={`w-full p-2 border rounded ${classes.input}`}
                                    value={formData.guest_name}
                                    onChange={(e) => setFormData({...formData, guest_name: e.target.value})}
                                    required
                                />
                            </div>
                            <div>
                                <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    className={`w-full p-2 border rounded ${classes.input}`}
                                    value={formData.guest_email}
                                    onChange={(e) => setFormData({...formData, guest_email: e.target.value})}
                                    required
                                />
                            </div>
                            <div>
                                <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                    Telefone (WhatsApp)
                                </label>
                                <input
                                    type="tel"
                                    className={`w-full p-2 border rounded ${classes.input}`}
                                    value={formData.guest_phone}
                                    onChange={(e) => setFormData({...formData, guest_phone: e.target.value})}
                                    placeholder="(81) 99999-9999"
                                />
                            </div>
                            <div>
                                <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                    CPF / Documento
                                </label>
                                <input
                                    type="text"
                                    className={`w-full p-2 border rounded ${classes.input}`}
                                    value={formData.guest_document}
                                    onChange={(e) => setFormData({...formData, guest_document: e.target.value})}
                                    placeholder="123.456.789-00"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Datas e Apartamento */}
                    <div>
                        <h3 className={`text-lg font-bold mb-3 ${classes.text}`}>Período da Estadia</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                    Check-in *
                                </label>
                                <input
                                    type="date"
                                    className={`w-full p-2 border rounded ${classes.input}`}
                                    value={formData.check_in}
                                    onChange={(e) => setFormData({...formData, check_in: e.target.value})}
                                    required
                                />
                            </div>
                            <div>
                                <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                    Check-out *
                                </label>
                                <input
                                    type="date"
                                    className={`w-full p-2 border rounded ${classes.input}`}
                                    value={formData.check_out}
                                    onChange={(e) => setFormData({...formData, check_out: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={checkAvailability}
                            disabled={checkingAvailability}
                            className={`mt-3 w-full py-2 rounded ${classes.button} disabled:opacity-50`}
                        >
                            {checkingAvailability ? 'Verificando...' : 'Verificar Disponibilidade'}
                        </button>

                        <div className="mt-3">
                            <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                Apartamento *
                            </label>
                            <select
                                className={`w-full p-2 border rounded ${classes.input}`}
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

                    {/* Hóspedes */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                Adultos
                            </label>
                            <select
                                className={`w-full p-2 border rounded ${classes.input}`}
                                value={formData.adults}
                                onChange={(e) => setFormData({...formData, adults: parseInt(e.target.value)})}
                            >
                                {[1, 2, 3, 4, 5, 6].map(n => (
                                    <option key={n} value={n}>{n}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                Crianças
                            </label>
                            <select
                                className={`w-full p-2 border rounded ${classes.input}`}
                                value={formData.children}
                                onChange={(e) => setFormData({...formData, children: parseInt(e.target.value)})}
                            >
                                {[0, 1, 2, 3, 4].map(n => (
                                    <option key={n} value={n}>{n}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Valores */}
                    <div>
                        <h3 className={`text-lg font-bold mb-3 ${classes.text}`}>Valores</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                    Valor Total (R$)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className={`w-full p-2 border rounded bg-gray-100 ${classes.text}`}
                                    value={formData.total_amount}
                                    readOnly
                                />
                            </div>
                            <div>
                                <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                    % de Entrada
                                </label>
                                <select
                                    className={`w-full p-2 border rounded ${classes.input}`}
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

                        <div className={`mt-3 p-3 rounded ${classes.card} border ${classes.border}`}>
                            <div className="flex justify-between">
                                <span className={classes.text}>Entrada ({formData.down_payment_percentage}%):</span>
                                <span className={`font-bold ${classes.text}`}>R$ {downPaymentAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between mt-1">
                                <span className={classes.text}>Saldo (vencimento no check-in):</span>
                                <span className={`font-bold ${classes.text}`}>R$ {remainingAmount.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="flex items-center mt-2">
                            <input
                                type="checkbox"
                                id="down_payment_paid"
                                checked={formData.down_payment_paid}
                                onChange={(e) => setFormData({...formData, down_payment_paid: e.target.checked})}
                                className="mr-2"
                            />
                            <label htmlFor="down_payment_paid" className={classes.text}>
                                Entrada já foi paga
                            </label>
                        </div>

                        {formData.down_payment_paid && (
                            <div className="mt-2">
                                <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                    Forma de Pagamento
                                </label>
                                <select
                                    className={`w-full p-2 border rounded ${classes.input}`}
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
                    </div>

                    {/* Observações */}
                    <div>
                        <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                            Observações
                        </label>
                        <textarea
                            rows="3"
                            className={`w-full p-2 border rounded ${classes.input}`}
                            value={formData.observations}
                            onChange={(e) => setFormData({...formData, observations: e.target.value})}
                        />
                    </div>

                    {/* Botões */}
                    <div className="flex space-x-3 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex-1 py-2 rounded ${classes.button} disabled:opacity-50`}
                        >
                            {loading ? 'Salvando...' : (bookingId ? 'Atualizar' : 'Salvar')}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className={`flex-1 py-2 rounded ${classes.cancelButton}`}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
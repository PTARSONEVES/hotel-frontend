import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { useTheme } from '../../../context/ThemeContext';

export default function BookingEditModal({ booking, onClose, onSuccess }) {
    const [guests, setGuests] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [roomTypes, setRoomTypes] = useState([]);
    const [availableRooms, setAvailableRooms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [checkingAvailability, setCheckingAvailability] = useState(false);
    const [formData, setFormData] = useState({
        guest_id: '',
        guest_name: '',
        guest_document: '',
        guest_phone: '',
        guest_email: '',
        room_id: '',
        room_number: '',
        room_type: '',
        check_in: '',
        check_out: '',
        adults: 1,
        children: 0,
        total_amount: 0,
        status: '',
        payment_status: '',
        observations: ''
    });
    const { theme } = useTheme();

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (booking) {
            setFormData({
                guest_id: booking.guest_id || '',
                guest_name: booking.guest_name || '',
                guest_document: booking.guest_document || '',
                guest_phone: booking.guest_phone || '',
                guest_email: booking.guest_email || '',
                room_id: booking.room_id || '',
                room_number: booking.room_number || '',
                room_type: booking.room_type || '',
                check_in: booking.check_in?.split('T')[0] || '',
                check_out: booking.check_out?.split('T')[0] || '',
                adults: booking.adults || 1,
                children: booking.children || 0,
                total_amount: booking.total_amount || 0,
                status: booking.status || 'reservado',
                payment_status: booking.payment_status || 'pendente',
                observations: booking.observations || ''
            });
        }
    }, [booking]);

    const loadData = async () => {
        try {
            const [guestsRes, roomsRes, typesRes] = await Promise.all([
                api.get('/hotel/guests'),
                api.get('/hotel/rooms'),
                api.get('/hotel/room-types')
            ]);
            setGuests(guestsRes.data);
            setRooms(roomsRes.data);
            setRoomTypes(typesRes.data);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        }
    };

    const checkAvailability = async () => {
        if (!formData.check_in || !formData.check_out) {
            alert('Selecione as datas de check-in e check-out');
            return;
        }

        setCheckingAvailability(true);
        try {
            const response = await api.get('/hotel/bookings/availability', {
                params: {
                    check_in: formData.check_in,
                    check_out: formData.check_out
                }
            });
            setAvailableRooms(response.data);
            alert(`${response.data.length} apartamentos disponíveis para o período.`);
        } catch (error) {
            console.error('Erro ao verificar disponibilidade:', error);
        } finally {
            setCheckingAvailability(false);
        }
    };

    const handleGuestChange = (guestId) => {
        const selectedGuest = guests.find(g => g.id === parseInt(guestId));
        if (selectedGuest) {
            setFormData({
                ...formData,
                guest_id: selectedGuest.id,
                guest_name: selectedGuest.name,
                guest_document: selectedGuest.document || '',
                guest_phone: selectedGuest.phone || '',
                guest_email: selectedGuest.email || ''
            });
        }
    };

    const handleRoomChange = (roomId) => {
        const selectedRoom = rooms.find(r => r.id === parseInt(roomId));
        if (selectedRoom) {
            const roomType = roomTypes.find(rt => rt.id === selectedRoom.room_type_id);
            setFormData({
                ...formData,
                room_id: selectedRoom.id,
                room_number: selectedRoom.room_number,
                room_type: roomType?.name || ''
            });
        }
    };

    const calculateNights = () => {
        if (!formData.check_in || !formData.check_out) return 0;
        const start = new Date(formData.check_in);
        const end = new Date(formData.check_out);
        return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        // Log dos dados que estão sendo enviados
        console.log('📝 Dados sendo enviados:', {
            guest_id: formData.guest_id,
            room_id: formData.room_id,
            check_in: formData.check_in,
            check_out: formData.check_out,
            adults: formData.adults,
            children: formData.children,
            total_amount: formData.total_amount,
            status: formData.status,
            payment_status: formData.payment_status,
            observations: formData.observations
        });
        
        try {
            const updateData = {
                guest_id: parseInt(formData.guest_id),
                room_id: parseInt(formData.room_id),
                check_in: formData.check_in,
                check_out: formData.check_out,
                adults: parseInt(formData.adults),
                children: parseInt(formData.children),
                total_amount: parseFloat(formData.total_amount),
                status: formData.status,
                payment_status: formData.payment_status,
                observations: formData.observations
            };
            
            console.log('📤 Enviando para API:', updateData);
            
            const response = await api.put(`/hotel/bookings/${booking.id}`, updateData);
            console.log('✅ Resposta do servidor:', response.data);
            
            alert('Reserva atualizada com sucesso!');
            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            console.error('❌ Erro detalhado:', error);
            console.error('❌ Resposta do erro:', error.response?.data);
            alert(error.response?.data?.error || 'Erro ao atualizar reserva');
        } finally {
            setLoading(false);
        }
    };

    const getThemeClasses = () => {
        if (theme === 'dracula') {
            return {
                card: 'bg-[#44475a]',
                text: 'text-[#f8f8f2]',
                border: 'border-[#6272a4]',
                input: 'bg-[#282a36] border-[#6272a4] text-[#f8f8f2] placeholder-[#6272a4] focus:ring-[#bd93f9]',
                button: 'bg-[#bd93f9] hover:bg-[#ff79c6] text-white',
                cancelButton: 'bg-[#6272a4] hover:bg-[#44475a] text-[#f8f8f2]'
            };
        }
        if (theme === 'dark') {
            return {
                card: 'bg-gray-800',
                text: 'text-white',
                border: 'border-gray-700',
                input: 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500',
                button: 'bg-blue-600 hover:bg-blue-700 text-white',
                cancelButton: 'bg-gray-600 hover:bg-gray-500 text-white'
            };
        }
        return {
            card: 'bg-white',
            text: 'text-gray-900',
            border: 'border-gray-200',
            input: 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500',
            button: 'bg-blue-600 hover:bg-blue-700 text-white',
            cancelButton: 'bg-gray-500 hover:bg-gray-600 text-white'
        };
    };

    const classes = getThemeClasses();
    const nights = calculateNights();

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`${classes.card} rounded-lg p-6 w-[600px] max-h-[90vh] overflow-y-auto`}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className={`text-xl font-bold ${classes.text}`}>
                        Editar Reserva #{booking?.id}
                    </h2>
                    <button onClick={onClose} className={classes.text}>✕</button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Seleção de Hóspede */}
                    <div>
                        <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                            Hóspede *
                        </label>
                        <div className="flex space-x-2">
                            <select
                                className={`flex-1 p-2 border rounded ${classes.input}`}
                                value={formData.guest_id}
                                onChange={(e) => handleGuestChange(e.target.value)}
                                required
                            >
                                <option value="">Selecione o hóspede</option>
                                {guests.map(guest => (
                                    <option key={guest.id} value={guest.id}>
                                        {guest.name} - {guest.document}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    {/* Informações do Hóspede (leitura) */}
                    {formData.guest_id && (
                        <div className={`p-3 rounded-lg ${classes.input} text-sm space-y-1`}>
                            <div className="flex justify-between">
                                <span className="opacity-70">Documento:</span>
                                <span>{formData.guest_document || '-'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="opacity-70">Telefone:</span>
                                <span>{formData.guest_phone || '-'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="opacity-70">Email:</span>
                                <span>{formData.guest_email || '-'}</span>
                            </div>
                        </div>
                    )}
                    
                    {/* Seleção de Apartamento */}
                    <div>
                        <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                            Apartamento *
                        </label>
                        <select
                            className={`w-full p-2 border rounded ${classes.input}`}
                            value={formData.room_id}
                            onChange={(e) => handleRoomChange(e.target.value)}
                            required
                        >
                            <option value="">Selecione o apartamento</option>
                            {rooms.map(room => (
                                <option key={room.id} value={room.id}>
                                    {room.room_number} - {room.room_type_name} ({room.status})
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    {/* Datas */}
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
                    
                    {/* Botão Verificar Disponibilidade */}
                    <button
                        type="button"
                        onClick={checkAvailability}
                        disabled={checkingAvailability}
                        className={`w-full py-2 rounded ${classes.button} disabled:opacity-50 text-sm`}
                    >
                        {checkingAvailability ? 'Verificando...' : 'Verificar Disponibilidade'}
                    </button>
                    
                    {/* Informações adicionais */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                Adultos
                            </label>
                            <input
                                type="number"
                                min="1"
                                className={`w-full p-2 border rounded ${classes.input}`}
                                value={formData.adults}
                                onChange={(e) => setFormData({...formData, adults: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                Crianças
                            </label>
                            <input
                                type="number"
                                min="0"
                                className={`w-full p-2 border rounded ${classes.input}`}
                                value={formData.children}
                                onChange={(e) => setFormData({...formData, children: e.target.value})}
                            />
                        </div>
                    </div>
                    
                    {/* Resumo da estadia */}
                    {nights > 0 && formData.room_type && (
                        <div className={`p-3 rounded-lg ${classes.input} text-sm`}>
                            <div className="flex justify-between">
                                <span className="opacity-70">Apartamento:</span>
                                <span>{formData.room_number} - {formData.room_type}</span>
                            </div>
                            <div className="flex justify-between mt-1">
                                <span className="opacity-70">Noites:</span>
                                <span>{nights} noite(s)</span>
                            </div>
                        </div>
                    )}
                    
                    <div>
                        <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                            Valor Total (R$)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            className={`w-full p-2 border rounded ${classes.input}`}
                            value={formData.total_amount}
                            onChange={(e) => setFormData({...formData, total_amount: e.target.value})}
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                Status da Reserva
                            </label>
                            <select
                                className={`w-full p-2 border rounded ${classes.input}`}
                                value={formData.status}
                                onChange={(e) => setFormData({...formData, status: e.target.value})}
                            >
                                <option value="reservado">Reservado</option>
                                <option value="confirmado">Confirmado</option>
                                <option value="checkin">Check-in</option>
                                <option value="checkout">Check-out</option>
                                <option value="cancelado">Cancelado</option>
                            </select>
                        </div>
                        <div>
                            <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                Status do Pagamento
                            </label>
                            <select
                                className={`w-full p-2 border rounded ${classes.input}`}
                                value={formData.payment_status}
                                onChange={(e) => setFormData({...formData, payment_status: e.target.value})}
                            >
                                <option value="pendente">Pendente</option>
                                <option value="entrada_paga">Entrada Paga</option>
                                <option value="parcial">Parcial</option>
                                <option value="quitado">Quitado</option>
                            </select>
                        </div>
                    </div>
                    
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
                    
                    <div className="flex space-x-3 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex-1 py-2 rounded ${classes.button} disabled:opacity-50`}
                        >
                            {loading ? 'Salvando...' : 'Salvar Alterações'}
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
                
                {/* Aviso de segurança */}
                <div className={`mt-4 pt-3 border-t ${classes.border} text-xs ${classes.text} opacity-70`}>
                    ⚠️ As alterações serão registradas para auditoria.
                </div>
            </div>
        </div>
    );
}
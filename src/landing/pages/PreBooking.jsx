import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LandingHeader from '../components/Header';
import Footer from '../components/Footer';
import api from '../../services/api';

export default function PreBooking() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        is_whatsapp: false,
        check_in: '',
        check_out: '',
        adults: 2,
        children: 0,
        flat_type: '',
        message: ''
    });
    
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            // Enviar para o backend
            const response = await api.post('/public/leads', formData);
            
            if (response.data.success) {
                setSubmitted(true);
                // Opcional: enviar email automático
                await api.post('/public/leads/auto-respond', { 
                    email: formData.email, 
                    name: formData.name 
                });
            }
        } catch (error) {
            console.error('Erro ao enviar lead:', error);
            setError('Ocorreu um erro ao enviar sua solicitação. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-[#282a36]">
                <LandingHeader />
                <div className="pt-32 pb-16 px-4">
                    <div className="max-w-2xl mx-auto text-center">
                        <div className="bg-green-100 dark:bg-[#50fa7b20] p-8 rounded-lg">
                            <h2 className="text-3xl font-bold text-green-800 dark:text-[#50fa7b] mb-4">
                                Recebemos sua solicitação!
                            </h2>
                            <p className="text-lg text-green-700 dark:text-[#f8f8f2] mb-6">
                                Em breve um de nossos consultores entrará em contato.
                                Verifique seu email para mais informações.
                            </p>
                            <button
                                onClick={() => navigate('/')}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Voltar para Home
                            </button>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#282a36]">
            <LandingHeader />
            
            <div className="pt-24 pb-16 px-4">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl font-bold text-center mb-4 dark:text-[#f8f8f2]">
                        Faça sua Pré-Reserva
                    </h1>
                    <p className="text-center text-gray-600 dark:text-[#f8f8f2] mb-12">
                        Preencha os dados abaixo e em breve entraremos em contato com as melhores ofertas!
                    </p>

                    {error && (
                        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="bg-white dark:bg-[#44475a] p-8 rounded-lg shadow-lg">
                        {/* Nome */}
                        <div className="mb-4">
                            <label className="block mb-2 font-medium dark:text-[#f8f8f2]">
                                Nome Completo *
                            </label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg dark:bg-[#282a36] dark:border-[#6272a4] dark:text-[#f8f8f2]"
                                placeholder="Digite seu nome completo"
                            />
                        </div>

                        {/* Email e Telefone */}
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block mb-2 font-medium dark:text-[#f8f8f2]">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full p-3 border rounded-lg dark:bg-[#282a36] dark:border-[#6272a4] dark:text-[#f8f8f2]"
                                    placeholder="seu@email.com"
                                />
                            </div>
                            <div>
                                <label className="block mb-2 font-medium dark:text-[#f8f8f2]">
                                    Telefone *
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    required
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full p-3 border rounded-lg dark:bg-[#282a36] dark:border-[#6272a4] dark:text-[#f8f8f2]"
                                    placeholder="(81) 99999-9999"
                                />
                                <label className="flex items-center mt-2 dark:text-[#f8f8f2]">
                                    <input
                                        type="checkbox"
                                        name="is_whatsapp"
                                        checked={formData.is_whatsapp}
                                        onChange={handleChange}
                                        className="mr-2"
                                    />
                                    <span className="text-sm">É WhatsApp</span>
                                </label>
                            </div>
                        </div>

                        {/* Datas */}
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block mb-2 font-medium dark:text-[#f8f8f2]">
                                    Check-in
                                </label>
                                <input
                                    type="date"
                                    name="check_in"
                                    value={formData.check_in}
                                    onChange={handleChange}
                                    className="w-full p-3 border rounded-lg dark:bg-[#282a36] dark:border-[#6272a4] dark:text-[#f8f8f2]"
                                />
                            </div>
                            <div>
                                <label className="block mb-2 font-medium dark:text-[#f8f8f2]">
                                    Check-out
                                </label>
                                <input
                                    type="date"
                                    name="check_out"
                                    value={formData.check_out}
                                    onChange={handleChange}
                                    className="w-full p-3 border rounded-lg dark:bg-[#282a36] dark:border-[#6272a4] dark:text-[#f8f8f2]"
                                />
                            </div>
                        </div>

                        {/* Hóspedes */}
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block mb-2 font-medium dark:text-[#f8f8f2]">
                                    Adultos
                                </label>
                                <select
                                    name="adults"
                                    value={formData.adults}
                                    onChange={handleChange}
                                    className="w-full p-3 border rounded-lg dark:bg-[#282a36] dark:border-[#6272a4] dark:text-[#f8f8f2]"
                                >
                                    {[1,2,3,4,5,6].map(n => (
                                        <option key={n} value={n}>{n}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block mb-2 font-medium dark:text-[#f8f8f2]">
                                    Crianças
                                </label>
                                <select
                                    name="children"
                                    value={formData.children}
                                    onChange={handleChange}
                                    className="w-full p-3 border rounded-lg dark:bg-[#282a36] dark:border-[#6272a4] dark:text-[#f8f8f2]"
                                >
                                    {[0,1,2,3,4].map(n => (
                                        <option key={n} value={n}>{n}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Tipo de Flat */}
                        <div className="mb-4">
                            <label className="block mb-2 font-medium dark:text-[#f8f8f2]">
                                Tipo de Flat de Interesse
                            </label>
                            <select
                                name="flat_type"
                                value={formData.flat_type}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg dark:bg-[#282a36] dark:border-[#6272a4] dark:text-[#f8f8f2]"
                            >
                                <option value="">Todos os tipos</option>
                                <option value="standard">Standard</option>
                                <option value="luxo">Luxo</option>
                                <option value="master">Master</option>
                                <option value="familia">Família</option>
                            </select>
                        </div>

                        {/* Mensagem */}
                        <div className="mb-6">
                            <label className="block mb-2 font-medium dark:text-[#f8f8f2]">
                                Mensagem (opcional)
                            </label>
                            <textarea
                                name="message"
                                rows="4"
                                value={formData.message}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg dark:bg-[#282a36] dark:border-[#6272a4] dark:text-[#f8f8f2]"
                                placeholder="Digite suas preferências, dúvidas ou pedidos especiais..."
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-lg font-semibold"
                        >
                            {loading ? 'Enviando...' : 'Enviar Solicitação'}
                        </button>
                    </form>
                </div>
            </div>
            
            <Footer />
        </div>
    );
}
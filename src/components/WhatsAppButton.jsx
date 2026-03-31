import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function WhatsAppButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [chatHistory, setChatHistory] = useState([
        { type: 'bot', text: 'Olá! 👋 Bem-vindo ao Ancorar Flat Resort!', time: new Date() },
        { type: 'bot', text: 'Como posso ajudar você hoje?', time: new Date() },
        { type: 'bot', text: 'Selecione uma opção:', time: new Date() }
    ]);
    const { theme } = useTheme();

    const phoneNumber = '558181091970';
    const welcomeMessage = encodeURIComponent(
        'Olá! 👋\n\n' +
        'Bem-vindo ao Ancorar Flat Resort!\n\n' +
        'Selecione uma opção:\n' +
        '1️⃣ - Reservas\n' +
        '2️⃣ - Informações sobre flats\n' +
        '3️⃣ - Porto de Galinhas\n' +
        '4️⃣ - Promoções\n' +
        '5️⃣ - Falar com atendente\n\n' +
        'Digite o número da opção desejada:'
    );

    const menuOptions = [
        { number: '1', text: '📅 Reservas', action: 'reservas' },
        { number: '2', text: '🏨 Flats', action: 'flats' },
        { number: '3', text: '🏖️ Porto de Galinhas', action: 'porto' },
        { number: '4', text: '🎁 Promoções', action: 'promocoes' },
        { number: '5', text: '👨‍💼 Atendente', action: 'atendente' }
    ];

    const getWhatsAppLink = (customMessage = welcomeMessage) => {
        return `https://wa.me/${phoneNumber}?text=${customMessage}`;
    };

    const handleOptionClick = async (option) => {
        await saveInteraction(option.action, option.text);

        let messageText = '';

        switch(option.action) {
            case 'reservas':
                messageText = encodeURIComponent(
                    'Gostaria de fazer uma reserva! 🏨\n\n' +
                    'Por favor, informe:\n' +
                    '📅 Data de check-in:\n' +
                    '📅 Data de check-out:\n' +
                    '👥 Número de pessoas:\n' +
                    '🏠 Tipo de flat:'
                );
                break;
            case 'flats':
                messageText = encodeURIComponent(
                    'Gostaria de informações sobre os flats! 🏨\n\n' +
                    'Temos:\n' +
                    '• Standard - R$ 350/diária\n' +
                    '• Luxo - R$ 550/diária\n' +
                    '• Master - R$ 750/diária\n' +
                    '• Família - R$ 850/diária\n\n' +
                    'Qual tipo você tem interesse?'
                );
                break;
            case 'porto':
                messageText = encodeURIComponent(
                    'Informações sobre Porto de Galinhas! 🏖️\n\n' +
                    'Principais atrações:\n' +
                    '• Piscinas Naturais\n' +
                    '• Praia de Muro Alto\n' +
                    '• Pontal de Maracaípe\n' +
                    '• Praia dos Carneiros\n\n' +
                    'Qual você gostaria de conhecer?'
                );
                break;
            case 'promocoes':
                messageText = encodeURIComponent(
                    'Promoções especiais! 🎁\n\n' +
                    'Confira nossas ofertas:\n' +
                    '• 15% off para reservas com 30 dias de antecedência\n' +
                    '• Pacote romântico com jantar incluso\n' +
                    '• Desconto para grupos acima de 4 pessoas\n\n' +
                    'Gostaria de saber mais sobre alguma promoção?'
                );
                break;
            default:
                messageText = welcomeMessage;
        }
        
        window.open(getWhatsAppLink(messageText), '_blank');
        setIsOpen(false);
    };

    const getThemeClasses = () => {
        if (theme === 'dracula') {
            return {
                button: 'bg-[#50fa7b] hover:bg-[#ff79c6] text-[#282a36]',
                chat: 'bg-[#282a36] border border-[#44475a]',
                header: 'bg-[#44475a]',
                botMessage: 'bg-[#44475a] text-[#f8f8f2]',
                userMessage: 'bg-[#50fa7b] text-[#282a36]',
                optionButton: 'bg-[#44475a] hover:bg-[#6272a4] text-[#f8f8f2]'
            };
        }
        if (theme === 'dark') {
            return {
                button: 'bg-green-500 hover:bg-green-600 text-white',
                chat: 'bg-gray-800 border border-gray-700',
                header: 'bg-gray-700',
                botMessage: 'bg-gray-700 text-white',
                userMessage: 'bg-green-500 text-white',
                optionButton: 'bg-gray-700 hover:bg-gray-600 text-white'
            };
        }
        return {
            button: 'bg-green-500 hover:bg-green-600 text-white',
            chat: 'bg-white border border-gray-200',
            header: 'bg-gray-100',
            botMessage: 'bg-gray-100 text-gray-900',
            userMessage: 'bg-green-500 text-white',
            optionButton: 'bg-gray-100 hover:bg-gray-200 text-gray-900'
        };
    };

    const saveInteraction = async (option, message) => {
        try {
            await api.post('/public/whatsapp/interaction', {
                phone: phoneNumber,
                name: '',
                message: message,
                option_selected: option
            });
        } catch (error) {
            console.error('Erro ao salvar interação:', error);
        }
    };

    const classes = getThemeClasses();

    return (
        <>
            {/* Botão Flutuante */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 ${classes.button}`}
                title="Atendimento WhatsApp"
            >
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.032 2.002c-5.514 0-9.996 4.476-9.996 9.99 0 1.75.46 3.473 1.33 4.99L2 22l5.176-1.328c1.468.808 3.12 1.236 4.824 1.236h.008c5.513 0 9.997-4.477 9.997-9.99 0-2.66-1.035-5.163-2.92-7.05-1.884-1.886-4.387-2.926-7.05-2.926z"/>
                </svg>
            </button>

            {/* Modal de Chat */}
            {isOpen && (
                <div className={`fixed bottom-20 right-6 z-50 w-80 rounded-lg shadow-xl ${classes.chat}`}>
                    {/* Header */}
                    <div className={`p-3 rounded-t-lg flex items-center justify-between ${classes.header}`}>
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12.032 2.002c-5.514 0-9.996 4.476-9.996 9.99 0 1.75.46 3.473 1.33 4.99L2 22l5.176-1.328c1.468.808 3.12 1.236 4.824 1.236h.008c5.513 0 9.997-4.477 9.997-9.99 0-2.66-1.035-5.163-2.92-7.05-1.884-1.886-4.387-2.926-7.05-2.926z"/>
                                </svg>
                            </div>
                            <div>
                                <span className="font-medium">Atendimento WhatsApp</span>
                                <div className="text-xs text-green-500">Online</div>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Mensagens */}
                    <div className="p-3 h-80 overflow-y-auto space-y-2">
                        {chatHistory.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[80%] p-2 rounded-lg ${msg.type === 'user' ? classes.userMessage : classes.botMessage}`}>
                                    <p className="text-sm">{msg.text}</p>
                                    <p className="text-xs opacity-70 mt-1">
                                        {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className={`p-2 rounded-lg ${classes.botMessage}`}>
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Opções do Menu */}
                    <div className="p-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
                        {menuOptions.map(option => (
                            <button
                                key={option.number}
                                onClick={() => handleOptionClick(option)}
                                className={`w-full p-2 rounded-lg text-left transition-colors ${classes.optionButton}`}
                            >
                                {option.text}
                            </button>
                        ))}
                        <a
                            href={getWhatsAppLink()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`block w-full p-2 rounded-lg text-center transition-colors ${classes.button}`}
                        >
                            Falar agora
                        </a>
                    </div>
                </div>
            )}
        </>
    );
}
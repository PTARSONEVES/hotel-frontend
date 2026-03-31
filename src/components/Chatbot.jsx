import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { useTheme } from '../context/ThemeContext';

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { type: 'bot', text: 'Olá! 👋 Sou o assistente virtual do Ancorar Flat Resort.\n\nComo posso ajudar você hoje?', time: new Date(), options: [
            { text: '1️⃣ Reservas', action: 'reserva' },
            { text: '2️⃣ Conhecer flats', action: 'flats' },
            { text: '3️⃣ Porto de Galinhas', action: 'porto' },
            { text: '4️⃣ Promoções', action: 'prices' },
            { text: '5️⃣ Falar com atendente', action: 'human' }
        ] }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [sessionId] = useState(() => 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9));
    const messagesEndRef = useRef(null);
    const { theme } = useTheme();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async (text, isOption = false) => {
        if (!text.trim()) return;
        
        // Adicionar mensagem do usuário
        setMessages(prev => [...prev, { type: 'user', text, time: new Date() }]);
        setInputMessage('');
        setIsTyping(true);
        
        try {
            const response = await api.post('/chatbot/message', {
                message: text,
                sessionId
            });
            
            // Adicionar resposta do bot
            const botMessage = {
                type: 'bot',
                text: response.data.response,
                time: new Date(),
                options: response.data.options
            };
            setMessages(prev => [...prev, botMessage]);
            
            // Se for para escalar para WhatsApp
            if (response.data.escalate) {
                setTimeout(() => {
                    setMessages(prev => [...prev, {
                        type: 'bot',
                        text: 'Vou conectar você com um atendente.',
                        time: new Date(),
                        options: [{ text: '📱 Abrir WhatsApp', action: 'whatsapp' }]
                    }]);
                }, 1000);
            }
        } catch (error) {
            console.error('Erro:', error);
            setMessages(prev => [...prev, { 
                type: 'bot', 
                text: 'Desculpe, estou com problemas. Por favor, tente novamente mais tarde.', 
                time: new Date() 
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleOptionClick = (action) => {
        switch(action) {
            case 'reserva':
                sendMessage('Quero fazer uma reserva', true);
                break;
            case 'flats':
                sendMessage('Quero conhecer os flats', true);
                break;
            case 'porto':
                sendMessage('Informações sobre Porto de Galinhas', true);
                break;
            case 'prices':
                sendMessage('Promoções e preços', true);
                break;
            case 'schedule':
                sendMessage('Horários check-in/check-out', true);
                break;
            case 'cancellation':
                sendMessage('Política de cancelamento', true);
                break;
            case 'human':
            case 'whatsapp':
                window.open('https://wa.me/558181091970?text=Olá! Vim pelo chat do site e gostaria de falar com um atendente.', '_blank');
                break;
            case 'menu':
                sendMessage('ajuda', true);
                break;
            default:
                sendMessage(action, true);
        }
    };

    const getThemeClasses = () => {
        if (theme === 'dracula') {
            return {
                button: 'bg-[#50fa7b] hover:bg-[#ff79c6] text-[#282a36]',
                chat: 'bg-[#282a36] border border-[#44475a]',
                header: 'bg-[#44475a]',
                botMessage: 'bg-[#44475a] text-[#f8f8f2]',
                userMessage: 'bg-[#50fa7b] text-[#282a36]',
                input: 'bg-[#282a36] border-[#6272a4] text-[#f8f8f2] placeholder-[#6272a4]',
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
                input: 'bg-gray-700 border-gray-600 text-white placeholder-gray-400',
                optionButton: 'bg-gray-700 hover:bg-gray-600 text-white'
            };
        }
        return {
            button: 'bg-green-500 hover:bg-green-600 text-white',
            chat: 'bg-white border border-gray-200',
            header: 'bg-gray-100',
            botMessage: 'bg-gray-100 text-gray-900',
            userMessage: 'bg-green-500 text-white',
            input: 'bg-white border-gray-300 text-gray-900 placeholder-gray-400',
            optionButton: 'bg-gray-100 hover:bg-gray-200 text-gray-900'
        };
    };

    const classes = getThemeClasses();

    return (
        <>
            {/* Botão Flutuante */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 ${classes.button}`}
                title="Atendimento"
            >
                💬
            </button>

            {/* Janela do Chat */}
            {isOpen && (
                <div className={`fixed bottom-20 right-6 z-50 w-96 h-[500px] rounded-lg shadow-xl flex flex-col ${classes.chat}`}>
                    {/* Header */}
                    <div className={`p-3 rounded-t-lg flex items-center justify-between ${classes.header}`}>
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                💬
                            </div>
                            <div>
                                <span className="font-medium">Assistente Virtual</span>
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
                    <div className="flex-1 p-3 overflow-y-auto space-y-3">
                        {messages.map((msg, index) => (
                            <div key={index}>
                                <div className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-2 rounded-lg ${msg.type === 'user' ? classes.userMessage : classes.botMessage}`}>
                                        <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                                        <p className="text-xs opacity-70 mt-1">
                                            {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                                
                                {/* Opções do bot */}
                                {msg.options && msg.options.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2 ml-2">
                                        {msg.options.map((opt, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleOptionClick(opt.action)}
                                                className={`px-3 py-1 text-sm rounded-full transition-colors ${classes.optionButton}`}
                                            >
                                                {opt.text}
                                            </button>
                                        ))}
                                    </div>
                                )}
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
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className={`p-3 border-t ${classes.header}`}>
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputMessage)}
                                placeholder="Digite sua mensagem..."
                                className={`flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 ${classes.input}`}
                            />
                            <button
                                onClick={() => sendMessage(inputMessage)}
                                className={`px-4 py-2 rounded-lg ${classes.button}`}
                            >
                                Enviar
                            </button>
                        </div>
                        <p className={`text-xs mt-2 text-center ${classes.text} opacity-70`}>
                            Powered by Ancorar Flat Resort | 
                            <button 
                                onClick={() => window.open('https://wa.me/558181091970', '_blank')}
                                className="ml-1 hover:underline"
                            >
                                Falar com atendente
                            </button>
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from '../../components/ThemeToggle';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [sent, setSent] = useState(false);
    const { theme } = useTheme();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await api.post('/password/forgot', { email });
            setMessage(response.data.message || 'Se o email existir, você receberá instruções de recuperação');
            setSent(true);
        } catch (error) {
            setError(error.response?.data?.error || 'Erro ao solicitar recuperação');
        } finally {
            setLoading(false);
        }
    };

    const getThemeClasses = () => {
        if (theme === 'dracula') {
            return {
                container: 'bg-[#282a36]',
                card: 'bg-[#44475a]',
                text: 'text-[#f8f8f2]',
                input: 'bg-[#282a36] border-[#6272a4] text-[#f8f8f2] placeholder-[#6272a4] focus:border-[#bd93f9] focus:ring-[#bd93f9]',
                button: 'bg-[#bd93f9] hover:bg-[#ff79c6] text-white',
                link: 'text-[#bd93f9] hover:text-[#ff79c6]',
                success: 'bg-[#50fa7b] text-[#282a36]',
                error: 'bg-[#ff5555] text-white'
            };
        }
        if (theme === 'dark') {
            return {
                container: 'bg-gray-900',
                card: 'bg-gray-800',
                text: 'text-white',
                input: 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500',
                button: 'bg-blue-600 hover:bg-blue-700 text-white',
                link: 'text-blue-400 hover:text-blue-300',
                success: 'bg-green-600 text-white',
                error: 'bg-red-600 text-white'
            };
        }
        return {
            container: 'bg-gray-100',
            card: 'bg-white',
            text: 'text-gray-900',
            input: 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500',
            button: 'bg-blue-600 hover:bg-blue-700 text-white',
            link: 'text-blue-600 hover:text-blue-800',
            success: 'bg-green-100 text-green-700',
            error: 'bg-red-100 text-red-700'
        };
    };

    const classes = getThemeClasses();

    return (
        <div className={`min-h-screen flex items-center justify-center ${classes.container} py-12 px-4`}>
            <ThemeToggle />
            
            <div className={`max-w-md w-full ${classes.card} rounded-lg shadow-lg p-8`}>
                <div className="text-center mb-8">
                    <h2 className={`text-3xl font-bold ${classes.text}`}>
                        Recuperar Senha
                    </h2>
                    <p className={`${classes.text} opacity-70 mt-2`}>
                        Digite seu email para receber instruções
                    </p>
                </div>

                {error && (
                    <div className={`mb-4 ${classes.error} p-3 rounded`}>
                        {error}
                    </div>
                )}

                {message && (
                    <div className={`mb-4 ${classes.success} p-3 rounded`}>
                        {message}
                    </div>
                )}

                {!sent ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${classes.input}`}
                                placeholder="seu@email.com"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-2 px-4 rounded-md ${classes.button} disabled:opacity-50 transition-colors`}
                        >
                            {loading ? 'Enviando...' : 'Enviar instruções'}
                        </button>
                    </form>
                ) : (
                    <div className="text-center">
                        <Link
                            to="/login"
                            className={`inline-block mt-4 ${classes.link} hover:underline`}
                        >
                            Voltar para o login
                        </Link>
                    </div>
                )}

                <div className="mt-6 text-center">
                    <Link
                        to="/login"
                        className={`text-sm ${classes.link} hover:underline`}
                    >
                        ← Voltar ao login
                    </Link>
                </div>
            </div>
        </div>
    );
}
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../../services/api';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from '../../components/ThemeToggle';

export default function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [validToken, setValidToken] = useState(false);
    const [checking, setChecking] = useState(true);
    
    const navigate = useNavigate();
    const location = useLocation();
    const { theme } = useTheme();
    
    // Pegar token da URL
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    useEffect(() => {
        verifyToken();
    }, []);

    const verifyToken = async () => {
        try {
            await api.get(`/password/verify/${token}`);
            setValidToken(true);
        } catch (error) {
            setError('Link inválido ou expirado');
        } finally {
            setChecking(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password.length < 6) {
            setError('A senha deve ter no mínimo 6 caracteres');
            return;
        }

        if (password !== confirmPassword) {
            setError('As senhas não coincidem');
            return;
        }

        setLoading(true);

        try {
            await api.post('/password/reset', { token, password });
            setSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (error) {
            setError(error.response?.data?.error || 'Erro ao redefinir senha');
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

    if (checking) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${classes.container}`}>
                <ThemeToggle />
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className={classes.text}>Verificando link...</p>
                </div>
            </div>
        );
    }

    if (!validToken) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${classes.container}`}>
                <ThemeToggle />
                <div className={`max-w-md w-full ${classes.card} rounded-lg shadow-lg p-8 text-center`}>
                    <div className={`${classes.error} p-4 rounded-lg mb-4`}>
                        ❌ Link Inválido
                    </div>
                    <p className={`mb-6 ${classes.text}`}>
                        Este link de recuperação é inválido ou já expirou.
                    </p>
                    <Link
                        to="/forgot-password"
                        className={`inline-block px-4 py-2 rounded ${classes.button}`}
                    >
                        Solicitar novo link
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen flex items-center justify-center ${classes.container} py-12 px-4`}>
            <ThemeToggle />
            
            <div className={`max-w-md w-full ${classes.card} rounded-lg shadow-lg p-8`}>
                <div className="text-center mb-8">
                    <h2 className={`text-3xl font-bold ${classes.text}`}>
                        Redefinir Senha
                    </h2>
                    <p className={`${classes.text} opacity-70 mt-2`}>
                        Digite sua nova senha
                    </p>
                </div>

                {error && (
                    <div className={`mb-4 ${classes.error} p-3 rounded`}>
                        {error}
                    </div>
                )}

                {success ? (
                    <div className="text-center">
                        <div className={`mb-4 ${classes.success} p-4 rounded-lg`}>
                            ✅ Senha redefinida com sucesso!
                        </div>
                        <p className={`mb-6 ${classes.text}`}>
                            Redirecionando para o login...
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                Nova Senha
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${classes.input}`}
                                placeholder="Mínimo 6 caracteres"
                                required
                            />
                        </div>

                        <div>
                            <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                                Confirmar Nova Senha
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${classes.input}`}
                                placeholder="Digite a senha novamente"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-2 px-4 rounded-md ${classes.button} disabled:opacity-50 transition-colors`}
                        >
                            {loading ? 'Redefinindo...' : 'Redefinir Senha'}
                        </button>
                    </form>
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
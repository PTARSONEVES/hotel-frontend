import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';
import api from '../services/api';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [needsVerification, setNeedsVerification] = useState(false);
    const [resending, setResending] = useState(false);
    const { login } = useAuth();
    const { theme } = useTheme();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setNeedsVerification(false);
        
        const result = await login(email, password);
        
        if (result.success) {
            navigate('/dashboard');
        } else {
            // Verificar se o erro é de email não verificado
            if (result.needsVerification) {
                setNeedsVerification(true);
                setError(result.error);
            } else {
                setError(result.error);
            }
        }
    };

    const handleResendVerification = async () => {
        setResending(true);
        try {
            await api.post('/auth/resend-verification', { email });
            alert('Novo link de confirmação enviado! Verifique seu email.');
        } catch (err) {
            alert(err.response?.data?.error || 'Erro ao reenviar confirmação');
        } finally {
            setResending(false);
        }
    };

    const getThemeClasses = () => {
        if (theme === 'dracula') {
            return {
                container: 'bg-[#282a36]',
                card: 'bg-[#44475a]',
                title: 'text-[#f8f8f2]',
                input: 'bg-[#282a36] border-[#6272a4] text-[#f8f8f2] placeholder-[#6272a4]',
                button: 'bg-[#bd93f9] hover:bg-[#ff79c6] text-white',
                link: 'text-[#bd93f9] hover:text-[#ff79c6]',
                error: 'bg-[#ff5555] text-white',
                warning: 'bg-[#f1fa8c] text-[#282a36]'
            };
        }
        if (theme === 'dark') {
            return {
                container: 'bg-gray-900',
                card: 'bg-gray-800',
                title: 'text-white',
                input: 'bg-gray-700 border-gray-600 text-white placeholder-gray-400',
                button: 'bg-blue-600 hover:bg-blue-700 text-white',
                link: 'text-blue-400 hover:text-blue-300',
                error: 'bg-red-600 text-white',
                warning: 'bg-yellow-600 text-white'
            };
        }
        return {
            container: 'bg-gray-100',
            card: 'bg-white',
            title: 'text-gray-900',
            input: 'bg-white border-gray-300 text-gray-900 placeholder-gray-400',
            button: 'bg-blue-600 hover:bg-blue-700 text-white',
            link: 'text-blue-600 hover:text-blue-800',
            error: 'bg-red-100 text-red-700',
            warning: 'bg-yellow-100 text-yellow-800'
        };
    };

    const classes = getThemeClasses();

    return (
        <div className={`min-h-screen flex items-center justify-center ${classes.container}`}>
            <ThemeToggle />
            
            <div className={`max-w-md w-full ${classes.card} p-8 rounded-lg shadow-lg`}>
                <h1 className={`text-3xl font-bold text-center mb-6 ${classes.title}`}>
                    Login
                </h1>
                
                {error && (
                    <div className={`${needsVerification ? classes.warning : classes.error} p-3 rounded mb-4`}>
                        {error}
                    </div>
                )}
                
                {needsVerification && (
                    <div className="mb-4">
                        <button
                            onClick={handleResendVerification}
                            disabled={resending}
                            className={`w-full py-2 rounded-md ${classes.button} transition-colors disabled:opacity-50`}
                        >
                            {resending ? 'Enviando...' : 'Reenviar link de confirmação'}
                        </button>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`w-full px-3 py-2 border rounded-md ${classes.input}`}
                            required
                        />
                    </div>
                    
                    <div>
                        <input
                            type="password"
                            placeholder="Senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`w-full px-3 py-2 border rounded-md ${classes.input}`}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className={`w-full py-2 rounded-md ${classes.button}`}
                    >
                        Entrar
                    </button>
                </form>
                
                <div className="flex items-center justify-between mt-4">
                    <Link to="/forgot-password" className={`text-sm ${classes.link}`}>
                        Esqueceu a senha?
                    </Link>
                    <Link to="/register" className={`text-sm ${classes.link}`}>
                        Criar conta
                    </Link>
                </div>
            </div>
        </div>
    );
}
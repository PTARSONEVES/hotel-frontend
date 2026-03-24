import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';
import api from '../services/api';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const { theme } = useTheme();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        
        if (!name || !email || !password) {
            setError('Todos os campos são obrigatórios');
            return;
        }
        
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
            const response = await api.post('/auth/register', { name, email, password });
            setSuccess(true);
            setError('');
        } catch (err) {
            setError(err.response?.data?.error || 'Erro ao registrar');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
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
                input: 'bg-[#282a36] border-[#6272a4] text-[#f8f8f2] placeholder-[#6272a4] focus:border-[#bd93f9]',
                button: 'bg-[#bd93f9] hover:bg-[#ff79c6] text-white',
                link: 'text-[#bd93f9] hover:text-[#ff79c6]',
                error: 'bg-[#ff5555] text-white',
                success: 'bg-[#50fa7b] text-[#282a36]',
                cancelButton: 'bg-gray-600 hover:bg-gray-700 text-white'
            };
        }
        if (theme === 'dark') {
            return {
                container: 'bg-gray-900',
                card: 'bg-gray-800',
                title: 'text-white',
                input: 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500',
                button: 'bg-blue-600 hover:bg-blue-700 text-white',
                link: 'text-blue-400 hover:text-blue-300',
                error: 'bg-red-600 text-white',
                success: 'bg-green-600 text-white',
                cancelButton: 'bg-gray-600 hover:bg-gray-700 text-white'
            };
        }
        return {
            container: 'bg-gray-100',
            card: 'bg-white',
            title: 'text-gray-900',
            input: 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500',
            button: 'bg-blue-600 hover:bg-blue-700 text-white',
            link: 'text-blue-600 hover:text-blue-800',
            error: 'bg-red-100 text-red-700',
            success: 'bg-green-100 text-green-700',
            cancelButton: 'bg-gray-500 hover:bg-gray-600 text-white'
        };
    };

    const classes = getThemeClasses();

    if (success) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${classes.container}`}>
                <ThemeToggle />
                <div className={`max-w-md w-full ${classes.card} p-8 rounded-lg shadow-lg text-center`}>
                    <div className={`${classes.success} p-4 rounded-lg mb-4`}>
                        ✅ Cadastro realizado com sucesso!
                    </div>
                    <p className={`mb-4 ${classes.title}`}>
                        Enviamos um link de confirmação para <strong>{email}</strong>.
                    </p>
                    <p className={`text-sm mb-6 ${classes.title} opacity-70`}>
                        Por favor, verifique sua caixa de entrada e clique no link para ativar sua conta.
                    </p>
                    <button
                        onClick={handleResend}
                        disabled={resending}
                        className={`w-full py-2 rounded-md ${classes.button} transition-colors duration-200 disabled:opacity-50`}
                    >
                        {resending ? 'Enviando...' : 'Reenviar link de confirmação'}
                    </button>
                    <button
                        onClick={() => navigate('/login')}
                        className={`w-full mt-3 py-2 rounded-md ${classes.cancelButton} transition-colors duration-200`}
                    >
                        Voltar para o login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen flex items-center justify-center ${classes.container} transition-colors duration-300`}>
            <ThemeToggle />
            
            <div className={`max-w-md w-full ${classes.card} p-8 rounded-lg shadow-lg`}>
                <h1 className={`text-3xl font-bold text-center mb-6 ${classes.title}`}>
                    Criar Conta
                </h1>
                
                {error && (
                    <div className={`${classes.error} p-3 rounded mb-4`}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Nome completo"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md ${classes.input} transition-colors duration-200`}
                        disabled={loading}
                        required
                    />
                    
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md ${classes.input} transition-colors duration-200`}
                        disabled={loading}
                        required
                    />
                    
                    <input
                        type="password"
                        placeholder="Senha (mínimo 6 caracteres)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md ${classes.input} transition-colors duration-200`}
                        disabled={loading}
                        required
                    />
                    
                    <input
                        type="password"
                        placeholder="Confirmar senha"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md ${classes.input} transition-colors duration-200`}
                        disabled={loading}
                        required
                    />

                    <div className="flex space-x-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex-1 py-2 rounded-md ${classes.button} transition-colors duration-200 disabled:opacity-50`}
                        >
                            {loading ? 'Registrando...' : 'Registrar'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            disabled={loading}
                            className={`flex-1 py-2 rounded-md ${classes.cancelButton} transition-colors duration-200 disabled:opacity-50`}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
                
                <p className={`text-center text-sm mt-4 ${classes.link}`}>
                    Já tem uma conta? <Link to="/login" className="hover:underline">Faça login</Link>
                </p>
            </div>
        </div>
    );
}
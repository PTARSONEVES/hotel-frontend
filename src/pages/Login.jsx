import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext'; // IMPORTAR
import ThemeToggle from '../components/ThemeToggle';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const { theme } = useTheme(); // USAR O TEMA
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(email, password);
        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error);
        }
    };

    // Classes baseadas no tema
    const getThemeClasses = () => {
        switch(theme) {
            case 'dracula':
                return {
                    container: 'bg-[#282a36]',
                    card: 'bg-[#44475a]',
                    title: 'text-[#f8f8f2]',
                    input: 'bg-[#282a36] border-[#6272a4] text-[#f8f8f2] placeholder-[#6272a4] focus:border-[#bd93f9] focus:ring-[#bd93f9]',
                    button: 'bg-[#bd93f9] hover:bg-[#ff79c6] text-white',
                    link: 'text-[#bd93f9] hover:text-[#ff79c6]',
                    error: 'bg-[#ff5555] text-white',
                };
            case 'dark':
                return {
                    container: 'bg-gray-900',
                    card: 'bg-gray-800',
                    title: 'text-white',
                    input: 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500',
                    button: 'bg-blue-600 hover:bg-blue-700 text-white',
                    link: 'text-blue-400 hover:text-blue-300',
                    error: 'bg-red-600 text-white',
                };
            default:
                return {
                    container: 'bg-gray-100',
                    card: 'bg-white',
                    title: 'text-gray-900',
                    input: 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500',
                    button: 'bg-blue-600 hover:bg-blue-700 text-white',
                    link: 'text-blue-600 hover:text-blue-800',
                    error: 'bg-red-100 text-red-700',
                };
        }
    };

    const classes = getThemeClasses();

    return (
        <div className={`min-h-screen flex items-center justify-center ${classes.container} transition-colors duration-300`}>
            <ThemeToggle />
            
            <div className={`max-w-md w-full ${classes.card} p-8 rounded-lg shadow-lg`}>
                <h1 className={`text-3xl font-bold text-center mb-6 ${classes.title}`}>
                    Login
                </h1>
                
                {error && (
                    <div className={`${classes.error} p-3 rounded mb-4`}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`w-full px-3 py-2 border rounded-md ${classes.input} transition-colors duration-200`}
                            required
                        />
                    </div>
                    
                    <div>
                        <input
                            type="password"
                            placeholder="Senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`w-full px-3 py-2 border rounded-md ${classes.input} transition-colors duration-200`}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className={`w-full py-2 px-4 rounded-md ${classes.button} transition-colors duration-200`}
                    >
                        Entrar
                    </button>
                </form>
                
                <div className="flex items-center justify-between mt-4">
                    <Link to="/forgot-password" className={`text-sm ${classes.link} transition-colors duration-200`}>
                        Esqueceu a senha?
                    </Link>
                    <Link to="/register" className={`text-sm ${classes.link} transition-colors duration-200`}>
                        Criar conta
                    </Link>
                </div>
            </div>
        </div>
    );
}
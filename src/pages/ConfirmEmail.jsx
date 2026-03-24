import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../services/api';
import ThemeToggle from '../components/ThemeToggle';
import { useTheme } from '../context/ThemeContext';

export default function ConfirmEmail() {
    const [status, setStatus] = useState('loading');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { theme } = useTheme();
    const hasConfirmed = useRef(false); // <-- EVITA DUPLA CHAMADA

    useEffect(() => {
        const token = new URLSearchParams(location.search).get('token');
        
        if (!token) {
            setStatus('error');
            setMessage('Link inválido');
            return;
        }
        
        // Só executa uma vez
        if (!hasConfirmed.current) {
            hasConfirmed.current = true;
            confirmEmail(token);
        }
    }, [location]);

    const confirmEmail = async (token) => {
        try {
            console.log('🔍 Confirmando email com token:', token);
            const response = await api.get(`/auth/confirm-email/${token}`);
            
            console.log('✅ Resposta:', response.data);
            
            // Salvar token e usuário
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            
            setStatus('success');
            setMessage('Email confirmado com sucesso! Redirecionando...');
            
            setTimeout(() => {
                navigate('/dashboard');
            }, 3000);
        } catch (err) {
            console.error('❌ Erro na confirmação:', err);
            
            // Se o erro for "Email já verificado", considere como sucesso
            if (err.response?.data?.error === 'Email já verificado') {
                setStatus('success');
                setMessage('Email já estava confirmado! Redirecionando...');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setStatus('error');
                setMessage(err.response?.data?.error || 'Erro ao confirmar email');
            }
        }
    };

    const getThemeClasses = () => {
        if (theme === 'dracula') {
            return {
                container: 'bg-[#282a36]',
                card: 'bg-[#44475a]',
                text: 'text-[#f8f8f2]',
                success: 'bg-[#50fa7b] text-[#282a36]',
                error: 'bg-[#ff5555] text-white'
            };
        }
        if (theme === 'dark') {
            return {
                container: 'bg-gray-900',
                card: 'bg-gray-800',
                text: 'text-white',
                success: 'bg-green-600 text-white',
                error: 'bg-red-600 text-white'
            };
        }
        return {
            container: 'bg-gray-100',
            card: 'bg-white',
            text: 'text-gray-900',
            success: 'bg-green-100 text-green-700',
            error: 'bg-red-100 text-red-700'
        };
    };

    const classes = getThemeClasses();

    if (status === 'loading') {
        return (
            <div className={`min-h-screen flex items-center justify-center ${classes.container}`}>
                <ThemeToggle />
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className={classes.text}>Confirmando seu email...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen flex items-center justify-center ${classes.container}`}>
            <ThemeToggle />
            <div className={`max-w-md w-full ${classes.card} p-8 rounded-lg shadow-lg text-center`}>
                <div className={`${status === 'success' ? classes.success : classes.error} p-4 rounded-lg mb-4`}>
                    {status === 'success' ? '✅ Sucesso!' : '❌ Erro'}
                </div>
                <p className={`mb-6 ${classes.text}`}>{message}</p>
                {status === 'error' && (
                    <Link
                        to="/login"
                        className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Voltar para o login
                    </Link>
                )}
            </div>
        </div>
    );
}
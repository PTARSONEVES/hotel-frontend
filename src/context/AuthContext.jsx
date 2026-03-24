import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUserFromToken();
    }, []);

    const loadUserFromToken = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                // Decodificar token
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const payload = JSON.parse(window.atob(base64));
                
                setUser({
                    id: payload.id,
                    email: payload.email,
                    name: payload.name || 'Usuário',
                    role: payload.role || 'hospede'
                });
            }
        } catch (error) {
            console.error('❌ Erro ao carregar usuário:', error);
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // FUNÇÃO DE LOGIN
    // =====================================================
    const login = async (email, password) => {
        try {
            console.log('🔑 Tentando login...');
            const response = await api.post('/auth/login', { email, password });
            const { token, user: userData } = response.data;

            localStorage.setItem('token', token);
            setUser(userData);
            return { success: true };
        } catch (error) {
            console.error('❌ Erro no login:', error);
            return { 
                success: false, 
                error: error.response?.data?.error || 'Erro ao fazer login' 
            };
        }
    };

    // =====================================================
    // FUNÇÃO DE REGISTRO (CORRIGIDA)
    // =====================================================
    const register = async (name, email, password) => {
        try {
            console.log('📝 Tentando registro...', { name, email });
            const response = await api.post('/auth/register', { name, email, password });
            const { token, user: userData } = response.data;

            console.log('✅ Registro bem-sucedido:', userData);
            localStorage.setItem('token', token);
            setUser(userData);
            return { success: true };
        } catch (error) {
            console.error('❌ Erro no registro:', error);
            return { 
                success: false, 
                error: error.response?.data?.error || 'Erro ao registrar' 
            };
        }
    };

    // =====================================================
    // FUNÇÃO DE LOGOUT
    // =====================================================
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    // =====================================================
    // FUNÇÕES DE VERIFICAÇÃO DE PERMISSÃO
    // =====================================================
    const hasPermission = (permissionName) => {
        if (!user) return false;
        if (user.role === 'admin') return true;
        // Implementar verificação de permissões específicas
        return false;
    };

    const hasMinRole = (requiredRole) => {
        if (!user) return false;
        const roleHierarchy = {
            'hospede': 1,
            'colaborador': 2,
            'admin': 3
        };
        return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            login, 
            register,   // <-- CERTIFIQUE-SE QUE ESTÁ AQUI
            logout, 
            loading,
            hasPermission,
            hasMinRole
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de AuthProvider');
    }
    return context;
};
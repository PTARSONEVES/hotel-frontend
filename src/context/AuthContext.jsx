import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [permissions, setPermissions] = useState([]);

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
                
                // Buscar dados completos do usuário (incluindo role e permissões)
                try {
                    const response = await api.get('/users/me');
                    setUser(response.data.user);
                    setPermissions(response.data.permissions || []);
                } catch (error) {
                    // Se falhar, usa dados do token
                    setUser({
                        id: payload.id,
                        email: payload.email,
                        name: payload.name || 'Usuário',
                        role: payload.role || 'hospede'
                    });
                }
            }
        } catch (error) {
            console.error('❌ Erro ao carregar usuário:', error);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, user: userData } = response.data;

            localStorage.setItem('token', token);
            setUser(userData);
            
            // Buscar permissões do usuário
            try {
                const permResponse = await api.get('/users/permissions');
                setPermissions(permResponse.data);
            } catch (error) {
                console.error('Erro ao carregar permissões:', error);
            }
            
            return { success: true };
        } catch (error) {
            return { 
                success: false, 
                error: error.response?.data?.error || 'Erro ao fazer login' 
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setPermissions([]);
    };

    // Verificar se o usuário tem uma permissão específica
    const hasPermission = (permissionName) => {
        if (!user) return false;
        if (user.role === 'admin') return true; // Admin tem tudo
        return permissions.includes(permissionName);
    };

    // Verificar se o usuário tem um papel mínimo
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
            logout, 
            loading,
            permissions,
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
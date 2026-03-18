import React from 'react'; 
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ 
    children, 
    requiredRole = null,        // 'hospede', 'colaborador', 'admin'
    requiredPermission = null,  // Nome da permissão específica
    redirectTo = '/login'
}) {
    const { user, loading, hasMinRole, hasPermission } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to={redirectTo} />;
    }

    // Verificar papel mínimo
    if (requiredRole && !hasMinRole(requiredRole)) {
        return <Navigate to="/dashboard" />;
    }

    // Verificar permissão específica
    if (requiredPermission && !hasPermission(requiredPermission)) {
        return <Navigate to="/dashboard" />;
    }

    return children;
}
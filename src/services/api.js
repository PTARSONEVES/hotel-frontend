import axios from 'axios';

// Forçar a URL correta para produção
const getBaseURL = () => {
    // Se estiver rodando localmente (localhost), usa localhost
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:3000/api';
    }
    // Se estiver em produção, usa a URL do backend no Render
    return 'https://sistema-financeiro-d71y.onrender.com/api';
};

const baseURL = getBaseURL();

console.log('🔧 API Base URL:', baseURL);

const api = axios.create({
    baseURL: baseURL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Interceptor para adicionar token
api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
    response => response,
    error => {
        console.error('❌ Erro na requisição:', error.response?.status, error.config?.url);
        
        // Só redireciona se NÃO for uma rota pública
        const publicRoutes = ['/auth/login', '/auth/register', '/password/forgot', '/password/reset'];
        const isPublicRoute = publicRoutes.some(route => error.config?.url?.includes(route));
        
        if (error.response?.status === 401 && !isPublicRoute) {
            console.log('🚫 Token inválido - redirecionando para login...');
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        
        return Promise.reject(error);
    }
);

export default api;
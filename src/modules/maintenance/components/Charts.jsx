import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useTheme } from '../../../context/ThemeContext';

export function OSStatusChart({ data }) {
    const { theme } = useTheme();
    
    const getColors = () => {
        if (theme === 'dracula') {
            return {
                text: '#f8f8f2',
                grid: '#6272a4',
                colors: ['#50fa7b', '#ffb86c', '#ff5555', '#6272a4']
            };
        }
        if (theme === 'dark') {
            return {
                text: '#ffffff',
                grid: '#4b5563',
                colors: ['#10b981', '#f59e0b', '#ef4444', '#6b7280']
            };
        }
        return {
            text: '#374151',
            grid: '#e5e7eb',
            colors: ['#10b981', '#f59e0b', '#ef4444', '#6b7280']
        };
    };
    
    const colors = getColors();
    
    const chartData = [
        { name: 'Abertas', value: data?.abertas || 0 },
        { name: 'Em Andamento', value: data?.em_andamento || 0 },
        { name: 'Concluídas', value: data?.concluidas || 0 },
        { name: 'Canceladas', value: data?.canceladas || 0 }
    ];
    
    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors.colors[index % colors.colors.length]} />
                    ))}
                </Pie>
                <Tooltip 
                    contentStyle={{ backgroundColor: theme === 'dracula' ? '#282a36' : '#fff', borderColor: colors.grid }}
                    labelStyle={{ color: colors.text }}
                />
                <Legend wrapperStyle={{ color: colors.text }} />
            </PieChart>
        </ResponsiveContainer>
    );
}

export function MonthlyCostsChart({ data }) {
    const { theme } = useTheme();
    
    const getColors = () => {
        if (theme === 'dracula') {
            return {
                text: '#f8f8f2',
                grid: '#6272a4',
                maoObra: '#bd93f9',
                materiais: '#50fa7b'
            };
        }
        if (theme === 'dark') {
            return {
                text: '#ffffff',
                grid: '#4b5563',
                maoObra: '#3b82f6',
                materiais: '#10b981'
            };
        }
        return {
            text: '#374151',
            grid: '#e5e7eb',
            maoObra: '#3b82f6',
            materiais: '#10b981'
        };
    };
    
    const colors = getColors();
    
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    
    const chartData = Array(12).fill().map((_, i) => ({
        mes: meses[i],
        maoObra: data?.find(d => d.mes === i + 1)?.custo_mao_obra || 0,
        materiais: data?.find(d => d.mes === i + 1)?.custo_materiais || 0
    }));
    
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
                <XAxis dataKey="mes" stroke={colors.text} />
                <YAxis stroke={colors.text} />
                <Tooltip 
                    contentStyle={{ backgroundColor: theme === 'dracula' ? '#282a36' : '#fff', borderColor: colors.grid }}
                    labelStyle={{ color: colors.text }}
                    formatter={(value) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                />
                <Legend wrapperStyle={{ color: colors.text }} />
                <Bar dataKey="maoObra" name="Mão de Obra" fill={colors.maoObra} />
                <Bar dataKey="materiais" name="Materiais" fill={colors.materiais} />
            </BarChart>
        </ResponsiveContainer>
    );
}

export function TopMaterialsChart({ data }) {
    const { theme } = useTheme();
    
    const getColors = () => {
        if (theme === 'dracula') return { text: '#f8f8f2', grid: '#6272a4', bar: '#bd93f9' };
        if (theme === 'dark') return { text: '#ffffff', grid: '#4b5563', bar: '#3b82f6' };
        return { text: '#374151', grid: '#e5e7eb', bar: '#3b82f6' };
    };
    
    const colors = getColors();
    
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} layout="vertical" margin={{ left: 100 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
                <XAxis type="number" stroke={colors.text} />
                <YAxis type="category" dataKey="name" stroke={colors.text} />
                <Tooltip 
                    contentStyle={{ backgroundColor: theme === 'dracula' ? '#282a36' : '#fff', borderColor: colors.grid }}
                    labelStyle={{ color: colors.text }}
                    formatter={(value) => `${value} unidades`}
                />
                <Bar dataKey="total_quantidade" name="Quantidade" fill={colors.bar} />
            </BarChart>
        </ResponsiveContainer>
    );
}

export function TopEquipmentChart({ data }) {
    const { theme } = useTheme();
    
    const getColors = () => {
        if (theme === 'dracula') return { text: '#f8f8f2', grid: '#6272a4', bar: '#ff79c6' };
        if (theme === 'dark') return { text: '#ffffff', grid: '#4b5563', bar: '#ef4444' };
        return { text: '#374151', grid: '#e5e7eb', bar: '#ef4444' };
    };
    
    const colors = getColors();
    
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} layout="vertical" margin={{ left: 100 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
                <XAxis type="number" stroke={colors.text} />
                <YAxis type="category" dataKey="name" stroke={colors.text} />
                <Tooltip 
                    contentStyle={{ backgroundColor: theme === 'dracula' ? '#282a36' : '#fff', borderColor: colors.grid }}
                    labelStyle={{ color: colors.text }}
                />
                <Bar dataKey="total_os" name="Total de OS" fill={colors.bar} />
            </BarChart>
        </ResponsiveContainer>
    );
}
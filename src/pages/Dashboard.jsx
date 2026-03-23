import React from 'react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';
import RoleBasedDashboard from '../components/RoleBasedDashboard';

export default function Dashboard() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pt-20">
            <ThemeToggle />
            <div className="max-w-7xl mx-auto px-4">
                <RoleBasedDashboard />
            </div>
        </div>
    );
}
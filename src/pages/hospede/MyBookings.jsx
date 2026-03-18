import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import ThemeToggle from '../../components/ThemeToggle';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export default function MyBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const { theme } = useTheme();
    const { user } = useAuth();

    useEffect(() => {
        loadMyBookings();
    }, []);

    const loadMyBookings = async () => {
        try {
            const response = await api.get('/hotel/bookings/my');
            setBookings(response.data);
        } catch (error) {
            console.error('Erro ao carregar reservas:', error);
        } finally {
            setLoading(false);
        }
    };

    const getThemeClasses = () => {
        if (theme === 'dracula') {
            return {
                card: 'bg-[#44475a]',
                text: 'text-[#f8f8f2]'
            };
        }
        if (theme === 'dark') {
            return {
                card: 'bg-gray-800',
                text: 'text-white'
            };
        }
        return {
            card: 'bg-white',
            text: 'text-gray-900'
        };
    };

    const classes = getThemeClasses();

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                <ThemeToggle />
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pt-20 pb-8">
            <ThemeToggle />
            
            <div className="max-w-7xl mx-auto px-4">
                <h1 className={`text-3xl font-bold mb-8 ${classes.text}`}>
                    Minhas Reservas
                </h1>

                {bookings.length === 0 ? (
                    <p className={classes.text}>Você não tem reservas.</p>
                ) : (
                    <div className="grid gap-4">
                        {bookings.map(booking => (
                            <div key={booking.id} className={`${classes.card} p-4 rounded-lg shadow`}>
                                <h3 className={`font-bold ${classes.text}`}>Reserva #{booking.id}</h3>
                                <p className={classes.text}>Check-in: {booking.check_in}</p>
                                <p className={classes.text}>Check-out: {booking.check_out}</p>
                                <p className={classes.text}>Status: {booking.status}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
import React from 'react';
import { Link } from 'react-router-dom';
import LandingHeader from '../components/Header';
import Footer from '../components/Footer';
import { useTheme } from '../../context/ThemeContext';

import home from '../assets/images/home_004.jpeg';

export default function Home() {
    const { theme } = useTheme();

    const highlights = [
        {
            icon: '🏖️',
            title: 'Praias Paradisíacas',
            description: 'A poucos passos das piscinas naturais de Porto de Galinhas'
        },
        {
            icon: '🏊‍♂️',
            title: 'Piscinas Adulto e Infantil',
            description: 'Áreas de lazer completas para toda família'
        },
        {
            icon: '🍽️',
            title: 'Restaurante Premiado',
            description: 'Gastronomia regional com toque gourmet'
        },
        {
            icon: '🛎️',
            title: 'Serviço de Quarto 24h',
            description: 'Conforto e comodidade à qualquer hora'
        }
    ];

    const getThemeClasses = () => {
        if (theme === 'dracula') {
            return {
                bg: 'bg-[#282a36]',
                text: 'text-[#f8f8f2]',
                card: 'bg-[#44475a]',
                accent: 'text-[#bd93f9]'
            };
        }
        if (theme === 'dark') {
            return {
                bg: 'bg-gray-900',
                text: 'text-white',
                card: 'bg-gray-800',
                accent: 'text-blue-400'
            };
        }
        return {
            bg: 'bg-gray-50',
            text: 'text-gray-900',
            card: 'bg-white',
            accent: 'text-blue-600'
        };
    };

    const classes = getThemeClasses();

    return (
        <div className={`min-h-screen ${classes.bg}`}>
            <LandingHeader />

            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <img 
//                        src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                        src={home}
                        alt="Resort"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50"></div>
                </div>

                {/* Hero Content */}
                <div className="relative text-center text-white max-w-4xl mx-auto px-4">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6">
                        Bem-vindo ao<br />
                        <span className="text-blue-400">Ancorar Flat Resort</span>
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 text-gray-200">
                        Onde o conforto encontra o paraíso em Porto de Galinhas
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/pre-reserva"
                            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-lg font-semibold transition-colors"
                        >
                            Faça sua Pré-reserva
                        </Link>
                        <Link
                            to="/flats"
                            className="px-8 py-4 border-2 border-white hover:bg-white hover:text-gray-900 text-white rounded-lg text-lg font-semibold transition-colors"
                        >
                            Conheça Nossos Flats
                        </Link>
                    </div>
                </div>
            </section>

            {/* Highlights */}
            <section className={`py-20 ${classes.bg}`}>
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className={`text-4xl font-bold text-center mb-4 ${classes.text}`}>
                        Por que escolher o Ancorar?
                    </h2>
                    <p className={`text-center text-xl mb-12 ${classes.text} opacity-80`}>
                        Experiências únicas em um dos destinos mais paradisíacos do Brasil
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {highlights.map((item, index) => (
                            <div key={index} className={`${classes.card} p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow`}>
                                <div className="text-5xl mb-4">{item.icon}</div>
                                <h3 className={`text-xl font-bold mb-2 ${classes.text}`}>{item.title}</h3>
                                <p className={`${classes.text} opacity-70`}>{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-blue-600 py-20">
                <div className="max-w-4xl mx-auto text-center px-4">
                    <h2 className="text-4xl font-bold text-white mb-6">
                        Pronto para viver essa experiência?
                    </h2>
                    <p className="text-xl text-white/90 mb-8">
                        Reserve agora e garanta as melhores tarifas
                    </p>
                    <Link
                        to="/pre-reserva"
                        className="inline-block px-8 py-4 bg-white text-blue-600 hover:bg-gray-100 rounded-lg text-lg font-semibold transition-colors"
                    >
                        Fazer Pré-reserva
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    );
}
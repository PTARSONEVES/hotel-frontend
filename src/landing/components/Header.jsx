import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from '../../components/ThemeToggle';
import Logo from '../../components/Logo';

export default function LandingHeader() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { theme } = useTheme();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const getThemeClasses = () => {
        if (theme === 'dracula') {
            return {
                nav: isScrolled ? 'bg-[#282a36]/95 backdrop-blur-md' : 'bg-transparent',
                text: 'text-[#f8f8f2]',
                hover: 'hover:text-[#ff79c6]',
                button: 'border-[#bd93f9] text-[#bd93f9] hover:bg-[#bd93f9] hover:text-white',
                mobileMenu: 'bg-[#282a36] border-[#44475a]'
            };
        }
        if (theme === 'dark') {
            return {
                nav: isScrolled ? 'bg-gray-900/95 backdrop-blur-md' : 'bg-transparent',
                text: 'text-gray-300',
                hover: 'hover:text-white',
                button: 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white',
                mobileMenu: 'bg-gray-900 border-gray-700'
            };
        }
        return {
            nav: isScrolled ? 'bg-white/95 backdrop-blur-md' : 'bg-transparent',
            text: 'text-gray-700',
            hover: 'hover:text-blue-600',
            button: 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white',
            mobileMenu: 'bg-white border-gray-200'
        };
    };

    const classes = getThemeClasses();

    const navLinks = [
        { to: '/', label: 'Home' },
        { to: '/sobre', label: 'O Resort' },
        { to: '/flats', label: 'Nossos Flats' },
        { to: '/porto-de-galinhas', label: 'Porto de Galinhas' },
    ];

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${classes.nav}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center">
                        <Logo className="h-14 w-auto" />
                    </Link>

                    {/* Menu Desktop */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map(link => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`${classes.text} ${classes.hover} transition-colors font-medium`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Ações Desktop */}
                    <div className="hidden md:flex items-center space-x-4">
                        <ThemeToggle />
                        <Link
                            to="/pre-reserva"
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            Pré-reserva
                        </Link>
                        <Link
                            to="/login"
                            className={`px-4 py-2 border rounded-lg transition-colors font-medium ${classes.button}`}
                        >
                            Login
                        </Link>
                        <a
                            href="https://wa.me/558181091970?text=Olá! Gostaria de mais informações sobre o Ancorar Flat Resort."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        >
                            WhatsApp
                        </a>
                    </div>

                    {/* Botão Menu Mobile */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Menu Mobile */}
                {isMobileMenuOpen && (
                    <div className={`md:hidden py-4 border-t ${classes.mobileMenu}`}>
                        {navLinks.map(link => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`block py-3 ${classes.text} ${classes.hover} transition-colors`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="flex flex-col space-y-3 pt-4">
                            <Link
                                to="/pre-reserva"
                                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg text-center font-medium"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Pré-reserva
                            </Link>
                            <Link
                                to="/login"
                                className={`w-full px-4 py-3 border rounded-lg text-center font-medium ${classes.button}`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Login
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
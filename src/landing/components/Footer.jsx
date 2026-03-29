import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';

export default function Footer() {
    const { theme } = useTheme();

    const getThemeClasses = () => {
        if (theme === 'dracula') {
            return {
                bg: 'bg-[#282a36] border-t border-[#44475a]',
                text: 'text-[#f8f8f2]',
                muted: 'text-[#6272a4]',
                hover: 'hover:text-[#ff79c6]',
                socialHover: 'hover:bg-[#44475a]'
            };
        }
        if (theme === 'dark') {
            return {
                bg: 'bg-gray-900 border-t border-gray-800',
                text: 'text-gray-300',
                muted: 'text-gray-500',
                hover: 'hover:text-white',
                socialHover: 'hover:bg-gray-800'
            };
        }
        return {
            bg: 'bg-gray-100 border-t border-gray-200',
            text: 'text-gray-700',
            muted: 'text-gray-500',
            hover: 'hover:text-blue-600',
            socialHover: 'hover:bg-gray-200'
        };
    };

    const classes = getThemeClasses();

    // Função para abrir WhatsApp
    const openWhatsApp = () => {
        const phone = '558181091970';
        const message = encodeURIComponent('Olá! Gostaria de mais informações sobre o Ancorar Flat Resort.');
        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    };

    // Função para abrir Instagram
    const openInstagram = () => {
        window.open('https://www.instagram.com/reservas.ancorarporto', '_blank');
    };

    // Função para abrir Facebook
    const openFacebook = () => {
        window.open('https://www.facebook.com/flatancorarsal', '_blank');
    };

    // Função para ligar
    const makeCall = () => {
        window.location.href = 'tel:+5581981091970';
    };

    return (
        <footer className={`${classes.bg} transition-colors duration-300`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Sobre */}
                    <div>
                        <h3 className={`text-lg font-bold mb-4 ${classes.text}`}>Ancorar Flat Resort</h3>
                        <p className={`${classes.muted} mb-4 text-sm`}>
                            O melhor de Porto de Galinhas com o conforto e sofisticação que você merece.
                        </p>
                        <div className="flex space-x-3">
                            {/* WhatsApp */}
                            <button
                                onClick={openWhatsApp}
                                className={`p-2 rounded-full transition-colors ${classes.socialHover}`}
                                aria-label="WhatsApp"
                            >
                                <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12.032 2.002c-5.514 0-9.996 4.476-9.996 9.99 0 1.75.46 3.473 1.33 4.99L2 22l5.176-1.328c1.468.808 3.12 1.236 4.824 1.236h.008c5.513 0 9.997-4.477 9.997-9.99 0-2.66-1.035-5.163-2.92-7.05-1.884-1.886-4.387-2.926-7.05-2.926zm0 18.395c-1.494 0-2.962-.397-4.243-1.145l-.304-.18-3.07.788.823-2.995-.197-.313c-.807-1.28-1.232-2.745-1.232-4.244 0-4.587 3.73-8.316 8.317-8.316 2.22 0 4.306.864 5.875 2.434 1.568 1.57 2.43 3.66 2.43 5.883 0 4.59-3.73 8.318-8.317 8.318zm4.56-6.227c-.25-.125-1.478-.73-1.707-.813-.23-.083-.397-.125-.564.125-.167.25-.647.813-.793.98-.146.166-.292.187-.542.062-.25-.124-1.055-.39-2.008-1.24-.742-.664-1.243-1.483-1.388-1.733-.146-.25-.016-.385.11-.51.11-.11.25-.292.375-.438.125-.146.166-.25.25-.417.083-.166.042-.312-.02-.437-.063-.125-.564-1.36-.773-1.862-.203-.49-.41-.423-.564-.432-.146-.01-.312-.01-.48-.01-.167 0-.437.062-.666.312-.23.25-.875.855-.875 2.085 0 1.23.896 2.42 1.022 2.587.125.166 1.763 2.694 4.27 3.78.596.258 1.062.412 1.426.528.6.19 1.145.164 1.578.1.48-.073 1.478-.604 1.686-1.188.208-.583.208-1.083.146-1.188-.063-.104-.23-.166-.48-.29z"/>
                                </svg>
                            </button>
                            {/* Instagram */}
                            <button
                                onClick={openInstagram}
                                className={`p-2 rounded-full transition-colors ${classes.socialHover}`}
                                aria-label="Instagram"
                            >
                                <svg className="w-6 h-6 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                                </svg>
                            </button>
                            {/* Facebook */}
                            <button
                                onClick={openFacebook}
                                className={`p-2 rounded-full transition-colors ${classes.socialHover}`}
                                aria-label="Facebook"
                            >
                                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879v-6.99h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.99C18.343 21.128 22 16.991 22 12z"/>
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Links Rápidos */}
                    <div>
                        <h3 className={`text-lg font-bold mb-4 ${classes.text}`}>Links Rápidos</h3>
                        <ul className="space-y-2">
                            <li><Link to="/" className={`${classes.muted} ${classes.hover} transition-colors`}>Home</Link></li>
                            <li><Link to="/sobre" className={`${classes.muted} ${classes.hover} transition-colors`}>Sobre Nós</Link></li>
                            <li><Link to="/flats" className={`${classes.muted} ${classes.hover} transition-colors`}>Flats</Link></li>
                            <li><Link to="/porto-de-galinhas" className={`${classes.muted} ${classes.hover} transition-colors`}>Porto de Galinhas</Link></li>
                        </ul>
                    </div>

                    {/* Contato */}
                    <div>
                        <h3 className={`text-lg font-bold mb-4 ${classes.text}`}>Contato</h3>
                        <ul className="space-y-3">
                            {/* Telefone com link para ligar */}
                            <li>
                                <button
                                    onClick={makeCall}
                                    className={`${classes.muted} ${classes.hover} transition-colors flex items-center space-x-2 cursor-pointer`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                                    </svg>
                                    <span>(81) 9 8109-1970</span>
                                </button>
                            </li>
                            {/* WhatsApp com link direto */}
                            <li>
                                <button
                                    onClick={openWhatsApp}
                                    className={`${classes.muted} ${classes.hover} transition-colors flex items-center space-x-2 cursor-pointer`}
                                >
                                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12.032 2.002c-5.514 0-9.996 4.476-9.996 9.99 0 1.75.46 3.473 1.33 4.99L2 22l5.176-1.328c1.468.808 3.12 1.236 4.824 1.236h.008c5.513 0 9.997-4.477 9.997-9.99 0-2.66-1.035-5.163-2.92-7.05-1.884-1.886-4.387-2.926-7.05-2.926z"/>
                                    </svg>
                                    <span>WhatsApp</span>
                                </button>
                            </li>
                            {/* Email */}
                            <li className={`${classes.muted} flex items-center space-x-2`}>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                </svg>
                                <span>reservas@ancorarportodegalinhas.com</span>
                            </li>
                            {/* Endereço */}
                            <li className={`${classes.muted} flex items-start space-x-2`}>
                                <svg className="w-5 h-5 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                </svg>
                                <span>Porto de Galinhas, Ipojuca - PE</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className={`text-lg font-bold mb-4 ${classes.text}`}>Newsletter</h3>
                        <p className={`${classes.muted} mb-4 text-sm`}>
                            Receba ofertas exclusivas e novidades.
                        </p>
                        <form className="flex" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="Seu email"
                                className={`flex-1 px-4 py-2 rounded-l-lg border focus:outline-none focus:ring-2 focus:ring-blue-500
                                    ${theme === 'dracula' 
                                        ? 'bg-[#282a36] border-[#6272a4] text-[#f8f8f2] placeholder-[#6272a4]' 
                                        : theme === 'dark' 
                                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' 
                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'}`}
                            />
                            <button
                                type="submit"
                                className={`px-4 py-2 rounded-r-lg transition-colors
                                    ${theme === 'dracula' 
                                        ? 'bg-[#bd93f9] hover:bg-[#ff79c6] text-white' 
                                        : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                            >
                                OK
                            </button>
                        </form>
                    </div>
                </div>

                <div className={`border-t ${theme === 'dracula' ? 'border-[#44475a]' : 'border-gray-200'} mt-8 pt-8 text-center ${classes.muted}`}>
                    <p>&copy; {new Date().getFullYear()} Ancorar Flat Resort. Todos os direitos reservados.</p>
                </div>
            </div>
        </footer>
    );
}
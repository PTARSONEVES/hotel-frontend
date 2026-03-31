import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import SocialMeta from '../components/SocialMeta';

export default function SocialFacebook() {
    const { theme } = useTheme();

    const getThemeClasses = () => {
        if (theme === 'dracula') {
            return {
                bg: 'bg-[#282a36]',
                text: 'text-[#f8f8f2]',
                card: 'bg-[#44475a]',
                button: 'bg-[#bd93f9] hover:bg-[#ff79c6] text-white'
            };
        }
        if (theme === 'dark') {
            return {
                bg: 'bg-gray-900',
                text: 'text-white',
                card: 'bg-gray-800',
                button: 'bg-blue-600 hover:bg-blue-700 text-white'
            };
        }
        return {
            bg: 'bg-gray-50',
            text: 'text-gray-900',
            card: 'bg-white',
            button: 'bg-blue-600 hover:bg-blue-700 text-white'
        };
    };

    const classes = getThemeClasses();

    return (
        <div className={`min-h-screen ${classes.bg}`}>
            <SocialMeta
                title="Ancorar Flat Resort no Facebook"
                description="Siga nossa página no Facebook e fique por dentro das novidades, promoções e eventos exclusivos do Ancorar Flat Resort em Porto de Galinhas!"
                image="/images/facebook-share.jpg"
                url="/facebook"
            />

            <div className="max-w-4xl mx-auto px-4 py-16">
                <div className={`${classes.card} rounded-2xl shadow-xl overflow-hidden`}>
                    {/* Header */}
                    <div className="bg-blue-600 p-8 text-center">
                        <div className="text-6xl mb-4">📘</div>
                        <h1 className={`text-3xl font-bold text-white`}>
                            Ancorar Flat Resort no Facebook
                        </h1>
                        <p className="text-white/90 mt-2">
                            Siga-nos e acompanhe nossas novidades
                        </p>
                    </div>

                    {/* Conteúdo */}
                    <div className="p-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h2 className={`text-xl font-bold mb-4 ${classes.text}`}>
                                    Por que seguir?
                                </h2>
                                <ul className="space-y-3">
                                    <li className="flex items-start space-x-2">
                                        <span className="text-blue-600">✓</span>
                                        <span className={classes.text}>Promoções exclusivas para seguidores</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <span className="text-blue-600">✓</span>
                                        <span className={classes.text}>Fotos e vídeos do resort</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <span className="text-blue-600">✓</span>
                                        <span className={classes.text}>Eventos especiais</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <span className="text-blue-600">✓</span>
                                        <span className={classes.text}>Depoimentos de hóspedes</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <span className="text-blue-600">✓</span>
                                        <span className={classes.text}>Dicas de Porto de Galinhas</span>
                                    </li>
                                </ul>
                            </div>
                            
                            <div>
                                <h2 className={`text-xl font-bold mb-4 ${classes.text}`}>
                                    Siga agora!
                                </h2>
                                <a
                                    href="https://www.facebook.com/flatancorarsal"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
                                >
                                    <span className="text-xl">📘</span>
                                    <span>Seguir no Facebook</span>
                                </a>
                                
                                <div className="mt-6">
                                    <h3 className={`font-bold mb-2 ${classes.text}`}>
                                        Últimas publicações
                                    </h3>
                                    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                                        <p className={`text-sm ${classes.text}`}>
                                            ⏳ Conteúdo em breve...
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
                            <Link
                                to="/"
                                className={`${classes.button} px-6 py-2 rounded-lg inline-block`}
                            >
                                Voltar para o site
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
import React from 'react';
import { Link } from 'react-router-dom';
import LandingHeader from '../components/Header';
import Footer from '../components/Footer';
import { useTheme } from '../../context/ThemeContext';

import about from '../assets/images/resort_001.jpeg';

export default function About() {
    const { theme } = useTheme();

    const getThemeClasses = () => {
        if (theme === 'dracula') {
            return {
                bg: 'bg-[#282a36]',
                text: 'text-[#f8f8f2]',
                card: 'bg-[#44475a]',
                accent: 'text-[#bd93f9]',
                border: 'border-[#44475a]'
            };
        }
        if (theme === 'dark') {
            return {
                bg: 'bg-gray-900',
                text: 'text-white',
                card: 'bg-gray-800',
                accent: 'text-blue-400',
                border: 'border-gray-700'
            };
        }
        return {
            bg: 'bg-gray-50',
            text: 'text-gray-900',
            card: 'bg-white',
            accent: 'text-blue-600',
            border: 'border-gray-200'
        };
    };

    const classes = getThemeClasses();

    const timeline = [
        {
            year: '2015',
            title: 'Fundação',
            description: 'O Ancorar Flat Resort abre suas portas com a missão de oferecer o melhor da hospitalidade em Porto de Galinhas.'
        },
        {
            year: '2018',
            title: 'Expansão',
            description: 'Ampliamos nossas instalações com a construção de 20 novos flats e uma área de lazer completa.'
        },
        {
            year: '2020',
            title: 'Reconhecimento',
            description: 'Recebemos o prêmio de "Melhor Resort de Porto de Galinhas" pela Associação de Turismo.'
        },
        {
            year: '2023',
            title: 'Inovação',
            description: 'Implementamos nosso sistema de gestão sustentável e energia solar em todas as unidades.'
        },
        {
            year: '2025',
            title: 'O Futuro',
            description: 'Preparando novas expansões e experiências exclusivas para nossos hóspedes.'
        }
    ];

    const values = [
        {
            icon: '🌊',
            title: 'Respeito à Natureza',
            description: 'Preservamos o meio ambiente com práticas sustentáveis'
        },
        {
            icon: '❤️',
            title: 'Hospitalidade',
            description: 'Recebemos cada hóspede como parte da família'
        },
        {
            icon: '⭐',
            title: 'Excelência',
            description: 'Buscamos a perfeição em cada detalhe'
        },
        {
            icon: '🤝',
            title: 'Compromisso',
            description: 'Honramos nossas promessas e valorizamos a confiança'
        }
    ];

    return (
        <div className={`min-h-screen ${classes.bg}`}>
            <LandingHeader />

            {/* Hero Section */}
            <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <img 
//                        src="https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1925&q=80"
                        src={about}
                        alt="Sobre o Resort"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60"></div>
                </div>
                <div className="relative text-center text-white">
                    <h1 className="text-5xl md:text-6xl font-bold mb-4">Sobre o Ancorar</h1>
                    <p className="text-xl max-w-2xl mx-auto px-4">
                        Conheça a história e os valores que fazem do nosso resort um lugar especial
                    </p>
                </div>
            </section>

            {/* Nossa História */}
            <section className={`py-20 ${classes.bg}`}>
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className={`text-4xl font-bold text-center mb-16 ${classes.text}`}>
                        Nossa História
                    </h2>
                    <div className="relative">
                        {/* Linha do tempo vertical */}
                        <div className={`absolute left-1/2 transform -translate-x-1/2 w-1 h-full ${classes.accent} hidden md:block`}></div>
                        
                        {timeline.map((item, index) => (
                            <div key={index} className={`relative flex flex-col md:flex-row items-center mb-12 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                                <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pl-12' : 'md:pr-12'}`}>
                                    <div className={`${classes.card} p-6 rounded-lg shadow-lg`}>
                                        <span className={`text-3xl font-bold ${classes.accent}`}>{item.year}</span>
                                        <h3 className={`text-xl font-bold mt-2 mb-3 ${classes.text}`}>{item.title}</h3>
                                        <p className={classes.text}>{item.description}</p>
                                    </div>
                                </div>
                                <div className="hidden md:block md:w-1/2"></div>
                                {/* Marcador da linha do tempo */}
                                <div className={`absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full ${classes.accent} hidden md:block`}></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Nossos Valores */}
            <section className={`py-20 ${classes.bg} ${theme === 'dracula' ? 'bg-[#44475a]' : ''}`}>
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className={`text-4xl font-bold text-center mb-4 ${classes.text}`}>
                        Nossos Valores
                    </h2>
                    <p className={`text-center text-xl mb-12 ${classes.text} opacity-80`}>
                        O que nos move e nos faz especiais
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <div key={index} className={`${classes.card} p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition-all hover:-translate-y-2`}>
                                <div className="text-6xl mb-4">{value.icon}</div>
                                <h3 className={`text-xl font-bold mb-3 ${classes.text}`}>{value.title}</h3>
                                <p className={classes.text}>{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Equipe */}
            <section className={`py-20 ${classes.bg}`}>
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className={`text-4xl font-bold text-center mb-4 ${classes.text}`}>
                        Nossa Equipe
                    </h2>
                    <p className={`text-center text-xl mb-12 ${classes.text} opacity-80`}>
                        Profissionais dedicados a fazer sua estadia inesquecível
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="text-center">
                                <div className="w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden border-4 border-blue-500">
                                    <img 
                                        src={`https://randomuser.me/api/portraits/${item === 1 ? 'women' : 'men'}/${item + 10}.jpg`}
                                        alt="Membro da equipe"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <h3 className={`text-xl font-bold mb-1 ${classes.text}`}>
                                    {item === 1 ? 'Maria Silva' : item === 2 ? 'João Santos' : 'Ana Oliveira'}
                                </h3>
                                <p className={`${classes.accent} mb-2`}>
                                    {item === 1 ? 'Gerente Geral' : item === 2 ? 'Chef de Cozinha' : 'Coordenadora de Eventos'}
                                </p>
                                <p className={classes.text}>
                                    {item === 1 ? '10 anos de experiência em hotelaria de luxo' : 
                                      item === 2 ? 'Especialista em gastronomia regional' : 
                                      'Criando momentos especiais há 8 anos'}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-blue-600 py-20">
                <div className="max-w-4xl mx-auto text-center px-4">
                    <h2 className="text-4xl font-bold text-white mb-6">
                        Venha conhecer pessoalmente
                    </h2>
                    <p className="text-xl text-white/90 mb-8">
                        Faça sua reserva e descubra por que somos tão especiais
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
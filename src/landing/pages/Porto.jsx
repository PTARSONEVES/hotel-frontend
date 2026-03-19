import React from 'react';
import { Link } from 'react-router-dom';
import LandingHeader from '../components/Header';
import Footer from '../components/Footer';
import { useTheme } from '../../context/ThemeContext';

import muroalto1 from '../assets/images/porto_muroalto_001.webp';
import pontal1 from '../assets/images/porto_pontalmaracaipe_003.jpg';
import porto from '../assets/images/porto_vila_001.jpg';
import piscina from '../assets/images/porto_piscinasnaturais_001.jpg';


export default function Porto() {
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

    const attractions = [
        {
            name: 'Piscinas Naturais',
            description: 'O cartão-postal de Porto de Galinhas. Piscinas naturais de águas cristalinas formadas entre corais, onde você pode nadar com peixes coloridos e relaxar em águas mornas.',
            image: piscina,
            icon: '🐠',
            highlights: ['Maré baixa (melhor horário)', 'Passeio de jangada', 'Snorkeling']
        },
        {
            name: 'Praia de Muro Alto',
            description: 'Considerada uma das praias mais bonitas do Brasil, com suas piscinas naturais formadas por recifes e águas calmas e cristalinas. Perfeita para famílias.',
            image: muroalto1,
            icon: '🏖️',
            highlights: ['Águas calmas', 'Estrutura de quiosques', 'Esportes náuticos']
        },
        {
            name: 'Pontal de Maracaípe',
            description: 'Ponto de encontro do rio com o mar, famoso pelo pôr do sol espetacular e pelas ondas perfeitas para a prática de surfe.',
            image: pontal1,
            icon: '🌅',
            highlights: ['Pôr do sol', 'Surfe', 'Barracas na praia']
        },
        {
            name: 'Praia dos Carneiros',
            description: 'Um verdadeiro paraíso com coqueirais, águas mornas e a famosa Capela de São Benedito, cenário para fotos inesquecíveis.',
            image: 'https://images.unsplash.com/photo-1590868309235-ea34bed3e32a?ixlib=rb-4.0.3',
            icon: '⛪',
            highlights: ['Capela histórica', 'Passeios de catamarã', 'Restaurantes à beira-mar']
        }
    ];

    const experiences = [
        {
            title: 'Passeio de Buggy',
            description: 'Explore as praias mais selvagens e descubra cenários paradisíacos com emoção e aventura.',
            duration: '4 horas',
            price: 'R$ 250',
            icon: '🚙'
        },
        {
            title: 'Mergulho com cilindro',
            description: 'Descubra a vida marinha em mergulhos guiados por instrutores experientes.',
            duration: '2 horas',
            price: 'R$ 350',
            icon: '🤿'
        },
        {
            title: 'Passeio de Catamarã',
            description: 'Navegue pelas águas calmas da região, com paradas para banho e snorkeling.',
            duration: '3 horas',
            price: 'R$ 180',
            icon: '⛵'
        },
        {
            title: 'Aula de Surfe',
            description: 'Aprenda a pegar ondas nas melhores escolas da região, com instrutores qualificados.',
            duration: '2 horas',
            price: 'R$ 120',
            icon: '🏄'
        }
    ];

    const tips = [
        {
            icon: '🌞',
            title: 'Melhor época',
            description: 'Setembro a março (sol garantido, menos chuvas)'
        },
        {
            icon: '🕶️',
            title: 'O que levar',
            description: 'Protetor solar, chapéu, roupa de banho, canga, repelente'
        },
        {
            icon: '🚗',
            title: 'Como chegar',
            description: 'A 60km do Recife (1h de carro), ônibus e transfers disponíveis'
        },
        {
            icon: '💰',
            title: 'Gastos médios',
            description: 'Diárias a partir de R$ 350, passeios de R$ 80 a R$ 300'
        }
    ];

    return (
        <div className={`min-h-screen ${classes.bg}`}>
            <LandingHeader />

            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <img 
                        src={porto}
                        alt="Porto de Galinhas"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50"></div>
                </div>
                <div className="relative text-center text-white max-w-4xl mx-auto px-4">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6">
                        Porto de <span className="text-blue-400">Galinhas</span>
                    </h1>
                    <p className="text-xl md:text-2xl mb-8">
                        Um dos destinos mais paradisíacos do Brasil, com piscinas naturais, praias deslumbrantes e cultura rica
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <a href="#atracoes" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-lg font-semibold transition-colors">
                            Conheça as atrações
                        </a>
                        <Link
                            to="/pre-reserva"
                            className="px-8 py-4 border-2 border-white hover:bg-white hover:text-gray-900 text-white rounded-lg text-lg font-semibold transition-colors"
                        >
                            Reserve sua estadia
                        </Link>
                    </div>
                </div>
            </section>

            {/* Introdução */}
            <section className={`py-20 ${classes.bg}`}>
                <div className="max-w-4xl mx-auto text-center px-4">
                    <h2 className={`text-4xl font-bold mb-6 ${classes.text}`}>
                        Bem-vindo ao Paraíso
                    </h2>
                    <p className={`text-xl leading-relaxed ${classes.text} opacity-90`}>
                        Porto de Galinhas é muito mais que um destino turístico - é um pedaço do paraíso onde o mar encontra a alma. 
                        Com suas piscinas naturais de águas cristalinas, coqueirais centenários e um povo acolhedor, 
                        a vila de pescadores se transformou em um dos destinos mais desejados do Brasil, sem perder sua essência charmosa e autêntica.
                    </p>
                </div>
            </section>

            {/* Principais Atrações */}
            <section id="atracoes" className={`py-20 ${theme === 'dracula' ? 'bg-[#44475a]' : theme === 'dark' ? 'bg-gray-800' : 'bg-blue-50'}`}>
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className={`text-4xl font-bold text-center mb-4 ${classes.text}`}>
                        Principais Atrações
                    </h2>
                    <p className={`text-center text-xl mb-12 ${classes.text} opacity-80`}>
                        Lugares que você não pode deixar de conhecer
                    </p>

                    <div className="space-y-20">
                        {attractions.map((attraction, index) => (
                            <div key={index} className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 items-center`}>
                                <div className="lg:w-1/2">
                                    <div className="rounded-lg overflow-hidden shadow-xl">
                                        <img 
                                            src={attraction.image}
                                            alt={attraction.name}
                                            className="w-full h-[400px] object-cover hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                </div>
                                <div className="lg:w-1/2">
                                    <div className={`${classes.card} p-8 rounded-lg shadow-lg`}>
                                        <div className="text-6xl mb-4">{attraction.icon}</div>
                                        <h3 className={`text-3xl font-bold mb-3 ${classes.text}`}>{attraction.name}</h3>
                                        <p className={`text-lg mb-6 ${classes.text} opacity-90`}>{attraction.description}</p>
                                        <div className="space-y-2">
                                            {attraction.highlights.map((highlight, idx) => (
                                                <div key={idx} className="flex items-center">
                                                    <span className={`text-2xl mr-3 ${classes.accent}`}>•</span>
                                                    <span className={classes.text}>{highlight}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Experiências */}
            <section className={`py-20 ${classes.bg}`}>
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className={`text-4xl font-bold text-center mb-4 ${classes.text}`}>
                        Experiências Imperdíveis
                    </h2>
                    <p className={`text-center text-xl mb-12 ${classes.text} opacity-80`}>
                        Atividades para tornar sua viagem ainda mais especial
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {experiences.map((exp, index) => (
                            <div key={index} className={`${classes.card} p-6 rounded-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-2`}>
                                <div className="text-5xl mb-4">{exp.icon}</div>
                                <h3 className={`text-xl font-bold mb-2 ${classes.text}`}>{exp.title}</h3>
                                <p className={`mb-4 ${classes.text} opacity-80`}>{exp.description}</p>
                                <div className="flex justify-between items-center">
                                    <span className={`font-bold ${classes.accent}`}>{exp.price}</span>
                                    <span className={`text-sm ${classes.text} opacity-70`}>{exp.duration}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Dicas de Viagem */}
            <section className={`py-20 ${theme === 'dracula' ? 'bg-[#44475a]' : theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className={`text-4xl font-bold text-center mb-4 ${classes.text}`}>
                        Dicas para sua Viagem
                    </h2>
                    <p className={`text-center text-xl mb-12 ${classes.text} opacity-80`}>
                        Tudo o que você precisa saber antes de ir
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {tips.map((tip, index) => (
                            <div key={index} className="text-center">
                                <div className="text-5xl mb-3">{tip.icon}</div>
                                <h3 className={`text-lg font-bold mb-2 ${classes.text}`}>{tip.title}</h3>
                                <p className={`text-sm ${classes.text} opacity-75`}>{tip.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Galeria */}
            <section className={`py-20 ${classes.bg}`}>
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className={`text-4xl font-bold text-center mb-12 ${classes.text}`}>
                        Galeria de Fotos
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                            <div key={item} className="overflow-hidden rounded-lg shadow-lg">
                                <img 
                                    src={`https://images.unsplash.com/photo-${item === 1 ? '1544551763-46a013bb70d5' : 
                                        item === 2 ? '1590523277543-a94d2e4eb00b' :
                                        item === 3 ? '1507525425510-1fad3f8a9f5b' :
                                        item === 4 ? '1590868309235-ea34bed3e32a' :
                                        item === 5 ? '1544551763-46a013bb70d6' :
                                        item === 6 ? '1544551763-46a013bb70d7' :
                                        item === 7 ? '1544551763-46a013bb70d8' :
                                        '1544551763-46a013bb70d9'}?ixlib=rb-4.0.3&w=600&q=80`}
                                    alt={`Porto de Galinhas ${item}`}
                                    className="w-full h-48 object-cover hover:scale-110 transition-transform duration-300"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mapa de Localização */}
            <section className={`py-20 ${classes.bg}`}>
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className={`text-4xl font-bold text-center mb-4 ${classes.text}`}>
                        Como Chegar
                    </h2>
                    <p className={`text-center text-xl mb-8 ${classes.text} opacity-80`}>
                        Localização privilegiada, de fácil acesso
                    </p>
                    <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-xl">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31590.56278956533!2d-35.0122182!3d-8.5098701!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7ab0f1f6f9f9f6f%3A0x1234567890abcdef!2sPorto%20de%20Galinhas%2C%20Ipojuca%20-%20PE!5e0!3m2!1spt-BR!2sbr!4v1634567890123!5m2!1spt-BR!2sbr"
                            width="100%"
                            height="450"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            className="w-full h-[450px]"
                        ></iframe>
                    </div>
                </div>
            </section>

            {/* CTA Final */}
            <section className="bg-blue-600 py-20">
                <div className="max-w-4xl mx-auto text-center px-4">
                    <h2 className="text-4xl font-bold text-white mb-6">
                        Pronto para conhecer esse paraíso?
                    </h2>
                    <p className="text-xl text-white/90 mb-8">
                        Faça sua reserva no Ancorar Flat Resort e tenha a melhor localização para explorar Porto de Galinhas
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
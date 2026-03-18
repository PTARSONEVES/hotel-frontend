import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LandingHeader from '../components/Header';
import Footer from '../components/Footer';
import { useTheme } from '../../context/ThemeContext';

export default function Flats() {
    const { theme } = useTheme();
    const [selectedFlat, setSelectedFlat] = useState(null);

    const flats = [
        {
            id: 1,
            name: 'Flat Standard',
            price: 'R$ 350',
            description: 'Conforto e praticidade para sua estadia',
            capacity: '2 adultos + 1 criança',
            size: '35m²',
            amenities: ['Ar condicionado', 'TV LED 32"', 'Wi-Fi', 'Frigobar', 'Cama de casal', 'Banheiro privativo'],
            images: [
                'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3',
                'https://images.unsplash.com/photo-1560185009-5bf9f2849488?ixlib=rb-4.0.3',
                'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?ixlib=rb-4.0.3'
            ],
            color: 'from-blue-400 to-blue-600'
        },
        {
            id: 2,
            name: 'Flat Luxo',
            price: 'R$ 550',
            description: 'Mais espaço e requinte para momentos especiais',
            capacity: '3 adultos + 1 criança',
            size: '50m²',
            amenities: ['Ar condicionado', 'TV LED 42"', 'Wi-Fi', 'Frigobar', 'Cama king size', 'Hidromassagem', 'Varanda', 'Banheiro privativo'],
            images: [
                'https://images.unsplash.com/photo-1598928506397-5f8041b1a24b?ixlib=rb-4.0.3',
                'https://images.unsplash.com/photo-1598928506381-2b1a0c2632f9?ixlib=rb-4.0.3',
                'https://images.unsplash.com/photo-1598928506388-9bc5b3c5f3b1?ixlib=rb-4.0.3'
            ],
            color: 'from-purple-400 to-purple-600'
        },
        {
            id: 3,
            name: 'Flat Master',
            price: 'R$ 750',
            description: 'O ápice do conforto e sofisticação',
            capacity: '4 adultos',
            size: '70m²',
            amenities: ['Ar condicionado', 'TV LED 50"', 'Wi-Fi', 'Frigobar', 'Cama king size', 'Hidromassagem', 'Varanda com rede', 'Cozinha americana', 'Sala de estar', '2 banheiros'],
            images: [
                'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3',
                'https://images.unsplash.com/photo-1611892440907-1c9e5b3c3b0a?ixlib=rb-4.0.3',
                'https://images.unsplash.com/photo-1611892440907-1c9e5b3c3b0b?ixlib=rb-4.0.3'
            ],
            color: 'from-pink-400 to-pink-600'
        },
        {
            id: 4,
            name: 'Flat Família',
            price: 'R$ 850',
            description: 'Espaço ideal para famílias',
            capacity: '5 pessoas',
            size: '85m²',
            amenities: ['2 quartos', 'Ar condicionado', '2 TVs LED', 'Wi-Fi', 'Frigobar', 'Cozinha completa', 'Sala de estar', 'Varanda', '2 banheiros'],
            images: [
                'https://images.unsplash.com/photo-1560185007-5f0f9a5b1c3a?ixlib=rb-4.0.3',
                'https://images.unsplash.com/photo-1560185007-5f0f9a5b1c3b?ixlib=rb-4.0.3',
                'https://images.unsplash.com/photo-1560185007-5f0f9a5b1c3c?ixlib=rb-4.0.3'
            ],
            color: 'from-green-400 to-green-600'
        }
    ];

    const getThemeClasses = () => {
        if (theme === 'dracula') {
            return {
                bg: 'bg-[#282a36]',
                text: 'text-[#f8f8f2]',
                card: 'bg-[#44475a]',
                accent: 'text-[#bd93f9]',
                modal: 'bg-[#44475a]'
            };
        }
        if (theme === 'dark') {
            return {
                bg: 'bg-gray-900',
                text: 'text-white',
                card: 'bg-gray-800',
                accent: 'text-blue-400',
                modal: 'bg-gray-800'
            };
        }
        return {
            bg: 'bg-gray-50',
            text: 'text-gray-900',
            card: 'bg-white',
            accent: 'text-blue-600',
            modal: 'bg-white'
        };
    };

    const classes = getThemeClasses();

    return (
        <div className={`min-h-screen ${classes.bg}`}>
            <LandingHeader />

            {/* Hero Section */}
            <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <img 
                        src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3"
                        alt="Nossos Flats"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60"></div>
                </div>
                <div className="relative text-center text-white">
                    <h1 className="text-5xl md:text-6xl font-bold mb-4">Nossos Flats</h1>
                    <p className="text-xl max-w-2xl mx-auto px-4">
                        Escolha o flat perfeito para sua estadia em Porto de Galinhas
                    </p>
                </div>
            </section>

            {/* Lista de Flats */}
            <section className={`py-20 ${classes.bg}`}>
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {flats.map((flat) => (
                            <div
                                key={flat.id}
                                className={`${classes.card} rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all hover:-translate-y-2 cursor-pointer`}
                                onClick={() => setSelectedFlat(flat)}
                            >
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={flat.images[0]}
                                        alt={flat.name}
                                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className={`absolute top-4 right-4 bg-gradient-to-r ${flat.color} text-white px-3 py-1 rounded-full text-lg font-bold`}>
                                        {flat.price}/noite
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className={`text-2xl font-bold mb-2 ${classes.text}`}>{flat.name}</h3>
                                    <p className={classes.text}>{flat.description}</p>
                                    <div className="flex items-center mt-4 text-sm">
                                        <span className={`mr-4 ${classes.accent}`}>👥 {flat.capacity}</span>
                                        <span className={classes.accent}>📏 {flat.size}</span>
                                    </div>
                                    <button className={`mt-6 px-4 py-2 bg-gradient-to-r ${flat.color} text-white rounded-lg hover:opacity-90 transition-opacity w-full`}>
                                        Ver Detalhes
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Modal de Detalhes */}
            {selectedFlat && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setSelectedFlat(null)}>
                    <div className={`${classes.modal} rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto`} onClick={(e) => e.stopPropagation()}>
                        <div className="relative">
                            <button
                                onClick={() => setSelectedFlat(null)}
                                className="absolute top-4 right-4 text-white bg-red-500 hover:bg-red-600 rounded-full w-10 h-10 flex items-center justify-center text-xl z-10"
                            >
                                ✕
                            </button>
                            
                            {/* Carrossel de Imagens */}
                            <div className="h-96 overflow-hidden">
                                <img
                                    src={selectedFlat.images[0]}
                                    alt={selectedFlat.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            
                            <div className="p-6">
                                <h2 className={`text-3xl font-bold mb-4 ${classes.text}`}>{selectedFlat.name}</h2>
                                
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <p className={`font-semibold ${classes.accent}`}>Capacidade</p>
                                        <p className={classes.text}>{selectedFlat.capacity}</p>
                                    </div>
                                    <div>
                                        <p className={`font-semibold ${classes.accent}`}>Tamanho</p>
                                        <p className={classes.text}>{selectedFlat.size}</p>
                                    </div>
                                    <div>
                                        <p className={`font-semibold ${classes.accent}`}>Diária</p>
                                        <p className={`text-2xl font-bold ${classes.accent}`}>{selectedFlat.price}</p>
                                    </div>
                                </div>
                                
                                <h3 className={`text-xl font-bold mb-3 ${classes.text}`}>Comodidades</h3>
                                <div className="grid grid-cols-2 gap-2 mb-6">
                                    {selectedFlat.amenities.map((item, index) => (
                                        <div key={index} className="flex items-center">
                                            <span className={`mr-2 ${classes.accent}`}>✓</span>
                                            <span className={classes.text}>{item}</span>
                                        </div>
                                    ))}
                                </div>
                                
                                <Link
                                    to="/pre-reserva"
                                    className={`block w-full py-3 text-center bg-gradient-to-r ${selectedFlat.color} text-white rounded-lg hover:opacity-90 transition-opacity font-semibold`}
                                    onClick={() => setSelectedFlat(null)}
                                >
                                    Reservar este Flat
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
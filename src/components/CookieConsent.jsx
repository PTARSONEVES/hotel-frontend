import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function CookieConsent() {
    const [visible, setVisible] = useState(false);
    const { theme } = useTheme();

    useEffect(() => {
        const consent = localStorage.getItem('tracking_consent');
        if (!consent) {
            setVisible(true);
        }
    }, []);

    const acceptAll = () => {
        localStorage.setItem('tracking_consent', 'accepted');
        document.cookie = "tracking_consent=accepted; path=/; max-age=31536000";
        setVisible(false);
        // Recarregar para ativar tracking
        window.location.reload();
    };

    const declineAll = () => {
        localStorage.setItem('tracking_consent', 'declined');
        document.cookie = "tracking_consent=declined; path=/; max-age=31536000";
        setVisible(false);
    };

    const getThemeClasses = () => {
        if (theme === 'dracula') {
            return {
                container: 'bg-[#282a36] border-t border-[#44475a]',
                text: 'text-[#f8f8f2]',
                buttonAccept: 'bg-[#50fa7b] hover:bg-[#69ff94] text-[#282a36]',
                buttonDecline: 'bg-[#44475a] hover:bg-[#6272a4] text-[#f8f8f2]'
            };
        }
        if (theme === 'dark') {
            return {
                container: 'bg-gray-900 border-t border-gray-800',
                text: 'text-gray-300',
                buttonAccept: 'bg-green-600 hover:bg-green-700 text-white',
                buttonDecline: 'bg-gray-700 hover:bg-gray-600 text-white'
            };
        }
        return {
            container: 'bg-white border-t border-gray-200',
            text: 'text-gray-700',
            buttonAccept: 'bg-green-600 hover:bg-green-700 text-white',
            buttonDecline: 'bg-gray-500 hover:bg-gray-600 text-white'
        };
    };

    const classes = getThemeClasses();

    if (!visible) return null;

    return (
        <div className={`fixed bottom-0 left-0 right-0 z-50 p-4 shadow-lg ${classes.container}`}>
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex-1">
                    <p className={`text-sm ${classes.text}`}>
                        🔒 Utilizamos cookies para melhorar sua experiência, analisar o tráfego 
                        e personalizar conteúdo. Ao continuar navegando, você concorda com nossa 
                        <a href="/politica-privacidade" className="underline ml-1 hover:opacity-80">
                            Política de Privacidade
                        </a>.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={declineAll}
                        className={`px-4 py-2 rounded-lg text-sm transition-colors ${classes.buttonDecline}`}
                    >
                        Recusar
                    </button>
                    <button
                        onClick={acceptAll}
                        className={`px-4 py-2 rounded-lg text-sm transition-colors ${classes.buttonAccept}`}
                    >
                        Aceitar todos
                    </button>
                </div>
            </div>
        </div>
    );
}
import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function OperationCodeDisplay({ code, label, showCopy = true }) {
    const { theme } = useTheme();
    
    const getThemeClasses = () => {
        if (theme === 'dracula') {
            return {
                container: 'bg-[#44475a] border border-[#6272a4]',
                text: 'text-[#f8f8f2]',
                code: 'font-mono text-lg font-bold text-[#bd93f9]',
                copyButton: 'bg-[#6272a4] hover:bg-[#bd93f9] text-white'
            };
        }
        if (theme === 'dark') {
            return {
                container: 'bg-gray-800 border border-gray-700',
                text: 'text-white',
                code: 'font-mono text-lg font-bold text-blue-400',
                copyButton: 'bg-gray-700 hover:bg-blue-600 text-white'
            };
        }
        return {
            container: 'bg-gray-100 border border-gray-200',
            text: 'text-gray-900',
            code: 'font-mono text-lg font-bold text-blue-600',
            copyButton: 'bg-gray-200 hover:bg-blue-600 hover:text-white text-gray-700'
        };
    };
    
    const classes = getThemeClasses();
    
    const copyToClipboard = () => {
        navigator.clipboard.writeText(code);
        alert('Código copiado para a área de transferência!');
    };
    
    if (!code) return null;
    
    return (
        <div className={`p-4 rounded-lg ${classes.container}`}>
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className={`text-xs mb-1 ${classes.text} opacity-70`}>
                        {label || 'Código de Operação'}
                    </p>
                    <p className={`${classes.code} tracking-wider`}>{code}</p>
                    <p className={`text-xs mt-1 ${classes.text} opacity-50`}>
                        Padrão EAN-13 | Leitura por código de barras
                    </p>
                </div>
                {showCopy && (
                    <button
                        onClick={copyToClipboard}
                        className={`px-3 py-1 rounded text-sm transition-colors ${classes.copyButton}`}
                        title="Copiar código"
                    >
                        📋 Copiar
                    </button>
                )}
            </div>
        </div>
    );
}
import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const getIcon = () => {
    switch(theme) {
      case 'light':
        return '☀️';
      case 'dark':
        return '🌙';
      case 'dracula':
        return '🧛';
      default:
        return '🌙';
    }
  };

  const getTooltip = () => {
    switch(theme) {
      case 'light':
        return 'Modo Claro';
      case 'dark':
        return 'Modo Escuro';
      case 'dracula':
        return 'Tema Dracula 🦇';
      default:
        return 'Trocar tema';
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className={`fixed top-20 right-4 z-50 p-3 rounded-lg transition-all duration-300 shadow-lg
        ${theme === 'light' ? 'bg-gray-200 hover:bg-gray-300' : ''}
        ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : ''}
        ${theme === 'dracula' ? 'bg-[#44475a] hover:bg-[#6272a4]' : ''}
      `}
      aria-label={getTooltip()}
      title={getTooltip()}
    >
      <span className="text-xl">{getIcon()}</span>
    </button>
  );
}
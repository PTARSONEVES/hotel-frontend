import React from 'react';
import { useTheme } from '../context/ThemeContext';
import logoImage from '../landing/assets/images/logo.png';

export default function Logo({ className = "h-12 w-auto", ...props }) {
    const { theme } = useTheme();
    
    // Se precisar de versões diferentes para cada tema, use:
    // const logoSrc = theme === 'dracula' ? logoDracula : logoImage;
    
    return (
        <img
            src={logoImage}
            alt="Ancorar Flat Resort"
            className={className}
            {...props}
        />
    );
}
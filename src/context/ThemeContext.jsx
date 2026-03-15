import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Agora armazenamos o tema atual (light, dark, dracula)
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && ['light', 'dark', 'dracula'].includes(savedTheme)) {
      return savedTheme;
    }
    // Detectar preferência do sistema
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    // Remover todas as classes de tema anteriores
    document.documentElement.classList.remove('light', 'dark', 'dracula');
    
    // Adicionar a nova classe de tema
    document.documentElement.classList.add(theme);
    
    // Salvar no localStorage
    localStorage.setItem('theme', theme);
    
    console.log('🎨 Tema alterado para:', theme);
  }, [theme]);

  const setThemeMode = (newTheme) => {
    if (['light', 'dark', 'dracula'].includes(newTheme)) {
      setTheme(newTheme);
    }
  };

  const toggleTheme = () => {
    // Ciclo: light → dark → dracula → light
    const themes = ['light', 'dark', 'dracula'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      setThemeMode, 
      toggleTheme,
      isDark: theme === 'dark',
      isDracula: theme === 'dracula'
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
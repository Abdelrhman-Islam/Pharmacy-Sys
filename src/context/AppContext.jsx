import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'en');

  useEffect(() => {
    // Update HTML attributes for theme and direction
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    
    localStorage.setItem('theme', theme);
    localStorage.setItem('lang', lang);
  }, [theme, lang]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  const toggleLang = () => setLang(prev => prev === 'en' ? 'ar' : 'en');
  
  return (
    <AppContext.Provider value={{ theme, lang, toggleTheme, toggleLang }}>
      {children}
    </AppContext.Provider>
  );
};

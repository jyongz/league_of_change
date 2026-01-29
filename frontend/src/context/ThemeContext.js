import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('app-theme');
    return savedTheme || 'default';
  });

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'default' ? 'street-league' : 'default'));
  };

  useEffect(() => {
    localStorage.setItem('app-theme', theme);
    if (theme === 'street-league') {
      document.body.classList.add('street-league-theme');
    } else {
      document.body.classList.remove('street-league-theme');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

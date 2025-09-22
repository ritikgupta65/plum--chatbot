import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeConfig {
  primaryGradient: string;
  secondaryGradient: string;
  accentColor: string;
  logoUrl: string;
  brandName: string;
  welcomeMessage: string;
  quickActions: string[];
  badgeImages?: string[];
}

interface ThemeContextType {
  theme: ThemeConfig;
  updateTheme: (updates: Partial<ThemeConfig>) => void;
  resetTheme: () => void;
  exportTheme: () => string;
  importTheme: (themeJson: string) => boolean;
}

const defaultTheme: ThemeConfig = {
  primaryGradient: 'from-[#5c108a] to-[#4a0d70]',
  secondaryGradient: 'from-[#5c108a] to-[#4a0d70]',
  accentColor: '[#5c108a]',
  logoUrl: 'https://space.bouncewatch.com/images/399663/Plum-Goodness-logo.jpg',
  brandName: 'Plum Goodness',
  welcomeMessage: 'How can we help you today?',
  quickActions: ['Ask a question', 'Track my order', 'New arrivals', 'Get support'],
  badgeImages: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLSSFJG6FMzugKEAqNhAq9Pp3ux_9oR2LwMQ&s', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4GWy-pvv8ROWnE0k8KwKcdOb78ebwqBoDBA&s']
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeConfig>(defaultTheme);

  useEffect(() => {
    const savedTheme = localStorage.getItem('chatbot-theme');
    if (savedTheme) {
      try {
        setTheme(JSON.parse(savedTheme));
      } catch (error) {
        console.error('Failed to parse saved theme:', error);
      }
    }
  }, []);

  const updateTheme = (updates: Partial<ThemeConfig>) => {
    const newTheme = { ...theme, ...updates };
    setTheme(newTheme);
    localStorage.setItem('chatbot-theme', JSON.stringify(newTheme));
  };

  const resetTheme = () => {
    setTheme(defaultTheme);
    localStorage.removeItem('chatbot-theme');
  };

  const exportTheme = () => {
    return JSON.stringify(theme, null, 2);
  };

  const importTheme = (themeJson: string) => {
    try {
      const importedTheme = JSON.parse(themeJson);
      setTheme({ ...defaultTheme, ...importedTheme });
      localStorage.setItem('chatbot-theme', JSON.stringify(importedTheme));
      return true;
    } catch (error) {
      console.error('Failed to import theme:', error);
      return false;
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, resetTheme, exportTheme, importTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

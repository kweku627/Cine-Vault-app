import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    card: string;
    text: string;
    textSecondary: string;
    textMuted: string;
    border: string;
    success: string;
    warning: string;
    error: string;
    overlay: string;
    button: string;
    disabled: string;
  };
  gradients: {
    primary: string[];
    secondary: string[];
    overlay: string[];
  };
}

const lightTheme: Theme = {
  colors: {
    primary: '#8B4513',      // Saddle Brown
    secondary: '#D2691E',    // Chocolate
    accent: '#CD853F',       // Peru
    background: '#FFF8DC',   // Cornsilk
    surface: '#F5E6D3',      // Light Mocha
    card: '#F0E0C8',         // Light Mocha Card
    text: '#3E2723',         // Dark Brown
    textSecondary: '#5D4037',// Brown
    textMuted: '#8D6E63',    // Brown Grey
    border: '#E8D5C4',       // Light Mocha Border
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    overlay: 'rgba(62, 39, 35, 0.8)',
    button: '#C62828', // Rich Red for buttons in light theme
    disabled: '#BDBDBD', // Light Grey for disabled state
  },
  gradients: {
    primary: ['#8B4513', '#D2691E'],
    secondary: ['#CD853F', '#DEB887'],
    overlay: ['rgba(255, 248, 220, 0)', 'rgba(255, 248, 220, 0.9)'],
  },
};

const darkTheme: Theme = {
  colors: {
    primary: '#E50914',      // Netflix Red
    secondary: '#B71C1C',    // Dark Red
    accent: '#F44336',       // Material Red
    background: '#0A0000',   // Very Dark Red
    surface: '#1A0000',      // Dark Red
    card: '#2A0000',         // Medium Dark Red
    text: '#FFFFFF',         // White
    textSecondary: '#FFCDD2',// Light Red
    textMuted: '#A1887F',    // Grey
    border: '#4A0000',       // Dark Red
    success: '#66BB6A',
    warning: '#FFA726',
    error: '#EF5350',
    overlay: 'rgba(10, 0, 0, 0.8)',
    button: '#E50914', // Netflix Red for buttons in dark theme
    disabled: '#424242', // Dark Grey for disabled state
  },
  gradients: {
    primary: ['#E50914', '#B71C1C'],
    secondary: ['#F44336', '#D32F2F'],
    overlay: ['rgba(10, 0, 0, 0)', 'rgba(10, 0, 0, 0.9)'],
  },
};

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (mode: 'light' | 'dark') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const savedThemeRef = useRef<boolean>(false);

  useEffect(() => {
    loadTheme();

    // Listen to system theme changes only if user hasn't overridden
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (!savedThemeRef.current) {
        setIsDark(colorScheme === 'dark');
      }
    });

    return () => subscription.remove();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme) {
        savedThemeRef.current = true;
        setIsDark(savedTheme === 'dark');
      } else {
        const colorScheme = Appearance.getColorScheme();
        setIsDark(colorScheme === 'dark');
      }
    } catch (error) {
      console.error('Failed to load theme:', error);
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme = !isDark;
      savedThemeRef.current = true;
      setIsDark(newTheme);
      await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  };

  const setTheme = async (mode: 'light' | 'dark') => {
    try {
      savedThemeRef.current = true;
      setIsDark(mode === 'dark');
      await AsyncStorage.setItem('theme', mode);
    } catch (error) {
      console.error('Failed to set theme:', error);
    }
  };

  const theme = useMemo(() => (isDark ? darkTheme : lightTheme), [isDark]);

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

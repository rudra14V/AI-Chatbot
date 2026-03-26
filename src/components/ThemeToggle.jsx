import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export function ThemeToggle() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full focus:outline-none bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
      title="Toggle Theme"
    >
      {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
}

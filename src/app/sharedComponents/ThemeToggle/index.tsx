'use client';
import { useThemeSafe } from '@/app/context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeSafe();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2.5 rounded-full transition-all duration-300 ${
        theme === 'dark'
          ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400 border border-gray-700'
          : 'bg-blue-100 hover:bg-blue-200 text-blue-600 border border-blue-300'
      }`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun size={20} />
      ) : (
        <Moon size={20} />
      )}
    </button>
  );
}

import React from 'react';
import { Sun, Moon, Sunrise } from 'lucide-react';
import { motion } from 'framer-motion';

type Theme = 'light' | 'dark' | 'sunrise';

interface ThemeToggleProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, setTheme }) => {
  const themes: { key: Theme; icon: React.ComponentType<any>; label: string }[] = [
    { key: 'light', icon: Sun, label: 'Light' },
    { key: 'dark', icon: Moon, label: 'Dark' },
    { key: 'sunrise', icon: Sunrise, label: 'Sunrise' }
  ];

  return (
    <div className="flex items-center gap-1 bg-white dark:bg-gray-800 rounded-lg p-1 shadow-lg border border-gray-200 dark:border-gray-700">
      {themes.map(({ key, icon: Icon, label }) => (
        <motion.button
          key={key}
          onClick={() => setTheme(key)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`relative flex items-center gap-2 px-3 py-2 rounded-md transition-all ${
            theme === key
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
          title={label}
        >
          <Icon className="h-4 w-4" />
          <span className="text-sm font-medium hidden sm:inline">{label}</span>
          {theme === key && (
            <motion.div
              layoutId="theme-indicator"
              className="absolute inset-0 bg-blue-600 rounded-md -z-10"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
        </motion.button>
      ))}
    </div>
  );
};

export default ThemeToggle;

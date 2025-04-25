import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

export const Header = () => {
  const { user, logout } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="bg-card p-4 flex items-center justify-between shadow-neumorphic-sm">
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg hover:bg-healthy/10 transition-colors"
        >
          {isDarkMode ? '🌙' : '☀️'}
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-healthy/20 flex items-center justify-center">
            {user?.name?.[0] || 'U'}
          </div>
          <span className="font-medium">{user?.name || 'User'}</span>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={logout}
          className="text-alert hover:bg-alert/10 px-3 py-1 rounded-lg transition-colors"
        >
          Logout
        </motion.button>
      </div>
    </header>
  );
}; 
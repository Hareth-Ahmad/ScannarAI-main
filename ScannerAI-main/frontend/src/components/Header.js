import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, Crown } from 'lucide-react';
import UsageCounter from './UsageCounter';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="glass border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <h1 className="text-2xl font-bold text-white neon-glow-blue">
              Clario
            </h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => navigate('/')}
              className="text-gray-300 hover:text-neon-blue transition-colors duration-200"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate('/classification')}
              className="text-gray-300 hover:text-neon-yellow transition-colors duration-200"
            >
              Classification
            </button>
            <button
              onClick={() => navigate('/forgery')}
              className="text-gray-300 hover:text-neon-green transition-colors duration-200"
            >
              Forgery Detection
            </button>
            <button
              onClick={() => navigate('/deepfake')}
              className="text-gray-300 hover:text-neon-purple transition-colors duration-200"
            >
              DeepFake Detection
            </button>
            <button
              onClick={() => navigate('/about')}
              className="text-gray-300 hover:text-neon-blue transition-colors duration-200"
            >
              About
            </button>
            <button
              onClick={() => navigate('/history')}
              className="text-gray-300 hover:text-neon-blue transition-colors duration-200"
            >
              History
            </button>
            <button
              onClick={() => navigate('/subscription')}
              className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 flex items-center"
            >
              <Crown className="h-4 w-4 mr-1" />
              Subscription
            </button>
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-300">
              <User size={20} />
              <span className="text-sm">{user?.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-300 hover:text-red-400 transition-colors duration-200"
            >
              <LogOut size={20} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
        
        {/* Usage Counter */}
        <div className="px-4 sm:px-6 lg:px-8 pb-4">
          <UsageCounter />
        </div>
      </div>
    </header>
  );
};

export default Header;



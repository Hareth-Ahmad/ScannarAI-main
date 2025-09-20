import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, ArrowLeft } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const Register = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    const result = await register(email);
    setLoading(false);

    if (result.success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <button
          onClick={() => navigate('/login')}
          className="flex items-center text-gray-400 hover:text-white transition-colors duration-200 mb-6"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Login
        </button>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-neon-blue to-neon-purple rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">C</span>
          </div>
          <h1 className="text-4xl font-bold text-white neon-glow-blue mb-2">
            Clario
          </h1>
          <p className="text-gray-400">Join the AI Revolution</p>
        </div>

        {/* Register Form */}
        <div className="glass rounded-2xl p-8 border border-gray-700">
          <h2 className="text-2xl font-semibold text-white mb-6 text-center">
            Create Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg bg-dark-card text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-blue focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="w-full btn-neon bg-gradient-to-r from-neon-blue to-neon-purple text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 hover:from-neon-purple hover:to-neon-blue disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <LoadingSpinner size="sm" color="white" />
                  <span className="ml-2">Creating Account...</span>
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-neon-blue hover:text-neon-purple transition-colors duration-200 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-8 space-y-4">
          <div className="glass rounded-lg p-4 border border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="text-neon-green text-xl">✨</div>
              <div>
                <h3 className="text-white font-medium">Instant Analysis</h3>
                <p className="text-gray-400 text-sm">Get results in seconds</p>
              </div>
            </div>
          </div>
          <div className="glass rounded-lg p-4 border border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="text-neon-yellow text-xl">🔒</div>
              <div>
                <h3 className="text-white font-medium">Secure & Private</h3>
                <p className="text-gray-400 text-sm">Your data is protected</p>
              </div>
            </div>
          </div>
          <div className="glass rounded-lg p-4 border border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="text-neon-purple text-xl">📊</div>
              <div>
                <h3 className="text-white font-medium">Detailed Reports</h3>
                <p className="text-gray-400 text-sm">Comprehensive analysis results</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;



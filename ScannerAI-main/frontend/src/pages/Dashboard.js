import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import NeonCard from '../components/NeonCard';
import { 
  Brain, 
  Shield, 
  Info, 
  History,
  Sparkles,
  Zap,
  Target,
  Eye
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Image Classification",
      description: "Upload an image and get AI-powered classification results with detailed analysis.",
      icon: Brain,
      color: "yellow",
      path: "/classification"
    },
    {
      title: "Forgery Detection",
      description: "Detect image manipulation and forgery using advanced AI algorithms with confidence scores.",
      icon: Shield,
      color: "green",
      path: "/forgery"
    },
    {
      title: "DeepFake Detection",
      description: "Detect deepfake images using state-of-the-art AI models with high accuracy.",
      icon: Eye,
      color: "purple",
      path: "/deepfake"
    },
    {
      title: "About Clario",
      description: "Learn more about our AI-powered image analysis platform and its capabilities.",
      icon: Info,
      color: "blue",
      path: "/about"
    },
    {
      title: "Analysis History",
      description: "View all your previous image analyses and results in one convenient place.",
      icon: History,
      color: "green",
      path: "/history"
    }
  ];

  const stats = [
    {
      title: "AI-Powered",
      description: "Advanced machine learning algorithms",
      icon: Sparkles,
      color: "blue"
    },
    {
      title: "Lightning Fast",
      description: "Get results in seconds",
      icon: Zap,
      color: "yellow"
    },
    {
      title: "Highly Accurate",
      description: "State-of-the-art detection methods",
      icon: Target,
      color: "green"
    }
  ];

  return (
    <div className="min-h-screen relative">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Welcome to{' '}
            <span className="neon-glow-blue">Clario</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Your AI-powered image analysis platform. Detect forgeries, classify images, 
            and unlock insights with cutting-edge machine learning technology.
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <NeonCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              color={feature.color}
              path={feature.path}
              className="h-full"
            />
          ))}
        </div>

        {/* Stats Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Why Choose <span className="neon-glow-green">Clario</span>?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="glass rounded-xl p-6 text-center border border-gray-700 hover:border-gray-600 transition-all duration-300"
              >
                <div className={`text-4xl mb-4 ${
                  stat.color === 'blue' ? 'text-neon-blue' :
                  stat.color === 'yellow' ? 'text-neon-yellow' :
                  'text-neon-green'
                }`}>
                  <stat.icon className="mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {stat.title}
                </h3>
                <p className="text-gray-400">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass rounded-2xl p-8 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/classification')}
              className="btn-neon bg-gradient-to-r from-neon-yellow to-yellow-600 text-white py-4 px-6 rounded-lg font-semibold transition-all duration-200 hover:from-yellow-600 hover:to-neon-yellow"
            >
              <div className="flex items-center justify-center space-x-2">
                <Brain size={24} />
                <span>Start Classification</span>
              </div>
            </button>
            <button
              onClick={() => navigate('/forgery')}
              className="btn-neon bg-gradient-to-r from-neon-green to-green-600 text-white py-4 px-6 rounded-lg font-semibold transition-all duration-200 hover:from-green-600 hover:to-neon-green"
            >
              <div className="flex items-center justify-center space-x-2">
                <Shield size={24} />
                <span>Detect Forgery</span>
              </div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-400">
            Powered by advanced AI technology • Built with ❤️ for image analysis
          </p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;



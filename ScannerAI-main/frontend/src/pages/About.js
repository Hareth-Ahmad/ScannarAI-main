import React from 'react';
import Header from '../components/Header';
import { 
  Brain, 
  Shield, 
  Zap, 
  Target, 
  Users, 
  Award,
  Code,
  Database,
  Cpu,
  Eye
} from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced machine learning algorithms analyze images with unprecedented accuracy and speed.",
      color: "blue"
    },
    {
      icon: Shield,
      title: "Forgery Detection",
      description: "Detect image manipulation and digital forgeries using state-of-the-art noiseprint technology.",
      color: "green"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Get results in seconds with our optimized processing pipeline and efficient algorithms.",
      color: "yellow"
    },
    {
      icon: Target,
      title: "Highly Accurate",
      description: "Industry-leading accuracy rates with confidence scores for reliable decision making.",
      color: "purple"
    }
  ];

  const technologies = [
    {
      icon: Cpu,
      title: "TensorFlow",
      description: "Deep learning framework for neural network processing"
    },
    {
      icon: Database,
      title: "Noiseprint",
      description: "Advanced image forensics and manipulation detection"
    },
    {
      icon: Code,
      title: "FastAPI",
      description: "High-performance Python web framework for APIs"
    },
    {
      icon: Eye,
      title: "Computer Vision",
      description: "Advanced image processing and analysis techniques"
    }
  ];

  const stats = [
    { number: "99.9%", label: "Uptime" },
    { number: "< 2s", label: "Average Response" },
    { number: "10M+", label: "Images Analyzed" },
    { number: "95%", label: "Accuracy Rate" }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">
            About <span className="neon-glow-purple">Clario</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Clario is a cutting-edge AI-powered image analysis platform that combines advanced 
            machine learning with forensic techniques to provide accurate image classification 
            and forgery detection. Built for professionals, researchers, and anyone who needs 
            reliable image analysis.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Our <span className="neon-glow-blue">Features</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="glass rounded-2xl p-8 border border-gray-700 hover:border-gray-600 transition-all duration-300 card-hover"
              >
                <div className={`text-4xl mb-6 ${
                  feature.color === 'blue' ? 'text-neon-blue' :
                  feature.color === 'green' ? 'text-neon-green' :
                  feature.color === 'yellow' ? 'text-neon-yellow' :
                  'text-neon-purple'
                }`}>
                  <feature.icon className="mx-auto" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Our <span className="neon-glow-green">Performance</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="glass rounded-xl p-6 text-center border border-gray-700"
              >
                <div className="text-4xl font-bold text-neon-blue mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-300">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technology Stack */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Technology <span className="neon-glow-yellow">Stack</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {technologies.map((tech, index) => (
              <div
                key={index}
                className="glass rounded-xl p-6 text-center border border-gray-700 hover:border-gray-600 transition-all duration-300"
              >
                <div className="text-3xl text-neon-yellow mb-4">
                  <tech.icon className="mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {tech.title}
                </h3>
                <p className="text-gray-400 text-sm">
                  {tech.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Mission Section */}
        <div className="mb-16">
          <div className="glass rounded-2xl p-12 border border-gray-700 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Our <span className="neon-glow-purple">Mission</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
              To democratize access to advanced image analysis technology, making it easy for 
              everyone to detect image manipulation and understand the authenticity of visual 
              content in our digital world.
            </p>
            <div className="flex items-center justify-center space-x-8 text-gray-400">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Trusted by thousands</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5" />
                <span>Industry leading</span>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            How It <span className="neon-glow-blue">Works</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass rounded-xl p-6 border border-gray-700 text-center">
              <div className="w-16 h-16 bg-neon-blue/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-neon-blue">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Upload Image</h3>
              <p className="text-gray-300">
                Simply drag and drop or select an image file to begin analysis.
              </p>
            </div>
            <div className="glass rounded-xl p-6 border border-gray-700 text-center">
              <div className="w-16 h-16 bg-neon-yellow/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-neon-yellow">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">AI Analysis</h3>
              <p className="text-gray-300">
                Our advanced algorithms analyze the image using multiple techniques.
              </p>
            </div>
            <div className="glass rounded-xl p-6 border border-gray-700 text-center">
              <div className="w-16 h-16 bg-neon-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-neon-green">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Get Results</h3>
              <p className="text-gray-300">
                Receive detailed analysis results with confidence scores and insights.
              </p>
            </div>
          </div>
        </div>

        {/* Contact/Support */}
        <div className="text-center">
          <div className="glass rounded-2xl p-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-4">
              Need <span className="neon-glow-green">Help</span>?
            </h2>
            <p className="text-gray-300 mb-6">
              Our team is here to help you get the most out of Clario.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-neon bg-gradient-to-r from-neon-blue to-neon-purple text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200">
                Contact Support
              </button>
              <button className="btn-neon bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200">
                View Documentation
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;



import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { 
  CreditCard, 
  CheckCircle, 
  Star, 
  Zap, 
  Shield,
  Crown,
  ArrowRight,
  Check
} from 'lucide-react';
import { api } from '../services/api';
import toast from 'react-hot-toast';

const Subscription = () => {
  const [usageStats, setUsageStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    fetchUsageStats();
  }, []);

  const fetchUsageStats = async () => {
    try {
      const response = await api.get('/usage/stats');
      setUsageStats(response.data);
    } catch (error) {
      console.error('Error fetching usage stats:', error);
      toast.error('Failed to load usage statistics');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    setSubscribing(true);
    try {
      // Simulate payment processing
      const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const response = await api.post('/subscription/create', {
        payment_method: 'visa',
        payment_id: paymentId
      });

      if (response.data.success) {
        toast.success('Subscription activated successfully!');
        fetchUsageStats(); // Refresh stats
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error('Failed to create subscription');
    } finally {
      setSubscribing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-white">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            <span className="neon-glow-yellow">Subscription Plans</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Choose the perfect plan for your AI analysis needs
          </p>
        </div>

        {/* Current Usage Stats */}
        {usageStats && (
          <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl p-6 border border-blue-500/50 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <Zap className="mr-3 text-blue-400" />
              Your Current Usage
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-black/50 rounded-lg p-4">
                <div className="text-sm text-gray-400">Today's Usage</div>
                <div className="text-2xl font-bold text-white">
                  {usageStats.usage_today} / {usageStats.limit}
                </div>
              </div>
              <div className="bg-black/50 rounded-lg p-4">
                <div className="text-sm text-gray-400">Remaining</div>
                <div className="text-2xl font-bold text-white">
                  {usageStats.remaining}
                </div>
              </div>
              <div className="bg-black/50 rounded-lg p-4">
                <div className="text-sm text-gray-400">Status</div>
                <div className="text-2xl font-bold text-white flex items-center">
                  {usageStats.is_subscribed ? (
                    <>
                      <Crown className="mr-2 text-yellow-400" />
                      Subscribed
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 text-blue-400" />
                      Free
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Subscription Plans */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Free Plan */}
          <div className="glass rounded-2xl p-8 border border-gray-700">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Free Plan</h3>
              <div className="text-4xl font-bold text-white mb-2">$0</div>
              <div className="text-gray-400">per month</div>
            </div>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-gray-300">
                <Check className="h-5 w-5 text-green-400 mr-3" />
                7 AI analyses per day
              </li>
              <li className="flex items-center text-gray-300">
                <Check className="h-5 w-5 text-green-400 mr-3" />
                Image Classification
              </li>
              <li className="flex items-center text-gray-300">
                <Check className="h-5 w-5 text-green-400 mr-3" />
                DeepFake Detection
              </li>
              <li className="flex items-center text-gray-300">
                <Check className="h-5 w-5 text-green-400 mr-3" />
                Forgery Detection
              </li>
              <li className="flex items-center text-gray-300">
                <Check className="h-5 w-5 text-green-400 mr-3" />
                Analysis History
              </li>
            </ul>
            
            <div className="text-center">
              <div className="text-gray-400 text-sm mb-4">
                {usageStats && !usageStats.is_subscribed ? 'Current Plan' : ''}
              </div>
            </div>
          </div>

          {/* Premium Plan */}
          <div className="glass rounded-2xl p-8 border border-yellow-500/50 bg-gradient-to-br from-yellow-900/20 to-orange-900/20">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Premium Plan</h3>
              <div className="text-4xl font-bold text-white mb-2">$7</div>
              <div className="text-gray-400">per month</div>
            </div>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-gray-300">
                <Check className="h-5 w-5 text-green-400 mr-3" />
                <span className="font-semibold text-yellow-400">Unlimited AI analyses</span>
              </li>
              <li className="flex items-center text-gray-300">
                <Check className="h-5 w-5 text-green-400 mr-3" />
                All AI models included
              </li>
              <li className="flex items-center text-gray-300">
                <Check className="h-5 w-5 text-green-400 mr-3" />
                Priority processing
              </li>
              <li className="flex items-center text-gray-300">
                <Check className="h-5 w-5 text-green-400 mr-3" />
                Advanced analytics
              </li>
              <li className="flex items-center text-gray-300">
                <Check className="h-5 w-5 text-green-400 mr-3" />
                Email support
              </li>
            </ul>
            
            <button
              onClick={handleSubscribe}
              disabled={subscribing || (usageStats && usageStats.is_subscribed)}
              className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                usageStats && usageStats.is_subscribed
                  ? 'bg-green-600 text-white cursor-not-allowed'
                  : subscribing
                  ? 'bg-gray-600 text-white cursor-not-allowed'
                  : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600'
              }`}
            >
              {usageStats && usageStats.is_subscribed ? (
                <div className="flex items-center justify-center">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Active Subscription
                </div>
              ) : subscribing ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Subscribe with Visa
                  <ArrowRight className="ml-2 h-5 w-5" />
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Features Comparison */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Why Choose Premium?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Unlimited Access</h3>
              <p className="text-gray-400">
                No daily limits. Analyze as many images as you need.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Premium Features</h3>
              <p className="text-gray-400">
                Access to all AI models and advanced analysis features.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Priority Support</h3>
              <p className="text-gray-400">
                Get priority processing and dedicated email support.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Subscription;

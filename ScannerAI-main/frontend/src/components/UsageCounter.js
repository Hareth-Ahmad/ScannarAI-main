import React, { useState, useEffect } from 'react';
import { Zap, Crown, AlertTriangle } from 'lucide-react';
import { api } from '../services/api';
import { Link } from 'react-router-dom';

const UsageCounter = () => {
  const [usageStats, setUsageStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsageStats();
  }, []);

  const fetchUsageStats = async () => {
    try {
      const response = await api.get('/usage/stats');
      setUsageStats(response.data);
    } catch (error) {
      console.error('Error fetching usage stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return null;
  }

  if (!usageStats) {
    return null;
  }

  // Don't show counter if user is subscribed
  if (usageStats.is_subscribed) {
    return (
      <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-lg p-3 border border-yellow-500/50">
        <div className="flex items-center justify-center">
          <Crown className="h-5 w-5 text-yellow-400 mr-2" />
          <span className="text-yellow-400 font-semibold">Premium Active - Unlimited Usage</span>
        </div>
      </div>
    );
  }

  const remaining = usageStats.remaining;
  const isNearLimit = remaining <= 2;
  const isAtLimit = remaining <= 0;

  return (
    <div className={`rounded-lg p-3 border ${
      isAtLimit 
        ? 'bg-gradient-to-r from-red-900/30 to-orange-900/30 border-red-500/50' 
        : isNearLimit 
        ? 'bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-yellow-500/50'
        : 'bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-500/50'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Zap className={`h-5 w-5 mr-2 ${
            isAtLimit ? 'text-red-400' : isNearLimit ? 'text-yellow-400' : 'text-blue-400'
          }`} />
          <span className={`font-semibold ${
            isAtLimit ? 'text-red-400' : isNearLimit ? 'text-yellow-400' : 'text-blue-400'
          }`}>
            {isAtLimit ? 'Daily Limit Reached' : `${remaining} analyses remaining today`}
          </span>
        </div>
        
        {isAtLimit && (
          <Link 
            to="/subscription"
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded text-sm font-semibold hover:from-yellow-500 hover:to-orange-600 transition-all duration-200"
          >
            Subscribe
          </Link>
        )}
      </div>
      
      {isNearLimit && !isAtLimit && (
        <div className="mt-2 text-sm text-yellow-300">
          <AlertTriangle className="h-4 w-4 inline mr-1" />
          Running low on free analyses. 
          <Link to="/subscription" className="text-yellow-400 hover:text-yellow-300 ml-1">
            Subscribe for unlimited access
          </Link>
        </div>
      )}
    </div>
  );
};

export default UsageCounter;

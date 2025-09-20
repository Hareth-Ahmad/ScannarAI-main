import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  History as HistoryIcon, 
  Brain, 
  Shield, 
  Calendar,
  FileImage,
  Download,
  Eye,
  Trash2,
  Filter,
  Search
} from 'lucide-react';
import { api } from '../services/api';
import toast from 'react-hot-toast';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await api.get('/analysis/history');
      setHistory(response.data.history);
    } catch (error) {
      console.error('Failed to fetch history:', error);
      toast.error('Failed to load analysis history');
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = history.filter(item => {
    const matchesFilter = filter === 'all' || item.analysis_type === filter;
    const matchesSearch = item.filename.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAnalysisIcon = (type) => {
    return type === 'classification' ? Brain : Shield;
  };

  const getAnalysisColor = (type) => {
    return type === 'classification' ? 'text-neon-yellow' : 'text-neon-green';
  };

  const getAnalysisBg = (type) => {
    return type === 'classification' ? 'bg-yellow-900/20 border-yellow-500' : 'bg-green-900/20 border-green-500';
  };

  const getResultSummary = (result) => {
    if (!result || !result.success) {
      return {
        status: 'error',
        message: result?.error || 'Analysis failed',
        details: null
      };
    }

    if (result.analysis_type === 'classification') {
      return {
        status: 'success',
        message: 'Classification completed',
        details: `QF: ${result.qf}, Mode: ${result.image_mode}`
      };
    } else {
      return {
        status: 'success',
        message: result.is_forged ? 'Likely forged' : 'Appears authentic',
        details: `Confidence: ${(result.confidence * 100).toFixed(1)}%`
      };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner size="lg" color="blue" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            <span className="neon-glow-blue">Analysis History</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            View all your previous image analyses and results in one convenient place.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="glass rounded-2xl p-6 border border-gray-700 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-lg bg-dark-card text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-blue focus:border-transparent"
                placeholder="Search by filename..."
              />
            </div>

            {/* Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-dark-card border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
              >
                <option value="all">All Analyses</option>
                <option value="classification">Classification</option>
                <option value="forgery">Forgery Detection</option>
              </select>
            </div>
          </div>
        </div>

        {/* History List */}
        {filteredHistory.length === 0 ? (
          <div className="glass rounded-2xl p-12 border border-gray-700 text-center">
            <HistoryIcon className="mx-auto h-16 w-16 text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {history.length === 0 ? 'No Analysis History' : 'No Results Found'}
            </h3>
            <p className="text-gray-400">
              {history.length === 0 
                ? 'Start by analyzing some images to see your history here.'
                : 'Try adjusting your search or filter criteria.'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredHistory.map((item) => {
              const Icon = getAnalysisIcon(item.analysis_type);
              const colorClass = getAnalysisColor(item.analysis_type);
              const bgClass = getAnalysisBg(item.analysis_type);
              const summary = getResultSummary(item.result);

              return (
                <div
                  key={item.id}
                  className="glass rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      {/* Icon */}
                      <div className={`p-3 rounded-lg ${bgClass}`}>
                        <Icon className={`h-6 w-6 ${colorClass}`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-white truncate">
                            {item.filename}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.analysis_type === 'classification' 
                              ? 'bg-yellow-900/30 text-yellow-400' 
                              : 'bg-green-900/30 text-green-400'
                          }`}>
                            {item.analysis_type}
                          </span>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(item.created_at)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FileImage className="h-4 w-4" />
                            <span>ID: {item.id}</span>
                          </div>
                        </div>

                        {/* Result Summary */}
                        <div className={`p-3 rounded-lg ${
                          summary.status === 'success' 
                            ? 'bg-green-900/20 border border-green-500' 
                            : 'bg-red-900/20 border border-red-500'
                        }`}>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className={`font-medium ${
                                summary.status === 'success' ? 'text-green-400' : 'text-red-400'
                              }`}>
                                {summary.message}
                              </p>
                              {summary.details && (
                                <p className="text-gray-300 text-sm mt-1">
                                  {summary.details}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => {
                          // View details modal or navigate to result page
                          toast.success('Viewing analysis details');
                        }}
                        className="p-2 text-gray-400 hover:text-neon-blue transition-colors duration-200"
                        title="View Details"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => {
                          // Download result
                          toast.success('Downloading analysis result');
                        }}
                        className="p-2 text-gray-400 hover:text-neon-green transition-colors duration-200"
                        title="Download Result"
                      >
                        <Download className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => {
                          // Delete analysis
                          toast.success('Analysis deleted');
                        }}
                        className="p-2 text-gray-400 hover:text-red-400 transition-colors duration-200"
                        title="Delete Analysis"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Stats */}
        {history.length > 0 && (
          <div className="mt-8 glass rounded-2xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-neon-blue">
                  {history.length}
                </div>
                <div className="text-gray-400 text-sm">Total Analyses</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-neon-yellow">
                  {history.filter(h => h.analysis_type === 'classification').length}
                </div>
                <div className="text-gray-400 text-sm">Classifications</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-neon-green">
                  {history.filter(h => h.analysis_type === 'forgery').length}
                </div>
                <div className="text-gray-400 text-sm">Forgery Checks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-neon-purple">
                  {history.filter(h => h.result?.success).length}
                </div>
                <div className="text-gray-400 text-sm">Successful</div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default History;



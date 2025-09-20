import React, { useState } from 'react';
import { api, uploadFile } from '../services/api';

const TestAnalysis = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState(null);

  const testBackendConnection = async () => {
    try {
      setLoading(true);
      const response = await api.get('/');
      setConnectionStatus(`✅ Backend connected: ${response.data.message}`);
    } catch (err) {
      setConnectionStatus(`❌ Backend connection failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
    setError(null);
  };

  const analyzeImage = async (analysisType) => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await uploadFile(`/analysis/${analysisType}`, file);
      setResult(response.data);
    } catch (err) {
      setError(`Analysis failed: ${err.message}`);
      console.error('Analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-400">
          🧪 Image Analysis Test
        </h1>

        {/* Connection Test */}
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Backend Connection Test</h2>
          <button
            onClick={testBackendConnection}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Backend Connection'}
          </button>
          {connectionStatus && (
            <p className="mt-2 text-sm">{connectionStatus}</p>
          )}
        </div>

        {/* File Upload */}
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Upload Image</h2>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
          />
          {file && (
            <p className="mt-2 text-sm text-green-400">
              ✅ Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
            </p>
          )}
        </div>

        {/* Analysis Buttons */}
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Analysis Options</h2>
          <div className="flex gap-4">
            <button
              onClick={() => analyzeImage('classification')}
              disabled={!file || loading}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded disabled:opacity-50"
            >
              {loading ? 'Analyzing...' : 'Classification'}
            </button>
            <button
              onClick={() => analyzeImage('forgery')}
              disabled={!file || loading}
              className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded disabled:opacity-50"
            >
              {loading ? 'Analyzing...' : 'Forgery Detection'}
            </button>
            <button
              onClick={() => analyzeImage('deepfake')}
              disabled={!file || loading}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded disabled:opacity-50"
            >
              {loading ? 'Analyzing...' : 'Deepfake Detection'}
            </button>
          </div>
        </div>

        {/* Results */}
        {error && (
          <div className="bg-red-900 border border-red-600 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold text-red-400">Error</h3>
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {result && (
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
            <div className="space-y-4">
              <div>
                <strong>Success:</strong> {result.success ? '✅ Yes' : '❌ No'}
              </div>
              <div>
                <strong>Analysis Type:</strong> {result.analysis_type}
              </div>
              <div>
                <strong>Filename:</strong> {result.filename}
              </div>
              
              {result.result && (
                <div>
                  <strong>Analysis Details:</strong>
                  <pre className="bg-gray-900 p-4 rounded mt-2 overflow-auto text-sm">
                    {JSON.stringify(result.result, null, 2)}
                  </pre>
                </div>
              )}
              
              {result.error && (
                <div className="text-red-400">
                  <strong>Error:</strong> {result.error}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestAnalysis;


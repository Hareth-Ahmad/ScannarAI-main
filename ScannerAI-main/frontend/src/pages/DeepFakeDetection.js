import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Header from '../components/Header';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Upload, 
  Image as ImageIcon, 
  Shield, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  RotateCcw,
  Eye,
  Brain
} from 'lucide-react';
import { uploadFile } from '../services/api';
import toast from 'react-hot-toast';

const DeepFakeDetection = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      setResult(null);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  const handleAnalyze = async () => {
    if (!uploadedFile) return;

    setLoading(true);
    setUploadProgress(0);

    try {
      const response = await uploadFile(
        '/analysis/deepfake',
        uploadedFile,
        (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        }
      );

      setResult(response.data);
      toast.success('Deepfake detection completed!');
    } catch (error) {
      console.error('Deepfake detection error:', error);
      toast.error(error.response?.data?.detail || 'Deepfake detection failed');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const handleReset = () => {
    setUploadedFile(null);
    setPreview(null);
    setResult(null);
    setUploadProgress(0);
  };

  const formatResult = (result) => {
    if (!result || !result.success) {
      return {
        status: 'error',
        message: result?.error || 'Analysis failed',
        details: null
      };
    }

    return {
      status: 'success',
      message: result.message,
      details: {
        predicted_label: result.predicted_label,
        is_deepfake: result.is_deepfake,
        confidence: result.confidence,
        risk_level: result.risk_level,
        basic_analysis: result.basic_analysis
      }
    };
  };

  const formattedResult = result ? formatResult(result) : null;

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'text-red-400';
    if (confidence >= 0.6) return 'text-yellow-400';
    if (confidence >= 0.4) return 'text-orange-400';
    return 'text-green-400';
  };

  const getConfidenceBg = (confidence) => {
    if (confidence >= 0.8) return 'bg-red-900/20 border-red-500';
    if (confidence >= 0.6) return 'bg-yellow-900/20 border-yellow-500';
    if (confidence >= 0.4) return 'bg-orange-900/20 border-orange-500';
    return 'bg-green-900/20 border-green-500';
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            <span className="neon-glow-purple">DeepFake Detection</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Upload a face image to detect if it's a deepfake using advanced AI algorithms.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            {/* Upload Area */}
            <div className="glass rounded-2xl p-6 border border-gray-700">
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                <Upload className="mr-3 text-neon-purple" />
                Upload Face Image
              </h2>

              {!uploadedFile ? (
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
                    isDragActive
                      ? 'border-neon-purple bg-neon-purple/10'
                      : 'border-gray-600 hover:border-neon-purple hover:bg-neon-purple/5'
                  }`}
                >
                  <input {...getInputProps()} />
                  <ImageIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  {isDragActive ? (
                    <p className="text-neon-purple text-lg">Drop the image here...</p>
                  ) : (
                    <div>
                      <p className="text-gray-300 text-lg mb-2">
                        Drag & drop a face image here, or click to select
                      </p>
                      <p className="text-gray-500 text-sm">
                        Supports: JPEG, PNG, GIF, BMP, WebP (max 10MB)
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Preview */}
                  <div className="relative">
                    <img
                      src={preview}
                      alt="Uploaded"
                      className="w-full h-64 object-cover rounded-lg border border-gray-600"
                    />
                    <button
                      onClick={handleReset}
                      className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors duration-200"
                    >
                      <XCircle size={20} />
                    </button>
                  </div>

                  {/* File Info */}
                  <div className="bg-dark-card rounded-lg p-4 border border-gray-600">
                    <h3 className="text-white font-medium mb-2">File Information</h3>
                    <div className="text-sm text-gray-300 space-y-1">
                      <p><span className="text-gray-400">Name:</span> {uploadedFile.name}</p>
                      <p><span className="text-gray-400">Size:</span> {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      <p><span className="text-gray-400">Type:</span> {uploadedFile.type}</p>
                    </div>
                  </div>

                  {/* Analyze Button */}
                  <button
                    onClick={handleAnalyze}
                    disabled={loading}
                    className="w-full btn-neon bg-gradient-to-r from-neon-purple to-purple-600 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 hover:from-purple-600 hover:to-neon-purple disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <LoadingSpinner size="sm" color="white" />
                        <span className="ml-2">Analyzing...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Brain className="mr-2" size={20} />
                        Detect DeepFake
                      </div>
                    )}
                  </button>

                  {/* Progress Bar */}
                  {loading && uploadProgress > 0 && (
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-neon-purple h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <div className="glass rounded-2xl p-6 border border-gray-700">
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                <Brain className="mr-3 text-neon-purple" />
                Detection Results
              </h2>

              {!result ? (
                <div className="text-center py-12">
                  <Brain className="mx-auto h-16 w-16 text-gray-600 mb-4" />
                  <p className="text-gray-400">
                    Upload a face image to see deepfake detection results
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Main DeepFake Result */}
                  <div className={`bg-gradient-to-r rounded-xl p-6 border ${
                    formattedResult.details?.is_deepfake 
                      ? 'from-red-900/30 to-orange-900/30 border-red-500/50' 
                      : 'from-green-900/30 to-blue-900/30 border-green-500/50'
                  }`}>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-4">
                        {formattedResult.details?.is_deepfake ? (
                          <XCircle className="h-8 w-8 text-red-400 mr-3" />
                        ) : (
                          <CheckCircle className="h-8 w-8 text-green-400 mr-3" />
                        )}
                        <h3 className="text-2xl font-bold text-white">DeepFake Detection Result</h3>
                      </div>
                      
                      <div className="bg-black/50 rounded-lg p-4 mb-4">
                        <p className={`text-4xl font-bold mb-2 ${
                          (result?.result?.is_deepfake || result?.is_deepfake) ? 'text-red-400' : 'text-green-400'
                        }`}>
                          {(result?.result?.is_deepfake || result?.is_deepfake) ? 'DEEPFAKE DETECTED' : 'AUTHENTIC'}
                        </p>
                        <p className="text-lg text-gray-300">
                          Confidence: <span className="text-yellow-400 font-bold">
                            {(((result?.result?.confidence || result?.confidence) || 0) * 100).toFixed(1)}%
                          </span>
                        </p>
                        <p className="text-sm text-gray-400 mt-2">
                          {result?.result?.predicted_label || result?.predicted_label}
                        </p>
                      </div>
                      
                      <p className="text-gray-300 text-sm">
                        {result?.result?.message || result?.message || 'Analysis completed successfully'}
                      </p>
                    </div>
                  </div>

                  {/* DeepFake Status */}
                  {formattedResult.details && (
                    <div className="space-y-4">
                      <div className={`p-4 rounded-lg border ${getConfidenceBg(formattedResult.details.confidence)}`}>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-white font-medium">DeepFake Status</h3>
                          <div className={`flex items-center ${getConfidenceColor(formattedResult.details.confidence)}`}>
                            {formattedResult.details.is_deepfake ? (
                              <AlertTriangle className="h-5 w-5 mr-2" />
                            ) : (
                              <CheckCircle className="h-5 w-5 mr-2" />
                            )}
                            <span className="font-semibold">
                              {formattedResult.details.is_deepfake ? 'DEEPFAKE DETECTED' : 'AUTHENTIC'}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Confidence:</span>
                          <span className={`font-bold ${getConfidenceColor(formattedResult.details.confidence)}`}>
                            {(formattedResult.details.confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>

                      {/* Confidence Bar */}
                      <div className="bg-dark-card rounded-lg p-4 border border-gray-600">
                        <h3 className="text-white font-medium mb-3">Confidence Level</h3>
                        <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                          <div
                            className={`h-3 rounded-full transition-all duration-500 ${
                              formattedResult.details.confidence >= 0.8 ? 'bg-red-500' :
                              formattedResult.details.confidence >= 0.6 ? 'bg-yellow-500' :
                              formattedResult.details.confidence >= 0.4 ? 'bg-orange-500' :
                              'bg-green-500'
                            }`}
                            style={{ width: `${formattedResult.details.confidence * 100}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>Low Risk</span>
                          <span>High Risk</span>
                        </div>
                      </div>

                      {/* Prediction Details */}
                      <div className="bg-dark-card rounded-lg p-4 border border-gray-600">
                        <h3 className="text-white font-medium mb-3">Prediction Details</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Predicted Label:</span>
                            <span className="text-white">{formattedResult.details.predicted_label}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Is DeepFake:</span>
                            <span className={`font-semibold ${
                              formattedResult.details.is_deepfake ? 'text-red-400' : 'text-green-400'
                            }`}>
                              {formattedResult.details.is_deepfake ? 'Yes' : 'No'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Risk Level:</span>
                            <span className={`font-semibold ${
                              formattedResult.details.risk_level === 'High Risk' ? 'text-red-400' :
                              formattedResult.details.risk_level === 'Medium Risk' ? 'text-yellow-400' :
                              formattedResult.details.risk_level === 'Low Risk' ? 'text-orange-400' :
                              'text-green-400'
                            }`}>
                              {formattedResult.details.risk_level}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* AI Model Information */}
                      <div className="bg-dark-card rounded-lg p-4 border border-gray-600">
                        <h3 className="text-white font-medium mb-3">AI Model Information</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Model Used:</span>
                            <span className="text-white">DeepFake Detector v2</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Analysis Type:</span>
                            <span className="text-white">DeepFake Detection</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Model Version:</span>
                            <span className="text-white">prithivMLmods/Deep-Fake-Detector-v2-Model</span>
                          </div>
                        </div>
                      </div>

                      {/* Interpretation */}
                      <div className="bg-dark-card rounded-lg p-4 border border-gray-600">
                        <h3 className="text-white font-medium mb-3">Interpretation</h3>
                        <div className="text-sm text-gray-300 space-y-2">
                          {formattedResult.details.is_deepfake ? (
                            <div className="flex items-start space-x-2">
                              <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                              <p>
                                This image appears to be a deepfake. The AI detected signs of 
                                artificial generation or manipulation.
                              </p>
                            </div>
                          ) : (
                            <div className="flex items-start space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                              <p>
                                This image appears to be authentic with no significant signs of 
                                deepfake generation detected.
                              </p>
                            </div>
                          )}
                          <p className="text-gray-400 text-xs">
                            Note: This analysis is based on AI detection algorithms and should be 
                            considered alongside other evidence.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Reset Button */}
                  <button
                    onClick={handleReset}
                    className="w-full btn-neon bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 hover:from-gray-700 hover:to-gray-800"
                  >
                    <div className="flex items-center justify-center">
                      <RotateCcw className="mr-2" size={20} />
                      Analyze Another Image
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DeepFakeDetection;

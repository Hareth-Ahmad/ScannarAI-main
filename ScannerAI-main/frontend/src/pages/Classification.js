import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Header from '../components/Header';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Upload, 
  Image as ImageIcon, 
  Brain, 
  CheckCircle, 
  XCircle,
  Download,
  RotateCcw
} from 'lucide-react';
import { uploadFile } from '../services/api';
import toast from 'react-hot-toast';

const Classification = () => {
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
        '/analysis/classification',
        uploadedFile,
        (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        }
      );

      setResult(response.data);
      toast.success('Image classification completed!');
    } catch (error) {
      console.error('Classification error:', error);
      
      if (error.usageLimitExceeded) {
        // Show subscription prompt for usage limit
        toast.error(
          <div>
            <p className="font-semibold">Daily limit reached!</p>
            <p className="text-sm">You've used all 7 free analyses today.</p>
            <a 
              href="/subscription" 
              className="text-yellow-400 hover:text-yellow-300 underline"
            >
              Subscribe for unlimited access
            </a>
          </div>,
          { duration: 8000 }
        );
      } else {
        toast.error(error.response?.data?.detail || 'Classification failed');
      }
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
      message: result.message || 'Classification completed successfully',
      details: {
        predicted_label: result.predicted_label,
        confidence: result.confidence,
        top_predictions: result.top_predictions,
        basic_analysis: result.basic_analysis,
        analysis_type: result.analysis_type
      }
    };
  };

  const formattedResult = result ? formatResult(result) : null;

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            <span className="neon-glow-yellow">Image Classification</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Upload an image to get AI-powered classification analysis using advanced noiseprint technology.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            {/* Upload Area */}
            <div className="glass rounded-2xl p-6 border border-gray-700">
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                <Upload className="mr-3 text-neon-yellow" />
                Upload Image
              </h2>

              {!uploadedFile ? (
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
                    isDragActive
                      ? 'border-neon-yellow bg-neon-yellow/10'
                      : 'border-gray-600 hover:border-neon-yellow hover:bg-neon-yellow/5'
                  }`}
                >
                  <input {...getInputProps()} />
                  <ImageIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  {isDragActive ? (
                    <p className="text-neon-yellow text-lg">Drop the image here...</p>
                  ) : (
                    <div>
                      <p className="text-gray-300 text-lg mb-2">
                        Drag & drop an image here, or click to select
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
                    className="w-full btn-neon bg-gradient-to-r from-neon-yellow to-yellow-600 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 hover:from-yellow-600 hover:to-neon-yellow disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <LoadingSpinner size="sm" color="white" />
                        <span className="ml-2">Analyzing...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Brain className="mr-2" size={20} />
                        Analyze Image
                      </div>
                    )}
                  </button>

                  {/* Progress Bar */}
                  {loading && uploadProgress > 0 && (
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-neon-yellow h-2 rounded-full transition-all duration-300"
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
                <Brain className="mr-3 text-neon-yellow" />
                Analysis Results
              </h2>

              {!result ? (
                <div className="text-center py-12">
                  <Brain className="mx-auto h-16 w-16 text-gray-600 mb-4" />
                  <p className="text-gray-400">
                    Upload an image to see classification results
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Main Prediction Result */}
                  <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-xl p-6 border border-green-500/50">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-4">
                        <CheckCircle className="h-8 w-8 text-green-400 mr-3" />
                        <h3 className="text-2xl font-bold text-white">Classification Result</h3>
                      </div>
                      
                      <div className="bg-black/50 rounded-lg p-4 mb-4">
                        <p className="text-3xl font-bold text-green-400 mb-2">
                          {result?.result?.predicted_label || result?.predicted_label || 'Unknown'}
                        </p>
                        <p className="text-lg text-gray-300">
                          Confidence: <span className="text-yellow-400 font-bold">
                            {(((result?.result?.confidence || result?.confidence) || 0) * 100).toFixed(1)}%
                          </span>
                        </p>
                      </div>
                      
                      <p className="text-gray-300 text-sm">
                        {result?.result?.message || result?.message || 'Analysis completed successfully'}
                      </p>
                    </div>
                  </div>

                  {/* Details */}
                  {formattedResult.details && (
                    <div className="space-y-4">
                      {/* Prediction Results */}
                      {formattedResult.details.predicted_label && (
                        <div className="bg-dark-card rounded-lg p-4 border border-gray-600">
                          <h3 className="text-white font-medium mb-3">Prediction Results</h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Predicted Label:</span>
                              <span className="text-white font-medium">{formattedResult.details.predicted_label}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Confidence:</span>
                              <span className="text-white">{(formattedResult.details.confidence * 100).toFixed(1)}%</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Top Predictions */}
                      {formattedResult.details.top_predictions && (
                        <div className="bg-dark-card rounded-lg p-4 border border-gray-600">
                          <h3 className="text-white font-medium mb-3">Top Predictions</h3>
                          <div className="space-y-2">
                            {formattedResult.details.top_predictions.map((pred, index) => (
                              <div key={index} className="flex justify-between items-center">
                                <span className="text-gray-300">{pred.label}</span>
                                <span className="text-white">{(pred.confidence * 100).toFixed(1)}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Basic Analysis */}
                      {formattedResult.details.basic_analysis && (
                        <div className="bg-dark-card rounded-lg p-4 border border-gray-600">
                          <h3 className="text-white font-medium mb-3">Image Properties</h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Dimensions:</span>
                              <span className="text-white">
                                {formattedResult.details.basic_analysis.image_properties?.width} x {formattedResult.details.basic_analysis.image_properties?.height}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Format:</span>
                              <span className="text-white">{formattedResult.details.basic_analysis.image_properties?.format}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Mode:</span>
                              <span className="text-white">{formattedResult.details.basic_analysis.image_properties?.mode}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Sharpness:</span>
                              <span className="text-white">
                                {formattedResult.details.basic_analysis.color_analysis?.sharpness?.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Edge Density:</span>
                              <span className="text-white">
                                {(formattedResult.details.basic_analysis.color_analysis?.edge_density * 100).toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* AI Model Information */}
                      <div className="bg-dark-card rounded-lg p-4 border border-gray-600">
                        <h3 className="text-white font-medium mb-3">AI Model Information</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Model Used:</span>
                            <span className="text-white">Vision Transformer (ViT)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Analysis Type:</span>
                            <span className="text-white">Image Classification</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Model Version:</span>
                            <span className="text-white">google/vit-base-patch16-224</span>
                          </div>
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

export default Classification;



import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Classification from './pages/Classification';
import ForgeryDetection from './pages/ForgeryDetection';
import DeepFakeDetection from './pages/DeepFakeDetection';
import About from './pages/About';
import History from './pages/History';
import TestAnalysis from './pages/TestAnalysis';
import Subscription from './pages/Subscription';
import ProtectedRoute from './components/ProtectedRoute';
import FloatingParticles from './components/FloatingParticles';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen animated-bg">
          <FloatingParticles count={30} />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/classification" element={
              <ProtectedRoute>
                <Classification />
              </ProtectedRoute>
            } />
            <Route path="/forgery" element={
              <ProtectedRoute>
                <ForgeryDetection />
              </ProtectedRoute>
            } />
            <Route path="/deepfake" element={
              <ProtectedRoute>
                <DeepFakeDetection />
              </ProtectedRoute>
            } />
            <Route path="/about" element={
              <ProtectedRoute>
                <About />
              </ProtectedRoute>
            } />
            <Route path="/history" element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            } />
            <Route path="/subscription" element={
              <ProtectedRoute>
                <Subscription />
              </ProtectedRoute>
            } />
            <Route path="/test" element={<TestAnalysis />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1a1a1a',
                color: '#ffffff',
                border: '1px solid #00f5ff',
                borderRadius: '8px',
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;



import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import ReportsComplaints from './pages/ReportsComplaints';
import CustomerService from './pages/CustomerService';
import PoingConfiguration from './pages/PoingConfiguration';
import TermsConditions from './pages/TermsConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import VerifyOTP from './pages/VerifyOTP';
import ResetPassword from './pages/ResetPassword';
import PasswordResetSuccess from './pages/PasswordResetSuccess';

// Protected Route Component for role-based access control
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const getUserRole = () => {
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData).role : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  };

  const userRole = getUserRole();
  
  // If no role restrictions or user role is allowed, render the component
  if (allowedRoles.length === 0 || allowedRoles.includes(userRole)) {
    return children;
  }
  
  // Otherwise, redirect to dashboard
  return <Navigate to="/dashboard" replace />;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check authentication status on app load
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('admin-auth-token');
      setIsAuthenticated(!!token);
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App w-full min-h-screen">
        {isAuthenticated ? (
          // Authenticated Routes
          <Layout>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/user-management" element={
                <ProtectedRoute allowedRoles={['admin', 'user']}>
                  <UserManagement />
                </ProtectedRoute>
              } />
              <Route path="/reports-complaints" element={<ReportsComplaints />} />
              <Route path="/customer-service" element={
                <ProtectedRoute allowedRoles={['admin', 'user']}>
                  <CustomerService />
                </ProtectedRoute>
              } />
              <Route path="/poing-configuration" element={
                <ProtectedRoute allowedRoles={['admin', 'user']}>
                  <PoingConfiguration />
                </ProtectedRoute>
              } />
              <Route path="/terms-conditions" element={<TermsConditions />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              {/* Redirect auth routes to dashboard if already authenticated */}
              <Route path="/login" element={<Navigate to="/dashboard" replace />} />
              <Route path="/forgot-password" element={<Navigate to="/dashboard" replace />} />
              <Route path="/verify-otp" element={<Navigate to="/dashboard" replace />} />
              <Route path="/reset-password" element={<Navigate to="/dashboard" replace />} />
              <Route path="/password-reset-success" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Layout>
        ) : (
          // Unauthenticated Routes
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/password-reset-success" element={<PasswordResetSuccess />} />
            {/* Redirect all other routes to root (login) if not authenticated */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
        
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App

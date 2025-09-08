import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/layout/Navbar';
import {
  Home,
  Login,
  Register,
  Dashboard,
  BugSubmit,
  SubmissionHistory,
  SubmissionResults,
  Search,
  AdminDashboard,
  DatasetUpload,
  ModelManagement,
  UserManagement,
  SystemLogs,
} from './pages';
import './App.css';

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }
  
  return user ? <>{children}</> : <Navigate to="/login" />;
};

// Admin route component
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }
  
  return user && user.is_admin ? <>{children}</> : <Navigate to="/dashboard" />;
};

// Main App Layout
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container-custom py-8">
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<AppLayout><Home /></AppLayout>} />
          <Route path="/login" element={<AppLayout><Login /></AppLayout>} />
          <Route path="/register" element={<AppLayout><Register /></AppLayout>} />
          
          {/* Protected routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <AppLayout><Dashboard /></AppLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/submit" 
            element={
              <ProtectedRoute>
                <AppLayout><BugSubmit /></AppLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/history" 
            element={
              <ProtectedRoute>
                <AppLayout><SubmissionHistory /></AppLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/results/:id" 
            element={
              <ProtectedRoute>
                <AppLayout><SubmissionResults /></AppLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/search" 
            element={
              <ProtectedRoute>
                <AppLayout><Search /></AppLayout>
              </ProtectedRoute>
            } 
          />
          
          {/* Admin routes */}
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <AppLayout><AdminDashboard /></AppLayout>
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/upload" 
            element={
              <AdminRoute>
                <AppLayout><DatasetUpload /></AppLayout>
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/model" 
            element={
              <AdminRoute>
                <AppLayout><ModelManagement /></AppLayout>
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <AdminRoute>
                <AppLayout><UserManagement /></AppLayout>
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/logs" 
            element={
              <AdminRoute>
                <AppLayout><SystemLogs /></AppLayout>
              </AdminRoute>
            } 
          />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

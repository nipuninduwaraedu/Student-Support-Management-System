import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import CSubmitComplaint from './pages/CSubmitComplaint';
import CSubmitFeedback from './pages/CSubmitFeedback';
import CAdminDashboard from './pages/CAdminDashboard';
import CStudentDashboard from './pages/CStudentDashboard';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-background">
          <Navbar />
          <Routes>
            {/* Student Routes */}
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={
              <ProtectedRoute requireStudent={true}>
                <CStudentDashboard />
              </ProtectedRoute>
            } />
            <Route path="/complaint" element={
              <ProtectedRoute requireStudent={true}>
                <CSubmitComplaint />
              </ProtectedRoute>
            } />
            <Route path="/feedback" element={
              <ProtectedRoute requireStudent={true}>
                <CSubmitFeedback />
              </ProtectedRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute requireAdmin={true}>
                <CAdminDashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

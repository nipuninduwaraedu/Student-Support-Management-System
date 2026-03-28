import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/LHome';
import AdminDashboard from './pages/LAdminDashboard';
import StudentDashboard from './pages/LStudentDashboard';
import LostItems from './pages/LLostItems';
import ItemDetails from './pages/LItemDetails';
import ClaimSubmission from './pages/LClaimSubmission';
import { AuthProvider, useAuth } from './context/AuthContext';
import './index.css';

const ProtectedRoute = ({ children, roleRequired }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (roleRequired && user.role !== roleRequired) return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              
              <Route path="/items" element={<LostItems />} />
              <Route path="/items/:id" element={<ItemDetails />} />
              
              {/* Student Routes */}
              <Route path="/student" element={
                <ProtectedRoute roleRequired="Student">
                  <StudentDashboard />
                </ProtectedRoute>
              } />
              <Route path="/items/:id/claim" element={
                <ProtectedRoute roleRequired="Student">
                  <ClaimSubmission />
                </ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute roleRequired="Admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
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
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthProvider, AuthContext } from "./context/AuthContext";

// Layout
import Layout from "./components/Layout";

// Admin Pages
import EAdminDashboard from "./pages/admin/EAdminDashboard";
import EAdminEvents from "./pages/admin/EAdminEvents";
import EAdminAssignments from "./pages/admin/EAdminAssignments";

// Student Pages
import EStudentDashboard from "./pages/student/EStudentDashboard";
import EStudentEvents from "./pages/student/EStudentEvents";
import EStudentAssignments from "./pages/student/EStudentAssignments";

// Auth Pages
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

// ProtectedRoute Component
import ProtectedRoute from "./routes/ProtectedRoute.jsx";

function DashboardRedirect() {
  const { user } = useContext(AuthContext);

  if (user?.role === "admin") return <Navigate to="/admin-dashboard" replace />;
  if (user?.role === "student") return <Navigate to="/student-dashboard" replace />;

  return <Navigate to="/login" replace />;
}

function Unauthorized() {
  return (
    <div className="page-wrap">
      <div className="dashboard-card wide">
        <h2>Access Denied</h2>
        <p className="muted">You do not have permission to view this page.</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Role-based redirect */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["student", "admin"]}>
                <DashboardRedirect />
              </ProtectedRoute>
            }
          />

          {/* Student Routes */}
          <Route
            path="/student-dashboard"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <Layout>
                  <EStudentDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/student-dashboard/events"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <Layout>
                  <EStudentEvents />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/student-dashboard/assignments"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <Layout>
                  <EStudentAssignments />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Layout>
                  <EAdminDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-dashboard/events"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Layout>
                  <EAdminEvents />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-dashboard/assignments"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Layout>
                  <EAdminAssignments />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Unauthorized */}
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
export default App;

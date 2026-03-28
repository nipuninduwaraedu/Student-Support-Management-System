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
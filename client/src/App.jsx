import AIChatbotPage from "./features/ai-chatbot/pages/AIChatbotPage.jsx";

function App() {
  return <AIChatbotPage />;
import { Navigate, Route, Routes } from "react-router-dom";
import { useContext } from "react";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import { AuthContext } from "./context/AuthContext.jsx";
import "./styles/auth.css";

function DashboardRedirect() {
  const { user } = useContext(AuthContext);

  if (user?.role === "admin") {
    return <Navigate to="/admin-dashboard" replace />;
  }

  return <Navigate to="/student-dashboard" replace />;
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

function StudentDashboardHome() {
  return <div />;
}

function AdminDashboardHome() {
  return <div />;
}

function EmptyModulePage() {
  return <div />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["student", "admin"]}>
            <DashboardRedirect />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student-dashboard"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<StudentDashboardHome />} />
        <Route path="ai-chatbot" element={<EmptyModulePage />} />
        <Route path="lost-found" element={<EmptyModulePage />} />
        <Route path="event-management" element={<EmptyModulePage />} />
        <Route path="complain-feedback" element={<EmptyModulePage />} />
      </Route>
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboardHome />} />
        <Route path="lost-found" element={<EmptyModulePage />} />
        <Route path="event-management" element={<EmptyModulePage />} />
        <Route path="complain-feedback" element={<EmptyModulePage />} />
      </Route>
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;

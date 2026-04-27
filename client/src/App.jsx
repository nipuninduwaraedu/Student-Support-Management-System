import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Unauthorized from "./pages/Unauthorized.jsx";
import EStudentDashboard from "./pages/student/EStudentDashboard.jsx";
import EStudentEvents from "./pages/student/EStudentEvents.jsx";
import EStudentAssignments from "./pages/student/EStudentAssignments.jsx";
import CSubmitComplaint from "./pages/CSubmitComplaint.jsx";
import CSubmitFeedback from "./pages/CSubmitFeedback.jsx";
import CStudentDashboard from "./pages/CStudentDashboard.jsx";
import EAdminDashboard from "./pages/admin/EAdminDashboard.jsx";
import EAdminEvents from "./pages/admin/EAdminEvents.jsx";
import EAdminAssignments from "./pages/admin/EAdminAssignments.jsx";
import CAdminDashboard from "./pages/CAdminDashboard.jsx";
import LHome from "./pages/LHome.jsx";
import LLostItems from "./pages/LLostItems.jsx";
import LItemDetails from "./pages/LItemDetails.jsx";
import LClaimSubmission from "./pages/LClaimSubmission.jsx";
import LStudentLostDashboard from "./pages/LStudentDashboard.jsx";
import LAdminLostDashboard from "./pages/LAdminDashboard.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import DashboardRedirect from "./routes/DashboardRedirect.jsx";

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
      <Route
        path="/student-dashboard/complaints/new"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <Layout>
              <CSubmitComplaint />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student-dashboard/complaints/feedback"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <Layout>
              <CSubmitFeedback />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student-dashboard/complaints/notifications"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <Layout>
              <CStudentDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/student-dashboard/lost-found"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <Layout>
              <LHome />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student-dashboard/lost-found/browse"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <Layout>
              <LLostItems />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student-dashboard/lost-found/browse/:id"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <Layout>
              <LItemDetails />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student-dashboard/lost-found/browse/:id/claim"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <Layout>
              <LClaimSubmission />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student-dashboard/lost-found/my-claims"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <Layout>
              <LStudentLostDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

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
      <Route
        path="/admin-dashboard/complaints"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Layout>
              <CAdminDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin-dashboard/lost-found"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Layout>
              <LAdminLostDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;

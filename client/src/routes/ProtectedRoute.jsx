import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useContext(AuthContext);
  const token = localStorage.getItem("token");

  if (loading && token) {
    return <div className="auth-container">Loading...</div>;
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

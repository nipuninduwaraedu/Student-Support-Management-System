import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

export default function DashboardRedirect() {
  const { user } = useContext(AuthContext);

  if (user?.role === "admin") {
    return <Navigate to="/admin-dashboard" replace />;
  }
  if (user?.role === "student") {
    return <Navigate to="/student-dashboard" replace />;
  }
  return <Navigate to="/login" replace />;
}

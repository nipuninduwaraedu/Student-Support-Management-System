import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function AdminDashboard() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="page-wrap">
      <div className="dashboard-card wide">
        <h2>Admin Dashboard</h2>
        <p className="muted">Welcome, {user?.name || "Admin"}.</p>
        <p className="muted">
          This is your admin dashboard for managing users and support
          operations.
        </p>
        <button className="btn" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default AdminDashboard;

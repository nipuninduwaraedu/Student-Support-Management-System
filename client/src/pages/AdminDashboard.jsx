import { useContext } from "react";
import { Link, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function AdminDashboard() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="brand">SSMS Portal</div>
          <p className="muted">Admin Console</p>
          <div className="role-badge">{user?.role || "admin"}</div>
        </div>

        <div className="profile-card">
          <div className="avatar">{(user?.name || "A").slice(0, 1).toUpperCase()}</div>
          <div className="profile-meta">
            <div className="profile-name">{user?.name || "Admin"}</div>
            <div className="profile-email">{user?.email || "admin@email.com"}</div>
          </div>
        </div>

        <nav className="side-links">
          <div className="nav-section-title">Modules</div>
          <Link to="/admin-dashboard">Overview</Link>
          <Link to="/admin-dashboard/lost-found">Lost Item</Link>
          <Link to="/admin-dashboard/event-management">Event Management</Link>
          <Link to="/admin-dashboard/complain-feedback">
            Complain & Feedback
          </Link>
        </nav>

        <button className="btn btn-secondary logout-btn" onClick={logout}>
          Logout
        </button>
      </aside>

      <main className="content">
        <div className="topbar">
          <div className="topbar-left">
            <h2 className="topbar-title">Admin Dashboard</h2>
            <span className="topbar-subtitle">
              Manage lost items, events, and feedback.
            </span>
          </div>
          <div className="topbar-right">
            <input
              className="topbar-search"
              placeholder="Search users, reports..."
              aria-label="Search"
            />
            <button className="icon-btn" type="button" title="Notifications">
              🔔
            </button>
            <button className="icon-btn" type="button" title="Help">
              ?
            </button>
          </div>
        </div>

        <div className="topbar-divider" />

        <Outlet />
      </main>
    </div>
  );
}

export default AdminDashboard;

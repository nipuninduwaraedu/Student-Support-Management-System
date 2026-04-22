import { useContext } from "react";
import { Link, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function StudentDashboard() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="brand">SSMS Portal</div>
          <p className="muted">Student Workspace</p>
          <div className="role-badge">{user?.role || "student"}</div>
        </div>

        <div className="profile-card">
          <div className="avatar">
            {(user?.name || "S").slice(0, 1).toUpperCase()}
          </div>
          <div className="profile-meta">
            <div className="profile-name">{user?.name || "Student"}</div>
            <div className="profile-email">
              {user?.email || "student@email.com"}
            </div>
          </div>
        </div>

        <nav className="side-links">
          <div className="nav-section-title">Modules</div>
          <Link to="/student-dashboard">Overview</Link>
          <Link to="/student-dashboard/lost-found">Lost Item</Link>
          <Link to="/student-dashboard/event-management">Event Management</Link>
          <Link to="/student-dashboard/complain-feedback">
            Complain & Feedback
          </Link>
          <button className="nav-btn">AI Chatbot</button>
        </nav>

        <button className="btn btn-secondary logout-btn" onClick={logout}>
          Logout
        </button>
      </aside>

      <main className="content">
        <div className="topbar">
          <div className="topbar-left">
            <h2 className="topbar-title">Student Dashboard</h2>
            <span className="topbar-subtitle">
              Welcome back, {user?.name || "Student"}.
            </span>
          </div>
          <div className="topbar-right">
            <input
              className="topbar-search"
              placeholder="Search tickets, events..."
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

export default StudentDashboard;

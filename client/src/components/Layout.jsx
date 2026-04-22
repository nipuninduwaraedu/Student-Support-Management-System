import { useContext } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import {
  LayoutDashboard,
  Calendar,
  FileText,
  MessageCircle,
  LogOut,
  MessageSquare,
  Inbox,
  Search,
} from "lucide-react";

const Layout = ({ children }) => {
  const { user: authUser, loading, logout } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
      <div className="auth-container shell-loading">
        <div className="shell-loading-inner">
          <div className="shell-spinner" aria-hidden />
          <p>Loading your workspace…</p>
        </div>
      </div>
    );
  }

  const user = authUser || { name: "", role: "student" };

  const adminItems = [
    {
      path: "/admin-dashboard",
      label: "Overview",
      icon: <LayoutDashboard size={20} strokeWidth={2} />,
    },
    {
      path: "/admin-dashboard/complaints",
      label: "Complaints & feedback",
      icon: <MessageSquare size={20} strokeWidth={2} />,
    },
    {
      path: "/admin-dashboard/lost-found",
      label: "Lost Item",
      icon: <Search size={20} strokeWidth={2} />,
    },
    {
      path: "/admin-dashboard/events",
      label: "Events",
      icon: <Calendar size={20} strokeWidth={2} />,
    },
    {
      path: "/admin-dashboard/assignments",
      label: "Assignments",
      icon: <FileText size={20} strokeWidth={2} />,
    },
  ];

  const studentItems = [
    {
      path: "/student-dashboard",
      label: "Overview",
      icon: <LayoutDashboard size={20} strokeWidth={2} />,
    },
    {
      path: "/student-dashboard/lost-found",
      label: "Lost Item",
      icon: <Search size={20} strokeWidth={2} />,
    },
    {
      path: "/student-dashboard/lost-found/my-claims",
      label: "My claims",
      icon: <Inbox size={20} strokeWidth={2} />,
    },
    {
      path: "/student-dashboard/events",
      label: "Events",
      icon: <Calendar size={20} strokeWidth={2} />,
    },
    {
      path: "/student-dashboard/assignments",
      label: "Assignments",
      icon: <FileText size={20} strokeWidth={2} />,
    },
    {
      path: "#",
      label: "AI Chatbot",
      icon: <MessageCircle size={20} strokeWidth={2} />,
    },
    {
      path: "/student-dashboard/complaints/new",
      label: "Submit complaint",
      icon: <MessageSquare size={20} strokeWidth={2} />,
    },
    {
      path: "/student-dashboard/complaints/feedback",
      label: "Give feedback",
      icon: <MessageSquare size={20} strokeWidth={2} />,
    },
    {
      path: "/student-dashboard/complaints/notifications",
      label: "Notifications",
      icon: <Inbox size={20} strokeWidth={2} />,
    },
  ];

  const navItems = user.role === "admin" ? adminItems : studentItems;

  const isNavActive = (path) => {
    if (path === "/student-dashboard" || path === "/admin-dashboard") {
      return location.pathname === path;
    }
    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  return (
    <div className="app-container">
      <aside className="sidebar" aria-label="Main navigation">
        <div className="sidebar-logo">
          <span className="logo-mark" aria-hidden>
            🎓
          </span>
          <span>Student Support</span>
        </div>
        <div className="nav-section-label">
          {user.role === "admin" ? "Administration" : "Student"}
        </div>
        <nav>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${isNavActive(item.path) ? "active" : ""}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-user">
            Signed in as <strong>{user.name || user.email || "User"}</strong>
            <span style={{ display: "block", marginTop: "0.2rem" }}>
              Role: <strong>{user.role}</strong>
            </span>
          </div>
          {authUser && (
            <button
              type="button"
              onClick={logout}
              className="nav-link nav-link-logout"
            >
              <span className="nav-icon">
                <LogOut size={20} strokeWidth={2} />
              </span>
              Log out
            </button>
          )}
        </div>
      </aside>
      <main className="main-content">{children ?? <Outlet />}</main>
    </div>
  );
};

export default Layout;

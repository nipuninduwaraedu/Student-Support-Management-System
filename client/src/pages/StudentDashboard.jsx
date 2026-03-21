import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function StudentDashboard() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="page-wrap">
      <div className="dashboard-card wide">
        <h2>Student Dashboard</h2>
        <p className="muted">Welcome, {user?.name || "Student"}.</p>
        <p className="muted">
          This is your student dashboard where you can create and track support
          requests.
        </p>
        <button className="btn" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default StudentDashboard;

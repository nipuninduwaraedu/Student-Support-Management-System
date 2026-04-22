import { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, FileText, Search } from "lucide-react";
import { Link } from "react-router-dom";

const EAdminDashboard = () => {
  const [stats, setStats] = useState({ events: 0, assignments: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [eventsRes, assignmentsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/events"),
          axios.get("http://localhost:5000/api/assignments"),
        ]);
        setStats({
          events: eventsRes.data.length,
          assignments: assignmentsRes.data.length,
        });
      } catch (err) {
        console.error("Failed to fetch stats");
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1>Admin overview</h1>
          <p className="subtitle">
            Monitor events, coursework, complaints, and lost &amp; from one
            dashboard.
          </p>
        </div>
      </div>

      <div className="card-grid">
        <div className="glass-panel dash-tile">
          <div className="dash-tile-icon dash-tile-icon--violet">
            <Calendar size={28} />
          </div>
          <div>
            <h3>{stats.events}</h3>
            <p className="subtitle">Scheduled events</p>
          </div>
        </div>
        <div className="glass-panel dash-tile">
          <div className="dash-tile-icon dash-tile-icon--green">
            <FileText size={28} />
          </div>
          <div>
            <h3>{stats.assignments}</h3>
            <p className="subtitle">Assignments created</p>
          </div>
        </div>
      </div>

      <div className="page-header dashboard-section">
        <div>
          <h2>Lost &amp; found operations</h2>
          <p className="subtitle">
            Post recovered items, review student proof, and close claims.
          </p>
        </div>
      </div>
      <div className="card-grid">
        <Link
          to="/admin-dashboard/lost-found"
          className="glass-panel dash-tile dash-tile-link"
        >
          <div className="dash-tile-icon dash-tile-icon--amber">
            <Search size={28} />
          </div>
          <div>
            <h3>Open admin console</h3>
            <p className="subtitle">Items directory and claims queue</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default EAdminDashboard;

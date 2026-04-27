import { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, FileText, Search } from "lucide-react";
import { Link } from "react-router-dom";

const EStudentDashboard = () => {
  const [stats, setStats] = useState({
    upcomingEvents: 0,
    pendingAssignments: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [eventsRes, assignmentsRes, submissionsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/events"),
          axios.get("http://localhost:5000/api/assignments"),
          axios.get("http://localhost:5000/api/submissions/me"),
        ]);

        const submittedIds = submissionsRes.data.map((sub) => sub.assignment._id);
        const pending = assignmentsRes.data.filter(
          (a) => !submittedIds.includes(a._id)
        );

        setStats({
          upcomingEvents: eventsRes.data.length,
          pendingAssignments: pending.length,
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
          <h1>Student overview</h1>
          <p className="subtitle">
            Events, coursework, and lost &amp; found in one place.
          </p>
        </div>
      </div>

      <div className="card-grid">
        <div className="glass-panel dash-tile">
          <div className="dash-tile-icon dash-tile-icon--violet">
            <Calendar size={28} />
          </div>
          <div>
            <h3>{stats.upcomingEvents}</h3>
            <p className="subtitle">Published events</p>
          </div>
        </div>
        <div
          className="glass-panel dash-tile"
          style={{
            borderColor:
              stats.pendingAssignments > 0 ? "rgba(225, 29, 72, 0.2)" : undefined,
          }}
        >
          <div
            className={`dash-tile-icon ${stats.pendingAssignments > 0 ? "dash-tile-icon--rose" : "dash-tile-icon--green"}`}
          >
            <FileText size={28} />
          </div>
          <div>
            <h3>{stats.pendingAssignments}</h3>
            <p className="subtitle">Assignments to submit</p>
          </div>
        </div>
      </div>

      <div className="page-header dashboard-section">
        <div>
          <h2>Lost &amp; found</h2>
          <p className="subtitle">
            Browse campus listings and track your claims.
          </p>
        </div>
      </div>
      <div className="card-grid">
        <Link
          to="/student-dashboard/lost-found"
          className="glass-panel dash-tile dash-tile-link"
        >
          <div className="dash-tile-icon dash-tile-icon--amber">
            <Search size={28} />
          </div>
          <div>
            <h3>Hub</h3>
            <p className="subtitle">Introduction and next steps</p>
          </div>
        </Link>
        <Link
          to="/student-dashboard/lost-found/browse"
          className="glass-panel dash-tile dash-tile-link"
        >
          <div className="dash-tile-icon dash-tile-icon--violet">
            <Search size={28} />
          </div>
          <div>
            <h3>Browse listings</h3>
            <p className="subtitle">Search items reported to the desk</p>
          </div>
        </Link>
        <Link
          to="/student-dashboard/lost-found/my-claims"
          className="glass-panel dash-tile dash-tile-link"
        >
          <div className="dash-tile-icon dash-tile-icon--green">
            <FileText size={28} />
          </div>
          <div>
            <h3>My claims</h3>
            <p className="subtitle">Status and history</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default EStudentDashboard;

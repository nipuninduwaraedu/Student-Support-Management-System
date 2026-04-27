import { useState, useEffect } from "react";
import axios from "axios";
import {
  Plus,
  Trash2,
  Calendar as CalIcon,
  FileText,
  Download,
  Users,
} from "lucide-react";
import moment from "moment";

const EAdminAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    module: "",
    deadline: "",
  });

  // Submissions viewing logic
  const [viewingSubmissionsFor, setViewingSubmissionsFor] = useState(null);
  const [submissions, setSubmissions] = useState([]);

  const fetchAssignments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/assignments");
      setAssignments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/assignments", formData);
      setShowModal(false);
      setFormData({ title: "", description: "", module: "", deadline: "" });
      fetchAssignments();
    } catch (err) {
      alert(
        "Failed to create assignment: " +
          (err.response?.data?.msg || err.message),
      );
      console.error(err.response?.data || err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/assignments/${id}`);
      fetchAssignments();
    } catch (err) {
      alert("Failed to delete assignment");
    }
  };

  const viewSubmissions = async (assignmentId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/submissions/assignment/${assignmentId}`,
      );
      setSubmissions(res.data);
      setViewingSubmissionsFor(assignmentId);
    } catch (err) {
      alert("Failed to load submissions");
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1>Manage Assignments</h1>
          <p className="subtitle">
            Create assignments and view student submissions
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> New Assignment
        </button>
      </div>

      <div className="card-grid">
        {assignments.map((assignment) => (
          <div
            key={assignment._id}
            className="glass-panel"
            style={{
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "1rem",
              }}
            >
              <div>
                <span
                  style={{
                    background: "#eef2ff",
                    color: "var(--primary)",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "4px",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    display: "inline-block",
                    marginBottom: "0.5rem",
                  }}
                >
                  {assignment.module}
                </span>
                <h3>{assignment.title}</h3>
              </div>
            </div>
            <p className="subtitle" style={{ flex: 1, marginBottom: "1.5rem" }}>
              {assignment.description}
            </p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                color: "#DC2626",
                fontSize: "0.9rem",
                fontWeight: 500,
                marginBottom: "1.5rem",
              }}
            >
              <CalIcon size={16} /> Deadline:{" "}
              {moment(assignment.deadline).format("MMM Do YYYY")}
            </div>

            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                className="btn btn-secondary"
                style={{ flex: 1, padding: "0.5rem", fontSize: "0.9rem" }}
                onClick={() => viewSubmissions(assignment._id)}
              >
                <Users size={16} /> Submissions
              </button>
              <button
                className="btn btn-danger"
                style={{ padding: "0.5rem" }}
                onClick={() => handleDelete(assignment._id)}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Assignment Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in">
            <button className="close-btn" onClick={() => setShowModal(false)}>
              &times;
            </button>
            <h2 style={{ marginBottom: "1.5rem" }}>
              <FileText size={20} /> Create Assignment
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Chapter 5 Report"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label">Subject / Module</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Mathematics"
                  value={formData.module}
                  onChange={(e) =>
                    setFormData({ ...formData, module: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  required
                  className="form-textarea"
                  rows="3"
                  placeholder="Describe what students need to do..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                ></textarea>
              </div>
              <div className="form-group">
                <label className="form-label">Submission Deadline</label>
                <input
                  type="date"
                  required
                  className="form-input"
                  max={new Date().toISOString().split("T")[0]}
                  value={formData.deadline}
                  onChange={(e) =>
                    setFormData({ ...formData, deadline: e.target.value })
                  }
                />
              </div>
              <button type="submit" className="modal-submit-btn">
                <FileText size={16} /> Create Assignment
              </button>
            </form>
          </div>
        </div>
      )}

      {/* View Submissions Modal */}
      {viewingSubmissionsFor && (
        <div className="modal-overlay">
          <div
            className="modal-content animate-fade-in"
            style={{ maxWidth: "700px" }}
          >
            <button
              className="close-btn"
              onClick={() => setViewingSubmissionsFor(null)}
            >
              &times;
            </button>
            <h2 style={{ marginBottom: "1.5rem" }}>Student Submissions</h2>
            {submissions.length === 0 ? (
              <p className="subtitle">
                No submissions yet for this assignment.
              </p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    textAlign: "left",
                  }}
                >
                  <thead style={{ borderBottom: "2px solid var(--border)" }}>
                    <tr>
                      <th style={{ padding: "1rem 0.5rem" }}>Student Name</th>
                      <th style={{ padding: "1rem 0.5rem" }}>Email</th>
                      <th style={{ padding: "1rem 0.5rem" }}>Date Submitted</th>
                      <th style={{ padding: "1rem 0.5rem" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((sub) => (
                      <tr
                        key={sub._id}
                        style={{ borderBottom: "1px solid var(--border)" }}
                      >
                        <td style={{ padding: "1rem 0.5rem", fontWeight: 500 }}>
                          {sub.student?.name}
                        </td>
                        <td
                          style={{
                            padding: "1rem 0.5rem",
                            color: "var(--text-light)",
                          }}
                        >
                          {sub.student?.email}
                        </td>
                        <td style={{ padding: "1rem 0.5rem" }}>
                          {moment(sub.createdAt).format("MMM Do YYYY, h:mm a")}
                        </td>
                        <td style={{ padding: "1rem 0.5rem" }}>
                          <a
                            href={`http://localhost:5000${sub.pdfUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-secondary"
                            style={{
                              padding: "0.4rem 0.8rem",
                              fontSize: "0.85rem",
                            }}
                          >
                            <Download size={14} /> Open PDF
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default EAdminAssignments;

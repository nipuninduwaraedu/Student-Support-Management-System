import React, { useEffect, useState } from 'react';
import { getComplaints, updateComplaintStatus } from '../services/api';
import './CAdminDashboard.css';

const CAdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const data = await getComplaints();
      setComplaints(data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateComplaintStatus(id, newStatus);
      // Update local state
      setComplaints(complaints.map(c => c._id === id ? { ...c, status: newStatus } : c));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const filteredComplaints = complaints.filter(c => {
    if (filterType !== 'All' && c.type !== filterType) return false;
    if (filterStatus !== 'All' && c.status !== filterStatus) return false;
    return true;
  });

  if (loading) return <div className="loader">Loading...</div>;

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>Admin Dashboard</h2>
        <div className="filters">
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="All">All Types</option>
            <option value="Complaint">Complaints</option>
            <option value="Feedback">Feedback</option>
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Student</th>
              <th>ID</th>
              <th>Type - Category</th>
              <th>Message</th>
              <th>Attachment</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredComplaints.length === 0 ? (
              <tr>
                <td colSpan="8" className="empty-state">No Submissions Found</td>
              </tr>
            ) : (
              filteredComplaints.map(complaint => (
                <tr key={complaint._id}>
                  <td>{new Date(complaint.createdAt).toLocaleDateString()}</td>
                  <td>{complaint.studentName}<br/><small>{complaint.email}</small></td>
                  <td>{complaint.studentId}</td>
                  <td><span className={`badge ${complaint.type.toLowerCase()}`}>{complaint.type}</span><br/>{complaint.category}</td>
                  <td className="msg-cell">{complaint.message}</td>
                  <td>
                    {complaint.fileUrl ? (
                      <a href={`http://localhost:5000/uploads/${complaint.fileUrl.split(/[\\/]/).pop()}`} target="_blank" rel="noreferrer" className="link-btn">View</a>
                    ) : (
                      'None'
                    )}
                  </td>
                  <td>
                    <span className={`status-badge ${complaint.status.replace(' ', '-').toLowerCase()}`}>
                      {complaint.status}
                    </span>
                  </td>
                  <td>
                    <select 
                      className="status-select"
                      value={complaint.status}
                      onChange={(e) => handleStatusChange(complaint._id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CAdminDashboard;

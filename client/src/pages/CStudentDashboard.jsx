import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';
import './CStudentDashboard.css';

const CStudentDashboard = () => {
  const [notifications, setNotifications] = useState([]);
  const { token, user } = useContext(AuthContext);

  useEffect(() => {
    fetchNotifications();
  }, [token]);

  const fetchNotifications = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(data);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error('Failed to mark as read', error);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Welcome, {user?.name}</h2>
        <p>Your Notification Center</p>
      </div>

      <div className="notifications-list">
        <h3>Recent Updates</h3>
        {notifications.length === 0 ? (
          <div className="empty-state">No new notifications.</div>
        ) : (
          notifications.map(note => (
            <div key={note._id} className={`notification-card ${note.isRead ? 'read' : 'unread'}`}>
              <div className="notif-content">
                <p>{note.message}</p>
                <small>{new Date(note.createdAt).toLocaleString()}</small>
              </div>
              {!note.isRead && (
                <button className="mark-read-btn" onClick={() => markAsRead(note._id)}>
                  Mark as Read
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CStudentDashboard;

import React, { useState, useContext, useEffect } from 'react';
import { submitComplaint } from '../services/api';
import { AuthContext } from '../context/AuthContext.jsx';
import './CSubmitComplaint.css'; // Reuse CSS

const CSubmitFeedback = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    studentName: user?.name || '',
    studentId: user?.studentId || '',
    email: user?.email || '',
    type: 'Feedback',
    category: 'Academic', // default
    message: '',
  });
  const [file, setFile] = useState(null);
  const [statusMsg, setStatusMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMsg('');

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });
      if (file) {
        data.append('file', file);
      }

      await submitComplaint(data);
      setStatusMsg('Success: Thank you for your feedback!');
      setFormData({
        studentName: '',
        studentId: '',
        email: '',
        type: 'Feedback',
        category: 'Academic',
        message: '',
      });
      setFile(null);
      e.target.reset();
    } catch (error) {
      console.error(error);
      setStatusMsg('Error: Could not submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="submit-container">
      <div className="form-card feedback-card">
        <h2>Submit Feedback</h2>
        <p className="form-subtitle">Share your suggestions to help us improve</p>
        
        {statusMsg && (
          <div className={`status-msg ${statusMsg.startsWith('Success') ? 'success' : 'error'}`}>
            {statusMsg}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group half">
              <label>Student Name *</label>
              <input type="text" name="studentName" value={formData.studentName} onChange={handleChange} required />
            </div>
            
            <div className="form-group half">
              <label>Student ID *</label>
              <input type="text" name="studentId" value={formData.studentId} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label>Email Address *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            
            <div className="form-group half">
              <label>Relevant Area *</label>
              <select name="category" value={formData.category} onChange={handleChange} required>
                <option value="Academic">Academic</option>
                <option value="Facilities">Facilities</option>
                <option value="Administration">Administration</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Your Feedback/Suggestions *</label>
            <textarea name="message" rows="5" placeholder="Let us know what we can improve..." value={formData.message} onChange={handleChange} required></textarea>
          </div>

          <div className="form-group">
            <label>Upload Supporting File (Optional)</label>
            <input type="file" name="file" onChange={handleFileChange} />
          </div>

          <button type="submit" className="submit-btn feedback-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CSubmitFeedback;

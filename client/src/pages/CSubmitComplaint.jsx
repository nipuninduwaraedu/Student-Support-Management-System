import React, { useState, useContext, useEffect } from 'react';
import { submitComplaint } from '../services/api';
import { AuthContext } from '../context/AuthContext.jsx';
import './CSubmitComplaint.css';

const CSubmitComplaint = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    studentName: user?.name || '',
    studentId: user?.studentId || '',
    email: user?.email || '',
    type: 'Complaint',
    category: 'Academic',
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
      setStatusMsg('Success: Your complaint has been submitted!');
      setFormData({
        studentName: '',
        studentId: '',
        email: '',
        type: 'Complaint',
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
      <div className="form-card complaint-card">
        <h2>Submit a Complaint</h2>
        <p className="form-subtitle">Report university-related issues</p>
        
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
              <label>Category *</label>
              <select name="category" value={formData.category} onChange={handleChange} required>
                <option value="Academic">Academic</option>
                <option value="Facilities">Facilities</option>
                <option value="Administration">Administration</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Complaint Details *</label>
            <textarea name="message" rows="5" placeholder="Describe the issue in detail..." value={formData.message} onChange={handleChange} required></textarea>
          </div>

          <div className="form-group">
            <label>Upload Evidence (Images/Documents)</label>
            <input type="file" name="file" onChange={handleFileChange} />
          </div>

          <button type="submit" className="submit-btn complaint-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CSubmitComplaint;

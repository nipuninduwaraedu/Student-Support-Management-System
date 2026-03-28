import { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar as CalIcon, Upload, CheckCircle, AlertTriangle } from 'lucide-react';
import moment from 'moment';

const StudentAssignments = () => {
    const [assignments, setAssignments] = useState([]);
    const [submissions, setSubmissions] = useState({});
    const [uploadingId, setUploadingId] = useState(null);

    const fetchData = async () => {
        try {
            const [assigRes, subRes] = await Promise.all([
                axios.get('http://localhost:5000/api/assignments'),
                axios.get('http://localhost:5000/api/submissions/me')
            ]);
            setAssignments(assigRes.data);
            
            const subMap = {};
            subRes.data.forEach(sub => {
                subMap[sub.assignment._id] = sub;
            });
            setSubmissions(subMap);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleUpload = async (e, assignmentId) => {
        const file = e.target.files[0];
        if (!file || file.type !== 'application/pdf') {
            alert('Please select a valid PDF file');
            return;
        }

        setUploadingId(assignmentId);
        const data = new FormData();
        data.append('pdf', file);
        data.append('assignmentId', assignmentId);

        try {
            await axios.post('http://localhost:5000/api/submissions', data);
            await fetchData(); // refresh data
            alert('Submission successful!');
        } catch (err) {
            alert('Upload failed');
        } finally {
            setUploadingId(null);
        }
    };

    // Calculate urgency for notifications (e.g., less than 24 hours left, not submitted)
    const getUrgencyAlert = (assignment) => {
        const isSubmitted = !!submissions[assignment._id];
        if (isSubmitted) return null;

        const hoursLeft = moment(assignment.deadline).diff(moment(), 'hours');
        if (hoursLeft > 0 && hoursLeft <= 24) {
            return (
                <div style={{ background: '#FEF2F2', border: '1px solid #F87171', color: '#B91C1C', padding: '0.75rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.9rem', fontWeight: 500 }}>
                    <AlertTriangle size={16} /> Deadline is approaching! Less than 24 hours left to submit.
                </div>
            );
        } else if (hoursLeft < 0) {
            return (
                <div style={{ background: '#F3F4F6', border: '1px solid #D1D5DB', color: '#4B5563', padding: '0.75rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.9rem', fontWeight: 500 }}>
                    <AlertTriangle size={16} /> Deadline passed.
                </div>
            );
        }
        return null;
    };

    return (
        <div className="animate-fade-in">
            <div className="page-header">
                <div>
                    <h1>My Assignments</h1>
                    <p className="subtitle">View and submit your course assignments (PDF only)</p>
                </div>
            </div>

            <div className="card-grid">
                {assignments.map(assignment => {
                    const submission = submissions[assignment._id];
                    const isSubmitted = !!submission;
                    
                    return (
                        <div key={assignment._id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                            {getUrgencyAlert(assignment)}
                        
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <div>
                                    <span style={{ background: '#eef2ff', color: 'var(--primary)', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600, display: 'inline-block', marginBottom: '0.5rem' }}>{assignment.module}</span>
                                    <h3 style={{ marginBottom: '0.25rem' }}>{assignment.title}</h3>
                                </div>
                                {isSubmitted && (
                                    <span style={{ background: '#ECFDF5', color: '#059669', padding: '0.25rem 0.5rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <CheckCircle size={14} /> Submitted
                                    </span>
                                )}
                            </div>
                            
                            <p className="subtitle" style={{ flex: 1, marginBottom: '1.5rem', lineHeight: '1.5' }}>{assignment.description}</p>
                            
                            <div style={{ padding: '0.75rem', borderRadius: '8px', background: isSubmitted ? '#f9fafb' : '#fff1f2', border: isSubmitted ? '1px solid #e5e7eb' : '1px solid #fecdd3', fontSize: '0.85rem', marginBottom: '1.5rem', fontWeight: 500, color: isSubmitted ? 'var(--text-light)' : '#E11D48' }}>
                                Deadline: {moment(assignment.deadline).format('MMMM Do YYYY')}
                            </div>

                            {isSubmitted ? (
                                <a href={`http://localhost:5000${submission.pdfUrl}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ width: '100%' }}>
                                    View Uploaded Submission
                                </a>
                            ) : (
                                <div>
                                    <label className="btn btn-primary" style={{ width: '100%', cursor: 'pointer', opacity: uploadingId === assignment._id ? 0.7 : 1 }}>
                                        <Upload size={18} /> {uploadingId === assignment._id ? 'Uploading...' : 'Upload PDF'}
                                        <input 
                                            type="file" 
                                            accept="application/pdf" 
                                            style={{ display: 'none' }} 
                                            onChange={(e) => handleUpload(e, assignment._id)}
                                            disabled={uploadingId === assignment._id}
                                        />
                                    </label>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            {assignments.length === 0 && <p className="subtitle">No assignments posted yet.</p>}
        </div>
    );
};
export default StudentAssignments;

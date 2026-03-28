import { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, FileText } from 'lucide-react';

const StudentDashboard = () => {
    const [stats, setStats] = useState({ upcomingEvents: 0, pendingAssignments: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [eventsRes, assignmentsRes, submissionsRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/events'),
                    axios.get('http://localhost:5000/api/assignments'),
                    axios.get('http://localhost:5000/api/submissions/me')
                ]);

                const submittedIds = submissionsRes.data.map(sub => sub.assignment._id);
                const pending = assignmentsRes.data.filter(a => !submittedIds.includes(a._id));

                setStats({
                    upcomingEvents: eventsRes.data.length,
                    pendingAssignments: pending.length
                });
            } catch (err) {
                console.error('Failed to fetch stats');
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="animate-fade-in">
            <div className="page-header">
                <div>
                    <h1>Student Dashboard</h1>
                    <p className="subtitle">Your overview and pending tasks</p>
                </div>
            </div>
            
            <div className="card-grid">
                <div className="glass-panel" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ background: '#eef2ff', padding: '1rem', borderRadius: '50%', color: 'var(--primary)' }}>
                        <Calendar size={32} />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '2rem' }}>{stats.upcomingEvents}</h3>
                        <p className="subtitle">Upcoming Events</p>
                    </div>
                </div>
                <div className="glass-panel" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', background: stats.pendingAssignments > 0 ? '#fff1f2' : 'var(--surface)' }}>
                    <div style={{ background: stats.pendingAssignments > 0 ? '#ffe4e6' : '#ecfdf5', padding: '1rem', borderRadius: '50%', color: stats.pendingAssignments > 0 ? '#E11D48' : 'var(--secondary)' }}>
                        <FileText size={32} />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '2rem' }}>{stats.pendingAssignments}</h3>
                        <p className="subtitle">Pending Assignments</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default StudentDashboard;

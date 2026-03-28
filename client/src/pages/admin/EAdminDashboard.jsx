import { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, FileText, CheckCircle } from 'lucide-react';

const EAdminDashboard = () => {
    const [stats, setStats] = useState({ events: 0, assignments: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [eventsRes, assignmentsRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/events'),
                    axios.get('http://localhost:5000/api/assignments')
                ]);
                setStats({
                    events: eventsRes.data.length,
                    assignments: assignmentsRes.data.length
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
                    <h1>Admin Dashboard</h1>
                    <p className="subtitle">Overview of the system</p>
                </div>
            </div>
            
            <div className="card-grid">
                <div className="glass-panel" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ background: '#eef2ff', padding: '1rem', borderRadius: '50%', color: 'var(--primary)' }}>
                        <Calendar size={32} />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '2rem' }}>{stats.events}</h3>
                        <p className="subtitle">Total Events</p>
                    </div>
                </div>
                <div className="glass-panel" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ background: '#ecfdf5', padding: '1rem', borderRadius: '50%', color: 'var(--secondary)' }}>
                        <FileText size={32} />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '2rem' }}>{stats.assignments}</h3>
                        <p className="subtitle">Total Assignments</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default EAdminDashboard;

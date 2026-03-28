import { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar as CalIcon, Clock } from 'lucide-react';
import moment from 'moment';

const StudentEvents = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/events');
                setEvents(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchEvents();
    }, []);

    return (
        <div className="animate-fade-in">
            <div className="page-header">
                <div>
                    <h1>Campus Events</h1>
                    <p className="subtitle">Discover what's happening on campus</p>
                </div>
            </div>

            <div className="card-grid">
                {events.map(event => (
                    <div key={event._id} className="glass-panel event-card">
                        <img src={`http://localhost:5000${event.imageUrl}`} alt={event.title} className="event-img" onError={(e) => { e.target.src = 'https://via.placeholder.com/300x180?text=No+Image'; }} />
                        <div className="event-content">
                            <h3 style={{ marginBottom: '0.5rem' }}>{event.title}</h3>
                            <p className="subtitle" style={{ flex: 1, marginBottom: '1rem' }}>{event.description}</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-light)', background: '#f9fafb', padding: '0.75rem', borderRadius: '8px' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><CalIcon size={14} /> {moment(event.date).format('MMM Do YYYY')}</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={14} /> {event.time}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {events.length === 0 && <p className="subtitle">No upcoming events right now.</p>}
        </div>
    );
};
export default StudentEvents;

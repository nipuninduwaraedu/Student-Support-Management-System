import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { MapPin, Calendar, CheckCircle } from 'lucide-react';

const ItemDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/items/${id}`);
        setItem(data);
      } catch (err) {
        setError('Item not found or an error occurred.');
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  if (loading) return <div className="text-center mt-8">Loading item details...</div>;
  if (error || !item) return <div className="text-center mt-8 text-danger">{error}</div>;

  const imageUrl = item.image 
    ? (item.image.startsWith('/uploads') ? `http://localhost:5000${item.image}` : item.image) 
    : 'https://via.placeholder.com/800x400?text=No+Image+Available';

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Link to="/items" className="text-muted" style={{ display: 'inline-block', marginBottom: '1.5rem', fontWeight: 500 }}>
        &larr; Back to Lost Items
      </Link>
      <div className="card overflow-hidden">
        <img 
          src={imageUrl} 
          alt={item.name} 
          style={{ width: '100%', height: '400px', objectFit: 'cover', background: '#f3f4f6' }} 
        />
        <div className="card-body" style={{ padding: '2rem' }}>
          <div className="flex justify-between items-start mb-4">
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0, lineHeight: 1.2 }}>{item.name}</h1>
            <span className={`badge badge-${item.status.toLowerCase()}`} style={{ fontSize: '1rem', padding: '0.4rem 1rem' }}>
              {item.status}
            </span>
          </div>

          <div className="flex gap-4 mb-6 text-muted">
            <div className="flex items-center gap-2">
              <Calendar size={20} />
              <span>{new Date(item.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={20} />
              <span>{item.location}</span>
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Description</h3>
            <p style={{ fontSize: '1.125rem', lineHeight: 1.6, color: 'var(--text-main)' }}>{item.description}</p>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '2rem 0' }} />

          <div className="flex justify-between items-center">
            <p className="text-muted">Do you think this belongs to you?</p>
            {item.status === 'Available' ? (
              user ? (
                user.role === 'Student' ? (
                  <Link to={`/items/${item._id}/claim`} className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1.125rem' }}>
                    Claim This Item
                  </Link>
                ) : (
                  <button disabled className="btn btn-outline" title="Admins cannot submit claims">
                    Admin Account
                  </button>
                )
              ) : (
                <Link to="/login" className="btn btn-primary">Login to Claim</Link>
              )
            ) : (
              <div className="flex items-center gap-2 text-success" style={{ color: 'var(--success)', fontWeight: 600 }}>
                <CheckCircle size={20} />
                Item has been claimed
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;

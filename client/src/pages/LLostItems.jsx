import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LF } from '../constants/lostFoundRoutes';
import axios from 'axios';
import { Search } from 'lucide-react';

const LostItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/items');
        setItems(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.location.toLowerCase().includes(searchTerm.toLowerCase()) // Filter by name or venue
  );

  if (loading) return <div className="text-center mt-8">Loading items...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Lost Items Database</h1>
        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            className="form-input" 
            placeholder="Search by name or location..." 
            style={{ paddingLeft: '2.5rem' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-12 text-muted">No available items found matching your search.</div>
      ) : (
        <div className="grid grid-cols-3">
          {filteredItems.map(item => {
            const imageUrl = item.image 
              ? (item.image.startsWith('/uploads') ? `http://localhost:5000${item.image}` : item.image) 
              : 'https://via.placeholder.com/400x200?text=No+Image';
            return (
              <div key={item._id} className="card">
                <img src={imageUrl} alt={item.name} className="card-img" />
                <div className="card-body">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="card-title" style={{ marginBottom: 0 }}>{item.name}</h3>
                    <span className="badge badge-available">Available</span>
                  </div>
                  <p className="card-text text-muted" style={{ fontSize: '0.875rem' }}>
                    <strong>Location:</strong> {item.location} <br/>
                    <strong>Date:</strong> {new Date(item.date).toLocaleDateString()}
                  </p>
                  <Link to={LF.item(item._id)} className="btn btn-outline w-full" style={{ marginTop: '0.5rem' }}>
                    View Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LostItems;

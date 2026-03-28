import { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusCircle, CheckCircle, XCircle } from 'lucide-react';

const AdminDashboard = () => {
  const [claims, setClaims] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', description: '', location: '', date: '' });
  const [imageFile, setImageFile] = useState(null);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [claimsRes, itemsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/claims'),
        axios.get('http://localhost:5000/api/items/all')
      ]);
      setClaims(claimsRes.data);
      setItems(itemsRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      const formData = new FormData();
      formData.append('name', newItem.name);
      formData.append('description', newItem.description);
      formData.append('location', newItem.location);
      formData.append('date', newItem.date);
      if (imageFile) {
        formData.append('imageFile', imageFile);
      }

      await axios.post('http://localhost:5000/api/items', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setShowAddForm(false);
      setNewItem({ name: '', description: '', location: '', date: '' });
      setImageFile(null);
      fetchData();
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        setFormError(error.response.data.errors.map(err => err.msg).join(', '));
      } else {
        setFormError(error.response?.data?.message || 'Error adding item');
      }
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this lost item?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/items/${itemId}`);
      fetchData();
    } catch (error) {
      alert('Error deleting item');
    }
  };

  const handleClaimAction = async (claimId, status) => {
    try {
      await axios.put(`http://localhost:5000/api/claims/${claimId}/status`, { status });
      fetchData();
    } catch (error) {
      alert('Error updating claim');
    }
  };

  if (loading) return <div className="text-center mt-8">Loading dashboard...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Admin Dashboard</h1>
        <button onClick={() => setShowAddForm(!showAddForm)} className="btn btn-primary">
          <PlusCircle size={18} /> Add Lost Item
        </button>
      </div>

      {showAddForm && (
        <div className="card card-body mb-8" style={{ borderTop: '4px solid var(--primary)' }}>
          <h2 className="mb-4" style={{ fontSize: '1.25rem', fontWeight: 700 }}>Report a New Lost Item</h2>
          {formError && <div className="alert alert-error mb-4">{formError}</div>}
          <form onSubmit={handleAddItem} className="grid grid-cols-2 gap-4">
            <div className="form-group mb-0">
              <label className="form-label">Item Name</label>
              <input type="text" className="form-input" required value={newItem.name} onChange={(e) => setNewItem({...newItem, name: e.target.value})} />
            </div>
            <div className="form-group mb-0">
              <label className="form-label">Date Lost/Found</label>
              <input type="date" className="form-input" required value={newItem.date} onChange={(e) => setNewItem({...newItem, date: e.target.value})} />
            </div>
            <div className="form-group mb-0">
              <label className="form-label">Location</label>
              <input type="text" className="form-input" required value={newItem.location} onChange={(e) => setNewItem({...newItem, location: e.target.value})} />
            </div>
            <div className="form-group mb-0">
              <label className="form-label">Upload Image (from PC)</label>
              <input type="file" className="form-input" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
            </div>
            <div className="form-group mb-0" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Description</label>
              <textarea className="form-input" required rows="3" value={newItem.description} onChange={(e) => setNewItem({...newItem, description: e.target.value})}></textarea>
            </div>
            <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button type="button" onClick={() => setShowAddForm(false)} className="btn btn-outline">Cancel</button>
              <button type="submit" className="btn btn-primary">Save Item</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-2 gap-8">
        <div>
          <h2 className="mb-4" style={{ fontSize: '1.5rem', fontWeight: 700 }}>Recent Claims</h2>
          {claims.length === 0 ? (
            <p className="text-muted">No claims to review currently.</p>
          ) : (
            <div className="flex flex-col gap-4" style={{ display: 'flex', flexDirection: 'column' }}>
              {claims.map(claim => (
                <div key={claim._id} className="card card-body">
                  <div className="flex justify-between items-center mb-2">
                    <h3 style={{ fontWeight: 600 }}>{claim.item?.name || 'Deleted Item'}</h3>
                    <span className={`badge badge-${claim.status.toLowerCase()}`}>{claim.status}</span>
                  </div>
                  <p className="text-muted mb-2" style={{ fontSize: '0.875rem' }}>Claimed by: {claim.studentName} ({claim.contactDetails})</p>
                  <div className="mb-4" style={{ padding: '0.75rem', background: '#f3f4f6', borderRadius: '0.375rem', fontSize: '0.875rem', wordBreak: 'break-word' }}>
                    <strong>Proof:</strong> 
                    {claim.proof.includes('/uploads/') ? (
                      <div>
                        {claim.proof.split(' - ')[1]} <br/>
                        <a href={`http://localhost:5000${claim.proof.split(' - ')[0].replace('[File Proof]: ', '')}`} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>View Uploaded Proof</a>
                      </div>
                    ) : (
                      claim.proof
                    )}
                  </div>
                  {claim.status === 'Pending' && (
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => handleClaimAction(claim._id, 'Rejected')} className="btn btn-danger" style={{ padding: '0.4rem 0.75rem', fontSize: '0.875rem' }}>
                        <XCircle size={16} /> Reject
                      </button>
                      <button onClick={() => handleClaimAction(claim._id, 'Approved')} className="btn btn-success" style={{ padding: '0.4rem 0.75rem', fontSize: '0.875rem' }}>
                        <CheckCircle size={16} /> Approve
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="mb-4" style={{ fontSize: '1.5rem', fontWeight: 700 }}>All Reported Items</h2>
          {items.length === 0 ? (
            <p className="text-muted">No items reported.</p>
          ) : (
            <div className="flex flex-col gap-4" style={{ display: 'flex', flexDirection: 'column' }}>
              {items.map(item => (
                <div key={item._id} className="card card-body flex items-center justify-between" style={{ padding: '1rem' }}>
                  <div className="flex items-center gap-4">
                    {item.image && (
                      <img 
                        src={item.image.startsWith('/uploads') ? `http://localhost:5000${item.image}` : item.image} 
                        alt="item" 
                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                    )}
                    <div>
                      <h3 style={{ fontWeight: 600 }}>{item.name}</h3>
                      <p className="text-muted" style={{ fontSize: '0.875rem' }}>{new Date(item.date).toLocaleDateString()} - {item.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`badge badge-${item.status.toLowerCase()}`}>{item.status}</span>
                    <button onClick={() => handleDeleteItem(item._id)} className="btn btn-danger" style={{ padding: '0.4rem 0.75rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <XCircle size={16} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

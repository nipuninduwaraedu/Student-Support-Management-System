import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import { LF } from '../constants/lostFoundRoutes';

const ClaimSubmission = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [item, setItem] = useState(null);
  const [formData, setFormData] = useState({ studentName: user?.name || '', contactDetails: user?.email || '', proof: '' });
  const [proofFile, setProofFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/items/${id}`);
        if (data.status !== 'Available') {
          setError('This item is no longer available for claiming.');
        }
        setItem(data);
      } catch (err) {
        setError('Failed to load item details.');
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const form = new FormData();
      form.append('itemId', id);
      form.append('studentName', formData.studentName);
      form.append('contactDetails', formData.contactDetails);
      form.append('proof', formData.proof);
      if (proofFile) {
        form.append('proofFile', proofFile);
      }

      await axios.post('http://localhost:5000/api/claims', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate(LF.myClaims);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        setError(err.response.data.errors.map(e => e.msg).join(', '));
      } else {
        setError(err.response?.data?.message || 'Error submitting claim. Please try again.');
      }
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <Link to={`/items/${id}`} className="text-muted" style={{ display: 'inline-block', marginBottom: '1.5rem', fontWeight: 500 }}>
        &larr; Back to Item
      </Link>
      
      <div className="card card-body">
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Submit a Claim</h1>
        <p className="text-muted mb-6">
          You are claiming: <strong>{item?.name}</strong>. Please provide details and proof of ownership.
        </p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input 
              type="text" 
              className="form-input" 
              value={formData.studentName} 
              onChange={(e) => setFormData({...formData, studentName: e.target.value})} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Contact Details (Email/Phone)</label>
            <input 
              type="text" 
              className="form-input" 
              value={formData.contactDetails} 
              onChange={(e) => setFormData({...formData, contactDetails: e.target.value})} 
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Upload Picture Proof (from PC)</label>
            <input 
              type="file" 
              accept="image/*"
              className="form-input" 
              onChange={(e) => setProofFile(e.target.files[0])} 
            />
            <p className="text-muted mt-1" style={{ fontSize: '0.75rem' }}>Upload an image of you using the item, a receipt, or other picture proof.</p>
          </div>

          <div className="form-group">
            <label className="form-label">Additional Proof or Description</label>
            <textarea 
              className="form-input" 
              rows="4"
              value={formData.proof} 
              onChange={(e) => setFormData({...formData, proof: e.target.value})} 
              placeholder="E.g. The backpack has a small tear on the right strap..."
            ></textarea>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <Link to={LF.item(id)} className="btn btn-outline" disabled={submitting}>Cancel</Link>
            <button type="submit" className="btn btn-primary" disabled={submitting || item?.status !== 'Available'}>
              {submitting ? 'Submitting...' : 'Submit Claim'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClaimSubmission;

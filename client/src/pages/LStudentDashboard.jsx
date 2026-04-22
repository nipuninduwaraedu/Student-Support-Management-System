import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import { LF } from '../constants/lostFoundRoutes';
import { Edit2, Trash2 } from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [myClaims, setMyClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit State
  const [editingClaimId, setEditingClaimId] = useState(null);
  const [editForm, setEditForm] = useState({ studentName: '', contactDetails: '', proof: '' });
  const [editFile, setEditFile] = useState(null);
  const [editError, setEditError] = useState('');

  const fetchClaims = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/claims/my-claims');
      setMyClaims(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const handleDeleteClaim = async (claimId) => {
    if (!window.confirm('Are you sure you want to delete this claim?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/claims/${claimId}`);
      fetchClaims();
    } catch (error) {
      alert('Error deleting claim');
    }
  };

  const startEdit = (claim) => {
    setEditingClaimId(claim._id);
    let proofText = claim.proof;
    // Clean up file link prefix for editing the text part
    if (proofText.includes('[File Proof]:')) {
      const parts = proofText.split(' - ');
      proofText = parts.length > 1 ? parts.slice(1).join(' - ') : '';
    }
    setEditForm({ studentName: claim.studentName, contactDetails: claim.contactDetails, proof: proofText });
    setEditFile(null);
    setEditError('');
  };

  const handleUpdateClaim = async (e, claimId) => {
    e.preventDefault();
    setEditError('');
    try {
      const formData = new FormData();
      formData.append('studentName', editForm.studentName);
      formData.append('contactDetails', editForm.contactDetails);
      formData.append('proof', editForm.proof);
      if (editFile) {
        formData.append('proofFile', editFile);
      }

      await axios.put(`http://localhost:5000/api/claims/${claimId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setEditingClaimId(null);
      fetchClaims();
    } catch (error) {
      setEditError(error.response?.data?.message || 'Error updating claim');
    }
  };

  if (loading) return <div className="text-center mt-8">Loading dashboard...</div>;

  return (
    <div>
      <h1 className="mb-2" style={{ fontSize: '2rem', fontWeight: 700 }}>Hello, {user?.name}</h1>
      <p className="text-muted mb-8 text-lg">Track your submitted claims here.</p>
      
      <div className="card card-body mb-8 flex justify-between items-center" style={{ background: 'var(--primary)', color: 'white' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'white' }}>Lost something?</h2>
          <p style={{ opacity: 0.9 }}>Browse the list of reported items and claim yours.</p>
        </div>
        <Link to={LF.browse} className="btn" style={{ background: 'white', color: 'var(--primary)' }}>Browse Items</Link>
      </div>

      <h2 className="mb-4" style={{ fontSize: '1.5rem', fontWeight: 700 }}>My Claims</h2>
      {myClaims.length === 0 ? (
        <div className="text-center py-8" style={{ border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-lg)' }}>
          <p className="text-muted mb-4">You haven't made any claims yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {myClaims.map(claim => (
            <div key={claim._id} className="card card-body">
              <div className="flex justify-between items-center mb-2">
                <Link to={claim.item?._id ? LF.item(claim.item._id) : LF.browse} style={{ fontWeight: 600, color: 'var(--primary)' }}>
                  {claim.item?.name || 'Unknown Item'}
                </Link>
                <span className={`badge badge-${claim.status.toLowerCase()}`}>{claim.status}</span>
              </div>
              
              {editingClaimId === claim._id ? (
                <form onSubmit={(e) => handleUpdateClaim(e, claim._id)} className="mt-4" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                  <h4 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Edit Claim</h4>
                  {editError && <div className="text-danger mb-2 text-sm">{editError}</div>}
                  <div className="form-group mb-2">
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Name</label>
                    <input type="text" className="form-input" value={editForm.studentName} onChange={(e) => setEditForm({...editForm, studentName: e.target.value})} required />
                  </div>
                  <div className="form-group mb-2">
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Contact</label>
                    <input type="text" className="form-input" value={editForm.contactDetails} onChange={(e) => setEditForm({...editForm, contactDetails: e.target.value})} required />
                  </div>
                  <div className="form-group mb-2">
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>New Proof Image (Optional)</label>
                    <input type="file" className="form-input" accept="image/*" onChange={(e) => setEditFile(e.target.files[0])} />
                  </div>
                  <div className="form-group mb-4">
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Proof Details</label>
                    <textarea className="form-input" rows="2" value={editForm.proof} onChange={(e) => setEditForm({...editForm, proof: e.target.value})} />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button type="button" onClick={() => setEditingClaimId(null)} className="btn btn-outline" style={{ padding: '0.3rem 0.6rem', fontSize: '0.875rem' }}>Cancel</button>
                    <button type="submit" className="btn btn-primary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.875rem' }}>Save Changes</button>
                  </div>
                </form>
              ) : (
                <>
                  <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    Submitted on: {new Date(claim.createdAt).toLocaleDateString()}
                  </p>
                  <div style={{ padding: '0.5rem', background: '#f9fafb', borderRadius: '0.375rem', fontSize: '0.875rem', wordBreak: 'break-word', marginBottom: '1rem' }}>
                    <strong>Your Proof:</strong> <br />
                    {claim.proof.includes('/uploads/') ? (
                      <div>
                        <a href={`http://localhost:5000${claim.proof.split(' - ')[0].replace('[File Proof]: ', '')}`} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline', marginBottom: '0.5rem', display: 'inline-block' }}>View Uploaded Image</a>
                        <br />
                        {claim.proof.split(' - ').slice(1).join(' - ')}
                      </div>
                    ) : (
                      claim.proof
                    )}
                  </div>

                  {claim.status === 'Pending' && (
                    <div className="flex gap-2 justify-end" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                      <button onClick={() => startEdit(claim)} className="btn btn-outline" style={{ padding: '0.4rem 0.75rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Edit2 size={16} /> Edit
                      </button>
                      <button onClick={() => handleDeleteClaim(claim._id)} className="btn btn-danger" style={{ padding: '0.4rem 0.75rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;

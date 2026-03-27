import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Student' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/register', formData);
      login(data.user, data.token);
      
      if (data.user.role === 'Admin') navigate('/admin');
      else navigate('/student');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        setError(err.response.data.errors.map(e => e.msg).join(', '));
      } else {
        setError(err.response?.data?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Create Account</h2>
      {error && <div className="alert alert-error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input type="text" name="name" className="form-input" value={formData.name} onChange={handleChange} required placeholder="John Doe" />
        </div>
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input type="email" name="email" className="form-input" value={formData.email} onChange={handleChange} required placeholder="john@example.com" />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input type="password" name="password" className="form-input" value={formData.password} onChange={handleChange} required minLength="6" placeholder="••••••••" />
        </div>
        <div className="form-group">
          <label className="form-label">Account Type</label>
          <select name="role" className="form-input" value={formData.role} onChange={handleChange}>
            <option value="Student">Student</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary w-full" disabled={loading}>
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>
      <p className="text-center mt-4 text-muted" style={{ fontSize: '0.875rem' }}>
        Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Log in</Link>
      </p>
    </div>
  );
};

export default Register;

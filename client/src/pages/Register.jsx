import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, Navigate } from 'react-router-dom';

const Register = () => {
    const { register, user, loading } = useContext(AuthContext);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
    const [error, setError] = useState('');

    if (loading) return null;
    if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/student'} replace />;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData.name, formData.email, formData.password, formData.role);
        } catch (err) {
            setError(err.response?.data?.msg || 'Registration failed');
        }
    };

    return (
        <div className="auth-container">
            <div className="glass-panel auth-card animate-fade-in" style={{ maxWidth: '450px' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>Create Account</h2>
                    <p className="subtitle">Join the Student Support System</p>
                </div>
                {error && <div style={{ color: 'white', background: '#EF4444', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input type="text" required className="form-input" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input type="email" required className="form-input" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input type="password" required className="form-input" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Are you an Admin or Student?</label>
                        <select className="form-select" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
                            <option value="student">Student</option>
                            <option value="admin">System Admin</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Create Account</button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-light)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Login here</Link>
                </p>
            </div>
        </div>
    );
};
export default Register;

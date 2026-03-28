import { useContext } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, Calendar, FileText, LogOut } from 'lucide-react';

const Layout = () => {
    const { user: authUser, loading, logout } = useContext(AuthContext);
    const location = useLocation();

    if (loading) return <div className="auth-container">Loading...</div>;
    
    // Provide a mock user if not logged in, as login pages were removed
    const user = authUser || { name: 'Guest User', role: 'admin' };

    const adminItems = [
        { path: '/admin', label: 'Admin Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/admin/events', label: 'Admin Events', icon: <Calendar size={20} /> },
        { path: '/admin/assignments', label: 'Admin Assignments', icon: <FileText size={20} /> }
    ];

    const studentItems = [
        { path: '/student', label: 'Student Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/student/events', label: 'Student Events', icon: <Calendar size={20} /> },
        { path: '/student/assignments', label: 'Student Assignments', icon: <FileText size={20} /> }
    ];

    const navItems = user.role === 'admin' ? adminItems : studentItems;

    return (
        <div className="app-container">
            <aside className="sidebar">
                <div className="sidebar-logo">
                    🎓 Support System
                </div>
                <nav style={{ flex: 1 }}>
                    <div style={{ padding: '0 1rem', marginBottom: '0.5rem', fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 600, textTransform: 'uppercase' }}>
                        {user.role === 'admin' ? 'Admin Portal' : 'Student Portal'}
                    </div>
                    {navItems.map(item => (
                        <Link 
                            key={item.path} 
                            to={item.path} 
                            className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                    
                    <div style={{ marginTop: '2rem', padding: '0 1rem', marginBottom: '0.5rem', fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 600, textTransform: 'uppercase' }}>
                        Switch View (Debug)
                    </div>
                    <Link to="/admin" className="nav-link" style={{ fontSize: '0.8rem' }}>Admin View</Link>
                    <Link to="/student" className="nav-link" style={{ fontSize: '0.8rem' }}>Student View</Link>
                </nav>
                <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                    <div style={{ padding: '0 1rem', marginBottom: '1rem', color: 'var(--text-light)', fontSize: '0.9rem' }}>
                        Active Role: <strong>{user.role}</strong>
                    </div>
                    {authUser && (
                        <button onClick={logout} className="nav-link" style={{ width: '100%', textAlign: 'left', color: '#EF4444' }}>
                            <span className="nav-icon"><LogOut size={20} /></span>
                            Logout
                        </button>
                    )}
                </div>
            </aside>
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};
export default Layout;

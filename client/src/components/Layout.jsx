import { useContext } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, Calendar, FileText, LogOut } from 'lucide-react';

const Layout = () => {
    const { user, loading, logout } = useContext(AuthContext);
    const location = useLocation();

    if (loading) return <div className="auth-container">Loading...</div>;
    if (!user) return <Navigate to="/login" replace />;

    const navItems = user.role === 'admin' 
        ? [
            { path: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
            { path: '/admin/events', label: 'Events', icon: <Calendar size={20} /> },
            { path: '/admin/assignments', label: 'Assignments', icon: <FileText size={20} /> }
        ]
        : [
            { path: '/student', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
            { path: '/student/events', label: 'Events', icon: <Calendar size={20} /> },
            { path: '/student/assignments', label: 'Assignments', icon: <FileText size={20} /> }
        ];

    return (
        <div className="app-container">
            <aside className="sidebar">
                <div className="sidebar-logo">
                    🎓 Support System
                </div>
                <nav style={{ flex: 1 }}>
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
                </nav>
                <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                    <div style={{ padding: '0 1rem', marginBottom: '1rem', color: 'var(--text-light)', fontSize: '0.9rem' }}>
                        Logged in as: <br /><strong>{user.name}</strong>
                    </div>
                    <button onClick={logout} className="nav-link" style={{ width: '100%', textAlign: 'left', color: '#EF4444' }}>
                        <span className="nav-icon"><LogOut size={20} /></span>
                        Logout
                    </button>
                </div>
            </aside>
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};
export default Layout;

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        <Search size={28} />
        Lost & Found
      </Link>
      <div className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/items" className="nav-link">Lost Items</Link>
        {user ? (
          <>
            <Link to={user.role === 'Admin' ? '/admin' : '/student'} className="nav-link">
              Dashboard
            </Link>
            <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>
              Logout
            </button>
          </>
        ) : null}
      <div className="navbar-container">
        <h1 className="navbar-logo">Student Support</h1>
        <ul className="nav-menu">
          {user ? (
            <>
              {user.role === 'Student' && (
                <>
                  <li className="nav-item">
                    <NavLink to="/dashboard" className={({ isActive }) => "nav-links" + (isActive ? " active" : "")}>
                      Dashboard
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/complaint" className={({ isActive }) => "nav-links" + (isActive ? " active" : "")}>
                      Complaints
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/feedback" className={({ isActive }) => "nav-links" + (isActive ? " active" : "")}>
                      Feedback
                    </NavLink>
                  </li>
                </>
              )}

              {user.role === 'Admin' && (
                <li className="nav-item">
                  <NavLink to="/admin" className={({ isActive }) => "nav-links" + (isActive ? " active" : "")}>
                    Admin Panel
                  </NavLink>
                </li>
              )}

              <li className="nav-item">
                <button onClick={handleLogout} className="nav-links logout-btn">Logout</button>
              </li>
            </>
          ) : null}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

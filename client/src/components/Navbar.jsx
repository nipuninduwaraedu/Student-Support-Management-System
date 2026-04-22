import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="navbar-logo">Student Support</h1>
        <ul className="nav-menu">
          {user ? (
            <>
              {user.role === "student" && (
                <>
                  <li className="nav-item">
                    <NavLink
                      to="/student-dashboard"
                      className={({ isActive }) =>
                        "nav-links" + (isActive ? " active" : "")
                      }
                    >
                      Dashboard
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      to="/student-dashboard/complaints/new"
                      className={({ isActive }) =>
                        "nav-links" + (isActive ? " active" : "")
                      }
                    >
                      Complaints
                    </NavLink>
                  </li>
                </>
              )}

              {user.role === "admin" && (
                <li className="nav-item">
                  <NavLink
                    to="/admin-dashboard"
                    className={({ isActive }) =>
                      "nav-links" + (isActive ? " active" : "")
                    }
                  >
                    Admin Panel
                  </NavLink>
                </li>
              )}

              <li className="nav-item">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="nav-links logout-btn"
                >
                  Logout
                </button>
              </li>
            </>
          ) : null}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

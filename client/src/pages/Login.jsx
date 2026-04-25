import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { AuthContext } from "../context/AuthContext.jsx";
import "../styles/auth.css";

const getDashboardRouteByRole = (role) =>
  role === "admin" ? "/admin-dashboard" : "/student-dashboard";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await loginUser(form);
      login(res.data);
      navigate(getDashboardRouteByRole(res.data?.user?.role));
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="auth-layout">
      <section className="auth-hero" aria-labelledby="login-hero-title">
        <span className="auth-hero-badge">Official campus portal</span>
        <h1 id="login-hero-title">Student Support Hub</h1>
        <p className="auth-hero-lead">
          File complaints and feedback, follow events and deadlines, and use
          lost &amp; found—one desk for the whole campus.
        </p>
        <ul className="auth-hero-list">
          <li>Track requests from start to finish</li>
          <li>One place for announcements and due dates</li>
          <li>Report or claim items with a clear process</li>
        </ul>
      </section>

      <div className="auth-panel-wrap">
        <section className="auth-card" aria-labelledby="login-card-title">
          <header className="auth-card-intro">
            <h2 id="login-card-title" className="auth-card-title">
              Welcome back
            </h2>
            <p className="auth-card-sub">
              Sign in with your <strong>university email</strong>. We open the
              right workspace for students or support staff.
            </p>
          </header>

          <form className="auth-form auth-form--login" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label htmlFor="login-email">Email</label>
              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="username"
                placeholder="Enter your Emaill"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="auth-field">
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            {error && <p className="error">{error}</p>}

            <button className="btn" type="submit">
              Sign in securely
            </button>
          </form>

          <p className="auth-switch">
            First time here? <Link to="/register">Register for access</Link>
          </p>
        </section>
      </div>
    </div>
  );
}

export default Login;

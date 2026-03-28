
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { AuthContext } from "../context/AuthContext";
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
      <section className="auth-hero">
        <h1>Student Support Management System</h1>
        <p>
          Resolve student issues faster with centralized ticketing, AI Student Assistant, Event Management 
        </p>
        <ul>
          <li>Smart support With Lost Things</li>
          <li>Your Module Specipic AI Chatbot</li>
          <li>Faster response & Manage All Events</li>
        </ul>
      </section>

      <section className="auth-card">
        <h2>Welcome Back</h2>
        <p className="muted">Sign in to continue to your support workspace.</p>

        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            name="email"
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <label>Password</label>
          <input
            name="password"
            type="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          {error && <p className="error">{error}</p>}

          <button className="btn" type="submit">
            Login
          </button>
        </form>

        <p className="auth-switch">
          Need an account? <Link to="/register">Create one</Link>
        </p>
      </section>
    </div>
  );
}

export default Login;


import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import { AuthContext } from "../context/AuthContext";
import "../styles/auth.css";

const getDashboardRouteByRole = (role) =>
  role === "admin" ? "/admin-dashboard" : "/student-dashboard";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await registerUser(form);
      login(res.data);
      navigate(getDashboardRouteByRole(res.data?.user?.role));
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed");
    }
  };

  return (
    <div className="auth-layout">
      <section className="auth-hero">
        <h1>Create Your SSMS Account</h1>
        <p>
          Register as a student or admin to access Student Support Management System 
        </p>
        <ul>
          <li>Smart support With Lost Things</li>
          <li>Your Module Specipic AI Chatbot</li>
          <li>Faster response & Manage All Events</li>
        </ul>
      </section>

      <section className="auth-card">
        <h2>Register</h2>
        <p className="muted">Get started in less than a minute.</p>

        <form onSubmit={handleSubmit}>
          <label>Full Name</label>
          <input
            name="name"
            placeholder="Enter your full name"
            value={form.name}
            onChange={onChange}
          />
          <label>Email</label>
          <input
            name="email"
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={onChange}
          />
          <label>Password</label>
          <input
            name="password"
            type="password"
            placeholder="Create a password"
            value={form.password}
            onChange={onChange}
          />
          <label>Role</label>
          <select name="role" value={form.role} onChange={onChange}>
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>

          {error && <p className="error">{error}</p>}

          <button className="btn" type="submit">
            Create Account
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </section>
    </div>
  );
}

export default Register;

import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import { AuthContext } from "../context/AuthContext.jsx";
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
      <section className="auth-hero auth-hero--compact" aria-labelledby="register-hero-title">
        <span className="auth-hero-badge">Campus account</span>
        <h1 id="register-hero-title">Join Student Support</h1>
        <p className="auth-hero-lead">
          Same tools as sign-in: requests, events, coursework, and lost &amp;
          found—aligned to your role.
        </p>
        <ul className="auth-hero-list auth-hero-list--tight">
          <li>Role-based access only</li>
          <li>Secure email and password</li>
          <li>One consistent experience after you join</li>
        </ul>
      </section>

      <div className="auth-panel-wrap">
        <section className="auth-card auth-card--register" aria-labelledby="register-card-title">
          <header className="auth-card-intro auth-card-intro--compact">
            <h2 id="register-card-title" className="auth-card-title">
              Create your account
            </h2>
            <p className="auth-card-sub">
              Use your <strong>official name</strong> and{" "}
              <strong>university email</strong>. Choose{" "}
              <strong>Student</strong> or <strong>Administrator</strong> only if
              you are allowed to run the desk.
            </p>
          </header>

          <form className="auth-form auth-form--register" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label htmlFor="reg-name">Full name</label>
              <input
                id="reg-name"
                name="name"
                placeholder="e.g. Jordan Lee"
                value={form.name}
                onChange={onChange}
                autoComplete="name"
              />
            </div>
            <div className="auth-field">
              <label htmlFor="reg-email">Email</label>
              <input
                id="reg-email"
                name="email"
                type="email"
                placeholder="you@university.edu"
                value={form.email}
                onChange={onChange}
                autoComplete="email"
              />
            </div>
            <div className="auth-field">
              <label htmlFor="reg-password">Password</label>
              <input
                id="reg-password"
                name="password"
                type="password"
                placeholder="At least 6 characters"
                value={form.password}
                onChange={onChange}
                autoComplete="new-password"
              />
            </div>
            <div className="auth-field">
              <label htmlFor="reg-role">Role</label>
              <select id="reg-role" name="role" value={form.role} onChange={onChange}>
                <option value="student">Student</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            {error && <p className="error auth-field-full">{error}</p>}

            <button className="btn auth-field-full" type="submit">
              Complete registration
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </section>
      </div>
    </div>
  );
}

export default Register;

import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(
  /\/$/,
  ""
);

export const AuthContext = createContext(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    axios
      .get(`${API_BASE}/api/auth/me`)
      .then((res) => {
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        delete axios.defaults.headers.common["Authorization"];
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback((data) => {
    const token = data?.token;
    const u = data?.user;
    if (!token || !u) return;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(u));
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(u);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    navigate("/login");
  }, [navigate]);

  const register = useCallback(
    async (payload) => {
      const res = await axios.post(`${API_BASE}/api/auth/register`, payload);
      login(res.data);
      return res.data.user;
    },
    [login]
  );

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, register }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;

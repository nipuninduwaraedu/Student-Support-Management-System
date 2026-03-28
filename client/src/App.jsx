import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/LHome';
import AdminDashboard from './pages/LAdminDashboard';
import StudentDashboard from './pages/LStudentDashboard';
import LostItems from './pages/LLostItems';
import ItemDetails from './pages/LItemDetails';
import ClaimSubmission from './pages/LClaimSubmission';
import { AuthProvider, useAuth } from './context/AuthContext';
import './index.css';

const ProtectedRoute = ({ children, roleRequired }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (roleRequired && user.role !== roleRequired) return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              
              <Route path="/items" element={<LostItems />} />
              <Route path="/items/:id" element={<ItemDetails />} />
              
              {/* Student Routes */}
              <Route path="/student" element={
                <ProtectedRoute roleRequired="Student">
                  <StudentDashboard />
                </ProtectedRoute>
              } />
              <Route path="/items/:id/claim" element={
                <ProtectedRoute roleRequired="Student">
                  <ClaimSubmission />
                </ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute roleRequired="Admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminEvents from './pages/admin/AdminEvents';
import AdminAssignments from './pages/admin/AdminAssignments';

import StudentDashboard from './pages/student/StudentDashboard';
import StudentEvents from './pages/student/StudentEvents';
import StudentAssignments from './pages/student/StudentAssignments';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/login" replace />} />
            
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="admin/events" element={<AdminEvents />} />
            <Route path="admin/assignments" element={<AdminAssignments />} />
            
            <Route path="student" element={<StudentDashboard />} />
            <Route path="student/events" element={<StudentEvents />} />
            <Route path="student/assignments" element={<StudentAssignments />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

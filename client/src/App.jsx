import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';

import EAdminDashboard from './pages/admin/EAdminDashboard';
import EAdminEvents from './pages/admin/EAdminEvents';
import EAdminAssignments from './pages/admin/EAdminAssignments';

import EStudentDashboard from './pages/student/EStudentDashboard';
import EStudentEvents from './pages/student/EStudentEvents';
import EStudentAssignments from './pages/student/EStudentAssignments';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/admin" replace />} />
            
            <Route path="admin" element={<EAdminDashboard />} />
            <Route path="admin/events" element={<EAdminEvents />} />
            <Route path="admin/assignments" element={<EAdminAssignments />} />
            
            <Route path="student" element={<EStudentDashboard />} />
            <Route path="student/events" element={<EStudentEvents />} />
            <Route path="student/assignments" element={<EStudentAssignments />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { User } from './types';

// Protected Route Component
const ProtectedRoute = ({ children, user }: { children: React.ReactNode, user: User | null }) => {
  const location = useLocation();
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <Router>
      <div className="min-h-screen bg-cyber-900 text-slate-200 font-sans selection:bg-cyan-500 selection:text-white">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login onLogin={setUser} />} />
          <Route 
            path="/audit" 
            element={
              <ProtectedRoute user={user}>
                <Dashboard user={user!} onLogout={() => setUser(null)} />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
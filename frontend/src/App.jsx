import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Analyze from './pages/Analyze';
import AnalysisResult from './pages/AnalysisResult';
import Layout from './components/Layout';

import { ThemeProvider } from './context/ThemeContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 transition-colors">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-600"></div>
    </div>
  );
  if (!user) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route element={<Layout />}>
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/analyze" element={<ProtectedRoute><Analyze /></ProtectedRoute>} />
              <Route path="/analysis/:id" element={<ProtectedRoute><AnalysisResult /></ProtectedRoute>} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

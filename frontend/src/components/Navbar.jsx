import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BrainCircuit, LogOut, LayoutDashboard, Search } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass sticky top-0 z-50 px-4 py-3">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary-600">
          <BrainCircuit size={32} />
          <span>AI Resume</span>
        </Link>
        
        {user ? (
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-1 hover:text-primary-600 transition-colors">
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </Link>
            <Link to="/analyze" className="flex items-center gap-1 hover:text-primary-600 transition-colors">
              <Search size={18} />
              <span>Analyze</span>
            </Link>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <span className="text-sm font-medium text-slate-600">Hi, {user.name}</span>
              <button 
                onClick={handleLogout}
                className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-4">
            <Link to="/login" className="text-slate-600 hover:text-primary-600 font-medium px-4 py-2">Login</Link>
            <Link to="/signup" className="btn-primary">Get Started</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

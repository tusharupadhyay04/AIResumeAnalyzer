import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BrainCircuit, LogOut, LayoutDashboard, Search, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass sticky top-0 z-50 px-6 py-4 mb-8">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 font-black text-2xl tracking-tight text-slate-900 dark:text-white group">
          <div className="p-2 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-200 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
            <BrainCircuit size={28} />
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-cyan-500">
            ResuAI
          </span>
        </Link>
        
        <div className="flex items-center gap-4 md:gap-8">
          {user ? (
            <div className="flex items-center gap-4 md:gap-8">
              <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                <Link to="/" className="flex items-center gap-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  <LayoutDashboard size={18} />
                  <span>Dashboard</span>
                </Link>
                <Link to="/analyze" className="flex items-center gap-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  <Search size={18} />
                  <span>Analyze</span>
                </Link>
              </div>

              <div className="flex items-center gap-4 pl-4 md:pl-8 border-l border-slate-200/60 dark:border-slate-700">
                <button
                  onClick={toggleTheme}
                  className="p-3 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-all duration-300"
                  title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                >
                  {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>

                <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Welcome</p>
                  <p className="text-sm font-black text-slate-800 dark:text-slate-200">{user.name}</p>
                </div>

                <button 
                  onClick={handleLogout}
                  className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-all duration-300"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-4 items-center">
              <button
                onClick={toggleTheme}
                className="p-3 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-all duration-300 mr-2"
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>
              <Link to="/login" className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white font-bold px-4 py-2 transition-colors">
                Login
              </Link>
              <Link to="/signup" className="btn-primary px-8">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BrainCircuit, Mail, Lock, User, ArrowRight, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 animate-in text-left">
      {/* Floating Theme Toggle */}
      <div className="fixed top-10 right-10">
        <button
          onClick={toggleTheme}
          className="p-4 glass rounded-2xl text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300 shadow-xl"
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
        </button>
      </div>

      <div className="max-w-md w-full glass rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-600 to-cyan-500"></div>
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-indigo-600 text-white rounded-[1.5rem] shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
              <BrainCircuit size={40} />
            </div>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Create Account</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Start your AI-powered career growth</p>
        </div>

        {error && <div className="bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 p-4 rounded-2xl text-sm mb-8 border border-rose-100 dark:border-rose-800 font-bold animate-shake">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest ml-1">Full Name</label>
            <div className="relative group/input">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-indigo-600 dark:group-focus-within/input:text-indigo-400 transition-colors" size={20} />
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field pl-14" 
                placeholder="John Doe"
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest ml-1">Email</label>
            <div className="relative group/input">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-indigo-600 dark:group-focus-within/input:text-indigo-400 transition-colors" size={20} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-14" 
                placeholder="name@example.com"
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest ml-1">Password</label>
            <div className="relative group/input">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-indigo-600 dark:group-focus-within/input:text-indigo-400 transition-colors" size={20} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-14" 
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button type="submit" className="w-full btn-primary py-4 px-8 text-lg rounded-[1.5rem] shadow-lg shadow-indigo-100 dark:shadow-indigo-900/40 group">
            <span>Sign Up</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <p className="text-center text-slate-500 dark:text-slate-400 mt-10 font-medium">
          Already have an account? <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-black hover:underline underline-offset-4 decoration-2">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;

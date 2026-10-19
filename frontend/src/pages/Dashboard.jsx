import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { FileText, Plus, Clock, ChevronRight, BarChart3, Target, Trash2 } from 'lucide-react';

const Dashboard = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const { data } = await api.get('/resume');
        setResumes(data);
      } catch (err) {
        console.error('Failed to fetch resumes');
      } finally {
        setLoading(false);
      }
    };
    fetchResumes();
  }, []);

  const handleDelete = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Delete this analysis permanently?')) {
      try {
        await api.delete(`/resume/${id}`);
        setResumes(resumes.filter(r => r._id !== id));
      } catch (err) {
        alert('Failed to delete analysis');
      }
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;

  return (
    <div className="space-y-10 animate-in">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 text-left">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Your Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Manage your resume analyses and track your professional growth</p>
        </div>
        <Link to="/analyze" className="btn-primary group self-start shadow-xl">
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          <span>New Analysis</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-8 rounded-[2.5rem] card-glow group">
          <div className="flex items-center gap-4 text-indigo-600 mb-6">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
              <FileText size={24} />
            </div>
            <span className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-xs">Total Resumes</span>
          </div>
          <div className="text-5xl font-black text-slate-900 dark:text-white">{resumes.length}</div>
        </div>

        <div className="glass p-8 rounded-[2.5rem] card-glow group">
          <div className="flex items-center gap-4 text-emerald-600 mb-6">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
              <Target size={24} />
            </div>
            <span className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-xs">Highest ATS Score</span>
          </div>
          <div className="text-5xl font-black text-emerald-600">
            {resumes.length > 0 ? Math.max(...resumes.map(r => r.analysisResults?.atsScore || 0)) : '--'}
          </div>
        </div>

        <div className="glass p-8 rounded-[2.5rem] card-glow group">
          <div className="flex items-center gap-4 text-cyan-600 mb-6">
            <div className="p-3 bg-cyan-50 dark:bg-cyan-900/30 rounded-2xl group-hover:scale-110 group-hover:bg-cyan-600 group-hover:text-white transition-all duration-300">
              <BarChart3 size={24} />
            </div>
            <span className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-xs">Avg Match %</span>
          </div>
          <div className="text-5xl font-black text-cyan-600">
            {resumes.length > 0 ? Math.round(resumes.reduce((acc, r) => acc + (r.analysisResults?.matchPercentage || 0), 0) / resumes.length) : '--'}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800 pb-4">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <Clock size={24} className="text-indigo-600" />
            Recent History
          </h2>
          <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-bold rounded-full uppercase">
            Sorted by most recent
          </span>
        </div>
        
        {resumes.length === 0 ? (
          <div className="text-center py-20 glass rounded-[2.5rem] border-dashed border-2 border-slate-200 dark:border-slate-800">
            <div className="p-6 bg-slate-50 dark:bg-slate-800 inline-block rounded-full mb-4">
              <FileText size={48} className="text-slate-300 dark:text-slate-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">No analyses yet</h3>
            <p className="text-slate-400 dark:text-slate-500 mt-2">Start by uploading your first resume!</p>
            <Link to="/analyze" className="btn-primary mt-8 inline-flex">Analyze Now</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {resumes.map((resume, i) => (
              <Link 
                to={`/analysis/${resume._id}`} 
                key={resume._id} 
                className="glass p-6 rounded-[2rem] flex flex-col sm:flex-row sm:items-center justify-between hover:border-indigo-400/50 hover:bg-white/95 dark:hover:bg-slate-800/90 transition-all group border-transparent shadow-sm"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex items-center gap-5">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                    <FileText size={28} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{resume.originalName}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-sm font-medium text-slate-400 dark:text-slate-500">{new Date(resume.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      <span className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full"></span>
                      <p className="text-sm font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-tighter">Verified Analysis</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end gap-10 mt-6 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-0 border-slate-100 dark:border-slate-800">
                  {resume.analysisResults && (
                    <div className="text-left sm:text-right">
                      <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-1">ATS Score</div>
                      <div className={`text-2xl font-black ${resume.analysisResults.atsScore >= 80 ? 'text-emerald-500' : resume.analysisResults.atsScore >= 50 ? 'text-amber-500' : 'text-rose-500'}`}>
                        {resume.analysisResults.atsScore}%
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={(e) => handleDelete(e, resume._id)}
                      className="p-3 text-slate-300 dark:text-slate-600 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-2xl transition-all duration-300"
                      title="Delete Analysis"
                    >
                      <Trash2 size={22} />
                    </button>
                    <div className="p-2 text-slate-300 dark:text-slate-600 group-hover:text-indigo-600 group-hover:translate-x-2 transition-all duration-500">
                      <ChevronRight size={28} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

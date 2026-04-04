import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { FileText, Plus, Clock, ChevronRight, BarChart3, Target } from 'lucide-react';

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

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1">Manage your resume analyses and track your progress</p>
        </div>
        <Link to="/analyze" className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          <span>New Analysis</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-2xl">
          <div className="flex items-center gap-3 text-primary-600 mb-4">
            <div className="p-2 bg-primary-100 rounded-lg"><FileText size={20} /></div>
            <span className="font-semibold text-slate-700">Total Resumes</span>
          </div>
          <div className="text-4xl font-bold text-slate-900">{resumes.length}</div>
        </div>
        <div className="glass p-6 rounded-2xl">
          <div className="flex items-center gap-3 text-green-600 mb-4">
            <div className="p-2 bg-green-100 rounded-lg"><Target size={20} /></div>
            <span className="font-semibold text-slate-700">Highest Score</span>
          </div>
          <div className="text-4xl font-bold text-slate-900">
            {resumes.length > 0 ? Math.max(...resumes.map(r => r.analysisResults?.atsScore || 0)) : '--'}
          </div>
        </div>
        <div className="glass p-6 rounded-2xl">
          <div className="flex items-center gap-3 text-purple-600 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg"><BarChart3 size={20} /></div>
            <span className="font-semibold text-slate-700">Avg Match %</span>
          </div>
          <div className="text-4xl font-bold text-slate-900">
            {resumes.length > 0 ? Math.round(resumes.reduce((acc, r) => acc + (r.analysisResults?.matchPercentage || 0), 0) / resumes.length) : '--'}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Clock size={20} className="text-slate-400" />
          Recent Analyses
        </h2>
        
        {resumes.length === 0 ? (
          <div className="text-center py-12 glass rounded-2xl">
            <p className="text-slate-400">No analyses yet. Start by uploading your first resume!</p>
            <Link to="/analyze" className="text-primary-600 font-semibold mt-4 inline-block hover:underline">Analyze Now</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {resumes.map((resume) => (
              <div key={resume._id} className="glass p-5 rounded-2xl flex items-center justify-between hover:border-primary-300 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-100 rounded-xl group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{resume.originalName}</h3>
                    <p className="text-sm text-slate-500">Analyzed on {new Date(resume.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  {resume.analysisResults && (
                    <div className="text-right">
                      <div className="text-sm text-slate-500 mb-1">ATS Score</div>
                      <div className={`font-bold text-lg ${resume.analysisResults.atsScore >= 80 ? 'text-green-600' : resume.analysisResults.atsScore >= 50 ? 'text-amber-500' : 'text-red-500'}`}>
                        {resume.analysisResults.atsScore}/100
                      </div>
                    </div>
                  )}
                  <button className="p-2 text-slate-400 hover:text-primary-600 group-hover:translate-x-1 transition-all">
                    <ChevronRight size={24} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

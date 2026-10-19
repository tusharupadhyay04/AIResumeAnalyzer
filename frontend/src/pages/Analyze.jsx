import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Upload, FileText, CheckCircle2, AlertCircle, Sparkles, Brain, Download, ChevronRight, Target } from 'lucide-react';

const Analyze = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [jd, setJd] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [step, setStep] = useState(1); // 1: Upload, 2: Analysis Results
  const [showRewriter, setShowRewriter] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!file || !jd) return alert('Please provide both resume and job description');

    setLoading(true);
    try {
      // 1. Upload File
      const formData = new FormData();
      formData.append('resume', file);
      const { data: resumeData } = await api.post('/resume/upload', formData);

      // 2. Analyze
      await api.post(`/resume/analyze/${resumeData._id}`, { jobDescription: jd });
      navigate(`/analysis/${resumeData._id}`);
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || err.message || 'Analysis failed';
      alert(`Analysis failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-8 animate-in text-center">
        <div className="relative group">
          <div className="absolute inset-[-20px] bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="relative animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-indigo-600 shadow-[0_0_40px_rgba(79,70,229,0.3)]"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Brain className="text-indigo-600 animate-bounce" size={40} />
          </div>
        </div>
        <div className="text-center px-4">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">AI is Thinking...</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-3 font-medium max-w-sm mx-auto">Our advanced algorithms are matching your unique skills with the job requirements.</p>
          <div className="flex gap-1 justify-center mt-6">
            <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-2 h-2 bg-indigo-200 rounded-full animate-bounce"></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in pb-20">
      <div className="text-center space-y-4 pt-10">
        <div className="inline-block px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-sm font-black uppercase tracking-widest mb-4">
          AI-Powered Insights
        </div>
        <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          Unlock Your Career <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">With AI Analysis</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-4 text-xl font-medium max-w-2xl mx-auto">Upload your resume and the target job description to see how you rank and get instant improvement tips.</p>
      </div>

      <form onSubmit={handleAnalyze} className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <Upload size={20} />
            </div>
            <label className="text-xl font-black text-slate-800 dark:text-slate-200 tracking-tight">Step 1: Your Resume</label>
          </div>
          
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-cyan-50 dark:from-indigo-900/20 dark:to-cyan-900/20 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative glass border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-12 flex flex-col items-center justify-center hover:border-indigo-400/50 hover:bg-white/95 dark:hover:bg-slate-800/90 transition-all cursor-pointer">
              <input 
                type="file" 
                accept=".pdf" 
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-[2rem] text-slate-400 dark:text-slate-500 group-hover:bg-indigo-600 group-hover:text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 mb-6 shadow-sm">
                <FileText size={56} />
              </div>
              <p className="text-slate-700 dark:text-slate-300 text-xl font-black">{file ? file.name : "Drop your PDF here"}</p>
              <p className="text-slate-400 dark:text-slate-500 font-bold mt-2 text-sm uppercase tracking-widest">or click to browse files</p>
              
              {file && (
                <div className="mt-6 flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-black uppercase tracking-wider animate-bounce">
                  <CheckCircle2 size={16} />
                  File Ready
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6 flex flex-col">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 rounded-xl">
              <Target size={20} />
            </div>
            <label className="text-xl font-black text-slate-800 dark:text-slate-200 tracking-tight">Step 2: Job Description</label>
          </div>
          
          <div className="glass p-2 rounded-[2.5rem] shadow-inner focus-within:shadow-indigo-100/50 dark:focus-within:shadow-indigo-900/30 transition-all flex-grow">
            <textarea 
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              className="w-full h-full min-h-[350px] bg-white/50 dark:bg-slate-800/50 rounded-[2rem] p-8 resize-none border-0 focus:ring-0 text-slate-700 dark:text-slate-300 font-medium placeholder:text-slate-300 dark:placeholder:text-slate-600"
              placeholder="Paste the target job description here..."
              required
            />
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col items-center gap-4 py-8">
          <button type="submit" className="btn-primary py-5 px-16 text-xl rounded-[2rem] shadow-2xl shadow-indigo-200 dark:shadow-indigo-900/40">
            <Sparkles size={28} />
            <span>Launch Analysis</span>
          </button>
          <p className="text-slate-400 dark:text-slate-500 text-sm font-bold uppercase tracking-[0.2em]">Takes less than 15 seconds</p>
        </div>
      </form>
    </div>
  );
};

export default Analyze;

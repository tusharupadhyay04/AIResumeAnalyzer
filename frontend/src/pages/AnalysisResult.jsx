import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { 
  FileText, CheckCircle2, AlertCircle, Sparkles, Brain, Download, 
  ChevronRight, Target, ArrowLeft, Trash2, Eye, EyeOff
} from 'lucide-react';

const AnalysisResult = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRewriter, setShowRewriter] = useState(false);
  const [showPDF, setShowPDF] = useState(false);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const { data } = await api.get(`/resume/${id}`);
        setResume(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load analysis result');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this analysis permanently?')) {
      try {
        await api.delete(`/resume/${id}`);
        navigate('/');
      } catch (err) {
        alert('Failed to delete analysis');
      }
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-32 space-y-6 animate-in">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600 shadow-xl"></div>
      </div>
      <p className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-[0.2em] animate-pulse text-xs">Loading Analysis...</p>
    </div>
  );

  if (error) return (
    <div className="max-w-md mx-auto py-20 text-center animate-in">
      <div className="p-6 bg-rose-50 dark:bg-rose-900/20 inline-block rounded-[2rem] mb-6">
        <AlertCircle className="text-rose-500" size={48} />
      </div>
      <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">Access Denied</h2>
      <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium leading-relaxed">{error}</p>
      <Link to="/" className="btn-primary inline-flex items-center gap-3 px-8">
        <ArrowLeft size={20} />
        Return to Dashboard
      </Link>
    </div>
  );

  const analysis = resume.analysisResults;

  if (!analysis) return (
    <div className="max-w-md mx-auto py-20 text-center animate-in">
      <div className="p-6 bg-amber-50 dark:bg-amber-900/20 inline-block rounded-[2rem] mb-6">
        <Brain className="text-amber-500" size={48} />
      </div>
      <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">Pending Analysis</h2>
      <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">This resume has been uploaded but not yet processed by our AI.</p>
      <Link to="/analyze" className="btn-primary px-8">Start Analysis Now</Link>
    </div>
  );

  // Circular progress math
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (analysis.atsScore / 100) * circumference;

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-24 animate-in">
      {/* Header Bar */}
      <div className="glass p-6 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-5 w-full md:w-auto">
          <button 
            onClick={() => navigate('/')}
            className="p-4 bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-400 hover:text-indigo-600 rounded-2xl transition-all border border-transparent hover:border-indigo-100 group"
          >
            <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="text-left">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-black uppercase rounded-md tracking-wider">Analysis Complete</span>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{new Date(resume.createdAt).toLocaleDateString()}</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <FileText className="text-indigo-600 dark:text-indigo-400" size={24} />
              {resume.originalName}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto justify-end">
          <button
            onClick={() => setShowPDF(v => !v)}
            className={`p-4 rounded-2xl transition-all border flex items-center gap-2 group font-bold text-sm ${
              showPDF
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40'
                : 'text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border-transparent hover:border-indigo-100'
            }`}
          >
            {showPDF ? <EyeOff size={20} /> : <Eye size={20} />}
            <span>{showPDF ? 'Hide Resume' : 'View Resume'}</span>
          </button>
          <button 
            onClick={handleDelete}
            className="p-4 text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-2xl transition-all border border-transparent hover:border-rose-100 flex items-center gap-2 group"
          >
            <Trash2 size={20} className="group-hover:rotate-12 transition-transform" />
            <span className="font-bold text-sm">Delete</span>
          </button>
        </div>
      </div>

      {/* PDF Viewer Panel */}
      {showPDF && (() => {
        const pdfUrl = `http://localhost:5000/uploads/${resume.filename}`;
        return (
          <div className="glass rounded-[2.5rem] overflow-hidden border border-indigo-100 dark:border-indigo-900/40 shadow-2xl shadow-indigo-100/50 dark:shadow-black/30 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 dark:border-slate-800 bg-indigo-50/50 dark:bg-indigo-950/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-md shadow-indigo-200 dark:shadow-indigo-900/40">
                  <FileText size={18} />
                </div>
                <div>
                  <p className="font-black text-slate-900 dark:text-white text-sm">{resume.originalName}</p>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Uploaded Resume Preview</p>
                </div>
              </div>
              <a
                href={pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-xs font-black rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 dark:shadow-indigo-900/40"
              >
                <Download size={14} />
                Open / Download PDF
              </a>
            </div>

            {/* PDF embed using object tag — better browser support than iframe */}
            <div className="relative w-full bg-slate-100 dark:bg-slate-900" style={{ height: '80vh' }}>
              <object
                data={pdfUrl}
                type="application/pdf"
                className="w-full h-full"
              >
                {/* Fallback when browser blocks embedded PDF */}
                <div className="flex flex-col items-center justify-center h-full gap-6 text-center px-8">
                  <div className="p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-[2rem]">
                    <FileText size={56} className="text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">Browser Blocked Inline Preview</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-6 max-w-sm">
                      Your browser's security settings prevent embedding PDFs from a different port. Click the button below to open it in a new tab.
                    </p>
                    <a
                      href={pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 dark:shadow-indigo-900/40"
                    >
                      <Download size={20} />
                      Open PDF in New Tab
                    </a>
                  </div>
                </div>
              </object>
            </div>
          </div>
        );
      })()}


      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
        {/* Left Sidebar Stats */}
        <div className="lg:col-span-4 space-y-8">
          <div className="glass p-10 rounded-[3rem] relative overflow-hidden flex flex-col items-center">
            {/* Background Glow */}
            <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-20 dark:opacity-40 ${analysis.atsScore >= 80 ? 'bg-emerald-500' : analysis.atsScore >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}></div>
            
            <div className="relative mb-8">
              <svg className="w-52 h-52 -rotate-90">
                <circle
                  cx="104"
                  cy="104"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  className="text-slate-100 dark:text-slate-800"
                />
                <circle
                  cx="104"
                  cy="104"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={circumference}
                  style={{ strokeDashoffset: offset }}
                  strokeLinecap="round"
                  className={`transition-all duration-1000 ease-out ${analysis.atsScore >= 80 ? 'text-emerald-500' : analysis.atsScore >= 50 ? 'text-amber-500' : 'text-rose-500'} drop-shadow-[0_0_8px_rgba(0,0,0,0.1)]`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">{analysis.atsScore}</span>
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">ATS Score</span>
              </div>
            </div>

            <div className="text-center">
              <p className="font-black text-slate-800 dark:text-slate-200 text-xl tracking-tight mb-2">
                {analysis.atsScore >= 80 ? 'Highly Compatible!' : analysis.atsScore >= 50 ? 'Good Potential' : 'Needs Improvement'}
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">
                Your resume matches <span className="text-indigo-600 dark:text-indigo-400 font-bold">{analysis.matchPercentage}%</span> of the job requirements based on keyword density and skill mapping.
              </p>
            </div>
          </div>
          
          <div className="glass p-8 rounded-[2.5rem] space-y-6">
            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs flex items-center gap-3 mb-2 border-b border-slate-100 dark:border-slate-800 pb-4">
              <Target size={18} className="text-indigo-600 dark:text-indigo-400" />
              Detailed Matching
            </h3>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-slate-500 dark:text-slate-400">Keyword Density</span>
                  <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">{analysis.matchPercentage}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${analysis.matchPercentage}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-slate-500 dark:text-slate-400">Skill Alignment</span>
                  <span className="text-sm font-black text-cyan-500 dark:text-cyan-400">{Math.min(100, analysis.matchPercentage + 8)}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${Math.min(100, analysis.matchPercentage + 8)}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass p-8 rounded-[2.5rem] card-glow group">
              <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl group-hover:scale-110 transition-transform">
                  <CheckCircle2 size={20} />
                </div>
                Found Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysis.matchingSkills?.length > 0 ? analysis.matchingSkills.map((skill, i) => (
                  <span key={i} className="px-4 py-1.5 bg-emerald-50/50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-xl text-xs font-black border border-emerald-100/50 dark:border-emerald-800/30 hover:scale-105 transition-transform cursor-default">
                    {skill}
                  </span>
                )) : <p className="text-slate-400 dark:text-slate-500 text-sm font-medium italic">No skills identified.</p>}
              </div>
            </div>
            
            <div className="glass p-8 rounded-[2.5rem] card-glow group">
              <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <div className="p-2 bg-rose-50 dark:bg-rose-900/30 text-rose-500 dark:text-rose-400 rounded-xl group-hover:scale-110 transition-transform">
                  <AlertCircle size={20} />
                </div>
                Missing Keywords
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysis.missingKeywords?.length > 0 ? analysis.missingKeywords.map((keyword, i) => (
                  <span key={i} className="px-4 py-1.5 bg-rose-50/50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 rounded-xl text-xs font-black border border-rose-100/50 dark:border-rose-800/30 hover:scale-105 transition-transform cursor-default">
                    {keyword}
                  </span>
                )) : <p className="text-emerald-500 dark:text-emerald-400 text-sm font-black">Perfect score! No keywords missing.</p>}
              </div>
            </div>
          </div>

          <div className="glass p-10 rounded-[3rem] space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 text-indigo-50/50 dark:text-indigo-900/10 -mr-4 -mt-4 pointer-events-none">
              <Sparkles size={120} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-4 relative">
              <Sparkles size={28} className="text-indigo-600 dark:text-indigo-400" />
              AI Strategic Suggestions
            </h3>
            <ul className="grid grid-cols-1 gap-5 relative text-left">
              {analysis.suggestions?.map((suggestion, i) => (
                <li key={i} className="flex gap-5 p-6 rounded-[2rem] bg-indigo-50/30 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/30 hover:bg-white hover:dark:bg-slate-800 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500 group">
                  <div className="h-10 w-10 mt-0.5 rounded-2xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 text-sm font-black shadow-lg shadow-indigo-100 dark:shadow-indigo-900/40 group-hover:scale-110 transition-transform">
                    {i+1}
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{suggestion}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-10 rounded-[3rem] border-2 border-dashed border-indigo-300 dark:border-indigo-800/50 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-indigo-200 dark:shadow-black/20">
            <div className="flex items-center gap-6">
              <div className="p-5 bg-white/20 backdrop-blur-md text-white rounded-[2rem] shadow-inner">
                <Brain size={40} />
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-black tracking-tight">AI Content Rewriter</h3>
                <p className="text-indigo-100 font-medium">We've generated high-impact bullet points for your resume.</p>
              </div>
            </div>
            <button 
              onClick={() => setShowRewriter(true)}
              className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-indigo-50 transition-all active:scale-95 shadow-xl shadow-black/10"
            >
              <span>View Improvements</span>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* AI Rewriter Modal (Enhanced) */}
      {showRewriter && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.4)] animate-in scale-in duration-500">
            <div className="p-10 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-indigo-50/50 dark:bg-indigo-950/30">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-100 dark:shadow-indigo-900/40">
                  <Brain size={28} />
                </div>
                <div className="text-left">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">AI Optimization</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">Enhanced Work Experience</p>
                </div>
              </div>
              <button 
                onClick={() => setShowRewriter(false)}
                className="p-3 bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 rounded-2xl text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all shadow-sm"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <div className="p-10 space-y-6 max-h-[60vh] overflow-y-auto text-left">
              {analysis.improvedBulletPoints?.length > 0 ? (
                <div className="space-y-5">
                  {analysis.improvedBulletPoints.map((point, i) => (
                    <div key={i} className="group relative p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:border-indigo-200 dark:hover:border-indigo-900/50 hover:bg-white dark:hover:bg-slate-800 transition-all shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 duration-500">
                      <div className="absolute -left-3 top-8 w-8 h-8 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-100 dark:shadow-indigo-900/40 flex items-center justify-center text-xs font-black">
                        {i + 1}
                      </div>
                      <p className="text-slate-800 dark:text-slate-300 leading-relaxed pl-4 font-medium">{point}</p>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(point);
                          alert('Copied to clipboard!');
                        }}
                        className="mt-6 text-[10px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-[0.2em] hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-2"
                      >
                        <CheckCircle2 size={12} />
                        Copy to clipboard
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center">
                  <Sparkles className="text-slate-200 dark:text-slate-800 mx-auto mb-4" size={64} />
                  <p className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest text-sm">Generating improvements...</p>
                </div>
              )}
            </div>

            <div className="p-10 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-end gap-5">
              <button 
                onClick={() => setShowRewriter(false)}
                className="px-8 py-4 font-black text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
              >
                Done
              </button>
              <button 
                onClick={() => {
                  const text = analysis.improvedBulletPoints?.join('\n\n');
                  const blob = new Blob([text], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${resume.originalName}_AI_Optimized.txt`;
                  a.click();
                }}
                className="bg-indigo-600 text-white px-10 py-4 rounded-[1.5rem] font-black flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 dark:shadow-indigo-900/40"
              >
                <Download size={20} />
                <span>Save All as TXT</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisResult;

import React, { useState } from 'react';
import api from '../services/api';
import { Upload, FileText, CheckCircle2, AlertCircle, Sparkles, Brain, Download, ChevronRight, Target } from 'lucide-react';

const Analyze = () => {
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
      const { data: analysisData } = await api.post(`/resume/analyze/${resumeData._id}`, { jobDescription: jd });
      setAnalysis(analysisData.analysisResults);
      setStep(2);
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
      <div className="flex flex-col items-center justify-center py-20 space-y-6">
        <div className="relative">
          <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-primary-600"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Brain className="text-primary-600 animate-pulse" size={32} />
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900">AI is Analyzing...</h2>
          <p className="text-slate-500 mt-2">Checking your resume against the job description.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {step === 1 ? (
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">ATS Resume Analyzer</h1>
            <p className="text-slate-500 mt-3 text-lg">Compare your resume with a job description and get instant improvements.</p>
          </div>

          <form onSubmit={handleAnalyze} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="block font-bold text-slate-800 text-lg flex items-center gap-2">
                <Upload size={20} className="text-primary-600" />
                Upload Resume (PDF)
              </label>
              <div className="border-2 border-dashed border-slate-200 rounded-3xl p-10 flex flex-col items-center justify-center bg-white hover:border-primary-300 transition-colors cursor-pointer relative group">
                <input 
                  type="file" 
                  accept=".pdf" 
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="p-4 bg-slate-50 rounded-full text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors mb-4">
                  <FileText size={48} />
                </div>
                <p className="text-slate-600 font-medium">{file ? file.name : "Drag and drop or click to upload"}</p>
                <p className="text-slate-400 text-sm mt-1">Only PDF format is supported</p>
              </div>
            </div>

            <div className="space-y-4 flex flex-col">
              <label className="block font-bold text-slate-800 text-lg flex items-center gap-2">
                <FileText size={20} className="text-primary-600" />
                Job Description
              </label>
              <textarea 
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                className="input-field flex-grow min-h-[300px] rounded-3xl p-6 resize-none"
                placeholder="Paste the job description here..."
                required
              />
            </div>

            <div className="lg:col-span-2 flex justify-center pt-4">
              <button type="submit" className="btn-primary py-4 px-12 text-lg rounded-2xl flex items-center gap-3 shadow-lg shadow-primary-200">
                <Sparkles size={24} />
                <span>Analyze with AI</span>
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-8 pb-20">
          <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="text-green-500" />
              Analysis Results
            </h1>
            <button onClick={() => setStep(1)} className="text-slate-500 hover:text-primary-600 font-medium">Analyze Another</button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <div className="glass p-8 rounded-3xl text-center space-y-3">
                <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">ATS Score</div>
                <div className={`text-6xl font-black ${analysis.atsScore >= 80 ? 'text-green-600' : analysis.atsScore >= 50 ? 'text-amber-500' : 'text-red-500'}`}>
                  {analysis.atsScore}
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mt-4">
                  <div 
                    className={`h-full transition-all duration-1000 ${analysis.atsScore >= 80 ? 'bg-green-500' : analysis.atsScore >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                    style={{ width: `${analysis.atsScore}%` }}
                  />
                </div>
              </div>
              
              <div className="glass p-6 rounded-3xl space-y-4">
                <h3 className="font-bold text-slate-800 flex items-center gap-2 border-b pb-3">
                  <Target size={18} className="text-primary-600" />
                  Match Details
                </h3>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Keyword Match</span>
                  <span className="font-bold text-slate-900">{analysis.matchPercentage}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Skills Match</span>
                  <span className="font-bold text-slate-900">{Math.min(100, analysis.matchPercentage + 5)}%</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass p-6 rounded-3xl">
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-green-500" />
                    Matching Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.matchingSkills?.map((skill, i) => (
                      <span key={i} className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-100">{skill}</span>
                    ))}
                  </div>
                </div>
                <div className="glass p-6 rounded-3xl">
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <AlertCircle size={18} className="text-red-500" />
                    Missing Keywords
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.missingKeywords?.map((keyword, i) => (
                      <span key={i} className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm font-medium border border-red-100">{keyword}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="glass p-8 rounded-3xl space-y-6">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles size={20} className="text-primary-600" />
                  AI Improvement Suggestions
                </h3>
                <ul className="space-y-4">
                  {analysis.suggestions?.map((suggestion, i) => (
                    <li key={i} className="flex gap-4 p-4 rounded-2xl bg-primary-50/50 border border-primary-100">
                      <div className="h-6 w-6 mt-0.5 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0 text-xs font-bold">{i+1}</div>
                      <p className="text-slate-700 leading-relaxed">{suggestion}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-8 rounded-3xl border-2 border-dashed border-primary-200 bg-gradient-to-br from-primary-50 to-white flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-primary-600 text-white rounded-2xl shadow-lg shadow-primary-200">
                    <Brain size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Advanced AI Rewriter</h3>
                    <p className="text-slate-500">We've generated improved bullet points for your resume.</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowRewriter(true)}
                  className="btn-primary flex items-center gap-2 py-3 px-6 rounded-2xl"
                >
                  <span>View & Download</span>
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* AI Rewriter Modal */}
          {showRewriter && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
              <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-primary-50 to-white">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-600 text-white rounded-xl">
                      <Brain size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">Improved Your Resume</h2>
                  </div>
                  <button 
                    onClick={() => setShowRewriter(false)}
                    className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
                </div>
                
                <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                  <p className="text-slate-600">Based on the job description, we've optimized these experience bullet points for better ATS ranking:</p>
                  
                  <div className="space-y-4">
                    {analysis.improvedBulletPoints?.map((point, i) => (
                      <div key={i} className="group relative p-6 rounded-2xl border border-slate-100 bg-slate-50 hover:border-primary-200 hover:bg-white transition-all">
                        <div className="absolute -left-3 top-6 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md shadow-primary-200">
                          {i + 1}
                        </div>
                        <p className="text-slate-800 leading-relaxed pl-2">{point}</p>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(point);
                            alert('Copied to clipboard!');
                          }}
                          className="mt-4 text-xs font-bold text-primary-600 uppercase tracking-widest hover:text-primary-700 flex items-center gap-1"
                        >
                          Copy to clipboard
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex gap-3">
                    <AlertCircle className="text-amber-500 flex-shrink-0" size={20} />
                    <p className="text-sm text-amber-800 leading-snug">
                      <strong>Pro Tip:</strong> Use these bullet points to replace less impactful items in your "Work Experience" section to boost your match score.
                    </p>
                  </div>
                </div>

                <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                  <button 
                    onClick={() => setShowRewriter(false)}
                    className="px-6 py-3 font-bold text-slate-500 hover:text-slate-700 transition-colors"
                  >
                    Close
                  </button>
                  <button 
                    onClick={() => {
                      const text = analysis.improvedBulletPoints?.join('\n\n');
                      const blob = new Blob([text], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'improved_resume_points.txt';
                      a.click();
                    }}
                    className="btn-primary py-3 px-8 rounded-2xl flex items-center gap-2"
                  >
                    <Download size={18} />
                    <span>Download TXT</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Analyze;

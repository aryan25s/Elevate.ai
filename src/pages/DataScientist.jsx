import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Database, Send, CheckCircle2, BarChart, PieChart, Activity, FileText } from 'lucide-react';

const DataScientist = ({ isDashboardView = false, addToHistory, externalInput, triggerAction, externalFile }) => {
  const [file, setFile] = useState(null);
  const [query, setQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [output, setOutput] = useState(null);

  useEffect(() => {
    if (externalFile) {
      setFile(externalFile);
    }
  }, [externalFile]);

  useEffect(() => {
    if (isDashboardView && externalInput && triggerAction > 0) {
      setQuery(externalInput);
      handleAnalyze(externalInput);
    }
  }, [triggerAction]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyze = (q = query) => {
    const finalQuery = q || query;
    const finalFile = file || externalFile;
    if (!finalFile || !finalQuery.trim()) return;
    
    setIsAnalyzing(true);
    // Simulate API call
    setTimeout(() => {
      setOutput(`Analysis for query: "${finalQuery}"\n\n1. Revenue Trends: We detected a 15% increase in Q3 compared to Q2, driven mainly by the new product launch.\n2. Customer Churn: Your data shows a 5% churn rate, mostly concentrated in the 18-24 demographic.\n3. Recommendations: Focus marketing efforts on retaining younger demographics and push promotions for the upcoming holiday season.\n\n(Note: This is an AI-generated dummy response based on your file "${finalFile.name}")`);
      setIsAnalyzing(false);
      if (isDashboardView && addToHistory) {
        addToHistory(finalQuery, 'data');
      }
    }, 2000);
  };

  return (
    <div className={`${isDashboardView ? 'p-6 sm:p-10' : 'section-container pt-24'}`}>
      <div className={`text-center ${isDashboardView ? 'mb-10' : 'mb-12'}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="badge-new inline-block mb-4"
        >
          Insights Engine
        </motion.div>
        <h1 className={`${isDashboardView ? 'text-3xl' : 'text-4xl md:text-5xl'} font-bold mb-4`}>AI Data Scientist 📊</h1>
        <p className="text-[var(--muted-text)] text-base max-w-2xl mx-auto">
          Upload your business data and get instant answers to your most pressing questions with high-speed AI analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Side: Inputs */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card-new flex-grow"
          >
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Database className="text-indigo-500" size={20} />
              {file ? 'Data Provided' : '1. Provide Data'}
            </h2>
            
            <label className={`relative block border-2 border-dashed border-[var(--border-color)] rounded-2xl ${file ? 'p-6' : 'p-10'} text-center cursor-pointer hover:border-indigo-500 transition-colors group bg-[var(--bg-color)]/30`}>
              <input 
                type="file" 
                accept=".csv" 
                onChange={handleFileChange} 
                className="hidden" 
              />
              <div className="flex flex-col items-center">
                {file ? (
                  <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex flex-col items-center">
                    <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-4" />
                    <span className="font-bold text-indigo-500 text-sm truncate max-w-[200px]">
                      {file.name}
                    </span>
                    <span className="text-[10px] text-[var(--muted-text)] mt-1 uppercase font-bold tracking-widest">
                      {(file.size / 1024).toFixed(1)} KB
                    </span>
                  </motion.div>
                ) : (
                  <>
                    <div className="p-4 bg-indigo-500/10 rounded-full mb-4 group-hover:scale-110 transition-transform">
                      <Upload className="w-8 h-8 text-indigo-500" />
                    </div>
                    <span className="font-bold text-sm">Drop your CSV here</span>
                    <span className="text-xs text-[var(--muted-text)] mt-2">or click to browse files</span>
                  </>
                )}
              </div>
            </label>

            {file && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 space-y-4"
              >
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--muted-text)]">
                  <Activity size={14} /> Sample Preview
                </div>
                <div className="overflow-x-auto rounded-xl border border-[var(--border-color)]">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[var(--bg-color)] border-b border-[var(--border-color)]">
                      <tr>
                        <th className="p-3">ID</th>
                        <th className="p-3">Date</th>
                        <th className="p-3 text-right">Revenue</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-color)]">
                      {[1, 2, 3].map(i => (
                        <tr key={i}>
                          <td className="p-3 opacity-70">{i}</td>
                          <td className="p-3 opacity-70">2026-01-1{i}</td>
                          <td className="p-3 text-right font-bold text-emerald-500">${(Math.random() * 1000).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card-new"
          >
            <label className="block text-sm font-bold uppercase tracking-widest text-indigo-500 mb-4">
              Ask Your Data
            </label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="e.g., What was the total revenue last month?" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={!file}
                className="input-field-new pr-12"
              />
              <button 
                onClick={handleAnalyze} 
                disabled={!file || !query.trim() || isAnalyzing}
                className="absolute right-2 top-2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 disabled:opacity-50 transition-all cursor-pointer border-none"
              >
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Output Panel */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-7"
        >
          <div className="glass-card-new h-full min-h-[500px] flex flex-col p-0 overflow-hidden">
            <div className="px-8 py-4 border-b border-[var(--border-color)] flex items-center justify-between bg-indigo-500/5">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-500 flex items-center gap-2">
                <BarChart size={14} /> AI Analysis Results
              </span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-bold text-[var(--muted-text)] uppercase">AI Ready</span>
              </div>
            </div>

            <div className="p-8 flex-grow">
              <AnimatePresence mode="wait">
                {isAnalyzing ? (
                  <motion.div 
                    key="analyzing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col items-center justify-center space-y-6"
                  >
                    <div className="relative">
                      <div className="w-20 h-20 border-4 border-indigo-500/20 rounded-full"></div>
                      <div className="w-20 h-20 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                      <Database className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-500" />
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold mb-2">Analyzing Patterns...</p>
                      <p className="text-sm text-[var(--muted-text)]">Our AI is processing your business metrics.</p>
                    </div>
                  </motion.div>
                ) : output ? (
                  <motion.div 
                    key="results"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div className="p-6 bg-[var(--bg-color)] rounded-2xl border border-[var(--border-color)] shadow-sm">
                       <h3 className="font-bold text-lg mb-4 text-indigo-500 flex items-center gap-2">
                         <PieChart size={18} /> Summary Insights
                       </h3>
                       <p className="text-[var(--text-color)] leading-relaxed whitespace-pre-wrap opacity-90 text-left">
                         {output}
                       </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                        <p className="text-[10px] font-bold text-emerald-600 uppercase mb-1 text-center">Growth Index</p>
                        <p className="text-2xl font-black text-emerald-500 text-center">+24.5%</p>
                      </div>
                      <div className="p-4 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                        <p className="text-[10px] font-bold text-indigo-600 uppercase mb-1 text-center">Confidence</p>
                        <p className="text-2xl font-black text-indigo-500 text-center">98.2%</p>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center text-[var(--muted-text)] opacity-40 py-20"
                  >
                    <Database size={64} className="mb-6" />
                    <p className="text-lg italic">Ready for analysis.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DataScientist;

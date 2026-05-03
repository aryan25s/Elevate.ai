import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Target, Globe, ExternalLink, Zap, ArrowUpRight, TrendingUp, BarChart } from 'lucide-react';

const SEOAssistant = ({ isDashboardView = false, addToHistory, externalInput, triggerAction }) => {
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [output, setOutput] = useState(null);

  useEffect(() => {
    if (isDashboardView && externalInput && triggerAction > 0) {
      setTopic(externalInput);
      handleGenerate(externalInput);
    }
  }, [triggerAction]);

  const handleGenerate = (keyword = topic) => {
    const finalTopic = keyword || topic;
    if (!finalTopic.trim()) return;
    
    setIsGenerating(true);
    // Simulate generation
    setTimeout(() => {
      setOutput({
        mainKeyword: finalTopic,
        secondaryKeywords: [
          { name: `best ${finalTopic}`, volume: '12K', difficulty: 'Low' },
          { name: `${finalTopic} tips 2026`, volume: '8.5K', difficulty: 'Medium' },
          { name: `how to use ${finalTopic}`, volume: '25K', difficulty: 'High' },
          { name: `${finalTopic} reviews`, volume: '4.2K', difficulty: 'Low' }
        ],
        score: 88,
        difficulty: 'Medium',
        trend: 'Upward'
      });
      setIsGenerating(false);
      if (isDashboardView && addToHistory) {
        addToHistory(`SEO: ${finalTopic}`, 'seo');
      }
    }, 1500);
  };

  return (
    <div className={`${isDashboardView ? 'p-6 sm:p-10' : 'section-container pt-24'}`}>
      <div className={`text-center ${isDashboardView ? 'mb-10' : 'mb-12'}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="badge-new inline-block mb-4"
        >
          Visibility Engine
        </motion.div>
        <h1 className={`${isDashboardView ? 'text-3xl' : 'text-4xl md:text-5xl'} font-bold mb-4`}>AI SEO Assistant 🔍</h1>
        <p className="text-[var(--muted-text)] text-base max-w-2xl mx-auto">
          Get real-time SEO insights and keyword opportunities by typing in the box below.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <AnimatePresence mode="wait">
          {isGenerating ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glass-card-new min-h-[400px] flex flex-col items-center justify-center space-y-6"
            >
              <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
              <p className="text-xl font-bold animate-pulse">Scanning search opportunities...</p>
            </motion.div>
          ) : output ? (
            <motion.div 
              key="results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div className="glass-card-new p-6 border-l-4 border-l-emerald-500">
                   <p className="text-[10px] font-bold text-[var(--muted-text)] uppercase mb-1">SEO Score</p>
                   <div className="text-3xl font-black text-emerald-500">{output.score}</div>
                 </div>
                 <div className="glass-card-new p-6 border-l-4 border-l-indigo-500">
                   <p className="text-[10px] font-bold text-[var(--muted-text)] uppercase mb-1">Difficulty</p>
                   <div className="text-3xl font-black text-indigo-500">{output.difficulty}</div>
                 </div>
                 <div className="glass-card-new p-6 border-l-4 border-l-purple-500">
                   <p className="text-[10px] font-bold text-[var(--muted-text)] uppercase mb-1">Trend</p>
                   <div className="text-3xl font-black text-purple-500">{output.trend}</div>
                 </div>
              </div>

              <div className="glass-card-new p-6">
                <h3 className="font-bold mb-6 flex items-center gap-2 text-indigo-500 uppercase tracking-widest text-xs">
                  <Globe size={18} /> Recommended Keywords for "{output.mainKeyword}"
                </h3>
                <div className="space-y-3">
                  {output.secondaryKeywords.map((kw, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-xl hover:border-indigo-500/50 transition-colors group">
                      <div>
                        <p className="font-bold text-[var(--text-color)]">{kw.name}</p>
                        <div className="flex gap-4 mt-1">
                          <span className="text-[10px] text-[var(--muted-text)] font-bold uppercase tracking-wider">Vol: {kw.volume}</span>
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${kw.difficulty === 'Low' ? 'text-emerald-500' : 'text-amber-500'}`}>
                            {kw.difficulty}
                          </span>
                        </div>
                      </div>
                      <ArrowUpRight size={18} className="text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
              </div>

                <div className="flex justify-center mt-10">
                  <button className="text-indigo-500 text-sm font-bold flex items-center gap-2 hover:underline cursor-pointer bg-transparent border-none group/link">
                    Download Detailed SEO Audit Report <ExternalLink size={14} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                  </button>
                </div>
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card-new min-h-[400px] flex flex-col items-center justify-center text-center opacity-30 py-20"
            >
              <Search size={64} className="mb-6 text-indigo-500" />
              <p className="text-lg font-medium">Search model active. Enter a keyword below.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SEOAssistant;

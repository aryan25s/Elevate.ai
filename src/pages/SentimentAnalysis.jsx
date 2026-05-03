import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Sparkles, Smile, Frown, Meh, Trash2, ShieldCheck, Activity } from 'lucide-react';

const SentimentAnalysis = ({ isDashboardView = false }) => {
  const [feedback, setFeedback] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [output, setOutput] = useState(null);

  const handleAnalyze = () => {
    if (!feedback.trim()) return;
    
    setIsAnalyzing(true);
    // Simulate generation
    setTimeout(() => {
      const lower = feedback.toLowerCase();
      let sentiment = 'Neutral';
      let score = 50;
      let color = 'text-indigo-500';
      let bgColor = 'bg-indigo-500/10';
      let icon = <Meh size={64} className="text-indigo-500" />;
      let phrases = ['General feedback', 'User interaction'];
      
      const posWords = ['great', 'awesome', 'good', 'excellent', 'love', 'amazing', 'best', 'happy'];
      const negWords = ['bad', 'terrible', 'awful', 'hate', 'worst', 'poor', 'slow', 'angry'];
      
      const posCount = posWords.filter(w => lower.includes(w)).length;
      const negCount = negWords.filter(w => lower.includes(w)).length;
      
      if (posCount > negCount) {
        sentiment = 'Positive';
        score = 85 + Math.floor(Math.random() * 10);
        color = 'text-emerald-500';
        bgColor = 'bg-emerald-500/10';
        icon = <Smile size={64} className="text-emerald-500" />;
        phrases = ['Satisfied customer', 'Excellent experience', 'Highly recommended'];
      } else if (negCount > posCount) {
        sentiment = 'Negative';
        score = 15 + Math.floor(Math.random() * 10);
        color = 'text-rose-500';
        bgColor = 'bg-rose-500/10';
        icon = <Frown size={64} className="text-rose-500" />;
        phrases = ['Service failure', 'Frustrated user', 'Poor performance'];
      }
      
      setOutput({ sentiment, score, color, bgColor, icon, phrases });
      setIsAnalyzing(false);
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
          Emotion Intelligence
        </motion.div>
        <h1 className={`${isDashboardView ? 'text-3xl' : 'text-4xl md:text-5xl'} font-bold mb-4`}>Sentiment Analysis 😊</h1>
        <p className="text-[var(--muted-text)] text-base max-w-2xl mx-auto">
          Understand the emotion and intent behind customer feedback in real-time with our neural engine.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card-new"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-indigo-500 flex items-center gap-2">
              <MessageSquare size={16} /> 1. Input Feedback
            </h2>
            <button 
              onClick={() => setFeedback('')}
              className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer border-none bg-transparent"
              title="Clear text"
            >
              <Trash2 size={16} />
            </button>
          </div>
          
          <textarea 
            rows={8}
            placeholder="Paste customer reviews, emails, or social feedback here... e.g. 'I absolutely love the new features!'" 
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="input-field-new resize-none"
          ></textarea>
          
          <button 
            onClick={handleAnalyze} 
            disabled={!feedback.trim() || isAnalyzing}
            className="w-full btn-primary-new flex items-center justify-center gap-2 py-4 mt-6"
          >
            {isAnalyzing ? (
              <>
                <Sparkles size={20} className="animate-spin" />
                Processing Sentiment...
              </>
            ) : (
              <>
                <Activity size={20} />
                Analyze Tone
              </>
            )}
          </button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card-new flex flex-col items-center justify-center text-center overflow-hidden relative"
        >
          <AnimatePresence mode="wait">
            {isAnalyzing ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-col items-center"
              >
                <div className="w-24 h-24 border-8 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin mb-8"></div>
                <p className="text-xl font-bold animate-pulse">Scanning Emotions...</p>
              </motion.div>
            ) : output ? (
              <motion.div 
                key="result"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full"
              >
                <div className="mb-8 flex flex-col items-center">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 10 }}
                    className="mb-4"
                  >
                    {output.icon}
                  </motion.div>
                  <h3 className={`text-4xl font-black mb-1 ${output.color}`}>{output.sentiment}</h3>
                  <p className="text-sm font-bold text-[var(--muted-text)] uppercase tracking-widest">Analysis Result</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className={`p-4 rounded-2xl ${output.bgColor} border border-[var(--border-color)]`}>
                    <p className="text-[10px] font-bold text-[var(--muted-text)] uppercase mb-1">Score</p>
                    <p className={`text-3xl font-black ${output.color}`}>{output.score}%</p>
                  </div>
                  <div className="p-4 bg-gray-500/5 rounded-2xl border border-[var(--border-color)]">
                    <p className="text-[10px] font-bold text-[var(--muted-text)] uppercase mb-1">Reliability</p>
                    <p className="text-3xl font-black text-indigo-500">High</p>
                  </div>
                </div>

                <div className="text-left">
                  <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted-text)] mb-4 flex items-center gap-2">
                    <ShieldCheck size={14} className="text-emerald-500" /> Neural Extract
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {output.phrases.map((phrase, i) => (
                      <span key={i} className="px-3 py-1 bg-white/5 border border-[var(--border-color)] rounded-lg text-xs font-medium">
                        {phrase}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                className="opacity-30 flex flex-col items-center py-20"
              >
                <Sparkles size={80} className="mb-6 text-indigo-500" />
                <p className="text-lg italic font-medium">Emotion engine ready.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default SentimentAnalysis;

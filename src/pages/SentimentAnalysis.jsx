import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Sparkles, Smile, Frown, Meh, Trash2, ShieldCheck, Activity } from 'lucide-react';

const SentimentAnalysis = ({ isDashboardView = false, addToHistory, externalInput, triggerAction }) => {
  const [feedback, setFeedback] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [output, setOutput] = useState(null);

  useEffect(() => {
    if (isDashboardView && externalInput && triggerAction > 0) {
      setFeedback(externalInput);
      handleAnalyze(externalInput);
    }
  }, [triggerAction]);

  const handleAnalyze = (text = feedback) => {
    const finalText = text || feedback;
    if (!finalText.trim()) return;
    
    setIsAnalyzing(true);
    // Simulate generation
    setTimeout(() => {
      const lower = finalText.toLowerCase();
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
      if (isDashboardView && addToHistory) {
        addToHistory(`Tone: ${finalText.substring(0, 15)}...`, 'sentiment');
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
          Emotion Intelligence
        </motion.div>
        <h1 className={`${isDashboardView ? 'text-3xl' : 'text-4xl md:text-5xl'} font-bold mb-4`}>Sentiment Analysis 😊</h1>
        <p className="text-[var(--muted-text)] text-base max-w-2xl mx-auto">
          Understand the emotion and intent behind customer feedback in real-time by pasting text in the box below.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card-new flex flex-col items-center justify-center text-center overflow-hidden min-h-[400px] shadow-indigo-500/5"
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
                <p className="text-xl font-bold animate-pulse tracking-wide text-indigo-400">Decoding Emotions...</p>
              </motion.div>
            ) : output ? (
              <motion.div 
                key="result"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full p-2"
              >
                <div className="mb-10 flex flex-col items-center">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 12 }}
                    className="mb-4"
                  >
                    {output.icon}
                  </motion.div>
                  <h3 className={`text-5xl font-black mb-1 ${output.color}`}>{output.sentiment}</h3>
                  <p className="text-xs font-bold text-[var(--muted-text)] uppercase tracking-widest mt-2">Overall Perspective</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-10 px-4">
                  <div className={`p-5 rounded-2xl ${output.bgColor} border border-white/5`}>
                    <p className="text-[10px] font-bold text-[var(--muted-text)] uppercase mb-1">Score</p>
                    <p className={`text-3xl font-black ${output.color}`}>{output.score}%</p>
                  </div>
                  <div className="p-5 bg-gray-500/5 rounded-2xl border border-white/5">
                    <p className="text-[10px] font-bold text-[var(--muted-text)] uppercase mb-1">Analysis</p>
                    <p className="text-3xl font-black text-indigo-500">Precise</p>
                  </div>
                </div>

                <div className="text-left px-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted-text)] mb-4 flex items-center gap-2">
                    <ShieldCheck size={14} className="text-emerald-500" /> Key Emotion Tags
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {output.phrases.map((phrase, i) => (
                      <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs font-semibold">
                        {phrase}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="opacity-30 flex flex-col items-center py-20"
              >
                <Activity size={80} className="mb-6 text-indigo-500" />
                <p className="text-lg italic font-medium text-indigo-400">Emotion engine ready. Paste text below.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default SentimentAnalysis;

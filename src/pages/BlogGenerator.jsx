import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PenTool, Copy, RefreshCw, FileText, Layout, Send, Sparkles } from 'lucide-react';

const BlogGenerator = ({ isDashboardView = false, addToHistory, externalInput, triggerAction }) => {
  const [title, setTitle] = useState('');
  const [keywords, setKeywords] = useState('');
  const [wordCount, setWordCount] = useState(500);
  const [isGenerating, setIsGenerating] = useState(false);
  const [blog, setBlog] = useState('');

  useEffect(() => {
    if (isDashboardView && externalInput && triggerAction > 0) {
      setTitle(externalInput);
      handleGenerate(externalInput);
    }
  }, [triggerAction]);

  const handleGenerate = (topic = title) => {
    const finalTitle = topic || title;
    if (!finalTitle.trim()) return;
    setIsGenerating(true);
    // Simulate generation
    setTimeout(() => {
      setBlog(`# ${finalTitle}\n\n**Keywords**: ${keywords}\n**Word Count Goal**: ${wordCount}\n\n## The Future of the Digital Landscape\n\nArtificial Intelligence is fundamentally reshaping how we approach content creation. By leveraging advanced language models, businesses can now produce high-quality drafts in a fraction of the time.\n\n### Key Benefits\n- Increased efficiency\n- Data-driven insights\n- Personalized messaging\n\n### Conclusion\n\nEmbracing these tools is no longer optional for those looking to stay competitive in the 2026 digital economy.`);
      setIsGenerating(false);
      if (isDashboardView && addToHistory) {
        addToHistory(finalTitle, 'blog');
      }
    }, 2000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(blog);
    alert('Blog copied to clipboard!');
  };

  return (
    <div className={`${isDashboardView ? 'p-6 sm:p-10' : 'section-container pt-24'}`}>
      <div className={`text-center ${isDashboardView ? 'mb-10' : 'mb-12'}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="badge-new inline-block mb-4"
        >
          Content Engine
        </motion.div>
        <h1 className={`${isDashboardView ? 'text-3xl' : 'text-4xl md:text-5xl'} font-bold mb-4`}>AI Blog Generator ✍️</h1>
        <p className="text-[var(--muted-text)] text-base max-w-2xl mx-auto">
          Create SEO-optimized blog posts in seconds. Simply enter your topic in the box below.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Output Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card-new min-h-[400px] flex flex-col p-0 overflow-hidden shadow-indigo-500/5"
        >
          <div className="px-8 py-4 border-b border-[var(--border-color)] bg-gray-50 dark:bg-[var(--card-bg)]/50 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-500 flex items-center gap-2">
              <FileText size={14} /> AI Draft
            </span>
            {blog && !isGenerating && (
              <button 
                onClick={copyToClipboard}
                className="text-xs font-bold hover:text-indigo-500 transition-colors flex items-center gap-1 cursor-pointer border-none bg-transparent"
              >
                <Copy size={14} /> Copy Content
              </button>
            )}
          </div>

          <div className="p-8 flex-grow overflow-y-auto max-h-[70vh]">
            <AnimatePresence mode="wait">
              {isGenerating ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center h-[300px] space-y-4 opacity-50"
                >
                  <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="font-medium animate-pulse">Drafting your content...</p>
                </motion.div>
              ) : blog ? (
                <motion.div 
                  key="content"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="prose dark:prose-invert max-w-none whitespace-pre-wrap font-serif leading-relaxed text-lg"
                >
                  {blog}
                </motion.div>
              ) : (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-[300px] flex flex-col items-center justify-center text-center text-[var(--muted-text)] opacity-40"
                >
                  <PenTool size={64} className="mb-6" />
                  <p className="text-lg italic">Your generated blog will appear here.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BlogGenerator;

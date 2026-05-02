import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PenTool, Copy, RefreshCw, FileText, Layout, Send } from 'lucide-react';

const BlogGenerator = () => {
  const [title, setTitle] = useState('');
  const [keywords, setKeywords] = useState('');
  const [wordCount, setWordCount] = useState(500);
  const [isGenerating, setIsGenerating] = useState(false);
  const [blog, setBlog] = useState('');

  const handleGenerate = () => {
    if (!title.trim()) return;
    setIsGenerating(true);
    // Simulate generation
    setTimeout(() => {
      setBlog(`# ${title}\n\n**Keywords**: ${keywords}\n**Word Count Goal**: ${wordCount}\n\n## The Future of the Digital Landscape\n\nArtificial Intelligence is fundamentally reshaping how we approach content creation. By leveraging advanced language models, businesses can now produce high-quality drafts in a fraction of the time.\n\n### Key Benefits\n- Increased efficiency\n- Data-driven insights\n- Personalized messaging\n\n### Conclusion\n\nEmbracing these tools is no longer optional for those looking to stay competitive in the 2026 digital economy.`);
      setIsGenerating(false);
    }, 2000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(blog);
    alert('Blog copied to clipboard!');
  };

  return (
    <div className="section-container pt-24">
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="badge-new inline-block mb-4"
        >
          Content Engine
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">AI Blog Generator ✍️</h1>
        <p className="text-[var(--muted-text)] text-lg max-w-2xl mx-auto">
          Create SEO-optimized blog posts in seconds. Simply enter your topic and let the AI do the heavy lifting.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Input Panel */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card-new space-y-6"
        >
          <div className="flex items-center gap-2 mb-2 font-bold text-indigo-500 uppercase tracking-widest text-xs">
            <Layout size={14} /> 1. Configuration
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 opacity-80">Blog Title</label>
              <input 
                type="text" 
                placeholder="e.g., The Future of Artificial Intelligence" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-field-new"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 opacity-80">Keywords (comma separated)</label>
              <input 
                type="text" 
                placeholder="e.g., AI, Machine Learning"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="input-field-new"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium opacity-80">Word Count</label>
                <span className="text-indigo-500 font-bold text-sm">{wordCount} words</span>
              </div>
              <input 
                type="range" 
                min="200" 
                max="2000" 
                step="100" 
                value={wordCount}
                onChange={(e) => setWordCount(Number(e.target.value))}
                className="w-full h-2 bg-[var(--border-color)] rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
          </div>
          
          <button 
            onClick={handleGenerate} 
            disabled={!title.trim() || isGenerating}
            className="w-full btn-primary-new flex items-center justify-center gap-2 py-4"
          >
            {isGenerating ? (
              <>
                <RefreshCw size={20} className="animate-spin" />
                Drafting Masterpiece...
              </>
            ) : (
              <>
                <Send size={20} />
                Generate Blog
              </>
            )}
          </button>
        </motion.div>

        {/* Output Section */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card-new min-h-[500px] flex flex-col p-0 overflow-hidden shadow-indigo-500/5"
        >
          <div className="px-8 py-4 border-b border-[var(--border-color)] bg-gray-50 dark:bg-[var(--card-bg)]/50 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-500 flex items-center gap-2">
              <FileText size={14} /> AI Draft
            </span>
            {blog && (
              <button 
                onClick={copyToClipboard}
                className="text-xs font-bold hover:text-indigo-500 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Copy size={14} /> Copy
              </button>
            )}
          </div>

          <div className="p-8 flex-grow overflow-y-auto max-h-[600px]">
            <AnimatePresence mode="wait">
              {isGenerating ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center h-full space-y-4 opacity-50"
                >
                  <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="font-medium animate-pulse">AI is thinking...</p>
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
                  className="h-full flex flex-col items-center justify-center text-center text-[var(--muted-text)] opacity-40 py-20"
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

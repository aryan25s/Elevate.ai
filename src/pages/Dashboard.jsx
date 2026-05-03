import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  MessageSquare, 
  ChevronDown, 
  Send, 
  Sparkles, 
  PenTool, 
  Search, 
  BarChart3, 
  Smile, 
  Menu, 
  X,
  Clock,
  LogOut,
  Paperclip
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = ({ defaultModel = 'blog' }) => {
  const [currentModel, setCurrentModel] = useState(defaultModel);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [history, setHistory] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const models = [
    { id: 'blog', name: 'Blog Generator', icon: <PenTool size={18} />, placeholder: 'Enter blog topic...' },
    { id: 'seo', name: 'SEO Optimization', icon: <Search size={18} />, placeholder: 'Ask SEO optimization...' },
    { id: 'data', name: 'Data Scientist', icon: <BarChart3 size={18} />, placeholder: 'Ask data analysis...' },
    { id: 'sentiment', name: 'Sentiment Analysis', icon: <Smile size={18} />, placeholder: 'Analyze sentiment...' },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isGenerating) return;

    const query = inputValue;
    const userMessage = { role: 'user', content: query };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsGenerating(true);

    // Simulate AI Response based on model
    setTimeout(() => {
      let aiResponse = "";
      if (currentModel === 'blog') {
        aiResponse = `# Generated Blog: ${query}\n\nArtificial Intelligence is at the forefront of digital transformation... (simulated content)`;
      } else if (currentModel === 'seo') {
        aiResponse = `### SEO Insights for: "${query}"\n\nTarget Keywords: AI tools, best automation 2026\nDifficulty: Low\nSearch Volume: 15K/mo`;
      } else if (currentModel === 'data') {
        aiResponse = `### Data Analysis Complete\n\nKey finding for "${query}": Your revenue grew by 12% in the last month despite market fluctuations. (Based on file: ${uploadedFile ? uploadedFile.name : 'No file uploaded'})`;
      } else if (currentModel === 'sentiment') {
        aiResponse = `### Sentiment Analysis Result:\n\nTone: Positive (92%)\nEmotion Detected: Excitement\nRecommended Action: Engagement.`;
      }

      setMessages(prev => [...prev, { role: 'ai', content: aiResponse, model: currentModel }]);
      setIsGenerating(false);
      
      // Update history
      setHistory(prev => {
        const title = query.length > 25 ? query.substring(0, 25) + '...' : query;
        // Check if title already exists to avoid duplicates in this simple demo
        if (prev.some(h => h.title === title)) return prev;
        return [{ id: Date.now(), title, model: currentModel }, ...prev];
      });
    }, 1500);
  };

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const currentModelData = models.find(m => m.id === currentModel);

  return (
    <div className="flex h-screen bg-[#030014] text-white overflow-hidden font-['Inter']">
      {/* Hidden File Input */}
      <input 
        type="file" 
        accept=".csv" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
      />

      {/* Sidebar */}
      <AnimatePresence mode='wait'>
        {isSidebarOpen && (
          <motion.aside 
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            exit={{ x: -260 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="w-[260px] bg-[#0A0A0B] border-r border-white/5 flex flex-col h-full z-40 shrink-0"
          >
            <div className="p-6">
              <Link to="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                Elevate AI
              </Link>
            </div>

            <div className="px-4 mb-4">
              <button 
                onClick={() => setMessages([])}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-indigo-500/50 transition-all group shadow-lg"
              >
                <Plus size={18} className="text-indigo-400 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-semibold text-gray-200">New Chat</span>
              </button>
            </div>

            <div className="flex-grow overflow-y-auto px-2 space-y-1 py-2 custom-scrollbar">
              <div className="px-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Clock size={10} /> Recent History
              </div>
              {history.length === 0 ? (
                <div className="px-3 py-4 text-xs text-gray-600 italic">No recent activity</div>
              ) : (
                history.map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => {
                      setCurrentModel(item.model);
                    }}
                    className={`w-full text-left px-3 py-3 rounded-lg hover:bg-white/5 group flex items-center gap-3 text-sm transition-all overflow-hidden whitespace-nowrap ${currentModel === item.model ? 'bg-white/5 text-white' : 'text-gray-400'}`}
                  >
                    <MessageSquare size={14} className="shrink-0 opacity-50" />
                    <span className="truncate">{item.title}</span>
                  </button>
                ))
              )}
            </div>

            <div className="p-4 border-t border-white/5 space-y-2">
              <button 
                onClick={() => navigate('/')}
                className="w-full flex items-center gap-3 px-3 py-3 hover:bg-white/5 rounded-lg text-sm text-gray-400 hover:text-white transition-colors"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <div className="flex flex-col flex-grow relative h-full min-w-0">
        {/* Top Navbar */}
        <header className="h-16 border-b border-white/5 bg-[#030014]/80 backdrop-blur-md flex items-center justify-between px-6 z-30 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/5 rounded-lg text-gray-400 transition-colors">
              <Menu size={20} />
            </button>
            <Link to="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 hidden sm:block">
              Elevate AI
            </Link>
          </div>

          <div className="relative">
            <button 
              onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all text-sm font-semibold group"
            >
              <span className="text-indigo-400">{currentModelData.icon}</span>
              <span>{currentModelData.name}</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${isModelDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isModelDropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full right-0 mt-2 w-64 bg-[#0A0A0B] border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-2 z-50"
                >
                  {models.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => {
                        setCurrentModel(model.id);
                        setIsModelDropdownOpen(false);
                      }}
                      className={`w-full text-left p-3 rounded-xl flex items-start gap-3 transition-all ${
                        currentModel === model.id ? 'bg-indigo-600/10 border border-indigo-500/20' : 'hover:bg-white/5'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${currentModel === model.id ? 'text-indigo-400' : 'text-gray-500'}`}>
                        {model.icon}
                      </div>
                      <div>
                        <div className={`text-sm font-bold ${currentModel === model.id ? 'text-white' : 'text-gray-300'}`}>{model.name}</div>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold shadow-lg shadow-indigo-600/20">
            AP
          </div>
        </header>

        {/* Content Area (Chat Messages) */}
        <main className="flex-grow relative h-full overflow-y-auto custom-scrollbar pb-40">
          <div className="max-w-3xl mx-auto w-full px-6 py-10 space-y-10">
            {messages.length === 0 ? (
              <div className="h-[50vh] flex items-center justify-center">
                {/* Purposely empty per requirement */}
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {messages.map((msg, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-5 ${msg.role === 'user' ? 'justify-end' : ''}`}
                  >
                    {msg.role === 'ai' && (
                      <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                        <Sparkles size={16} />
                      </div>
                    )}
                    <div className={`max-w-[85%] rounded-2xl p-5 text-sm leading-relaxed shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-indigo-600 text-white shadow-indigo-600/20' 
                        : 'bg-white/5 border border-white/5 text-gray-200'
                    }`}>
                      <div className="prose prose-invert prose-sm max-w-none">
                        {msg.content.split('\n').map((line, k) => (
                          <p key={k} className={line.trim() === "" ? "h-2" : ""}>{line}</p>
                        ))}
                      </div>
                    </div>
                    {msg.role === 'user' && (
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-gray-400 shrink-0 font-bold text-xs">
                        AP
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
            {isGenerating && (
              <div className="flex gap-5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                  <Sparkles size={16} className="animate-pulse" />
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </main>

        {/* Global Bottom Input Bar */}
        <div className="fixed bottom-0 right-0 p-6 bg-gradient-to-t from-[#030014] via-[#030014] to-transparent z-50 transition-all duration-300" 
             style={{ left: isSidebarOpen ? '260px' : '0' }}>
          <div className="max-w-3xl mx-auto relative group">
            <form onSubmit={handleSend} className="flex items-center gap-3">
              {currentModel === 'data' && (
                <button 
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 text-gray-400 transition-all shadow-lg shrink-0 flex items-center justify-center group/plus"
                  title="Upload CSV"
                >
                  <Plus size={24} className="group-hover/plus:text-indigo-400 transition-colors" />
                </button>
              )}
              <div className="relative flex-grow">
                <input 
                  type="text"
                  placeholder={currentModelData.placeholder}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full bg-[#0D0D0E] border border-white/10 rounded-[24px] px-7 py-5 pr-16 text-base focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-2xl placeholder:text-gray-600"
                />
                <button 
                  type="submit"
                  disabled={!inputValue.trim() || isGenerating}
                  className="absolute right-3 top-3 p-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-500 disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-600/20"
                >
                  <Send size={20} />
                </button>
              </div>
            </form>
            {uploadedFile && currentModel === 'data' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -top-10 left-0 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full flex items-center gap-2"
              >
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">
                  Attached: {uploadedFile.name}
                </span>
              </motion.div>
            )}
            <p className="text-[10px] text-center mt-4 text-gray-600 font-medium tracking-wide">
              Elevate AI can make mistakes. Consider checking important information.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
};

export default Dashboard;

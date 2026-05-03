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
  Copy,
  Check
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import BlogGenerator from './BlogGenerator';
import SEOAssistant from './SEOAssistant';
import DataScientist from './DataScientist';
import SentimentAnalysis from './SentimentAnalysis';

const Dashboard = ({ defaultModel = 'blog' }) => {
  const [currentModel, setCurrentModel] = useState(defaultModel);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState([
    { id: 1, title: 'AI in 2026 Blog', model: 'blog' },
    { name: 2, title: 'SEO Audit: React Store', model: 'seo' },
    { name: 3, title: 'Sales Q3 Data Analysis', model: 'data' },
  ]);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const models = [
    { id: 'blog', name: 'Blog Generator', icon: <PenTool size={18} />, desc: 'Write SEO-optimized blog posts.' },
    { id: 'seo', name: 'SEO Optimization', icon: <Search size={18} />, desc: 'Keyword research and strategies.' },
    { id: 'data', name: 'Data Scientist', icon: <BarChart3 size={18} />, desc: 'Analyze CSV files for insights.' },
    { id: 'sentiment', name: 'Sentiment Analysis', icon: <Smile size={18} />, desc: 'Understand text emotions.' },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isGenerating) return;

    const userMessage = { role: 'user', content: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsGenerating(true);

    // Simulate AI Response based on model
    setTimeout(() => {
      let aiResponse = "";
      if (currentModel === 'blog') {
        aiResponse = `Generated Blog Draft for: "${inputValue}"\n\nArtificial Intelligence is at the forefront of digital transformation... (simulated content)`;
      } else if (currentModel === 'seo') {
        aiResponse = `SEO Insights for: "${inputValue}"\n\nTarget Keywords: AI tools, best automation 2026\nDifficulty: Low\nSearch Volume: 15K/mo`;
      } else if (currentModel === 'data') {
        aiResponse = `Data Analysis Complete for query: "${inputValue}"\n\nKey finding: Your revenue grew by 12% in the last month despite market fluctuations.`;
      } else if (currentModel === 'sentiment') {
        aiResponse = `Sentiment Analysis Result:\n\nTone: Positive (92%)\nEmotion Detected: Excitement\nRecommended Action: Engagement.`;
      }

      setMessages(prev => [...prev, { role: 'ai', content: aiResponse, model: currentModel }]);
      setIsGenerating(false);
      
      // Update history if first message
      if (messages.length === 0) {
        setHistory(prev => [{ id: Date.now(), title: inputValue.slice(0, 20) + '...', model: currentModel }, ...prev]);
      }
    }, 1500);
  };

  const currentModelData = models.find(m => m.id === currentModel);

  // We'll import components here as lazy or static depending on preference
  // For this environment, we will assume they are in the same folder
  // Note: I will map these to the existing tool components
  const renderModelUI = () => {
    const commonProps = { isDashboardView: true };
    switch (currentModel) {
      case 'blog': return <BlogGenerator {...commonProps} />;
      case 'seo': return <SEOAssistant {...commonProps} />;
      case 'data': return <DataScientist {...commonProps} />;
      case 'sentiment': return <SentimentAnalysis {...commonProps} />;
      default: return <BlogGenerator {...commonProps} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#030014] text-white overflow-hidden font-['Inter']">
      {/* Sidebar */}
      <AnimatePresence mode='wait'>
        {isSidebarOpen && (
          <motion.aside 
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            exit={{ x: -260 }}
            className="w-[260px] bg-[#0A0A0B] border-r border-white/5 flex flex-col h-full z-40 shrink-0"
          >
            <div className="p-4">
              <button 
                onClick={() => setCurrentModel('blog')}
                className="w-full flex items-center gap-3 px-3 py-3 border border-white/10 rounded-lg hover:bg-white/5 transition-colors text-sm font-medium"
              >
                <Plus size={16} /> New Session
              </button>
            </div>

            <div className="flex-grow overflow-y-auto px-2 space-y-1 py-2 custom-scrollbar">
              <div className="px-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Clock size={10} /> Recent History
              </div>
              {history.map((item) => (
                <button 
                  key={item.id}
                  onClick={() => setCurrentModel(item.model)}
                  className={`w-full text-left px-3 py-3 rounded-lg hover:bg-white/5 group flex items-center gap-3 text-sm transition-all overflow-hidden whitespace-nowrap ${currentModel === item.model ? 'bg-white/5 text-white' : 'text-gray-400'}`}
                >
                  <MessageSquare size={14} className="shrink-0 opacity-50" />
                  <span className="truncate">{item.title}</span>
                </button>
              ))}
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
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/5 rounded-lg text-gray-400">
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
                        <div className="text-[10px] text-gray-500 leading-tight mt-0.5">{model.desc}</div>
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

        {/* Content Area */}
        <main className="flex-grow relative h-full overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentModel}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {renderModelUI()}
            </motion.div>
          </AnimatePresence>
        </main>
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

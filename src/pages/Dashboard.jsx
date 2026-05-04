import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, MessageSquare, ChevronDown, Sparkles,
  PenTool, Search, BarChart3, Smile, Menu,
  Clock, LogOut, Trash2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getConversations, getMessages, archiveConversation } from '../lib/api';
import ChatInterface from '../components/ChatInterface';

const SERVICE_SLUG = {
  blog:      'blog_generator',
  seo:       'seo_optimizer',
  data:      'ai_data_scientist',
  sentiment: 'sentiment_analysis',
};

const MODELS = [
  { id: 'blog',      name: 'Blog Generator',    icon: <PenTool size={16} />,   desc: 'Write SEO-optimized blog posts.' },
  { id: 'seo',       name: 'SEO Optimizer',     icon: <Search size={16} />,    desc: 'Keyword research & strategies.' },
  { id: 'data',      name: 'Data Scientist',    icon: <BarChart3 size={16} />, desc: 'Analyze data for insights.' },
  { id: 'sentiment', name: 'Sentiment Analysis',icon: <Smile size={16} />,     desc: 'Understand text emotions.' },
];

const Dashboard = ({ defaultModel = 'blog' }) => {
  const [currentModel, setCurrentModel] = useState(defaultModel);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [session, setSession] = useState(null);
  const [token, setToken] = useState(null);
  const [userInitials, setUserInitials] = useState('??');

  const [conversationIds, setConversationIds] = useState({
    blog: null, seo: null, data: null, sentiment: null,
  });

  // Pre-loaded messages when clicking sidebar — avoids a second fetch in ChatInterface
  const [loadedMessages, setLoadedMessages] = useState({
    blog: null, seo: null, data: null, sentiment: null,
  });

  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const navigate = useNavigate();

  // Auth
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { navigate('/login'); return; }
      setSession(session);
      setToken(session.access_token);
      setUserInitials((session.user.email || '??').slice(0, 2).toUpperCase());
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) { navigate('/login'); return; }
      setSession(session);
      setToken(session.access_token);
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  // Load sidebar
  const loadHistory = useCallback(async () => {
    if (!token) return;
    setHistoryLoading(true);
    try {
      const data = await getConversations(token);
      setHistory(data || []);
    } catch (err) {
      console.error('Failed to load conversations:', err);
    } finally {
      setHistoryLoading(false);
    }
  }, [token]);

  useEffect(() => { loadHistory(); }, [loadHistory]);

  // New conversation created by ChatInterface
  const handleConversationCreated = useCallback((modelId, conversationId) => {
    setConversationIds(prev => ({ ...prev, [modelId]: conversationId }));
    loadHistory();
  }, [loadHistory]);

  // Click sidebar item — switch model + load messages
  const handleLoadConversation = async (convo) => {
    const slug = convo.services?.slug;
    const modelId = Object.keys(SERVICE_SLUG).find(k => SERVICE_SLUG[k] === slug);
    if (!modelId || !token) return;

    setCurrentModel(modelId);
    setConversationIds(prev => ({ ...prev, [modelId]: convo.id }));

    // Fetch and pre-load messages so there's no flicker
    try {
      const messages = await getMessages(convo.id, token);
      setLoadedMessages(prev => ({ ...prev, [modelId]: messages || [] }));
    } catch (err) {
      console.error('Failed to load messages:', err);
      setLoadedMessages(prev => ({ ...prev, [modelId]: [] }));
    }
  };

  const handleNewChat = () => {
    setConversationIds(prev => ({ ...prev, [currentModel]: null }));
    setLoadedMessages(prev => ({ ...prev, [currentModel]: null }));
  };

  const handleModelSwitch = (modelId) => {
    setCurrentModel(modelId);
    setIsModelDropdownOpen(false);
  };

  const handleArchive = async (e, convoId) => {
    e.stopPropagation();
    try {
      await archiveConversation(convoId, token);
      setHistory(prev => prev.filter(c => c.id !== convoId));
      Object.entries(conversationIds).forEach(([modelId, id]) => {
        if (id === convoId) {
          setConversationIds(prev => ({ ...prev, [modelId]: null }));
          setLoadedMessages(prev => ({ ...prev, [modelId]: null }));
        }
      });
    } catch (err) {
      console.error('Failed to archive:', err);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const currentModelData = MODELS.find(m => m.id === currentModel);
  if (!session) return null;

  return (
    <div className="flex h-screen bg-[#030014] text-white overflow-hidden">

      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -260, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -260, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-[260px] bg-[#0A0A0F] border-r border-white/5 flex flex-col h-full shrink-0 z-40"
          >
            <div className="p-4 border-b border-white/5">
              <div className="flex items-center gap-2 px-1 mb-4">
                <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <Sparkles size={12} className="text-white" />
                </div>
                <span className="font-semibold text-sm">Elevate AI</span>
              </div>
              <button
                onClick={handleNewChat}
                className="w-full flex items-center gap-2 px-3 py-2.5 bg-white/5 hover:bg-white/8 border border-white/8 rounded-xl text-sm font-medium text-gray-300 hover:text-white transition-all"
              >
                <Plus size={15} /> New chat
              </button>
            </div>

            <div className="flex-grow overflow-y-auto py-3 px-2 custom-scrollbar">
              <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest px-3 mb-2 flex items-center gap-1.5">
                <Clock size={9} /> Recent
              </p>
              {historyLoading && <p className="px-3 text-xs text-gray-700 animate-pulse py-2">Loading...</p>}
              {!historyLoading && history.length === 0 && (
                <p className="px-3 text-xs text-gray-700 italic py-2">No conversations yet.</p>
              )}
              {history.map((convo) => {
                const slug = convo.services?.slug;
                const modelId = Object.keys(SERVICE_SLUG).find(k => SERVICE_SLUG[k] === slug);
                const isActive = conversationIds[modelId] === convo.id && currentModel === modelId;
                return (
                  <button
                    key={convo.id}
                    onClick={() => handleLoadConversation(convo)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/5 group flex items-center gap-2.5 text-xs transition-all mb-0.5 ${
                      isActive ? 'bg-white/5 text-white' : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    <MessageSquare size={12} className="shrink-0 opacity-40" />
                    <span className="truncate flex-1">{convo.title || 'Untitled'}</span>
                    <Trash2
                      size={11}
                      className="shrink-0 opacity-0 group-hover:opacity-40 hover:!opacity-100 text-rose-400 transition-opacity"
                      onClick={(e) => handleArchive(e, convo.id)}
                    />
                  </button>
                );
              })}
            </div>

            <div className="p-3 border-t border-white/5">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-white/5 rounded-xl text-xs text-gray-600 hover:text-gray-400 transition-colors"
              >
                <LogOut size={13} /> Logout
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex flex-col flex-grow h-full min-w-0">
        <header className="h-14 border-b border-white/5 bg-[#030014]/80 backdrop-blur-md flex items-center justify-between px-4 shrink-0 z-30">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-white/5 rounded-lg text-gray-500 hover:text-gray-300 transition-colors"
          >
            <Menu size={18} />
          </button>

          <div className="relative">
            <button
              onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/5 rounded-xl transition-all text-sm font-medium"
            >
              <span className="text-indigo-400">{currentModelData.icon}</span>
              <span className="text-gray-200">{currentModelData.name}</span>
              <ChevronDown size={13} className={`text-gray-500 transition-transform ${isModelDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {isModelDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.97 }}
                  transition={{ duration: 0.12 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-[#0F0F14] border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-1.5 z-50"
                >
                  {MODELS.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => handleModelSwitch(model.id)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 transition-all text-sm ${
                        currentModel === model.id
                          ? 'bg-indigo-600/15 text-white'
                          : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                      }`}
                    >
                      <span className={currentModel === model.id ? 'text-indigo-400' : 'text-gray-600'}>
                        {model.icon}
                      </span>
                      <div>
                        <div className="font-medium leading-tight">{model.name}</div>
                        <div className="text-[10px] text-gray-600 mt-0.5">{model.desc}</div>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="w-8 h-8 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-xs font-semibold text-indigo-300">
            {userInitials}
          </div>
        </header>

        <main className="flex-grow relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentModel}-${conversationIds[currentModel]}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="h-full"
            >
              <ChatInterface
                token={token}
                serviceSlug={SERVICE_SLUG[currentModel]}
                conversationId={conversationIds[currentModel]}
                onConversationCreated={(id) => handleConversationCreated(currentModel, id)}
                initialMessages={loadedMessages[currentModel]}
              />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .bg-white\/8 { background: rgba(255,255,255,0.08); }
      `}</style>
    </div>
  );
};

export default Dashboard;
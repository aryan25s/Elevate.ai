import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2, User, Sparkles, Copy, Check, Paperclip, X, BarChart2 } from 'lucide-react';
import { sendMessage, getMessages } from '../lib/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ─── Chart renderer ───────────────────────────────────────────────────────────
function ChartRenderer({ chartConfig }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartConfig || !canvasRef.current || !window.Chart) return;
    if (chartRef.current) chartRef.current.destroy();

    const colors = [
      'rgba(99,102,241,0.8)', 'rgba(16,185,129,0.8)',
      'rgba(245,158,11,0.8)', 'rgba(239,68,68,0.8)', 'rgba(139,92,246,0.8)',
    ];

    chartRef.current = new window.Chart(canvasRef.current, {
      type: chartConfig.type || 'bar',
      data: {
        labels: chartConfig.labels,
        datasets: (chartConfig.datasets || []).map((ds, i) => ({
          ...ds,
          backgroundColor: colors[i % colors.length],
          borderColor: colors[i % colors.length].replace('0.8', '1'),
          borderWidth: 1,
          borderRadius: chartConfig.type === 'bar' ? 4 : 0,
        })),
      },
      options: {
        responsive: true,
        plugins: {
          legend: { labels: { color: '#9ca3af', font: { size: 11 } } },
          title: { display: !!chartConfig.title, text: chartConfig.title, color: '#e5e7eb', font: { size: 13, weight: '500' } },
        },
        scales: chartConfig.type !== 'pie' ? {
          x: { ticks: { color: '#6b7280', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.05)' } },
          y: { ticks: { color: '#6b7280', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.05)' } },
        } : {},
      },
    });

    return () => chartRef.current?.destroy();
  }, [chartConfig]);

  return (
    <div className="mt-3 p-3 rounded-xl border border-white/8" style={{ background: 'rgba(255,255,255,0.03)' }}>
      <canvas ref={canvasRef} />
    </div>
  );
}

// ─── Markdown renderer ────────────────────────────────────────────────────────
function inlineMd(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="text-gray-300">$1</em>')
    .replace(/`(.+?)`/g, '<code class="bg-white/10 text-emerald-300 px-1.5 py-0.5 rounded text-xs font-mono">$1</code>');
}

function MessageContent({ content }) {
  const lines = content.split('\n');
  const elements = [];
  let i = 0, codeBuffer = [], inCode = false;

  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith('```')) {
      if (inCode) {
        elements.push(
          <pre key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 my-3 overflow-x-auto">
            <code className="text-sm text-emerald-300 font-mono leading-relaxed">{codeBuffer.join('\n')}</code>
          </pre>
        );
        codeBuffer = []; inCode = false;
      } else inCode = true;
      i++; continue;
    }
    if (inCode) { codeBuffer.push(line); i++; continue; }

    if      (line.startsWith('### ')) elements.push(<h3 key={i} className="text-base font-semibold text-white mt-4 mb-1">{line.slice(4)}</h3>);
    else if (line.startsWith('## '))  elements.push(<h2 key={i} className="text-lg font-semibold text-white mt-5 mb-2">{line.slice(3)}</h2>);
    else if (line.startsWith('# '))   elements.push(<h1 key={i} className="text-xl font-bold text-white mt-5 mb-2">{line.slice(2)}</h1>);
    else if (line.startsWith('- ') || line.startsWith('* '))
      elements.push(<div key={i} className="flex gap-2 my-0.5"><span className="text-indigo-400 mt-1 shrink-0">•</span><span dangerouslySetInnerHTML={{ __html: inlineMd(line.slice(2)) }} /></div>);
    else if (line.match(/^\d+\. /)) {
      const num = line.match(/^(\d+)\. /)[1];
      elements.push(<div key={i} className="flex gap-2 my-0.5"><span className="text-indigo-400 shrink-0 min-w-[18px]">{num}.</span><span dangerouslySetInnerHTML={{ __html: inlineMd(line.replace(/^\d+\. /, '')) }} /></div>);
    }
    else if (line.startsWith('---')) elements.push(<hr key={i} className="border-white/10 my-3" />);
    else if (line.trim() === '')     elements.push(<div key={i} className="h-2" />);
    else elements.push(<p key={i} className="leading-relaxed" dangerouslySetInnerHTML={{ __html: inlineMd(line) }} />);
    i++;
  }
  return <div className="space-y-0.5 text-sm text-gray-200">{elements}</div>;
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="p-1.5 rounded-lg hover:bg-white/10 text-gray-500 hover:text-gray-300 transition-all">
      {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
    </button>
  );
}

// ─── Welcome screen ───────────────────────────────────────────────────────────
function WelcomeScreen({ config, isDataScientist, onSuggestion, onFileClick }) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 pb-32">
      <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-5 text-2xl">
        {config.icon}
      </div>
      <h2 className="text-2xl font-semibold text-white mb-2">{config.name}</h2>
      <p className="text-gray-500 text-sm mb-6 text-center max-w-xs">{config.placeholder}</p>

      {isDataScientist && (
        <button
          onClick={onFileClick}
          className="flex items-center gap-2 px-4 py-2.5 mb-8 border border-dashed border-white/20 hover:border-indigo-500/50 rounded-xl text-sm text-gray-400 hover:text-indigo-300 transition-all"
        >
          <Paperclip size={15} /> Upload a CSV to get started
        </button>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
        {config.suggestions.map((s, i) => (
          <button key={i} onClick={() => onSuggestion(s)}
            className="text-left p-4 rounded-2xl border border-white/8 hover:border-white/20 hover:bg-white/5 transition-all group">
            <p className="text-sm text-gray-300 group-hover:text-white transition-colors leading-snug">{s}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Service configs ──────────────────────────────────────────────────────────
const SERVICE_CONFIG = {
  blog_generator: {
    name: 'Blog Generator', icon: '✍️',
    placeholder: 'Generate SEO-optimized blog posts in seconds.',
    inputPlaceholder: 'What would you like to write about?',
    suggestions: [
      'Write a blog post about the future of AI in education',
      'Create a 500-word post on remote work productivity tips',
      'Write about sustainable startups and green innovation',
      'Draft an intro for a blog on no-code tools for founders',
    ],
  },
  seo_optimizer: {
    name: 'SEO Optimizer', icon: '🔍',
    placeholder: 'Unlock top search rankings with AI-driven strategies.',
    inputPlaceholder: 'Enter a topic or paste content to optimize...',
    suggestions: [
      'Find keywords for a SaaS productivity app targeting students',
      'Optimize this title: "How AI helps small businesses grow"',
      'Suggest meta descriptions for a startup landing page',
      'What are long-tail keywords for an edtech startup?',
    ],
  },
  sentiment_analysis: {
    name: 'Sentiment Analysis', icon: '😊',
    placeholder: 'Understand the emotion behind any text instantly.',
    inputPlaceholder: 'Paste customer feedback, reviews, or any text...',
    suggestions: [
      '"This product changed my life, absolutely love it!"',
      '"Delivery was late and packaging was damaged. Very disappointed."',
      'Analyze: "The onboarding was okay but the UI needs work"',
      '"Not sure how I feel about this yet, it has pros and cons"',
    ],
  },
  ai_data_scientist: {
    name: 'Data Scientist', icon: '📊',
    placeholder: 'Upload a CSV and ask anything about your data.',
    inputPlaceholder: 'Ask a question about your data...',
    suggestions: [
      'What statistical tests should I use for A/B testing?',
      'Explain the difference between correlation and causation',
      'How do I handle missing values in a dataset?',
      'What does a high p-value mean in hypothesis testing?',
    ],
  },
};

// ─── Main component ───────────────────────────────────────────────────────────
const ChatInterface = ({ token, serviceSlug, conversationId, onConversationCreated, initialMessages = null }) => {
  const [messages, setMessages]           = useState([]);
  const [input, setInput]                 = useState('');
  const [isLoading, setIsLoading]         = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [selectedFile, setSelectedFile]   = useState(null);

  const fileInputRef = useRef(null);
  const bottomRef    = useRef(null);
  const inputRef     = useRef(null);

  const config          = SERVICE_CONFIG[serviceSlug] || SERVICE_CONFIG.blog_generator;
  const isDataScientist = serviceSlug === 'ai_data_scientist';

  // Load history
  useEffect(() => {
    if (!conversationId || !token) { setMessages([]); return; }
    if (initialMessages)           { setMessages(initialMessages); return; }
    setIsLoadingHistory(true);
    getMessages(conversationId, token)
      .then(data => setMessages(data || []))
      .catch(err => console.error('Load messages error:', err))
      .finally(() => setIsLoadingHistory(false));
  }, [conversationId, token, initialMessages]);

  // Auto-scroll
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const appendMsg  = (msg) => setMessages(prev => [...prev, { id: Date.now() + Math.random(), ...msg }]);
  const appendError = (text) => appendMsg({ role: 'assistant', content: text, isError: true });

  // ── Regular text send ────────────────────────────────────────────────────────
  const handleSend = async (text) => {
    const query = (text || input).trim();
    if (!query || isLoading) return;
    setInput('');
    appendMsg({ role: 'user', content: query });
    setIsLoading(true);
    try {
      const data = await sendMessage(query, serviceSlug, conversationId, token);
      appendMsg({ role: 'assistant', content: data.response });
      if (!conversationId && data.conversationId) onConversationCreated(data.conversationId);
    } catch (err) { appendError(`Error: ${err.message}`); }
    finally { setIsLoading(false); inputRef.current?.focus(); }
  };

  // ── CSV file send ────────────────────────────────────────────────────────────
  const handleFileSend = async () => {
    if (!selectedFile || isLoading) return;
    const question = input.trim() || 'Analyze this dataset — give me key insights, trends, and statistics.';

    setInput('');
    setSelectedFile(null);
    appendMsg({ role: 'user', content: `📎 ${selectedFile.name}\n\n${question}` });
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('question', question);
      if (conversationId) formData.append('conversationId', conversationId);

      const res = await fetch(`${API_URL}/files/analyze`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
        // ⚠️ Do NOT set Content-Type — browser handles multipart boundary
      });

      if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Analysis failed'); }

      const data = await res.json();
      appendMsg({ role: 'assistant', content: data.analysis, chart: data.chart || null });

      if (!conversationId && data.conversationId) onConversationCreated(data.conversationId);
    } catch (err) { appendError(`File analysis error: ${err.message}`); }
    finally { setIsLoading(false); inputRef.current?.focus(); }
  };

  const handleSubmit = () => {
    if (isDataScientist && selectedFile) handleFileSend();
    else handleSend();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
  };

  // Send button is enabled if: file selected (data scientist) OR text typed
  const canSend = !isLoading && ((isDataScientist && selectedFile) || input.trim().length > 0);

  return (
    <div className="flex flex-col h-full relative">

      {/* Hidden file picker */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={(e) => { if (e.target.files[0]) setSelectedFile(e.target.files[0]); e.target.value = ''; }}
      />

      {/* Messages */}
      <div className="flex-grow overflow-y-auto px-4 py-6 custom-scrollbar">
        {isLoadingHistory ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 size={24} className="animate-spin text-indigo-400" />
          </div>
        ) : messages.length === 0 ? (
          <WelcomeScreen
            config={config}
            isDataScientist={isDataScientist}
            onSuggestion={handleSend}
            onFileClick={() => fileInputRef.current?.click()}
          />
        ) : (
          <div className="max-w-3xl mx-auto space-y-6 pb-36">
            {messages.map((msg, idx) => (
              <div key={msg.id || idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>

                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 mt-1">
                    <Sparkles size={14} className="text-indigo-400" />
                  </div>
                )}

                <div className={`group max-w-[85%] ${msg.role === 'user' ? 'order-first' : ''}`}>
                  {msg.role === 'user' ? (
                    <div className="bg-indigo-600/20 border border-indigo-500/20 rounded-2xl rounded-tr-md px-4 py-3">
                      <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  ) : (
                    <div className={`rounded-2xl rounded-tl-md px-4 py-3 ${msg.isError ? 'bg-rose-500/10 border border-rose-500/20' : 'bg-white/4 border border-white/8'}`}>
                      <MessageContent content={msg.content} />
                      {/* Chart renders here if Gemini returned a chart config */}
                      {msg.chart && <ChartRenderer chartConfig={msg.chart} />}
                      <div className="flex justify-end mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <CopyButton text={msg.content} />
                      </div>
                    </div>
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center shrink-0 mt-1">
                    <User size={14} className="text-gray-400" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                  <Sparkles size={14} className="text-indigo-400" />
                </div>
                <div className="bg-white/4 border border-white/8 rounded-2xl rounded-tl-md px-4 py-3">
                  <div className="flex gap-1 items-center h-5">
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="absolute bottom-0 left-0 right-0 px-4 pb-6 pt-4 bg-gradient-to-t from-[#030014] via-[#030014]/95 to-transparent">
        <div className="max-w-3xl mx-auto">

          {/* File pill — shown when a CSV is selected */}
          {selectedFile && (
            <div className="flex items-center gap-2 mb-2 px-1">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-xs text-indigo-300">
                <BarChart2 size={12} />
                <span className="max-w-[220px] truncate">{selectedFile.name}</span>
                <span className="text-indigo-500">·</span>
                <span className="text-indigo-500">{(selectedFile.size / 1024).toFixed(1)} KB</span>
                <button onClick={() => setSelectedFile(null)} className="ml-1 hover:text-white transition-colors">
                  <X size={12} />
                </button>
              </div>
            </div>
          )}

          <div className="flex items-end gap-2 bg-white/5 border border-white/10 rounded-2xl px-3 py-3 focus-within:border-indigo-500/50 transition-colors">

            {/* Paperclip — only for data scientist */}
            {isDataScientist && (
              <button
                onClick={() => fileInputRef.current?.click()}
                title="Upload CSV file"
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all shrink-0 mb-0.5 border ${
                  selectedFile
                    ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-400'
                    : 'bg-white/5 border-white/10 text-gray-500 hover:bg-white/10 hover:text-gray-300'
                }`}
              >
                <Paperclip size={14} />
              </button>
            )}

            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px';
              }}
              onKeyDown={handleKeyDown}
              placeholder={
                selectedFile
                  ? 'Ask a question about this file, or press Send for auto-analysis...'
                  : config.inputPlaceholder
              }
              disabled={isLoading}
              className="flex-grow bg-transparent text-sm text-gray-200 placeholder-gray-600 resize-none outline-none leading-relaxed max-h-40 custom-scrollbar"
              style={{ height: '24px' }}
            />

            <button
              onClick={handleSubmit}
              disabled={!canSend}
              className="w-8 h-8 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-white/10 disabled:cursor-not-allowed flex items-center justify-center transition-all shrink-0 mb-0.5"
            >
              {isLoading
                ? <Loader2 size={14} className="animate-spin text-white" />
                : <Send size={14} className="text-white" />
              }
            </button>
          </div>

          <p className="text-center text-[10px] text-gray-700 mt-2">
            Elevate AI can make mistakes. Consider checking important information.
          </p>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.06); border-radius: 10px; }
        .bg-white\/4 { background: rgba(255,255,255,0.04); }
        .border-white\/8 { border-color: rgba(255,255,255,0.08); }
      `}</style>
    </div>
  );
};

export default ChatInterface;
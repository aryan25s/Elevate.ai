import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mail, Globe, User, MessageCircle } from 'lucide-react';

const Footer = () => {
  const location = useLocation();
  return (
    <footer id="footer" className="bg-[var(--card-bg)] border-t border-[var(--border-color)] pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="flex flex-col gap-6">
          <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Elevate AI</h3>
          <p className="text-[var(--muted-text)] text-sm leading-relaxed">
            Empowering students and small businesses with intelligent AI tools to grow faster and smarter.
          </p>
          <div className="flex gap-4">
            {[Globe, User, MessageCircle, Mail].map((Icon, i) => (
              <button key={i} className="p-2 rounded-lg border border-[var(--border-color)] bg-white/5 text-[var(--muted-text)] hover:text-indigo-500 hover:border-indigo-500/50 transition-all cursor-pointer">
                <Icon size={18} />
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest text-[var(--text-color)] mb-6">Features</h4>
          <ul className="flex flex-col gap-4 text-sm text-[var(--muted-text)]">
            {location.pathname === '/' ? (
              <>
                <li><Link to="/blog-generator" target="_blank" className="hover:text-indigo-500 transition-colors">AI Blog Generator</Link></li>
                <li><Link to="/seo" target="_blank" className="hover:text-indigo-500 transition-colors">SEO Optimization</Link></li>
                <li><Link to="/data-science" target="_blank" className="hover:text-indigo-500 transition-colors">Data Analytics</Link></li>
                <li><Link to="/sentiment" target="_blank" className="hover:text-indigo-500 transition-colors">Sentiment Analysis</Link></li>
              </>
            ) : (
              <>
                <li><Link to="/blog-generator" className="hover:text-indigo-500 transition-colors">AI Blog Generator</Link></li>
                <li><Link to="/seo" className="hover:text-indigo-500 transition-colors">SEO Optimization</Link></li>
                <li><Link to="/data-science" className="hover:text-indigo-500 transition-colors">Data Analytics</Link></li>
                <li><Link to="/sentiment" className="hover:text-indigo-500 transition-colors">Sentiment Analysis</Link></li>
              </>
            )}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest text-[var(--text-color)] mb-6">Company</h4>
          <ul className="flex flex-col gap-4 text-sm text-[var(--muted-text)]">
            <li><a href="#" className="hover:text-indigo-400 transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-indigo-400 transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-indigo-400 transition-colors">Blog</a></li>
            <li><a href="#" className="hover:text-indigo-400 transition-colors">Contact</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest text-[var(--text-color)] mb-6">Resources</h4>
          <ul className="flex flex-col gap-4 text-sm text-[var(--muted-text)]">
            <li><a href="#" className="hover:text-indigo-400 transition-colors">Documentation</a></li>
            <li><a href="#" className="hover:text-indigo-400 transition-colors">API Reference</a></li>
            <li><a href="#" className="hover:text-indigo-400 transition-colors">Community</a></li>
            <li><a href="#" className="hover:text-indigo-400 transition-colors">Support</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-[var(--border-color)] flex flex-col md:row justify-between items-center gap-4 text-xs text-[var(--muted-text)]">
        <p>&copy; {new Date().getFullYear()} Elevate AI. All rights reserved.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-[var(--text-color)] transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-[var(--text-color)] transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-[var(--text-color)] transition-colors">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

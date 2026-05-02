import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import BlogGenerator from './pages/BlogGenerator';
import SEOAssistant from './pages/SEOAssistant';
import DataScientist from './pages/DataScientist';
import SentimentAnalysis from './pages/SentimentAnalysis';
import './styles/global.css';

const App = () => {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-color)] text-[var(--text-color)] selection:bg-indigo-500/30">
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog-generator" element={<BlogGenerator />} />
          <Route path="/seo" element={<SEOAssistant />} />
          <Route path="/data-science" element={<DataScientist />} />
          <Route path="/sentiment" element={<SentimentAnalysis />} />
          <Route path="/app" element={<BlogGenerator />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;

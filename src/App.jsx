import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import DataScientist from './pages/DataScientist';
import BlogGenerator from './pages/BlogGenerator';
import SEOAssistant from './pages/SEOAssistant';
import SentimentAnalysis from './pages/SentimentAnalysis';

const App = () => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Check local storage for theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      // Default to user's system preference
      setTheme('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/data-scientist" element={<DataScientist />} />
          <Route path="/blog-generator" element={<BlogGenerator />} />
          <Route path="/seo" element={<SEOAssistant />} />
          <Route path="/sentiment" element={<SentimentAnalysis />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
};

export default App;
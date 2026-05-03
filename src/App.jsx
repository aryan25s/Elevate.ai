import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { useLocation } from 'react-router-dom';
import './styles/global.css';

const App = () => {
  const [theme, setTheme] = useState('dark');
  const location = useLocation();

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

  const isLoginPage = location.pathname === '/login';
  const toolPaths = ['/app', '/blog-generator', '/seo', '/data-science', '/sentiment'];
  const isDashboard = toolPaths.includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-color)] text-[var(--text-color)] selection:bg-indigo-500/30">
      {!isLoginPage && !isDashboard && <Navbar theme={theme} toggleTheme={toggleTheme} />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/app" element={<Dashboard />} />
          {/* Dashboard handled routes */}
          <Route path="/blog-generator" element={<Dashboard defaultModel="blog" />} />
          <Route path="/seo" element={<Dashboard defaultModel="seo" />} />
          <Route path="/data-science" element={<Dashboard defaultModel="data" />} />
          <Route path="/sentiment" element={<Dashboard defaultModel="sentiment" />} />
        </Routes>
      </main>
      {!isLoginPage && !isDashboard && <Footer theme={theme} />}
    </div>
  );
};

export default App;

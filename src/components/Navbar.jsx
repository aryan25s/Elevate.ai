import React, { useState } from 'react';
import { Link, useLocation, NavLink } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';

const Navbar = ({ theme, toggleTheme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toolPaths = ['/blog-generator', '/seo', '/data-science', '/sentiment', '/app'];
  const isAppPage = toolPaths.some(path => location.pathname.startsWith(path));

  const scrollToSection = (id) => {
    setIsOpen(false);
    
    // Check if we are on the page that contains the ID
    const element = document.getElementById(id);
    
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = `/#${id}`;
    }
  };

  const mainNavLinks = [
    { name: 'Features', id: 'features' },
    { name: 'Solutions', id: 'solutions' },
    { name: 'Pricing', id: 'pricing' },
    { name: 'About', id: 'footer' },
  ];

  const appNavLinks = [
    { name: 'Blog Gen', path: '/blog-generator' },
    { name: 'Data Sci', path: '/data-science' },
    { name: 'SEO', path: '/seo' },
    { name: 'Sentiment', path: '/sentiment' },
  ];

  return (
    <nav className="nav-blur">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
          Elevate AI
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-6">
          {!isAppPage ? (
            mainNavLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.id)}
                className="text-sm font-medium text-[var(--muted-text)] hover:text-[var(--text-color)] transition-colors cursor-pointer border-none bg-transparent"
              >
                {link.name}
              </button>
            ))
          ) : (
            appNavLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-[var(--muted-text)] hover:text-[var(--text-color)]'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))
          )}
          
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20 transition-colors cursor-pointer"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {!isAppPage && (
            <Link to="/login" target="_blank" className="btn-primary-new text-sm">
              Get Started
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center space-x-4">
          <button onClick={toggleTheme} className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button className="text-[var(--muted-text)]" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[var(--bg-color)]/95 backdrop-blur-xl p-6 flex flex-col space-y-4 border-b border-[var(--border-color)]">
          {!isAppPage ? (
             mainNavLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.id)}
                  className="text-lg font-medium text-left text-[var(--muted-text)] hover:text-[var(--text-color)] bg-transparent border-none"
                >
                  {link.name}
                </button>
              ))
          ) : (
            appNavLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `text-lg font-medium transition-colors ${
                    isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-[var(--muted-text)] hover:text-[var(--text-color)]'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))
          )}
          {!isAppPage && (
            <Link to="/blog-generator" target="_blank" onClick={() => setIsOpen(false)} className="btn-primary-new w-full text-center">
                Get Started
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';

const Navbar = ({ theme, toggleTheme }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Data Scientist', path: '/data-scientist' },
    { name: 'Blog Generator', path: '/blog-generator' },
    { name: 'SEO Assistant', path: '/seo' },
    { name: 'Sentiment Analysis', path: '/sentiment' },
    { name: 'Portfolio', path: '/portfolio' }
  ];

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand" onClick={closeMenu}>
        Elevate.AI
      </Link>
      
      <div className={`nav-links ${isOpen ? 'open' : ''}`}>
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={closeMenu}
          >
            {link.name}
          </NavLink>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <button 
          className="nav-toggle" 
          onClick={toggleTheme} 
          aria-label="Toggle Dark Mode"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        
        <button className="mobile-toggle" onClick={toggleMenu} aria-label="Toggle Menu">
          {isOpen ? '✕' : '☰'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
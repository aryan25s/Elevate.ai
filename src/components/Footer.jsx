import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} Elevate.AI by Aryan Pradhan. All rights reserved.</p>
      <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', opacity: 0.8 }}>
        Empowering small businesses & student startups with AI.
      </p>
    </footer>
  );
};

export default Footer;
import React from 'react';
import Button from '../components/Button';

const Portfolio = () => {
  return (
    <div className="portfolio-page fade-in" style={{ padding: '2rem 1rem' }}>
      <div className="profile-header">
        <div style={{ position: 'relative' }}>
          <div className="profile-img" style={{ 
            background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '4rem',
            color: 'white'
          }}>
            AP
          </div>
        </div>
        <div>
          <h1 className="profile-name">Aryan Pradhan</h1>
          <p className="profile-role">CSE AI/ML Student & Full Stack Developer</p>
          <div className="social-links">
            <Button variant="outline" onClick={() => window.open('https://github.com/aryan25s', '_blank')}>
              GitHub
            </Button>
            <Button variant="outline" onClick={() => window.open('www.linkedin.com/in/aryanp25', '_blank')}>
              LinkedIn
            </Button>
          </div>
        </div>
      </div>

      <div className="section-title">My Skills</div>
      <div className="skills-grid">
        <div className="card">
          <h3 className="card-title" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span>🧠</span> Skills
          </h3>
          <ul className="skill-list">
            <li>C++</li>
          </ul>
        </div>
        
        {/* <div className="card">
          <h3 className="card-title" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span>📊</span> Data Science
          </h3>
          <ul className="skill-list">
            <li>Python Data Stack (Pandas, NumPy)</li>
            <li>Data Visualization</li>
            <li>Predictive Modeling</li>
            <li>Statistical Analysis</li>
            <li>SQL & NoSQL Databases</li>
          </ul>
        </div> */}
        
        <div className="card">
          <h3 className="card-title" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span>💻</span> Development
          </h3>
          <ul className="skill-list">
            <li>React.js & Frontend Development</li>
            <li>Node.js & Express</li>
            <li>Git & GitHub</li>
            <li>UI/UX Design Principles</li>
          </ul>
        </div>
      </div>

      <div className="section-title">Education</div>
      <div className="card" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <h3 className="card-title">B.Tech in Computer Science Engineering (AI/ML)</h3>
        <p className="card-description" style={{ marginBottom: '0.5rem' }}>
          Currently pursuing my degree with a specialized focus on Artificial Intelligence and Machine Learning.
        </p>
        <p style={{ color: 'var(--primary-color)', fontWeight: '500' }}>
          Graduating in 2026
        </p>
      </div>
    </div>
  );
};

export default Portfolio;
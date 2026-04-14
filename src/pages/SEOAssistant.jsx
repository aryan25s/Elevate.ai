import React, { useState } from 'react';
import Button from '../components/Button';

const SEOAssistant = () => {
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [output, setOutput] = useState(null);

  const handleGenerate = () => {
    if (!topic.trim()) return;
    
    setIsGenerating(true);
    // Simulate generation
    setTimeout(() => {
      setOutput({
        title: `${topic.trim()}`,
        
      });
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="page-container fade-in">
      <div className="page-header">
        <h1 className="title-primary">AI SEO Assistant 🔍</h1>
        <p className="subtitle">Get keyword suggestions and optimization tips for your content.</p>
      </div>

      <div className="tool-container tool-split">
        {/* Input Panel */}
        <div className="tool-panel">
          <h2 className="tool-panel-title">1. Content Details</h2>
          
          <div className="form-group">
            <label className="form-label">Topic or Target Keyword</label>
            <input 
              type="text" 
              placeholder="e.g., React Hooks, Digital Marketing" 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          
          <Button 
            variant="primary" 
            onClick={handleGenerate} 
            disabled={!topic.trim() || isGenerating}
            style={{ width: '100%', marginTop: '1rem' }}
          >
            {isGenerating ? 'Analyzing...' : 'Generate SEO Suggestions'}
          </Button>
        </div>

        {/* Output Panel */}
        <div className="tool-panel">
          <h2 className="tool-panel-title">2. SEO Suggestions</h2>
          <div className="output-box">
            {isGenerating ? (
              <div className="empty-state pulse">
                <span style={{ fontSize: '2rem' }}>🔍</span>
                <p>Scanning the web for SEO data...</p>
              </div>
            ) : output ? (
              <div className="fade-in">
                <h3 style={{ marginBottom: '1rem', color: 'var(--primary-color)' }}>Optimization Results</h3>

                <p>Ab tujhe yha krna hai bhag boshdaaaaaa kartigay</p>
                
              </div>
            ) : (
              <div className="empty-state">
                <span style={{ fontSize: '2rem' }}>📈</span>
                <p>Enter a topic and generate SEO insights.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SEOAssistant;
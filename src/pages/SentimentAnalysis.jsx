import React, { useState } from 'react';
import Button from '../components/Button';

const SentimentAnalysis = () => {
  const [feedback, setFeedback] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [output, setOutput] = useState(null);

  const handleAnalyze = () => {
    if (!feedback.trim()) return;
    
    setIsAnalyzing(true);
    // Simulate generation
    setTimeout(() => {
      // Very basic mock sentiment calculation based on word length for variation
      const textLen = feedback.length;
      let sentiment = 'Neutral';
      let score = 50;
      let color = 'var(--text-color)';
      let emoji = '😐';
      let keywords = ['product', 'customer', 'feedback'];
      
      const posWords = ['great', 'awesome', 'good', 'excellent', 'love', 'amazing', 'best'];
      const negWords = ['bad', 'terrible', 'awful', 'hate', 'worst', 'poor', 'slow'];
      
      const lower = feedback.toLowerCase();
      
      const posCount = posWords.filter(w => lower.includes(w)).length;
      const negCount = negWords.filter(w => lower.includes(w)).length;
      
      if (posCount > negCount) {
        sentiment = 'Positive';
        score = 85;
        color = 'var(--secondary-color)';
        emoji = '😃';
        keywords = ['great experience', 'satisfied'];
      } else if (negCount > posCount) {
        sentiment = 'Negative';
        score = 25;
        color = '#e74c3c';
        emoji = '😠';
        keywords = ['frustrated', 'poor service'];
      } else {
        if (textLen > 50) score = 60;
        else score = 45;
      }
      
      setOutput({
        sentiment,
        score,
        color,
        emoji,
        keywords,
        summary: `The text primarily exhibits a ${sentiment.toLowerCase()} tone. The user appears to be expressing ${sentiment.toLowerCase() === 'positive' ? 'satisfaction' : sentiment.toLowerCase() === 'negative' ? 'dissatisfaction' : 'a neutral perspective'} regarding the service.`
      });
      setIsAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="page-container fade-in">
      <div className="page-header">
        <h1 className="title-primary">Sentiment Analysis 😊</h1>
        <p className="subtitle">Understand the emotion and intent behind customer feedback.</p>
      </div>

      <div className="tool-container tool-split">
        {/* Input Panel */}
        <div className="tool-panel">
          <h2 className="tool-panel-title">1. Customer Feedback</h2>
          
          <div className="form-group">
            <label className="form-label">Text to Analyze</label>
            <textarea 
              rows="6"
              placeholder="Paste customer reviews, emails, or feedback here... e.g. 'I absolutely love the new features!'" 
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            ></textarea>
          </div>
          
          <Button 
            variant="primary" 
            onClick={handleAnalyze} 
            disabled={!feedback.trim() || isAnalyzing}
            style={{ width: '100%', marginTop: '1rem' }}
          >
            {isAnalyzing ? 'Analyzing Text...' : 'Analyze Sentiment'}
          </Button>
        </div>

        {/* Output Panel */}
        <div className="tool-panel">
          <h2 className="tool-panel-title">2. Analysis Results</h2>
          <div className="output-box">
            {isAnalyzing ? (
              <div className="empty-state pulse">
                <span style={{ fontSize: '2rem' }}>🧠</span>
                <p>Processing text sentiment...</p>
              </div>
            ) : output ? (
              <div className="fade-in">
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>{output.emoji}</div>
                  <h3 style={{ color: output.color, fontSize: '1.8rem', fontWeight: 'bold' }}>
                    {output.sentiment}
                  </h3>
                  <p style={{ color: 'var(--text-muted)' }}>Confidence Score: {output.score}%</p>
                </div>
                
                <div style={{ marginBottom: '1.5rem', backgroundColor: 'var(--card-bg)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <strong>Summary:</strong>
                  <p style={{ marginTop: '0.5rem' }}>{output.summary}</p>
                </div>
                
                <div>
                  <strong>Key Extracted Phrases:</strong>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                    {output.keywords.map((kw, i) => (
                      <span key={i} style={{ 
                        backgroundColor: 'rgba(74, 144, 226, 0.1)', 
                        color: 'var(--primary-color)',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '16px',
                        fontSize: '0.85rem',
                        fontWeight: '500'
                      }}>
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <span style={{ fontSize: '2rem' }}>💬</span>
                <p>Paste text and analyze to view sentiment scores.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SentimentAnalysis;
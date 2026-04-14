import React, { useState } from 'react';
import Button from '../components/Button';

const BlogGenerator = () => {
  const [title, setTitle] = useState('');
  const [keywords, setKeywords] = useState('');
  const [wordCount, setWordCount] = useState(500);
  const [isGenerating, setIsGenerating] = useState(false);
  const [blog, setBlog] = useState('');

  const handleGenerate = () => {
    if (!title.trim()) return;
    const mainKeyword = keywords.trim() ? keywords.split(',')[0] : title;

    setIsGenerating(true);
    // Simulate generation
    setTimeout(() => {
      setBlog(`# ${title}\n\n**Keywords**: ${keywords}\n**Word Count Goal**: ${wordCount}\n\nAb yha krna h changessssssss kartigay tujheeeeeeee`);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="page-container fade-in">
      <div className="page-header">
        <h1 className="title-primary">AI Blog Generator ✍️</h1>
        <p className="subtitle">Create SEO-optimized blog posts in seconds.</p>
      </div>

      <div className="tool-container tool-split">
        {/* Input Form */}
        <div className="tool-panel">
          <h2 className="tool-panel-title">1. Content Details</h2>
          
          <div className="form-group">
            <label className="form-label">Blog Title</label>
            <input 
              type="text" 
              placeholder="e.g., The Future of Artificial Intelligence" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Keywords (comma separated)</label>
            <input 
              type="text" 
              placeholder="e.g., AI, Machine Learning (optional)"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Word Count: <span className="slider-val">{wordCount} words</span>
            </label>
            <input 
              type="range" 
              min="200" 
              max="2000" 
              step="100" 
              value={wordCount}
              onChange={(e) => setWordCount(e.target.value)}
              className="range-slider"
            />
          </div>
          
          <Button 
            variant="primary" 
            onClick={handleGenerate} 
            disabled={!title.trim() || isGenerating}
            style={{ width: '100%', marginTop: '1rem' }}
          >
            {isGenerating ? 'Drafting Blog...' : 'Generate Blog'}
          </Button>
        </div>

        {/* Output Section */}
        <div className="tool-panel">
          <h2 className="tool-panel-title">2. Generated Blog</h2>
          <div className="output-box" style={{ minHeight: '400px', whiteSpace: 'pre-wrap' }}>
            {isGenerating ? (
              <div className="empty-state pulse">
                <span style={{ fontSize: '2rem' }}>✍️</span>
                <p>Writing your masterpiece...</p>
              </div>
            ) : blog ? (
              <div className="fade-in">
                {blog}
              </div>
            ) : (
              <div className="empty-state">
                <span style={{ fontSize: '2rem' }}>📝</span>
                <p>Fill in the details and hit generate to see your blog post here.</p>
              </div>
            )}
          </div>
          {blog && !isGenerating && (
            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="outline" onClick={() => navigator.clipboard.writeText(blog)}>
                Copy to Clipboard 📋
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogGenerator;
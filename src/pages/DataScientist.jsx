import React, { useState } from 'react';
import Button from '../components/Button';

const DataScientist = () => {
  const [file, setFile] = useState(null);
  const [query, setQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [output, setOutput] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyze = () => {
    if (!file || !query.trim()) return;
    
    setIsAnalyzing(true);
    // Simulate API call
    setTimeout(() => {
      setOutput(`Analysis for query: "${query}"\n\n1. Revenue Trends: We detected a 15% increase in Q3 compared to Q2, driven mainly by the new product launch.\n2. Customer Churn: Your data shows a 5% churn rate, mostly concentrated in the 18-24 demographic.\n3. Recommendations: Focus marketing efforts on retaining younger demographics and push promotions for the upcoming holiday season.\n\n(Note: This is an AI-generated dummy response based on your file "${file.name}")`);
      setIsAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="page-container fade-in">
      <div className="page-header">
        <h1 className="title-primary">AI Data Scientist 📊</h1>
        <p className="subtitle">Upload your CSV and let our AI answer your business questions instantly.</p>
      </div>

      <div className="tool-container tool-split">
        {/* Input Panel */}
        <div className="tool-panel">
          <h2 className="tool-panel-title">1. Provide Data</h2>
          
          <div className="form-group">
            <label className="form-label">Upload CSV File</label>
            <label className="upload-zone">
              <input 
                type="file" 
                accept=".csv" 
                onChange={handleFileChange} 
                style={{ display: 'none' }} 
              />
              <span className="upload-icon">📁</span>
              {file ? (
                <span style={{ fontWeight: '500', color: 'var(--primary-color)' }}>
                  {file.name} ({(file.size / 1024).toFixed(1)} KB)
                </span>
              ) : (
                <span>Click to browse or drag and drop your CSV file here</span>
              )}
            </label>
          </div>

          {file && (
            <div className="form-group fade-in">
              <label className="form-label">Data Preview (Sample)</label>
              <table className="table-preview">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Date</th>
                    <th>Revenue</th>
                    <th>Category</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>2026-01-10</td>
                    <td>$450.00</td>
                    <td>Electronics</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>2026-01-11</td>
                    <td>$125.50</td>
                    <td>Apparel</td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>2026-01-12</td>
                    <td>$890.20</td>
                    <td>Software</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          <div className="form-group" style={{ marginTop: '2rem' }}>
            <label className="form-label">Ask Questions About Your Data</label>
            <input 
              type="text" 
              placeholder="e.g., What was the total revenue last month?" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={!file}
            />
          </div>
          
          <Button 
            variant="primary" 
            onClick={handleAnalyze} 
            disabled={!file || !query.trim() || isAnalyzing}
            style={{ width: '100%' }}
          >
            {isAnalyzing ? 'Analyzing Data...' : 'Analyze Data'}
          </Button>
        </div>

        {/* Output Panel */}
        <div className="tool-panel">
          <h2 className="tool-panel-title">2. AI Insights</h2>
          <div className="output-box">
            {isAnalyzing ? (
              <div className="empty-state pulse">
                <span style={{ fontSize: '2rem' }}>🤖</span>
                <p>Crunching numbers and generating insights...</p>
              </div>
            ) : output ? (
              <div className="fade-in" style={{ whiteSpace: 'pre-wrap' }}>
                {output}
              </div>
            ) : (
              <div className="empty-state">
                <span style={{ fontSize: '2rem' }}>✨</span>
                <p>Upload a file and ask a question to see AI-generated insights here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataScientist;
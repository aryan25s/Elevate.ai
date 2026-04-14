import React from 'react';
import Card from '../components/Card';
import Button from '../components/Button';

const Home = () => {
  const features = [
    {
      title: 'AI Data Scientist',
      description: 'Upload your CSV data and let AI answer complex business questions, detect patterns, and provide actionable insights instantly.',
      icon: '📊',
      to: '/data-scientist',
      buttonText: 'Try Data Scientist'
    },
    {
      title: 'AI Blog Generator',
      description: 'Generate SEO-optimized, engaging blog posts in seconds. Input your keywords and let our LLM do the writing.',
      icon: '✍️',
      to: '/blog-generator',
      buttonText: 'Generate Blogs'
    },
    {
      title: 'AI SEO Assistant',
      description: 'Optimize your content for search engines. Get keyword suggestions, meta descriptions, and readability improvements.',
      icon: '🔍',
      to: '/seo',
      buttonText: 'Optimize Content'
    },
    {
      title: 'Sentiment Analysis',
      description: 'Understand customer feedback at scale. Analyze text to determine user sentiment and prioritize responses.',
      icon: '😊',
      to: '/sentiment',
      buttonText: 'Analyze Sentiment'
    }
  ];

  return (
    <div className="home-page fade-in">
      <section className="hero">
        <h1 className="hero-title">Elevate.AI</h1>
        <p className="hero-subtitle">
          Elevating businesses using LLMs. Empowering small businesses and student startups with powerful, accessible AI tools.
        </p>
        <div className="hero-cta">
          <Button variant="primary" to="/data-scientist">Get Started Free</Button>
          <Button variant="secondary" to="/portfolio">Meet the Creator</Button>
        </div>
      </section>

      <section className="features-section">
        <h2 className="section-title">Our AI Suite</h2>
        <div className="grid-container">
          {features.map((feature, index) => (
            <Card
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              to={feature.to}
              buttonText={feature.buttonText}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
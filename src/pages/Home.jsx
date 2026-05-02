import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  Check, 
  BarChart3, 
  PenTool, 
  MessageSquare,
  GraduationCap,
  Briefcase,
  Zap,
  Star,
  TrendingUp
} from 'lucide-react';

const Home = () => {
  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[var(--bg-color)] overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 text-center">
        <div className="radial-glow" />
        
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="badge-new inline-block mb-8"
          >
            <Sparkles size={14} className="inline-block mr-2" />
            <span>Introducing Elevate AI v2.0</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold leading-tight mb-6"
          >
            Elevate your business with <br />
            <span className="purple-gradient-text">AI-powered intelligence</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-lg text-[var(--muted-text)] mb-10 leading-relaxed"
          >
            Helping students and small businesses grow faster with cutting-edge AI tools. 
            Transform your ideas into reality with intelligent automation.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link 
              to="/blog-generator" 
              target="_blank" 
              className="btn-primary-new flex items-center gap-2 px-8 py-3"
            >
              Try Elevate AI <ArrowRight size={18} />
            </Link>
            <button 
              onClick={scrollToFeatures}
              className="btn-secondary-new px-8 py-3"
            >
              Learn More
            </button>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-24">
            {[
              { label: 'Active Users', value: '10K+' },
              { label: 'Satisfaction', value: '95%' },
              { label: 'AI Support', value: '24/7' },
            ].map((stat, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="glass-card-new py-10"
              >
                <div className="text-4xl font-black text-indigo-500 mb-2">{stat.value}</div>
                <div className="text-[var(--muted-text)] font-bold uppercase tracking-widest text-xs">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-black/5 dark:bg-black/20">
        <div className="section-container">
          <div className="text-center mb-16">
            <div className="badge-new inline-block mb-4">Features</div>
            <h2 className="text-4xl md:text-5xl font-bold">
              Powerful AI Tools for <span className="purple-gradient-text">Every Need</span>
            </h2>
            <p className="text-[var(--muted-text)] mt-4 font-medium">Everything you need to grow your business with intelligent automation</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <FeatureCard 
              badge="Content Creation"
              icon={<PenTool size={32} />}
              title="AI Blog Generator"
              desc="Auto-generate SEO-ready blogs with intelligent content creation. Save hours of writing time."
              color="bg-sky-400"
              link="/blog-generator"
              index={0}
            />
            <FeatureCard 
              badge="Optimization"
              icon={<TrendingUp size={32} />}
              title="SEO Optimization"
              desc="Smart keyword suggestions and ranking analysis to boost your online visibility."
              color="bg-purple-400"
              link="/seo"
              index={1}
            />
            <FeatureCard 
              badge="Analytics"
              icon={<BarChart3 size={32} />}
              title="AI Data Scientist"
              desc="Get data insights, generate charts, and make predictions with AI-powered analysis."
              color="bg-orange-500"
              link="/data-science"
              index={2}
            />
            <FeatureCard 
              badge="Intelligence"
              icon={<MessageSquare size={32} />}
              title="Sentiment Analyzer"
              desc="Analyze customer sentiment from feedback, reviews, and social media interactions."
              color="bg-blue-500"
              link="/sentiment"
              index={3}
            />
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="py-16">
        <div className="section-container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold">Why Choose <span className="purple-gradient-text">Elevate AI</span></h2>
            <p className="text-[var(--muted-text)] mt-2 font-medium">Designed with your success in mind</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureItem 
              icon={<GraduationCap size={24} />} 
              title="Built for Students" 
              desc="Affordable pricing and educational resources designed specifically for learners."
              color="bg-indigo-500"
              index={0}
            />
            <FeatureItem 
              icon={<Briefcase size={24} />} 
              title="Perfect for Small Businesses" 
              desc="Scale your operations without breaking the bank. Enterprise features at startup prices."
              color="bg-blue-500"
              index={1}
            />
            <FeatureItem 
              icon={<Zap size={24} />} 
              title="No Technical Skills Required" 
              desc="Simple, intuitive interface that anyone can use. Get started in minutes, not days."
              color="bg-purple-500"
              index={2}
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 bg-black/5 dark:bg-black/20">
        <div className="section-container text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="badge-new inline-block mb-4"
          >
            Pricing
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Simple, <span className="purple-gradient-text">Transparent Pricing</span>
          </h2>
          <p className="text-[var(--muted-text)] mb-16 font-medium">Choose the perfect plan for your needs</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            <PricingCard 
              name="Free" 
              desc="Perfect for trying out Elevate AI"
              price="$0" 
              sub="forever"
              features={['5 AI blog posts per month', 'Basic SEO analysis', 'Community support', 'Access to dashboard']}
              cta="Get Started"
              index={0}
              appLink="/blog-generator"
            />
            <PricingCard 
              name="Starter" 
              desc="For students and freelancers"
              price="$29" 
              sub="per month"
              features={['50 AI blog posts per month', 'Advanced SEO optimization', 'Sentiment analysis', 'Email support', 'API access']}
              cta="Start Free Trial"
              index={1}
            />
            <PricingCard 
              name="Pro" 
              desc="Most popular for small businesses"
              price="$79" 
              sub="per month"
              popular
              features={['Unlimited AI content', 'Full data analytics suite', 'Priority support', 'Custom integrations', 'Team collaboration', 'Advanced analytics']}
              cta="Get Started"
              index={2}
            />
            <PricingCard 
              name="Business" 
              desc="For growing companies"
              price="$199" 
              sub="per month"
              features={['Everything in Pro', 'Dedicated account manager', 'Custom AI training', 'White-label solutions', 'SLA guarantee', 'Advanced security']}
              cta="Contact Sales"
              index={3}
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16">
        <div className="section-container">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card-new p-12 md:p-20 text-center relative overflow-hidden"
          >
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/10 blur-[120px] -z-10" />
             <div className="bg-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-10 shadow-xl shadow-indigo-600/30">
               <Sparkles size={32} className="text-white" />
             </div>
             <h2 className="text-4xl md:text-6xl font-black mb-8">
               Ready to <span className="text-indigo-500">Elevate</span> Your Business?
             </h2>
             <p className="text-[var(--muted-text)] text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
               Join thousands of students and businesses already growing with AI. Start your free trial today.
             </p>
             <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
               <Link 
                to="/blog-generator" 
                target="_blank" 
                className="btn-primary-new px-10 py-4 flex items-center gap-2 text-lg"
               >
                 Start Free Trial <ArrowRight size={20} />
               </Link>
               <button className="btn-secondary-new px-10 py-4 text-lg">
                 Schedule a Demo
               </button>
             </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

/* Component Helpers */

const FeatureCard = ({ badge, icon, title, desc, color, link, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    whileHover={{ 
      scale: 1.03,
      boxShadow: "0 20px 60px rgba(99, 102, 241, 0.15)",
      borderColor: "rgba(99, 102, 241, 0.4)"
    }}
    className="glass-card-new text-left group hover:bg-indigo-500/[0.03] transition-all duration-300"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    <div className={`${color} px-4 py-1.5 rounded-full inline-block text-[10px] font-bold text-white uppercase tracking-wider mb-6 relative z-10 shadow-sm`}>
      {badge}
    </div>
    <div className="mb-6 opacity-80 group-hover:scale-110 group-hover:text-indigo-500 transition-all duration-300 relative z-10">
      {icon}
    </div>
    <h3 className="text-2xl font-bold mb-4 group-hover:purple-gradient-text transition-all duration-300 relative z-10">{title}</h3>
    <p className="text-[var(--muted-text)] mb-8 leading-relaxed text-sm font-medium relative z-10">{desc}</p>
    <Link to={link} target="_blank" rel="noopener noreferrer" className="text-sm font-bold flex items-center gap-2 group/btn text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-500 relative z-10">
      Learn more <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform duration-300" />
    </Link>
  </motion.div>
);

const FeatureItem = ({ icon, title, desc, color, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    whileHover={{ 
      y: -10, 
      scale: 1.03,
      boxShadow: "0 20px 40px rgba(99, 102, 241, 0.15)",
      borderColor: "rgba(99, 102, 241, 0.4)"
    }}
    className="glass-card-new text-left group transition-all duration-300"
  >
    <div className={`${color} w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/20 group-hover:scale-110 group-hover:brightness-125 transition-all duration-300`}>
      {React.cloneElement(icon, { className: 'text-white' })}
    </div>
    <h3 className="text-xl font-bold mb-4 group-hover:text-indigo-500 transition-colors duration-300">{title}</h3>
    <p className="text-sm text-[var(--muted-text)] leading-relaxed font-medium">{desc}</p>
  </motion.div>
);

const PricingCard = ({ name, desc, price, sub, features, popular, cta, index, appLink }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    whileHover={{ 
      scale: 1.05, 
      y: -5,
      boxShadow: "0 20px 60px rgba(129, 140, 248, 0.2)",
      borderColor: "rgba(129, 140, 248, 0.5)"
    }}
    className={`glass-card-new !overflow-visible flex flex-col relative group transition-all duration-300 ${popular ? 'border-indigo-500/50 shadow-[0_0_40px_rgba(79,70,229,0.15)] bg-indigo-500/[0.03]' : ''}`}
  >
    {popular && (
      <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-[0_0_20px_rgba(79,70,229,0.4)] flex items-center gap-1 z-30 whitespace-nowrap">
        <Star size={10} className="fill-white" />
        Most Popular
      </div>
    )}
    <div className="text-left mb-8 relative z-10">
      <h4 className="text-xl font-bold mb-2 group-hover:text-indigo-500 transition-colors">{name}</h4>
      <p className="text-xs text-[var(--muted-text)] mb-6 font-medium">{desc}</p>
      <div className="flex items-baseline gap-1">
        <span className="text-4xl font-black text-indigo-500 group-hover:scale-110 transition-transform origin-left inline-block">{price}</span>
      </div>
      <p className="text-[10px] text-[var(--muted-text)] font-bold uppercase tracking-widest mt-1">{sub}</p>
    </div>
    
    <div className="space-y-4 mb-10 flex-grow text-left relative z-10">
      {features.map((f, i) => (
        <div key={i} className="flex items-start gap-3 text-xs text-[var(--text-color)] opacity-90">
          <Check size={14} className="text-indigo-500 shrink-0 mt-0.5" />
          {f}
        </div>
      ))}
    </div>

    {appLink ? (
      <Link 
        to={appLink} 
        target="_blank" 
        className={`w-full py-3 rounded-xl font-bold text-sm transition-all relative z-10 text-center ${popular ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30' : 'bg-white/5 hover:bg-indigo-600 hover:text-white text-[var(--text-color)] border border-[var(--border-color)] hover:border-indigo-600'}`}
      >
        {cta}
      </Link>
    ) : (
      <button className={`w-full py-3 rounded-xl font-bold text-sm transition-all relative z-10 ${popular ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30' : 'bg-white/5 hover:bg-indigo-600 hover:text-white text-[var(--text-color)] border border-[var(--border-color)] hover:border-indigo-600'}`}>
        {cta}
      </button>
    )}
    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl" />
  </motion.div>
);

export default Home;

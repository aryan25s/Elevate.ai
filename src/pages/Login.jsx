import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate login and redirect to the unified dashboard
    navigate('/app');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030014] relative overflow-hidden px-6">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 blur-[120px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="bg-indigo-600 p-1.5 rounded-lg shadow-lg shadow-indigo-600/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
              Elevate AI
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400">Enter your credentials to access your AI tools</p>
        </div>

        <div className="glass-card-new p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
              <div className="relative">
                <input 
                  type="email" 
                  required
                  placeholder="name@company.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field-new pl-11"
                />
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-400">Password</label>
                <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">Forgot password?</a>
              </div>
              <div className="relative">
                <input 
                  type="password" 
                  required
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field-new pl-11"
                />
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full btn-primary-new flex items-center justify-center gap-2 py-3"
            >
              Login to Dashboard <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account? {' '}
              <a href="#" className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors">Sign up for free</a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;

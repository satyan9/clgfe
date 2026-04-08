import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, User, Lock } from 'lucide-react';

const LoginForm = ({ role, title, subtitle, onSubmit, error, loading }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ username, password });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="glass-panel"
      style={{ padding: '2.5rem', width: '100%', maxWidth: '400px', margin: '0 auto' }}
    >
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          style={{
            background: 'var(--brand-navy)',
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            boxShadow: '0 8px 16px rgba(14, 39, 83, 0.2)'
          }}
        >
          <User size={32} color="white" />
        </motion.div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--brand-navy)', marginBottom: '0.25rem' }}>
          {title}
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          {subtitle}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {error && (
          <div style={{ 
            padding: '10px', 
            background: 'rgba(218, 41, 28, 0.1)', 
            border: '1px solid rgba(218, 41, 28, 0.3)', 
            color: 'var(--brand-red)', 
            borderRadius: '8px',
            marginBottom: '1rem',
            fontSize: '0.9rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}
        <div style={{ marginBottom: '1rem', position: 'relative' }}>
          <User size={18} color="#94a3b8" style={{ position: 'absolute', top: '15px', left: '16px' }} />
          <input 
            type="text" 
            placeholder="Username or ID" 
            className="input-field"
            style={{ paddingLeft: '44px' }}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            required
          />
        </div>
        <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
          <Lock size={18} color="#94a3b8" style={{ position: 'absolute', top: '15px', left: '16px' }} />
          <input 
            type="password" 
            placeholder="Password" 
            className="input-field"
            style={{ paddingLeft: '44px' }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
        </div>
        
        <motion.button 
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          type="submit" 
          className="btn-primary"
          disabled={loading}
          style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          <span>{loading ? 'Authenticating...' : 'Login securely'}</span>
          <LogIn size={18} />
        </motion.button>
      </form>
    </motion.div>
  );
};

export default LoginForm;

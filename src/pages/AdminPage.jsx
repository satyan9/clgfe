import React from 'react';
import LoginForm from '../components/LoginForm';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldAlert, Terminal } from 'lucide-react';

const AdminPage = () => {
  const navigate = useNavigate();

  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleAdminLogin = async (credentials) => {
    setError('');
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...credentials, role: 'admin' })
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        navigate('/admin-dashboard');
      } else {
        setError(data.message || 'Login failed.');
      }
    } catch (err) {
      setError('Cannot connect to server. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ position: 'relative' }}>
      {/* Background decoration */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
        style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '60vw',
          height: '60vw',
          background: 'radial-gradient(circle, rgba(220, 38, 38, 0.05) 0%, transparent 70%)',
          zIndex: -1,
          borderRadius: '50%'
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{ textAlign: 'center', marginBottom: '2rem' }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <div style={{ background: 'rgba(220, 38, 38, 0.1)', padding: '16px', borderRadius: '50%' }}>
            <ShieldAlert color="#ef4444" size={40} />
          </div>
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '0.5rem' }}>
          System Administration
        </h1>
        <p style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <Terminal size={16} /> Restricted Access Area
        </p>
      </motion.div>

      <LoginForm 
        role="admin"
        title="Admin Authentication"
        subtitle="Please enter your elevated credentials."
        onSubmit={handleAdminLogin}
        error={error}
        loading={loading}
      />
    </div>
  );
};

export default AdminPage;

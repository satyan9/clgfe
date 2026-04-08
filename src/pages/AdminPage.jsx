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
      const response = await fetch('https://clgbe.vercel.app/api/login', {
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
    <div className="page-container" style={{ 
      position: 'relative', 
      background: 'url(/campus_banner.png) center/cover no-repeat',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(14, 39, 83, 0.98) 0%, rgba(14, 39, 83, 0.9) 100%)', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '450px' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: '2.5rem' }}
        >
          <motion.div 
            whileHover={{ scale: 1.05, rotate: -5 }}
            onClick={() => navigate('/')}
            style={{ display: 'inline-flex', background: 'white', padding: '16px', borderRadius: '50%', marginBottom: '1.5rem', boxShadow: '0 12px 24px rgba(0,0,0,0.3)', cursor: 'pointer' }}
          >
            <ShieldAlert color="var(--brand-red)" size={48} />
          </motion.div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white', marginBottom: '0.5rem', textShadow: '0 2px 4px rgba(0,0,0,0.3)', letterSpacing: '1px' }}>
            ADMIN CONTROL
          </h1>
          <div style={{ width: '40px', height: '4px', background: 'var(--brand-gold)', margin: '0 auto 1.5rem' }} />
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', fontWeight: 600, textTransform: 'uppercase' }}>
            Authorised Access Only
          </p>
        </motion.div>

        <LoginForm
          role="admin"
          title="Security Check"
          subtitle="Authentication required to manage institutional records."
          onSubmit={handleAdminLogin}
          error={error}
          loading={loading}
        />

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button 
            onClick={() => navigate('/')}
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}
          >
            ← Global Tech Main Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;

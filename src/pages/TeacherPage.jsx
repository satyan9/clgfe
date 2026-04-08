import React from 'react';
import LoginForm from '../components/LoginForm';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Presentation, BookOpenCheck } from 'lucide-react';

const TeacherPage = () => {
  const navigate = useNavigate();

  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleTeacherLogin = async (credentials) => {
    setError('');
    setLoading(true);
    try {
      const response = await fetch('https://clgbe.vercel.app/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...credentials, role: 'teacher' })
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        navigate('/teacher-dashboard');
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
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(30, 41, 59, 1) 0%, rgba(14, 39, 83, 0.95) 100%)', zIndex: 0 }} />
      
      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '450px' }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: '2.5rem' }}
        >
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            onClick={() => navigate('/')}
            style={{ display: 'inline-flex', background: 'white', padding: '16px', borderRadius: '24px', marginBottom: '1.5rem', boxShadow: '0 12px 24px rgba(0,0,0,0.2)', cursor: 'pointer' }}
          >
            <Presentation color="var(--brand-red)" size={48} />
          </motion.div>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 900, color: 'white', marginBottom: '0.5rem', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            FACULTY PORTAL
          </h1>
          <div style={{ width: '60px', height: '4px', background: 'var(--brand-gold)', margin: '0 auto 1.5rem' }} />
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', fontWeight: 500 }}>
            Management System for Educators
          </p>
        </motion.div>

        <LoginForm
          role="teacher"
          title="Staff Authentication"
          subtitle="Please enter your employee credentials to continue."
          onSubmit={handleTeacherLogin}
          error={error}
          loading={loading}
        />
        
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button 
            onClick={() => navigate('/')}
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}
          >
            ← Back to Campus Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherPage;

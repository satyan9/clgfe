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
      const response = await fetch('http://localhost:5000/api/login', {
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
    <div className="page-container" style={{ position: 'relative' }}>
      {/* Background decoration */}
      <motion.div 
        animate={{ rotate: -360 }}
        transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
        style={{
          position: 'absolute',
          bottom: '-20%',
          left: '-10%',
          width: '50vw',
          height: '50vw',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.05) 0%, transparent 70%)',
          zIndex: -1,
          borderRadius: '50%'
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ textAlign: 'center', marginBottom: '2rem' }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '16px', borderRadius: '20px' }}>
            <Presentation color="#10b981" size={48} />
          </div>
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>
          Faculty Portal
        </h1>
        <p style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <BookOpenCheck size={16} /> Manage Classes & Students
        </p>
      </motion.div>

      <LoginForm 
        role="teacher"
        title="Faculty Login"
        subtitle="Access your teaching tools and schedules."
        onSubmit={handleTeacherLogin}
        error={error}
        loading={loading}
      />
    </div>
  );
};

export default TeacherPage;

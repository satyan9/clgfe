import React from 'react';
import { motion } from 'framer-motion';
import { LogOut, LayoutDashboard, Settings, Users, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ role }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Note: Add clear JWT / storage here later
    navigate('/');
  };

  const getRoleConfig = () => {
    switch (role) {
      case 'admin':
        return { color: '#ef4444', title: 'Admin Dashboard', icon: <Settings size={28} /> };
      case 'teacher':
        return { color: '#10b981', title: 'Faculty Dashboard', icon: <Users size={28} /> };
      case 'student':
      default:
        return { color: '#3b82f6', title: 'Student Dashboard', icon: <BookOpen size={28} /> };
    }
  };

  const config = getRoleConfig();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300 } }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      {/* Sidebar */}
      <motion.div 
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        style={{ 
          width: '250px', 
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(10px)',
          borderRight: '1px solid var(--glass-border)',
          padding: '2rem 1rem',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '3rem', padding: '0 1rem' }}>
          <div style={{ color: config.color }}>{config.icon}</div>
          <span style={{ fontWeight: 700, fontSize: '1.2rem' }}>Portal</span>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ 
            padding: '12px 16px', 
            background: `rgba(${config.color === '#ef4444' ? '239, 68, 68' : config.color === '#10b981' ? '16, 185, 129' : '59, 130, 246'}, 0.15)`,
            borderRadius: '8px',
            color: config.color,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontWeight: 600,
            cursor: 'pointer'
          }}>
            <LayoutDashboard size={20} />
            Overview
          </div>
          {/* Mock nav items depending on role could go here */}
        </nav>

        <motion.button 
          whileHover={{ scale: 1.02, background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          style={{
            padding: '12px',
            background: 'transparent',
            border: '1px solid var(--glass-border)',
            borderRadius: '8px',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: 'pointer',
            marginTop: 'auto',
            transition: 'all 0.2s'
          }}
        >
          <LogOut size={18} />
          Sign Out
        </motion.button>
      </motion.div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '3rem', overflowY: 'auto' }}>
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '3rem' }}
        >
          <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '0.5rem' }}>
            {config.title}
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Welcome back! Here is an overview of your recent activity.
          </p>
        </motion.header>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}
        >
          {[1, 2, 3].map((item) => (
            <motion.div 
              key={item}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="glass-panel"
              style={{ padding: '2rem', height: '200px' }}
            >
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: `rgba(${(item * 50) % 255}, 130, 246, 0.2)`, marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Overview Metric {item}</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Loading statistical data...</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue } from 'framer-motion';
import {
  BookOpen, Calendar, Clock, TrendingUp, Award, Bell, LogOut,
  ChevronRight, CheckCircle, AlertCircle, FileText, Download,
  Star, Zap, Target, Coffee, Wifi, BarChart2, User, Home,
  Book, Activity, MessageSquare, Settings, ChevronDown, X, Menu
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ── MOCK DATA ────────────────────────────────────────────────────────────────
const STUDENT = {
  name: 'Aditya Kumar',
  rollNo: '2024J333',
  branch: 'MPC (Maths, Physics, Chemistry)',
  year: 'Senior Inter (12th)',
  section: 'A',
  cgpa: 8.74,
  phone: '+91 98765 43210',
  email: '2024j333@globaltech.edu',
  photo: null,
  semester: 2,
  advisor: 'Dr. Priya Sharma',
};

const SUBJECTS = [
  { code: 'MAT-IIA', name: 'Mathematics IIA', credits: 4, internal: 42, external: 68, grade: 'A', status: 'pass' },
  { code: 'MAT-IIB', name: 'Mathematics IIB', credits: 4, internal: 38, external: 72, grade: 'A+', status: 'pass' },
  { code: 'PHY-II', name: 'Physics II', credits: 3, internal: 45, external: 65, grade: 'A', status: 'pass' },
  { code: 'CHE-II', name: 'Chemistry II', credits: 3, internal: 30, external: 58, grade: 'B+', status: 'pass' },
  { code: 'ENG-II', name: 'English II', credits: 4, internal: 28, external: 52, grade: 'B', status: 'pass' },
  { code: 'SAN-II', name: 'Sanskrit II', credits: 3, internal: 44, external: 70, grade: 'A+', status: 'pass' },
];

const ATTENDANCE = [
  { subject: 'Maths IIA', present: 42, total: 48, pct: 87.5 },
  { subject: 'Maths IIB', present: 45, total: 48, pct: 93.7 },
  { subject: 'Physics', present: 35, total: 40, pct: 87.5 },
  { subject: 'Chemistry', present: 30, total: 40, pct: 75.0 },
  { subject: 'English', present: 38, total: 44, pct: 86.4 },
  { subject: 'Sanskrit', present: 36, total: 40, pct: 90.0 },
];

const TIMETABLE = [
  { day: 'Monday', slots: ['Physics Lab', 'Maths IIA', 'Break', 'Chemistry', 'English', 'Maths IIB'] },
  { day: 'Tuesday', slots: ['Chem Lab', 'Physics', 'Break', 'Maths IIB', 'Sanskrit', 'Study Hour'] },
  { day: 'Wednesday', slots: ['English', 'Maths IIA', 'Break', 'Physics', 'Chem Lab', 'Mentor Session'] },
  { day: 'Thursday', slots: ['Maths IIA', 'Chemistry', 'Break', 'Physics Lab', 'Sanskrit', 'Maths IIB'] },
  { day: 'Friday', slots: ['Weekly Test', 'Weekly Test', 'Break', 'Study Hour', 'Study Hour', 'Free'] },
];

const ASSIGNMENTS = [
  { title: 'Integration Short Answers', subject: 'Maths IIB', due: '2026-04-12', status: 'pending', priority: 'high' },
  { title: 'Wave Optics Numericals', subject: 'Physics', due: '2026-04-10', status: 'submitted', priority: 'low' },
  { title: 'Electrochemistry Equations', subject: 'Chemistry', due: '2026-04-15', status: 'pending', priority: 'medium' },
  { title: 'Probability Exercises', subject: 'Maths IIA', due: '2026-04-08', status: 'overdue', priority: 'high' },
  { title: 'Sanskrit Grammar Chart', subject: 'Sanskrit', due: '2026-04-20', status: 'pending', priority: 'low' },
];

const NOTICES = [
  { id: 1, title: 'Semester Exam Schedule Released', time: '2h ago', type: 'exam', read: false },
  { id: 2, title: 'Project submission extended to Apr 25', time: '1d ago', type: 'assignment', read: false },
  { id: 3, title: 'Cultural fest registrations open!', time: '2d ago', type: 'event', read: true },
  { id: 4, title: 'Holiday on Apr 14 (Dr. Ambedkar Jayanti)', time: '3d ago', type: 'holiday', read: true },
];

const CGPA_TREND = [7.2, 7.8, 8.4, 8.74];

// ── HELPER COMPONENTS ────────────────────────────────────────────────────────
const CircularProgress = ({ value, max = 100, color, size = 80, stroke = 8, label }) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const pct = (value / max) * 100;
  const dash = (pct / 100) * circ;

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth={stroke}
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - dash }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          strokeLinecap="round"
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>{value}{label}</span>
      </div>
    </div>
  );
};

const AnimatedNumber = ({ value, duration = 1500 }) => {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = value / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= value) { setDisplay(value); clearInterval(timer); }
      else setDisplay(Math.floor(start * 10) / 10);
    }, 16);
    return () => clearInterval(timer);
  }, [value, duration]);
  return <>{display}</>;
};

const GradeChip = ({ grade }) => {
  const colors = { 'A+': '#10b981', A: '#3b82f6', 'B+': '#8b5cf6', B: '#f59e0b', C: '#ef4444' };
  return (
    <span style={{
      background: colors[grade] || '#6b7280', color: '#fff',
      padding: '2px 8px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700
    }}>{grade}</span>
  );
};

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
const StudentDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifOpen, setNotifOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [flippedCards, setFlippedCards] = useState({});
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const unread = NOTICES.filter(n => !n.read).length;

  const navItems = [
    { id: 'overview', icon: <Home size={18} />, label: 'Overview' },
    { id: 'academics', icon: <BookOpen size={18} />, label: 'Academics' },
    { id: 'attendance', icon: <Activity size={18} />, label: 'Attendance' },
    { id: 'schedule', icon: <Calendar size={18} />, label: 'Schedule' },
    { id: 'assignments', icon: <FileText size={18} />, label: 'Assignments' },
  ];

  const handleLogout = () => { localStorage.clear(); navigate('/'); };

  const toggleFlip = (id) => setFlippedCards(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter', sans-serif", color: '#0e2753' }}>

      {/* ── SIDEBAR ── */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: sidebarOpen ? 0 : -280 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        style={{
          width: 260, background: '#ffffff',
          borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column',
          position: 'fixed', top: 0, bottom: 0, zIndex: 50, overflowY: 'auto',
          boxShadow: '4px 0 15px rgba(0,0,0,0.02)'
        }}
      >
        {/* Logo */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--brand-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={18} color="#fff" />
            </div>
            <span style={{ fontWeight: 900, fontSize: '1rem', color: 'var(--brand-navy)', letterSpacing: '0.5px' }}>
              STUDENT <span style={{ color: 'var(--brand-gold)' }}>PORTAL</span>
            </span>
          </div>

          {/* Avatar card */}
          <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '1.25rem', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%', background: '#fff',
              margin: '0 auto 0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.5rem', fontWeight: 900, color: 'var(--brand-navy)',
              border: '3px solid var(--brand-gold)', boxShadow: '0 8px 16px rgba(0,0,0,0.05)'
            }}>
              {STUDENT.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div style={{ fontWeight: 800, color: 'var(--brand-navy)', fontSize: '1rem' }}>{STUDENT.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--brand-gold)', fontWeight: 700, marginTop: '4px' }}>{STUDENT.rollNo}</div>
            <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '6px', lineHeight: 1.4 }}>{STUDENT.branch}</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map(item => (
            <motion.button
              key={item.id}
              whileHover={{ x: 4, background: '#f1f5f9' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 14px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                background: activeTab === item.id ? 'var(--brand-navy)' : 'transparent',
                color: activeTab === item.id ? '#fff' : '#64748b',
                fontWeight: activeTab === item.id ? 700 : 500, fontSize: '0.9rem',
                textAlign: 'left', width: '100%', transition: 'all 0.2s'
              }}
            >
              <span style={{ color: activeTab === item.id ? 'var(--brand-gold)' : 'inherit' }}>{item.icon}</span>
              {item.label}
              {activeTab === item.id && (
                <motion.div layoutId="nav-indicator" style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: 'var(--brand-gold)' }} />
              )}
            </motion.button>
          ))}
        </nav>

        <div style={{ padding: '1rem' }}>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleLogout}
            style={{ width: '100%', padding: '10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 600 }}>
            <LogOut size={16} /> Logout
          </motion.button>
        </div>
      </motion.aside>

      {/* ── MAIN ── */}
      <div style={{ flex: 1, marginLeft: sidebarOpen ? 260 : 0, transition: 'margin 0.3s', display: 'flex', flexDirection: 'column' }}>

        {/* Top bar */}
        <header style={{
          position: 'sticky', top: 0, zIndex: 40, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #e2e8f0', padding: '0 2rem', height: 64,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ background: 'none', border: 'none', color: 'var(--brand-navy)', cursor: 'pointer' }}>
              <Menu size={22} />
            </motion.button>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>{today}</div>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--brand-navy)' }}>
                {navItems.find(n => n.id === activeTab)?.label}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ position: 'relative' }}>
              <motion.button whileTap={{ scale: 0.9 }}
                onClick={() => setNotifOpen(!notifOpen)}
                style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '10px', color: 'var(--brand-navy)', cursor: 'pointer', position: 'relative' }}>
                <Bell size={18} />
                {unread > 0 && <span style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, background: 'var(--brand-red)', borderRadius: '50%', border: '2px solid #fff' }} />}
              </motion.button>

              <AnimatePresence>
                {notifOpen && (
                  <motion.div initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                    style={{ position: 'absolute', right: 0, top: '110%', width: 320, background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', zIndex: 100, overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
                    <div style={{ padding: '1.25rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 800, color: 'var(--brand-navy)' }}>Notifications</span>
                      <motion.button whileTap={{ scale: 0.9 }} onClick={() => setNotifOpen(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><X size={16} /></motion.button>
                    </div>
                    {NOTICES.map(n => (
                      <div key={n.id} style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #f8fafc', display: 'flex', gap: '1rem', alignItems: 'flex-start', background: !n.read ? 'rgba(242,169,0,0.05)' : 'transparent' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: !n.read ? 'var(--brand-gold)' : '#cbd5e1', marginTop: 6, flexShrink: 0 }} />
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: !n.read ? 700 : 500, color: 'var(--brand-navy)' }}>{n.title}</div>
                          <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '4px' }}>{n.time}</div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* ── CONTENT ── */}
        <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
          <AnimatePresence mode="wait">

            {/* ── OVERVIEW TAB ── */}
            {activeTab === 'overview' && (
              <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>

                {/* Welcome Banner */}
                <div style={{ background: 'linear-gradient(135deg, var(--brand-navy) 0%, #1a365d 100%)', borderRadius: '24px', padding: '2.5rem', marginBottom: '2.5rem', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 40px rgba(14,39,83,0.1)' }}>
                  <div style={{ position: 'absolute', top: -50, right: -50, width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(242,169,0,0.15) 0%, transparent 70%)' }} />
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                      <div style={{ fontSize: '0.9rem', color: 'var(--brand-gold)', fontWeight: 700, letterSpacing: '1px', marginBottom: '0.5rem' }}>STUDENT PORTAL ⚡</div>
                      <h1 style={{ fontSize: '2.25rem', fontWeight: 900, marginBottom: '0.5rem', color: '#fff' }}>
                        Welcome back, {STUDENT.name.split(' ')[0]}!
                      </h1>
                      <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', fontWeight: 500 }}>
                        {STUDENT.year} · {STUDENT.branch} · Section {STUDENT.section}
                      </p>
                    </motion.div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
                      {[
                        { label: 'CGPA', value: STUDENT.cgpa, icon: <Star size={14} />, color: 'var(--brand-gold)' },
                        { label: 'Semester', value: `Sem ${STUDENT.semester}`, icon: <BookOpen size={14} />, color: '#60a5fa' },
                        { label: 'Advisor', value: STUDENT.advisor.split(' ')[1], icon: <User size={14} />, color: '#4ade80' },
                      ].map((stat, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.1 }}
                          style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', borderRadius: '14px', padding: '0.875rem 1.5rem', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid rgba(255,255,255,0.1)' }}>
                          <span style={{ color: stat.color }}>{stat.icon}</span>
                          <div>
                            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>{stat.label}</div>
                            <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#fff' }}>{stat.value}</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
                  {[
                    { label: 'Overall Attendance', value: 87, unit: '%', icon: <Activity size={20} />, color: '#10b981', warn: false },
                    { label: 'Pending Assignments', value: 3, unit: '', icon: <FileText size={20} />, color: 'var(--brand-gold)', warn: true },
                    { label: 'Credits Earned', value: 72, unit: '', icon: <Award size={20} />, color: 'var(--brand-navy)', warn: false },
                    { label: 'Backlogs', value: 0, unit: '', icon: <CheckCircle size={20} />, color: '#3b82f6', warn: false },
                  ].map((stat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
                      whileHover={{ y: -4, boxShadow: '0 10px 30px rgba(0,0,0,0.05)', background: '#fff' }}
                      style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '1.75rem', cursor: 'default', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                        <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '10px', color: stat.color, border: '1px solid #f1f5f9' }}>
                          {stat.icon}
                        </div>
                        {stat.warn && <span style={{ fontSize: '0.65rem', background: 'rgba(242,169,0,0.1)', color: 'var(--brand-gold)', padding: '4px 10px', borderRadius: '20px', fontWeight: 700, border: '1px solid rgba(242,169,0,0.2)' }}>REQUIRED</span>}
                      </div>
                      <div style={{ fontSize: '2.25rem', fontWeight: 900, color: 'var(--brand-navy)' }}>
                        <AnimatedNumber value={stat.value} />{stat.unit}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '6px', fontWeight: 600 }}>{stat.label}</div>
                    </motion.div>
                  ))}
                </div>

                {/* CGPA Trend + Notices */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>

                  {/* CGPA Trend */}
                  <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: '16px', padding: '1.5rem' }}>
                    <div style={{ fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <TrendingUp size={16} color="#8b5cf6" /> CGPA Progress
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', height: '120px' }}>
                      {CGPA_TREND.map((val, i) => (
                        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: i === CGPA_TREND.length - 1 ? '#a78bfa' : '#94a3b8' }}>{val}</span>
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${((val - 6.5) / 3.5) * 100}%` }}
                            transition={{ delay: i * 0.15, duration: 0.8, ease: 'easeOut' }}
                            style={{
                              width: '100%', borderRadius: '6px 6px 0 0', minHeight: 8,
                              background: i === CGPA_TREND.length - 1
                                ? 'linear-gradient(180deg, #8b5cf6, #6366f1)'
                                : 'rgba(139,92,246,0.3)'
                            }}
                          />
                          <span style={{ fontSize: '0.65rem', color: '#6b7280' }}>Sem {i + 1}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Notices */}
                  <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: '16px', padding: '1.5rem' }}>
                    <div style={{ fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Bell size={16} color="#f59e0b" /> Recent Notices
                      {unread > 0 && <span style={{ fontSize: '0.65rem', background: '#ef4444', color: '#fff', borderRadius: '20px', padding: '1px 6px' }}>{unread} new</span>}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                      {NOTICES.slice(0, 4).map(n => (
                        <div key={n.id} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', borderBottom: '1px solid rgba(139,92,246,0.08)', paddingBottom: '0.625rem' }}>
                          <div style={{ width: 6, height: 6, borderRadius: '50%', background: !n.read ? '#8b5cf6' : '#374151', marginTop: 7, flexShrink: 0 }} />
                          <div>
                            <div style={{ fontSize: '0.8rem', fontWeight: !n.read ? 600 : 400, lineHeight: 1.4 }}>{n.title}</div>
                            <div style={{ fontSize: '0.65rem', color: '#6b7280', marginTop: '2px' }}>{n.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Upcoming Assignments */}
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: '16px', padding: '1.5rem' }}>
                  <div style={{ fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileText size={16} color="#3b82f6" /> Upcoming Assignments
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {ASSIGNMENTS.slice(0, 3).map((a, i) => {
                      const priColor = a.priority === 'high' ? '#ef4444' : a.priority === 'medium' ? '#f59e0b' : '#10b981';
                      const statBg = a.status === 'submitted' ? 'rgba(16,185,129,0.1)' : a.status === 'overdue' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)';
                      const statColor = a.status === 'submitted' ? '#10b981' : a.status === 'overdue' ? '#ef4444' : '#f59e0b';
                      return (
                        <motion.div key={i} whileHover={{ x: 4 }}
                          style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.875rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', borderLeft: `3px solid ${priColor}` }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{a.title}</div>
                            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '2px' }}>{a.subject} · Due: {a.due}</div>
                          </div>
                          <span style={{ fontSize: '0.7rem', padding: '3px 10px', borderRadius: '20px', background: statBg, color: statColor, fontWeight: 600, textTransform: 'capitalize' }}>{a.status}</span>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── ACADEMICS TAB ── */}
            {activeTab === 'academics' && (
              <motion.div key="academics" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Academic Records — Semester {STUDENT.semester}</h2>

                {/* Subject Cards - Flip animation */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
                  {SUBJECTS.map((sub, i) => (
                    <motion.div
                      key={sub.code}
                      initial={{ opacity: 0, rotateY: -90 }}
                      animate={{ opacity: 1, rotateY: 0 }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      style={{ perspective: 1000, cursor: 'pointer', height: 180 }}
                      onClick={() => toggleFlip(sub.code)}
                    >
                      <motion.div
                        animate={{ rotateY: flippedCards[sub.code] ? 180 : 0 }}
                        transition={{ duration: 0.5 }}
                        style={{ width: '100%', height: '100%', transformStyle: 'preserve-3d', position: 'relative' }}
                      >
                        {/* Front */}
                        <div style={{
                          position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
                          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(139,92,246,0.2)',
                          borderRadius: '16px', padding: '1.25rem'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                            <div>
                              <div style={{ fontSize: '0.65rem', color: '#6b7280', marginBottom: '2px' }}>{sub.code} · {sub.credits} Credits</div>
                              <div style={{ fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.3 }}>{sub.name}</div>
                            </div>
                            <GradeChip grade={sub.grade} />
                          </div>
                          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <div style={{ flex: 1, background: 'rgba(139,92,246,0.1)', borderRadius: '10px', padding: '0.75rem', textAlign: 'center' }}>
                              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#a78bfa' }}>{sub.internal}</div>
                              <div style={{ fontSize: '0.65rem', color: '#6b7280' }}>Internal /50</div>
                            </div>
                            <div style={{ flex: 1, background: 'rgba(99,102,241,0.1)', borderRadius: '10px', padding: '0.75rem', textAlign: 'center' }}>
                              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#818cf8' }}>{sub.external}</div>
                              <div style={{ fontSize: '0.65rem', color: '#6b7280' }}>External /75</div>
                            </div>
                            <div style={{ flex: 1, background: 'rgba(16,185,129,0.1)', borderRadius: '10px', padding: '0.75rem', textAlign: 'center' }}>
                              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981' }}>{sub.internal + sub.external}</div>
                              <div style={{ fontSize: '0.65rem', color: '#6b7280' }}>Total /125</div>
                            </div>
                          </div>
                          <div style={{ fontSize: '0.65rem', color: '#6b7280', marginTop: '0.5rem', textAlign: 'right' }}>Tap to see more →</div>
                        </div>
                        {/* Back */}
                        <div style={{
                          position: 'absolute', inset: 0, backfaceVisibility: 'hidden', transform: 'rotateY(180deg)',
                          background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(99,102,241,0.1))',
                          border: '1px solid rgba(139,92,246,0.4)', borderRadius: '16px', padding: '1.25rem',
                          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                        }}>
                          <CircularProgress value={Math.round(((sub.internal + sub.external) / 125) * 10)} max={10} color="#8b5cf6" size={80} label="/10" />
                          <div style={{ fontWeight: 700, fontSize: '0.9rem', marginTop: '0.5rem' }}>{sub.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#a78bfa' }}>Grade Point: {sub.grade === 'A+' ? 10 : sub.grade === 'A' ? 9 : sub.grade === 'B+' ? 8 : 7}</div>
                          <div style={{ fontSize: '0.65rem', color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '2px 10px', borderRadius: '20px' }}>✓ PASS · {sub.credits} Credits</div>
                        </div>
                      </motion.div>
                    </motion.div>
                  ))}
                </div>

                {/* CGPA Summary */}
                <div style={{ background: 'linear-gradient(135deg, #1e0a4a, #1a1040)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '16px', padding: '2rem', display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                  <CircularProgress value={STUDENT.cgpa} max={10} color="#f59e0b" size={100} label="" />
                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#a78bfa', marginBottom: '4px' }}>Current CGPA</div>
                    <div style={{ fontSize: '3rem', fontWeight: 900, color: '#f59e0b' }}>{STUDENT.cgpa}</div>
                    <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Out of 10.0 · Semester {STUDENT.semester}</div>
                  </div>
                  <div style={{ flex: 1, display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    {SUBJECTS.map(s => (
                      <div key={s.code} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '0.75rem', minWidth: 120 }}>
                        <GradeChip grade={s.grade} />
                        <div style={{ fontSize: '0.75rem', marginTop: '4px', color: '#94a3b8' }}>{s.code}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── ATTENDANCE TAB ── */}
            {activeTab === 'attendance' && (
              <motion.div key="attendance" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Attendance Tracker</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {ATTENDANCE.map((a, i) => {
                    const low = a.pct < 75;
                    const warn = a.pct >= 75 && a.pct < 85;
                    const color = low ? '#ef4444' : warn ? '#f59e0b' : '#10b981';
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid rgba(${low ? '239,68,68' : warn ? '245,158,11' : '16,185,129'},0.2)`, borderRadius: '16px', padding: '1.25rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                          <div>
                            <div style={{ fontWeight: 700 }}>{a.subject}</div>
                            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{a.present}/{a.total} classes attended</div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color }}>{a.pct}%</div>
                            {low && <div style={{ fontSize: '0.65rem', color: '#ef4444' }}>⚠ Below minimum</div>}
                            {warn && <div style={{ fontSize: '0.65rem', color: '#f59e0b' }}>⚠ At risk</div>}
                          </div>
                        </div>
                        <div style={{ height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${a.pct}%` }}
                            transition={{ delay: i * 0.1 + 0.3, duration: 1, ease: 'easeOut' }}
                            style={{ height: '100%', borderRadius: 4, background: `linear-gradient(90deg, ${color}, ${color}88)` }}
                          />
                        </div>
                        {low && (
                          <div style={{ marginTop: '0.75rem', background: 'rgba(239,68,68,0.1)', borderRadius: '8px', padding: '0.5rem 0.75rem', fontSize: '0.75rem', color: '#ef4444' }}>
                            You need to attend {Math.ceil((0.75 * a.total - a.present) / 0.25)} more classes to reach 75%.
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ── SCHEDULE TAB ── */}
            {activeTab === 'schedule' && (
              <motion.div key="schedule" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Weekly Timetable</h2>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                  {TIMETABLE.map(d => (
                    <motion.button key={d.day} whileTap={{ scale: 0.95 }} onClick={() => setSelectedDay(d.day)}
                      style={{ padding: '8px 20px', borderRadius: '30px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem',
                        background: selectedDay === d.day ? 'linear-gradient(135deg, #8b5cf6, #6366f1)' : 'rgba(255,255,255,0.05)',
                        color: selectedDay === d.day ? '#fff' : '#94a3b8', transition: 'all 0.2s' }}>
                      {d.day}
                    </motion.button>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
                  {TIMETABLE.find(d => d.day === selectedDay)?.slots.map((slot, i) => {
                    const times = ['8:00', '9:00', '10:00', '11:00', '12:00', '1:00'];
                    const isBreak = slot === 'Break' || slot === 'Free';
                    return (
                      <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }}
                        whileHover={!isBreak ? { y: -4 } : {}}
                        style={{
                          background: isBreak ? 'rgba(255,255,255,0.02)' : 'rgba(139,92,246,0.1)',
                          border: `1px solid ${isBreak ? 'rgba(255,255,255,0.05)' : 'rgba(139,92,246,0.25)'}`,
                          borderRadius: '14px', padding: '1.25rem', borderTop: isBreak ? undefined : '3px solid #8b5cf6'
                        }}>
                        <div style={{ fontSize: '0.65rem', color: '#6b7280', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={10} /> {times[i]} AM
                        </div>
                        <div style={{ fontWeight: isBreak ? 400 : 700, color: isBreak ? '#374151' : '#e2e8f0', fontSize: '0.9rem' }}>{slot}</div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ── ASSIGNMENTS TAB ── */}
            {activeTab === 'assignments' && (
              <motion.div key="assignments" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Assignments & Tasks</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {ASSIGNMENTS.map((a, i) => {
                    const priColor = a.priority === 'high' ? '#ef4444' : a.priority === 'medium' ? '#f59e0b' : '#10b981';
                    const stColor = a.status === 'submitted' ? '#10b981' : a.status === 'overdue' ? '#ef4444' : '#f59e0b';
                    const icon = a.status === 'submitted' ? <CheckCircle size={18} /> : a.status === 'overdue' ? <AlertCircle size={18} /> : <Clock size={18} />;
                    return (
                      <motion.div key={i} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                        whileHover={{ x: 4 }}
                        style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid rgba(255,255,255,0.08)`, borderRadius: '16px', padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center', borderLeft: `4px solid ${priColor}` }}>
                        <div style={{ color: stColor }}>{icon}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, marginBottom: '4px' }}>{a.title}</div>
                          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                            <span style={{ background: 'rgba(139,92,246,0.1)', color: '#a78bfa', padding: '1px 8px', borderRadius: '10px', marginRight: '8px' }}>{a.subject}</span>
                            Due: {a.due}
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                          <span style={{ fontSize: '0.7rem', padding: '3px 10px', borderRadius: '20px', background: `${stColor}22`, color: stColor, fontWeight: 600, textTransform: 'capitalize' }}>{a.status}</span>
                          <span style={{ fontSize: '0.65rem', color: priColor, textTransform: 'capitalize' }}>{a.priority} priority</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;

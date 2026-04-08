import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, Users, BookOpen, AlertTriangle, BarChart2,
  Bell, LogOut, Menu, TrendingUp, Activity, CheckCircle,
  XCircle, Clock, ChevronRight, Settings, PlusCircle,
  Download, Eye, Edit3, Trash2, Home, FileText, Star,
  Database, Server, Cpu, HardDrive, Globe, Zap, X,
  UserCheck, UserX, Building, GraduationCap, DollarSign
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ── MOCK DATA ────────────────────────────────────────────────────────────────
const ADMIN = {
  name: 'Principal Admin',
  username: 'admin1',
  role: 'System Administrator',
  institution: 'Global Tech Junior College',
  initials: 'SA',
};

const STATS = [
  { label: 'Total Students', value: 4285, change: '+142', up: true, icon: <Users size={22} />, color: '#3b82f6', gradient: 'linear-gradient(135deg, #1e3a5f, #1e40af)' },
  { label: 'Active Faculty', value: 187, change: '+5', up: true, icon: <GraduationCap size={22} />, color: '#10b981', gradient: 'linear-gradient(135deg, #064e3b, #065f46)' },
  { label: 'Departments', value: 12, change: '0', up: null, icon: <Building size={22} />, color: '#f59e0b', gradient: 'linear-gradient(135deg, #451a03, #78350f)' },
  { label: 'Fee Collected', value: '₹2.4Cr', change: '+12%', up: true, icon: <DollarSign size={22} />, color: '#8b5cf6', gradient: 'linear-gradient(135deg, #2e1065, #4c1d95)' },
];

const DEPARTMENTS = [
  { name: 'Maths, Physics, Chem', code: 'MPC', hod: 'Dr. R. Menon', faculty: 32, students: 620, active: true },
  { name: 'Biology, Physics, Chem', code: 'BiPC', hod: 'Dr. A. Rajan', faculty: 28, students: 540, active: true },
  { name: 'Maths, Econ, Commerce', code: 'MEC', hod: 'Dr. V. Krishna', faculty: 30, students: 580, active: true },
  { name: 'Civics, Econ, Commerce', code: 'CEC', hod: 'Dr. P. Sinha', faculty: 22, students: 480, active: true },
  { name: 'Computer Science (Voc)', code: 'CS', hod: 'Dr. S. Lakshmi', faculty: 26, students: 560, active: true },
  { name: 'Languages', code: 'LANG', hod: 'Dr. K. Patel', faculty: 20, students: 505, active: true },
];

const RECENT_ADMISSIONS = [
  { roll: '2026A001', name: 'Aryan Singh', dept: 'MPC', status: 'confirmed', date: 'Apr 5' },
  { roll: '2026A002', name: 'Divya Menon', dept: 'BiPC', status: 'confirmed', date: 'Apr 5' },
  { roll: '2026A003', name: 'Kunal Das', dept: 'MEC', status: 'pending', date: 'Apr 6' },
  { roll: '2026A004', name: 'Preethi Nair', dept: 'CEC', status: 'confirmed', date: 'Apr 7' },
  { roll: '2026A005', name: 'Rohit Jain', dept: 'MPC', status: 'pending', date: 'Apr 7' },
];

const PENDING_APPROVALS = [
  { id: 1, type: 'Leave Application', from: 'Dr. Priya Sharma (MPC)', date: 'Apr 10', urgency: 'normal' },
  { id: 2, type: 'Course Addition', from: 'Prof. Venkat (CS)', date: 'Apr 12', urgency: 'high' },
  { id: 3, type: 'Lab Equipment Request', from: 'Dr. Suresh (BiPC)', date: 'Apr 15', urgency: 'low' },
  { id: 4, type: 'Fee Waiver Request', from: 'Student: 2024J445', date: 'Apr 8', urgency: 'high' },
];

const FACULTY_LIST = [
  { id: 'F001', name: 'Dr. Priya Sharma', dept: 'MPC', designation: 'Senior Lecturer', status: 'active', classes: 3 },
  { id: 'F002', name: 'Prof. Venkat Kumar', dept: 'CS', designation: 'Lecturer', status: 'active', classes: 2 },
  { id: 'F003', name: 'Dr. Anjali Rao', dept: 'BiPC', designation: 'Senior Lecturer', status: 'on-leave', classes: 0 },
  { id: 'F004', name: 'Prof. Suresh Pillai', dept: 'MEC', designation: 'Lecturer', status: 'active', classes: 4 },
];

const SYSTEM_HEALTH = [
  { label: 'Server CPU', value: 34, unit: '%', color: '#10b981', status: 'good' },
  { label: 'Memory Usage', value: 67, unit: '%', color: '#f59e0b', status: 'warn' },
  { label: 'DB Storage', value: 42, unit: '%', color: '#3b82f6', status: 'good' },
  { label: 'Network Load', value: 18, unit: '%', color: '#10b981', status: 'good' },
];

const MONTHLY_ENROLLMENT = [820, 780, 920, 1100, 980, 1050, 870, 990, 1080, 1020, 1150, 1200];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// ── HELPERS ──────────────────────────────────────────────────────────────────
const StatusDot = ({ status }) => {
  const c = { active: '#10b981', 'on-leave': '#f59e0b', inactive: '#ef4444', confirmed: '#10b981', pending: '#f59e0b', good: '#10b981', warn: '#f59e0b', critical: '#ef4444' };
  return <span style={{ width: 8, height: 8, borderRadius: '50%', background: c[status] || '#6b7280', display: 'inline-block' }} />;
};

const UrgencyBadge = ({ level }) => {
  const map = { high: { bg: 'rgba(239,68,68,0.12)', color: '#ef4444' }, normal: { bg: 'rgba(59,130,246,0.12)', color: '#3b82f6' }, low: { bg: 'rgba(107,114,128,0.12)', color: '#9ca3af' } };
  const s = map[level] || map['normal'];
  return <span style={{ background: s.bg, color: s.color, padding: '2px 10px', borderRadius: '20px', fontSize: '0.68rem', fontWeight: 700, textTransform: 'capitalize' }}>{level}</span>;
};

// Animated counter
const Counter = ({ to }) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const num = typeof to === 'number' ? to : 0;
    let current = 0;
    const step = num / 60;
    const t = setInterval(() => {
      current += step;
      if (current >= num) { setVal(to); clearInterval(t); }
      else setVal(typeof to === 'number' ? Math.floor(current) : to);
    }, 16);
    return () => clearInterval(t);
  }, [to]);
  return <>{typeof to === 'number' ? val : to}</>;
};

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [approvalModal, setApprovalModal] = useState(null);
  const [addFacultyModal, setAddFacultyModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const navItems = [
    { id: 'overview', icon: <Home size={17} />, label: 'Control Center' },
    { id: 'departments', icon: <Building size={17} />, label: 'Departments' },
    { id: 'faculty', icon: <GraduationCap size={17} />, label: 'Faculty' },
    { id: 'admissions', icon: <UserCheck size={17} />, label: 'Admissions' },
    { id: 'approvals', icon: <CheckCircle size={17} />, label: 'Approvals', badge: PENDING_APPROVALS.length },
    { id: 'system', icon: <Server size={17} />, label: 'System Health' },
  ];

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
        {/* Logo + Profile */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: '8px', background: 'var(--brand-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={18} color="#fff" />
            </div>
            <div>
              <div style={{ fontWeight: 900, fontSize: '0.9rem', color: 'var(--brand-navy)', letterSpacing: '0.5px' }}>ADMIN <span style={{ color: 'var(--brand-gold)' }}>CONTROL</span></div>
              <div style={{ fontSize: '0.6rem', color: '#64748b', letterSpacing: '0.5px', fontWeight: 700 }}>SECURE ACCESS</div>
            </div>
          </div>

          {/* Profile card */}
          <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '1rem', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--brand-red)', fontWeight: 900, fontSize: '1rem', color: 'var(--brand-red)', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                {ADMIN.initials}
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.875rem', color: 'var(--brand-navy)' }}>{ADMIN.name}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--brand-gold)', marginTop: '1px', fontWeight: 700 }}>{ADMIN.role}</div>
              </div>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {navItems.map(item => (
            <motion.button key={item.id} whileHover={{ x: 4 }} whileTap={{ scale: 0.97 }} onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '10px',
                border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%', position: 'relative',
                background: activeTab === item.id ? 'rgba(220,38,38,0.15)' : 'transparent',
                color: activeTab === item.id ? '#fca5a5' : '#6b7280',
                fontWeight: activeTab === item.id ? 600 : 400, fontSize: '0.875rem',
                borderLeft: activeTab === item.id ? '3px solid #dc2626' : '3px solid transparent'
              }}>
              {item.icon} {item.label}
              {item.badge && <span style={{ marginLeft: 'auto', background: '#dc2626', color: '#fff', borderRadius: '20px', padding: '1px 7px', fontSize: '0.65rem', fontWeight: 700 }}>{item.badge}</span>}
            </motion.button>
          ))}
        </nav>

        <div style={{ padding: '1rem' }}>
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => { localStorage.clear(); navigate('/'); }}
            style={{ width: '100%', padding: '10px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 600 }}>
            <LogOut size={16} /> Logout
          </motion.button>
        </div>
      </motion.aside>

      {/* ── MAIN ── */}
      <div style={{ flex: 1, marginLeft: sidebarOpen ? 260 : 0, transition: 'margin 0.3s', display: 'flex', flexDirection: 'column' }}>

        {/* Topbar */}
        <header style={{ position: 'sticky', top: 0, zIndex: 40, background: 'rgba(8,8,15,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(220,38,38,0.1)', padding: '0 2rem', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', color: '#fca5a5', cursor: 'pointer' }}>
              <Menu size={22} />
            </motion.button>
            <div style={{ fontWeight: 700 }}>{navItems.find(n => n.id === activeTab)?.label}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center', background: 'rgba(16,185,129,0.1)', padding: '4px 10px', borderRadius: '20px', border: '1px solid rgba(16,185,129,0.2)' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} />
              <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 600 }}>System Online</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{new Date().toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</div>
          </div>
        </header>

        {/* ── CONTENT ── */}
        <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
          <AnimatePresence mode="wait">

            {/* ── OVERVIEW / CONTROL CENTER ── */}
            {activeTab === 'overview' && (
              <motion.div key="ovw" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>

                {/* Big stat cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
                  {STATS.map((stat, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ y: -6, boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
                      style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '1.75rem', borderLeft: `4px solid ${stat.color === '#dc2626' ? 'var(--brand-red)' : stat.color}` }}>
                      <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '8px', display: 'inline-block', color: 'var(--brand-navy)', marginBottom: '1rem', border: '1px solid #f1f5f9' }}>
                        {stat.icon}
                      </div>
                      <div style={{ fontSize: '2.5rem', fontWeight: 900, lineHeight: 1, color: 'var(--brand-navy)' }}>
                        <Counter to={typeof stat.value === 'number' ? stat.value : stat.value} />
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '6px', fontWeight: 600 }}>{stat.label}</div>
                      <div style={{ fontSize: '0.7rem', marginTop: '10px', color: stat.up ? '#10b981' : stat.up === false ? '#ef4444' : '#64748b', fontWeight: 700 }}>
                        {stat.up !== null ? (stat.up ? '↑' : '↓') : '→'} {stat.change}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Enrollment chart + Pending approvals */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>

                  {/* Bar Chart */}
                  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1.75rem', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                      <div style={{ fontWeight: 800, color: 'var(--brand-navy)', display: 'flex', alignItems: 'center', gap: '8px' }}><BarChart2 size={16} color="var(--brand-gold)" /> Monthly Enrollment (2025)</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: 130 }}>
                      {MONTHLY_ENROLLMENT.map((v, i) => (
                        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${(v / Math.max(...MONTHLY_ENROLLMENT)) * 100}%` }}
                            transition={{ delay: i * 0.05, duration: 0.7, ease: 'easeOut' }}
                            style={{
                              width: '100%', borderRadius: '4px 4px 0 0', minHeight: 4,
                              background: i === new Date().getMonth() ? 'linear-gradient(180deg, #dc2626, #991b1b)' : 'rgba(220,38,38,0.25)'
                            }}
                          />
                          <span style={{ fontSize: '0.55rem', color: '#6b7280' }}>{MONTHS[i]}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pending Approvals */}
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(220,38,38,0.12)', borderRadius: '18px', padding: '1.75rem' }}>
                    <div style={{ fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'space-between' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle size={15} color="#f59e0b" /> Pending Approvals</span>
                      <span style={{ background: '#dc2626', color: '#fff', padding: '2px 8px', borderRadius: '10px', fontSize: '0.65rem', fontWeight: 700 }}>{PENDING_APPROVALS.length}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                      {PENDING_APPROVALS.map((a, i) => (
                        <motion.div key={a.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                          style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', cursor: 'pointer' }}
                          onClick={() => setApprovalModal(a)}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                              <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{a.type}</div>
                              <div style={{ fontSize: '0.65rem', color: '#6b7280', marginTop: '2px' }}>{a.from}</div>
                            </div>
                            <UrgencyBadge level={a.urgency} />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recent Admissions */}
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(220,38,38,0.12)', borderRadius: '18px', padding: '1.75rem' }}>
                  <div style={{ fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <UserCheck size={15} color="#3b82f6" /> Recent Admissions 2026
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid rgba(220,38,38,0.1)' }}>
                          {['Roll No', 'Name', 'Department', 'Date', 'Status'].map(h => (
                            <th key={h} style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.7rem', color: '#6b7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {RECENT_ADMISSIONS.map((r, i) => (
                          <motion.tr key={r.roll} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.08 }}
                            style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                            whileHover={{ background: 'rgba(220,38,38,0.05)' }}>
                            <td style={{ padding: '0.875rem 0.75rem', fontSize: '0.8rem', color: '#9ca3af', fontFamily: 'monospace' }}>{r.roll}</td>
                            <td style={{ padding: '0.875rem 0.75rem', fontSize: '0.875rem', fontWeight: 600 }}>{r.name}</td>
                            <td style={{ padding: '0.875rem 0.75rem' }}><span style={{ background: 'rgba(59,130,246,0.1)', color: '#60a5fa', padding: '2px 8px', borderRadius: '10px', fontSize: '0.72rem' }}>{r.dept}</span></td>
                            <td style={{ padding: '0.875rem 0.75rem', fontSize: '0.8rem', color: '#6b7280' }}>{r.date}</td>
                            <td style={{ padding: '0.875rem 0.75rem' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '5px', }}>
                                <StatusDot status={r.status} />
                                <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'capitalize', color: r.status === 'confirmed' ? '#10b981' : '#f59e0b' }}>{r.status}</span>
                              </span>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── DEPARTMENTS ── */}
            {activeTab === 'departments' && (
              <motion.div key="dept" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Department Overview</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
                  {DEPARTMENTS.map((dept, i) => (
                    <motion.div key={dept.code}
                      initial={{ opacity: 0, rotateX: -20, y: 20 }}
                      animate={{ opacity: 1, rotateX: 0, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ y: -6, boxShadow: '0 25px 50px rgba(220,38,38,0.1)' }}
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(220,38,38,0.15)', borderRadius: '18px', padding: '1.75rem', borderTop: '3px solid #dc2626' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <div>
                          <div style={{ fontSize: '0.65rem', color: '#6b7280', marginBottom: '2px', letterSpacing: '1px' }}>{dept.code}</div>
                          <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>{dept.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '2px' }}>HOD: {dept.hod}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-start' }}>
                          <StatusDot status="active" />
                          <span style={{ fontSize: '0.65rem', color: '#10b981' }}>Active</span>
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        {[{ label: 'Faculty', value: dept.faculty }, { label: 'Students', value: dept.students }].map((s, j) => (
                          <div key={j} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '0.75rem', textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: j === 0 ? '#10b981' : '#3b82f6' }}>{s.value}</div>
                            <div style={{ fontSize: '0.65rem', color: '#6b7280' }}>{s.label}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                        <motion.button whileHover={{ scale: 1.05 }} style={{ flex: 1, padding: '6px', background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.25)', borderRadius: '8px', color: '#fca5a5', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>View Details</motion.button>
                        <motion.button whileHover={{ scale: 1.05 }} style={{ flex: 1, padding: '6px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: '8px', color: '#60a5fa', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>Reports</motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── FACULTY ── */}
            {activeTab === 'faculty' && (
              <motion.div key="fac" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Faculty Management</h2>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                    onClick={() => setAddFacultyModal(true)}
                    style={{ padding: '8px 20px', background: 'linear-gradient(135deg, #dc2626, #991b1b)', border: 'none', borderRadius: '10px', color: '#fff', cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                    <PlusCircle size={15} /> Add Faculty
                  </motion.button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {FACULTY_LIST.map((f, i) => (
                    <motion.div key={f.id}
                      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                      whileHover={{ x: 4 }}
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(220,38,38,0.1)', borderRadius: '14px', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: 48, height: 48, borderRadius: '12px', background: 'linear-gradient(135deg, #dc2626, #991b1b)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem', flexShrink: 0 }}>
                        {f.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700 }}>{f.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '2px' }}>{f.designation} · {f.dept} · ID: {f.id}</div>
                      </div>
                      <div style={{ textAlign: 'center', minWidth: 50 }}>
                        <div style={{ fontWeight: 700 }}>{f.classes}</div>
                        <div style={{ fontSize: '0.6rem', color: '#6b7280' }}>Classes</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <StatusDot status={f.status} />
                        <span style={{ fontSize: '0.72rem', fontWeight: 600, color: f.status === 'active' ? '#10b981' : '#f59e0b', textTransform: 'capitalize' }}>{f.status}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <motion.button whileHover={{ scale: 1.1 }} style={{ padding: '6px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: '8px', color: '#60a5fa', cursor: 'pointer' }}><Eye size={14} /></motion.button>
                        <motion.button whileHover={{ scale: 1.1 }} style={{ padding: '6px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '8px', color: '#34d399', cursor: 'pointer' }}><Edit3 size={14} /></motion.button>
                        <motion.button whileHover={{ scale: 1.1 }} onClick={() => setConfirmDelete(f)}
                          style={{ padding: '6px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '8px', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={14} /></motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── ADMISSIONS ── */}
            {activeTab === 'admissions' && (
              <motion.div key="adm" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Admissions 2026</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                  {[{ l: 'Applications', v: 1240, c: '#3b82f6' }, { l: 'Confirmed', v: 842, c: '#10b981' }, { l: 'Pending', v: 298, c: '#f59e0b' }, { l: 'Rejected', v: 100, c: '#ef4444' }].map((s, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                      style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid rgba(255,255,255,0.07)`, borderRadius: '16px', padding: '1.5rem', borderLeft: `4px solid ${s.c}` }}>
                      <div style={{ fontSize: '2rem', fontWeight: 800, color: s.c }}>{s.v}</div>
                      <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{s.l}</div>
                    </motion.div>
                  ))}
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(220,38,38,0.12)', borderRadius: '18px', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: 'rgba(220,38,38,0.08)' }}>
                      <tr>
                        {['Roll No', 'Name', 'Department', 'Date', 'Status', 'Actions'].map(h => (
                          <th key={h} style={{ padding: '1rem', textAlign: 'left', fontSize: '0.7rem', color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {RECENT_ADMISSIONS.map((r, i) => (
                        <motion.tr key={r.roll} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.08 }}
                          style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <td style={{ padding: '1rem', fontSize: '0.8rem', color: '#9ca3af', fontFamily: 'monospace' }}>{r.roll}</td>
                          <td style={{ padding: '1rem', fontWeight: 600, fontSize: '0.875rem' }}>{r.name}</td>
                          <td style={{ padding: '1rem' }}><span style={{ background: 'rgba(59,130,246,0.1)', color: '#60a5fa', padding: '2px 8px', borderRadius: '10px', fontSize: '0.72rem' }}>{r.dept}</span></td>
                          <td style={{ padding: '1rem', fontSize: '0.8rem', color: '#6b7280' }}>{r.date}</td>
                          <td style={{ padding: '1rem' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                              <StatusDot status={r.status} />
                              <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'capitalize', color: r.status === 'confirmed' ? '#10b981' : '#f59e0b' }}>{r.status}</span>
                            </span>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <div style={{ display: 'flex', gap: '0.375rem' }}>
                              {r.status === 'pending' && (
                                <>
                                  <motion.button whileHover={{ scale: 1.1 }} style={{ padding: '4px 10px', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '6px', color: '#10b981', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 600 }}>Confirm</motion.button>
                                  <motion.button whileHover={{ scale: 1.1 }} style={{ padding: '4px 10px', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '6px', color: '#ef4444', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 600 }}>Reject</motion.button>
                                </>
                              )}
                              {r.status === 'confirmed' && <span style={{ fontSize: '0.72rem', color: '#10b981' }}>✓ Confirmed</span>}
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* ── APPROVALS ── */}
            {activeTab === 'approvals' && (
              <motion.div key="app" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Pending Approvals</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {PENDING_APPROVALS.map((a, i) => (
                    <motion.div key={a.id}
                      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.12 }}
                      style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${a.urgency === 'high' ? 'rgba(239,68,68,0.25)' : 'rgba(220,38,38,0.1)'}`, borderRadius: '16px', padding: '1.5rem', borderLeft: `4px solid ${a.urgency === 'high' ? '#ef4444' : a.urgency === 'normal' ? '#3b82f6' : '#6b7280'}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '4px' }}>{a.type}</div>
                          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>From: {a.from} · Requested: {a.date}</div>
                        </div>
                        <UrgencyBadge level={a.urgency} />
                      </div>
                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                          style={{ padding: '8px 20px', background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', borderRadius: '10px', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <CheckCircle size={14} /> Approve
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                          style={{ padding: '8px 20px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', color: '#ef4444', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <XCircle size={14} /> Reject
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.05 }}
                          style={{ padding: '8px 20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#9ca3af', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>
                          View Details
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── SYSTEM HEALTH ── */}
            {activeTab === 'system' && (
              <motion.div key="sys" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>System Health Monitor</h2>

                {/* Pulsing status */}
                <motion.div
                  animate={{ boxShadow: ['0 0 0 0 rgba(16,185,129,0)', '0 0 0 12px rgba(16,185,129,0.1)', '0 0 0 0 rgba(16,185,129,0)'] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '16px', padding: '1.25rem 1.75rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#10b981' }} />
                  <div>
                    <div style={{ fontWeight: 700, color: '#10b981' }}>All Systems Operational</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '2px' }}>Last checked: {new Date().toLocaleTimeString()}</div>
                  </div>
                </motion.div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
                  {SYSTEM_HEALTH.map((s, i) => (
                    <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.12 }}
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(220,38,38,0.12)', borderRadius: '16px', padding: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
                        <div style={{ fontWeight: 700 }}>{s.label}</div>
                        <span style={{ fontSize: '1.5rem', fontWeight: 800, color: s.color }}>{s.value}{s.unit}</span>
                      </div>
                      <div style={{ height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${s.value}%` }}
                          transition={{ delay: i * 0.15, duration: 1, ease: 'easeOut' }}
                          style={{ height: '100%', background: s.color, borderRadius: 4 }}
                        />
                      </div>
                      <div style={{ fontSize: '0.7rem', marginTop: '6px', color: s.status === 'good' ? '#10b981' : '#f59e0b', fontWeight: 600 }}>
                        {s.status === 'good' ? '✓ Normal' : '⚠ Moderate'}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Uptime */}
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(220,38,38,0.1)', borderRadius: '18px', padding: '1.75rem' }}>
                  <div style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Service Status</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {[
                      { name: 'Portal Backend API', status: 'online', uptime: '99.98%' },
                      { name: 'Student Database', status: 'online', uptime: '100%' },
                      { name: 'Email Service', status: 'online', uptime: '99.7%' },
                      { name: 'File Storage', status: 'online', uptime: '100%' },
                      { name: 'Authentication Server', status: 'online', uptime: '100%' },
                    ].map((svc, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.875rem', background: 'rgba(16,185,129,0.03)', borderRadius: '10px', border: '1px solid rgba(16,185,129,0.1)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
                          <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{svc.name}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 700 }}>Uptime: {svc.uptime}</span>
                          <span style={{ fontSize: '0.7rem', background: 'rgba(16,185,129,0.1)', color: '#10b981', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>Online</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>

      {/* ── APPROVAL MODAL ── */}
      <AnimatePresence>
        {approvalModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}
            onClick={() => setApprovalModal(null)}>
            <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              style={{ background: '#130a0a', border: '1px solid rgba(220,38,38,0.3)', borderRadius: '20px', padding: '2rem', width: 440, maxWidth: '90vw' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontWeight: 800, fontSize: '1.1rem' }}>{approvalModal.type}</h3>
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setApprovalModal(null)} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }}><X size={20} /></motion.button>
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.85rem', color: '#9ca3af', marginBottom: '0.5rem' }}>From</div>
                <div style={{ fontWeight: 700 }}>{approvalModal.from}</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>Requested on {approvalModal.date}</div>
                <div style={{ marginTop: '1rem', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  Urgency: <UrgencyBadge level={approvalModal.urgency} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => setApprovalModal(null)}
                  style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', borderRadius: '12px', color: '#fff', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <CheckCircle size={16} /> Approve
                </motion.button>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => setApprovalModal(null)}
                  style={{ flex: 1, padding: '12px', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '12px', color: '#ef4444', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <XCircle size={16} /> Reject
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── DELETE CONFIRM ── */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}
            onClick={() => setConfirmDelete(null)}>
            <motion.div initial={{ scale: 0.85 }} animate={{ scale: 1 }} exit={{ scale: 0.85 }}
              onClick={e => e.stopPropagation()}
              style={{ background: '#130a0a', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '20px', padding: '2rem', width: 380, maxWidth: '90vw', textAlign: 'center' }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(239,68,68,0.1)', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Trash2 color="#ef4444" size={28} />
              </div>
              <h3 style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.5rem' }}>Remove {confirmDelete?.name}?</h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1.5rem' }}>This action will permanently remove the faculty record. This cannot be undone.</p>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <motion.button whileHover={{ scale: 1.03 }} onClick={() => setConfirmDelete(null)}
                  style={{ flex: 1, padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#9ca3af', cursor: 'pointer', fontWeight: 600 }}>Cancel</motion.button>
                <motion.button whileHover={{ scale: 1.03 }} onClick={() => setConfirmDelete(null)}
                  style={{ flex: 1, padding: '10px', background: 'linear-gradient(135deg, #dc2626, #991b1b)', border: 'none', borderRadius: '10px', color: '#fff', cursor: 'pointer', fontWeight: 700 }}>Remove</motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;

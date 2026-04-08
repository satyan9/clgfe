import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, BookOpen, ClipboardList, BarChart2, Bell, LogOut, Menu,
  Clock, CheckCircle, AlertTriangle, PlusCircle, X, ChevronRight,
  TrendingUp, FileText, Calendar, MessageSquare, Award, Star,
  Upload, Eye, Edit3, Trash2, Home, Settings, Activity, Download
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ── MOCK DATA ────────────────────────────────────────────────────────────────
const TEACHER = {
  name: 'Dr. Priya Sharma',
  empId: 'GTU-FAC-1234567',
  dept: 'Mathematics',
  designation: 'Senior Lecturer',
  experience: '9 Years',
  email: 'priya.s@globaltech.edu',
  initials: 'PS',
};

const MY_CLASSES = [
  { id: 1, code: 'MAT-IIA', name: 'Mathematics IIA', section: 'A', year: 'Senior Inter', students: 62, schedule: 'Mon/Wed/Fri 8–9AM', room: 'Room 201' },
  { id: 2, code: 'MAT-IIB', name: 'Mathematics IIB', section: 'B', year: 'Senior Inter', students: 58, schedule: 'Tue/Thu 10–11AM', room: 'Room 204' },
  { id: 3, code: 'MAT-IA', name: 'Mathematics IA', section: 'A', year: 'Junior Inter', students: 45, schedule: 'Mon/Wed 2–3:30PM', room: 'Room 105' },
];

const MY_STUDENTS = [
  { roll: '2024J333', name: 'Aditya Kumar', subject: 'Maths IIA', internal: 42, attendance: 87, status: 'good' },
  { roll: '2024S210', name: 'Meera Pillai', subject: 'Maths IIB', internal: 38, attendance: 93, status: 'good' },
  { roll: '2024K097', name: 'Rahul Nair', subject: 'Maths IA', internal: 20, attendance: 64, status: 'at-risk' },
  { roll: '2024J412', name: 'Sneha Reddy', subject: 'Maths IIA', internal: 45, attendance: 96, status: 'excellent' },
  { roll: '2024M005', name: 'Vivek Sharma', subject: 'Maths IIB', internal: 15, attendance: 58, status: 'critical' },
  { roll: '2024J219', name: 'Ananya Roy', subject: 'Maths IA', internal: 39, attendance: 88, status: 'good' },
];

const ASSIGNMENTS_ISSUED = [
  { id: 1, title: 'Integration Short Answers', class: 'MAT-IIA (Sec A)', due: '2026-04-12', submitted: 44, total: 62, status: 'active' },
  { id: 2, title: 'Conic Sections Work', class: 'MAT-IIB (Sec B)', due: '2026-04-10', submitted: 58, total: 58, status: 'completed' },
  { id: 3, title: 'Matrices Exercises', class: 'MAT-IA (Sec A)', due: '2026-04-20', submitted: 10, total: 45, status: 'active' },
  { id: 4, title: 'Complex Numbers', class: 'MAT-IIB (Sec B)', due: '2026-04-25', submitted: 0, total: 58, status: 'draft' },
];

const LEAVES = [
  { date: 'Apr 10', reason: 'Conference – KL University', status: 'approved' },
  { date: 'Apr 22', reason: 'Personal', status: 'pending' },
];

const SCHEDULE = [
  { time: '8:00 AM', activity: 'Maths IIA Lecture', class: 'MAT-IIA (Sec A)', room: 'Room 201', type: 'lecture' },
  { time: '10:00 AM', activity: 'Maths IIB Doubt Session', class: 'MAT-IIB (Sec B)', room: 'Library', type: 'lab' },
  { time: '12:00 PM', activity: 'Lunch Break', class: '', room: '', type: 'break' },
  { time: '2:00 PM', activity: 'Maths IA Theory', class: 'MAT-IA (Sec A)', room: 'Room 105', type: 'lecture' },
  { time: '4:00 PM', activity: 'Study Hour Duty', class: 'Supervision', room: 'Study Hall', type: 'office' },
];

// ── HELPERS ──────────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    good: { bg: 'rgba(16,185,129,0.12)', color: '#10b981', label: 'Good' },
    excellent: { bg: 'rgba(99,102,241,0.12)', color: '#818cf8', label: 'Excellent' },
    'at-risk': { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b', label: 'At Risk' },
    critical: { bg: 'rgba(239,68,68,0.12)', color: '#ef4444', label: 'Critical' },
    approved: { bg: 'rgba(16,185,129,0.12)', color: '#10b981', label: 'Approved' },
    pending: { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b', label: 'Pending' },
    active: { bg: 'rgba(59,130,246,0.12)', color: '#3b82f6', label: 'Active' },
    completed: { bg: 'rgba(16,185,129,0.12)', color: '#10b981', label: 'Completed' },
    draft: { bg: 'rgba(107,114,128,0.12)', color: '#9ca3af', label: 'Draft' },
  };
  const s = map[status] || map['good'];
  return <span style={{ background: s.bg, color: s.color, padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700 }}>{s.label}</span>;
};

const MiniBar = ({ value, total, color }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3 }}>
      <motion.div initial={{ width: 0 }} animate={{ width: `${(value / total) * 100}%` }} transition={{ duration: 1, ease: 'easeOut' }}
        style={{ height: '100%', borderRadius: 3, background: color }} />
    </div>
    <span style={{ fontSize: '0.7rem', color: '#94a3b8', minWidth: 35 }}>{value}/{total}</span>
  </div>
);

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showAddAssignment, setShowAddAssignment] = useState(false);
  const [expandedStudent, setExpandedStudent] = useState(null);
  const [markModal, setMarkModal] = useState(null);

  const navItems = [
    { id: 'overview', icon: <Home size={18} />, label: 'Overview' },
    { id: 'classes', icon: <BookOpen size={18} />, label: 'My Classes' },
    { id: 'students', icon: <Users size={18} />, label: 'Students' },
    { id: 'assignments', icon: <ClipboardList size={18} />, label: 'Assignments' },
    { id: 'schedule', icon: <Calendar size={18} />, label: "Today's Schedule" },
    { id: 'leaves', icon: <FileText size={18} />, label: 'Leave Tracker' },
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
            <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'var(--brand-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={18} color="#fff" />
            </div>
            <span style={{ fontWeight: 900, fontSize: '1rem', color: 'var(--brand-navy)', letterSpacing: '0.5px' }}>
              FACULTY <span style={{ color: 'var(--brand-gold)' }}>PORTAL</span>
            </span>
          </div>

          {/* Profile card */}
          <motion.div whileHover={{ scale: 1.02 }}
            style={{ background: '#f8fafc', borderRadius: '14px', padding: '1rem', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ width: 52, height: 52, borderRadius: '12px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 900, border: '2px solid var(--brand-gold)', color: 'var(--brand-navy)', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                {TEACHER.initials}
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--brand-navy)' }}>{TEACHER.name}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--brand-gold)', marginTop: '2px', fontWeight: 700 }}>{TEACHER.designation}</div>
                <div style={{ fontSize: '0.65rem', color: '#64748b', marginTop: '1px' }}>{TEACHER.empId}</div>
              </div>
            </div>
          </motion.div>
        </div>

        <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {navItems.map(item => (
            <motion.button key={item.id} whileHover={{ x: 4 }} whileTap={{ scale: 0.97 }} onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px',
                borderRadius: '10px', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%',
                background: activeTab === item.id ? 'rgba(16,185,129,0.15)' : 'transparent',
                color: activeTab === item.id ? '#34d399' : '#6b7280',
                fontWeight: activeTab === item.id ? 600 : 400, fontSize: '0.875rem',
                borderLeft: activeTab === item.id ? '3px solid #10b981' : '3px solid transparent'
              }}>
              {item.icon} {item.label}
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
              <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>GTU Faculty</div>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--brand-navy)' }}>
                {navItems.find(n => n.id === activeTab)?.label}
              </div>
            </div>
          </div>
          <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>{new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
        </header>

        {/* ── CONTENT ── */}
        <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
          <AnimatePresence mode="wait">

            {/* ── OVERVIEW ── */}
            {activeTab === 'overview' && (
              <motion.div key="ovw" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>

                {/* Hero card */}
                <div style={{ background: 'linear-gradient(135deg, var(--brand-navy) 0%, #1a365d 100%)', borderRadius: '24px', padding: '2.5rem', marginBottom: '2.5rem', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 40px rgba(14,39,83,0.1)' }}>
                  <div style={{ position: 'absolute', top: -50, right: -50, width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(242,169,0,0.15) 0%, transparent 70%)' }} />
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <div style={{ fontSize: '0.9rem', color: 'var(--brand-gold)', fontWeight: 700, letterSpacing: '1px', marginBottom: '0.5rem' }}>FACULTY PORTAL 🎓</div>
                    <h1 style={{ fontSize: '2.25rem', fontWeight: 900, marginBottom: '0.5rem', color: '#fff' }}>Good morning, {TEACHER.name.split(', ')[1]}! 👋</h1>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', fontWeight: 500 }}>{TEACHER.dept} · {TEACHER.experience} Experience</p>
                  </motion.div>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
                    {[
                      { label: 'Classes', value: MY_CLASSES.length, color: 'var(--brand-gold)' },
                      { label: 'Students', value: MY_CLASSES.reduce((s, c) => s + c.students, 0), color: '#60a5fa' },
                      { label: 'Active Tasks', value: ASSIGNMENTS_ISSUED.filter(a => a.status === 'active').length, color: '#4ade80' },
                    ].map((s, i) => (
                      <div key={i} style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', borderRadius: '14px', padding: '0.875rem 1.5rem', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <div>
                          <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>{s.label}</div>
                          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>{s.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Today's quick schedule */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                    <div style={{ fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}><Clock size={15} color="#10b981" /> Today's Classes</div>
                    {SCHEDULE.filter(s => s.type !== 'break').slice(0, 3).map((s, i) => (
                      <motion.div key={i} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.1 }}
                        style={{ display: 'flex', gap: '12px', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981', minWidth: 55 }}>{s.time}</div>
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{s.activity}</div>
                          {s.class && <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>{s.class} · {s.room}</div>}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                    <div style={{ fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}><AlertTriangle size={15} color="#f59e0b" /> Students Needing Attention</div>
                    {MY_STUDENTS.filter(s => ['critical', 'at-risk'].includes(s.status)).map((s, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{s.name}</div>
                          <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>{s.roll} · {s.subject} · Att: {s.attendance}%</div>
                        </div>
                        <StatusBadge status={s.status} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Assignment Progress */}
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                  <div style={{ fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}><ClipboardList size={15} color="#3b82f6" /> Assignment Submission Progress</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {ASSIGNMENTS_ISSUED.map((a, i) => (
                      <div key={i}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <div>
                            <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{a.title}</span>
                            <span style={{ fontSize: '0.7rem', color: '#6b7280', marginLeft: '8px' }}>{a.class} · Due: {a.due}</span>
                          </div>
                          <StatusBadge status={a.status} />
                        </div>
                        <MiniBar value={a.submitted} total={a.total} color={a.status === 'completed' ? '#10b981' : a.status === 'active' ? '#3b82f6' : '#6b7280'} />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── CLASSES ── */}
            {activeTab === 'classes' && (
              <motion.div key="cls" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>My Classes</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
                  {MY_CLASSES.map((c, i) => (
                    <motion.div key={c.id}
                      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.12 }}
                      whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(16,185,129,0.15)' }}
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: '18px', padding: '1.75rem', borderTop: '3px solid #10b981', cursor: 'pointer' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <div>
                          <div style={{ fontSize: '0.7rem', color: '#34d399', marginBottom: '4px' }}>{c.code} · {c.year} Year</div>
                          <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{c.name}</div>
                        </div>
                        <div style={{ background: 'rgba(16,185,129,0.1)', borderRadius: '10px', padding: '8px', color: '#10b981' }}>
                          <BookOpen size={20} />
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                        {[
                          { label: 'Section', value: `Section ${c.section}` },
                          { label: 'Students', value: c.students },
                          { label: 'Schedule', value: c.schedule },
                          { label: 'Room', value: c.room },
                        ].map((info, j) => (
                          <div key={j} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '0.5rem 0.75rem' }}>
                            <div style={{ fontSize: '0.6rem', color: '#6b7280' }}>{info.label}</div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{info.value}</div>
                          </div>
                        ))}
                      </div>
                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        style={{ width: '100%', padding: '8px', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '10px', color: '#34d399', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        View Class Roster <ChevronRight size={14} />
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── STUDENTS ── */}
            {activeTab === 'students' && (
              <motion.div key="stu" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Student Management</h2>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                    onClick={() => setMarkModal(true)}
                    style={{ padding: '8px 20px', background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', borderRadius: '10px', color: '#fff', cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                    <Edit3 size={15} /> Mark Attendance
                  </motion.button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {MY_STUDENTS.map((s, i) => (
                    <motion.div key={s.roll}
                      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                      onClick={() => setExpandedStudent(expandedStudent === s.roll ? null : s.roll)}
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(16,185,129,0.1)', borderRadius: '14px', overflow: 'hidden', cursor: 'pointer' }}>
                      <div style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.875rem', flexShrink: 0 }}>
                          {s.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{s.name}</div>
                          <div style={{ fontSize: '0.70rem', color: '#6b7280' }}>{s.roll} · {s.subject}</div>
                        </div>
                        <div style={{ textAlign: 'center', minWidth: 60 }}>
                          <div style={{ fontWeight: 700, color: s.attendance < 75 ? '#ef4444' : s.attendance < 85 ? '#f59e0b' : '#10b981' }}>{s.attendance}%</div>
                          <div style={{ fontSize: '0.6rem', color: '#6b7280' }}>Attendance</div>
                        </div>
                        <div style={{ textAlign: 'center', minWidth: 60 }}>
                          <div style={{ fontWeight: 700 }}>{s.internal}/50</div>
                          <div style={{ fontSize: '0.6rem', color: '#6b7280' }}>Internal</div>
                        </div>
                        <StatusBadge status={s.status} />
                      </div>

                      <AnimatePresence>
                        {expandedStudent === s.roll && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                            style={{ borderTop: '1px solid rgba(16,185,129,0.1)', background: 'rgba(16,185,129,0.05)', padding: '1rem 1.25rem', overflow: 'hidden' }}>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                              {s.status === 'critical' && (
                                <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', padding: '0.75rem 1rem', fontSize: '0.8rem', color: '#ef4444' }}>
                                  ⚠ This student needs immediate counseling. Attendance is critically low.
                                </div>
                              )}
                              <motion.button whileHover={{ scale: 1.05 }} style={{ padding: '6px 14px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '8px', color: '#34d399', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                                Send Notice
                              </motion.button>
                              <motion.button whileHover={{ scale: 1.05 }} style={{ padding: '6px 14px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '8px', color: '#60a5fa', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                                Edit Marks
                              </motion.button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── ASSIGNMENTS ── */}
            {activeTab === 'assignments' && (
              <motion.div key="asn" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Assignments Issued</h2>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                    onClick={() => setShowAddAssignment(true)}
                    style={{ padding: '8px 20px', background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', borderRadius: '10px', color: '#fff', cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                    <PlusCircle size={15} /> New Assignment
                  </motion.button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {ASSIGNMENTS_ISSUED.map((a, i) => (
                    <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                      whileHover={{ y: -3 }}
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(16,185,129,0.12)', borderRadius: '16px', padding: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '4px' }}>{a.title}</div>
                          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{a.class} · Due: {a.due}</div>
                        </div>
                        <StatusBadge status={a.status} />
                      </div>
                      <MiniBar value={a.submitted} total={a.total} color={a.status === 'completed' ? '#10b981' : '#3b82f6'} />
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                        <motion.button whileHover={{ scale: 1.05 }} style={{ padding: '5px 12px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '8px', color: '#60a5fa', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}><Eye size={12} /> View Submissions</motion.button>
                        <motion.button whileHover={{ scale: 1.05 }} style={{ padding: '5px 12px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '8px', color: '#34d399', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}><Download size={12} /> Export</motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── SCHEDULE ── */}
            {activeTab === 'schedule' && (
              <motion.div key="sch" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Today's Schedule</h2>
                <div style={{ position: 'relative', paddingLeft: '2rem' }}>
                  {/* Timeline line */}
                  <div style={{ position: 'absolute', left: '0.75rem', top: 0, bottom: 0, width: 2, background: 'linear-gradient(180deg, #10b981 0%, rgba(16,185,129,0.1) 100%)' }} />
                  {SCHEDULE.map((item, i) => {
                    const typeColors = { lecture: '#10b981', lab: '#3b82f6', break: '#374151', office: '#8b5cf6' };
                    const color = typeColors[item.type];
                    return (
                      <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }}
                        style={{ display: 'flex', gap: '1.25rem', marginBottom: '1.5rem', alignItems: 'flex-start' }}>
                        <div style={{ width: 14, height: 14, borderRadius: '50%', background: color, border: '2px solid #050e1a', position: 'absolute', left: '0.5rem', marginTop: 4 }} />
                        <div style={{ flex: 1, background: item.type === 'break' ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.04)', border: `1px solid rgba(${item.type === 'lecture' ? '16,185,129' : item.type === 'lab' ? '59,130,246' : item.type === 'office' ? '139,92,246' : '55,65,81'},0.2)`, borderRadius: '14px', padding: '1.25rem', borderLeft: `3px solid ${color}` }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                              <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '4px' }}>{item.activity}</div>
                              {item.class && <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{item.class} {item.room ? `· ${item.room}` : ''}</div>}
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontWeight: 700, color, fontSize: '0.9rem' }}>{item.time}</div>
                              <div style={{ fontSize: '0.65rem', color: '#6b7280', textTransform: 'capitalize', marginTop: '2px' }}>{item.type}</div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ── LEAVE TRACKER ── */}
            {activeTab === 'leaves' && (
              <motion.div key="lv" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Leave Tracker</h2>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                  {[{ label: 'Total Leaves', value: 12 }, { label: 'Used', value: 5 }, { label: 'Balance', value: 7 }].map((s, i) => (
                    <div key={i} style={{ flex: 1, minWidth: 140, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(16,185,129,0.12)', borderRadius: '16px', padding: '1.5rem', textAlign: 'center' }}>
                      <div style={{ fontSize: '2.5rem', fontWeight: 800, color: i === 2 ? '#10b981' : '#e2e8f0' }}>{s.value}</div>
                      <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {LEAVES.map((l, i) => (
                    <motion.div key={i} whileHover={{ x: 4 }}
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(16,185,129,0.1)', borderRadius: '14px' }}>
                      <div>
                        <div style={{ fontWeight: 600 }}>{l.reason}</div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '2px' }}>Date: {l.date}</div>
                      </div>
                      <StatusBadge status={l.status} />
                    </motion.div>
                  ))}
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    style={{ padding: '12px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '12px', color: '#34d399', cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <PlusCircle size={16} /> Apply for Leave
                  </motion.button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>

      {/* ── ADD ASSIGNMENT MODAL ── */}
      <AnimatePresence>
        {showAddAssignment && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}
            onClick={() => setShowAddAssignment(false)}>
            <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              style={{ background: '#071a12', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '20px', padding: '2rem', width: 480, maxWidth: '90vw' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontWeight: 800, fontSize: '1.1rem' }}>Create New Assignment</h3>
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowAddAssignment(false)} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }}><X size={20} /></motion.button>
              </div>
              {['Title', 'Select Class', 'Due Date', 'Description'].map((field, i) => (
                <div key={i} style={{ marginBottom: '1rem' }}>
                  <label style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600, display: 'block', marginBottom: '6px' }}>{field.toUpperCase()}</label>
                  <input type={field === 'Due Date' ? 'date' : 'text'} placeholder={field}
                    style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '10px', color: '#e2e8f0', fontSize: '0.875rem', outline: 'none' }} />
                </div>
              ))}
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', borderRadius: '12px', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '1rem' }}>
                Create Assignment
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeacherDashboard;

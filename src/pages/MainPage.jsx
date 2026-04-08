import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Award, BookOpen, Globe, MapPin, Mail, Phone, Bell, ChevronRight } from 'lucide-react';

const MainPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleStudentLogin = async (credentials) => {
    setError('');
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...credentials, role: 'student' })
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        navigate('/student-dashboard');
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
    <div style={{ padding: '0', scrollBehavior: 'smooth' }}>
      
      {/* Top Notice Bar */}
      <div className="top-notice-bar">
        <div>
          <span style={{ marginRight: '1rem' }}><Phone size={14} style={{ display: 'inline', marginRight: '4px' }}/> +1 (800) 555-0198</span>
          <span><Mail size={14} style={{ display: 'inline', marginRight: '4px' }}/> admissions@globaltech.edu</span>
        </div>
        <div>
          <a href="#about" style={{ color: 'white', textDecoration: 'none', marginRight: '15px' }}>Alumni</a>
          <a href="#contact" style={{ color: 'white', textDecoration: 'none', marginRight: '15px' }}>Careers</a>
          <a href="#contact" style={{ color: 'white', textDecoration: 'none' }}>Library</a>
        </div>
      </div>

      {/* Ticker */}
      <div className="news-ticker">
        <span style={{ fontWeight: 800, marginRight: '10px', background: 'var(--brand-red)', color: 'white', padding: '2px 8px', borderRadius: '4px' }}>NEW</span>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <div className="ticker-content">
            Admissions open for the Academic Year 2026! Apply now online. &nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp; 
            Global Tech breaks records in national placement drives! &nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;
            Upcoming Seminar on AI & Robotics on May 10th.
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav style={{ 
        position: 'sticky', top: 0, width: '100%', padding: '1rem 4rem', 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: '#ffffff', borderBottom: '3px solid var(--brand-red)', zIndex: 50,
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'var(--brand-navy)', padding: '10px', borderRadius: '4px' }}>
            <GraduationCap color="white" size={36} />
          </div>
          <div>
            <span style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--brand-navy)', display: 'block', lineHeight: 1 }}>GLOBAL TECH</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--brand-red)', letterSpacing: '2px' }}>UNIVERSITY</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '2rem', fontWeight: 600, alignItems: 'center', color: 'var(--brand-navy)' }}>
          <a href="#home" style={{ color: 'inherit', textDecoration: 'none' }}>HOME</a>
          <a href="#about" style={{ color: 'inherit', textDecoration: 'none' }}>INSTITUTION</a>
          <a href="#highlights" style={{ color: 'inherit', textDecoration: 'none' }}>CAMPUS LIFE</a>
          <a href="#contact" style={{ color: 'inherit', textDecoration: 'none' }}>CONTACT</a>
          <button 
            onClick={() => {
              const el = document.getElementById('login-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            style={{ 
              background: 'var(--brand-red)', color: 'white', padding: '10px 24px', 
              borderRadius: '4px', border: 'none', fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '8px'
            }}
          >
            STUDENT LOGIN <ChevronRight size={16} />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" style={{ 
        width: '100%', 
        height: '600px',
        position: 'relative',
        background: 'url(/campus_banner.png) center/cover no-repeat',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderBottom: '10px solid var(--brand-navy)'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to right, rgba(14, 39, 83, 0.9) 0%, rgba(14, 39, 83, 0.3) 100%)' }} />
        
        <div style={{ position: 'relative', zIndex: 10, padding: '0 6rem', maxWidth: '800px', color: 'white' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span style={{ display: 'inline-block', padding: '6px 12px', background: 'var(--brand-red)', fontWeight: 700, marginBottom: '1rem', borderRadius: '4px' }}>
              REDEFINING EXCELLENCE
            </span>
            <h1 style={{ fontSize: '3.5rem', fontWeight: 900, lineHeight: '1.2', marginBottom: '1.5rem', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
              Empowering the Next Generation of Innovators
            </h1>
            <p style={{ fontSize: '1.2rem', marginBottom: '2rem', lineHeight: '1.6', opacity: 0.9 }}>
              Sri Venkateswara College inspired layout with traditional institutional authority, cutting-edge facilities, and a legacy of producing world-class tech leaders.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Floating Student Portal Login Section */}
      <section id="login-section" style={{ padding: '0 4rem', marginTop: '-80px', position: 'relative', zIndex: 20 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '2rem' }}>
          
          <div className="glass-panel" style={{ flex: '1 1 60%', background: 'white', padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ padding: '12px', background: 'rgba(218, 41, 28, 0.1)', borderRadius: '8px', color: 'var(--brand-red)' }}>
                <Bell size={32} />
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--brand-navy)' }}>Important Announcements</h2>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
                <a href="#" style={{ color: 'var(--brand-navy)', textDecoration: 'none', fontWeight: 600, fontSize: '1.1rem' }}>Semester Examination Timetable Published</a>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>Check the student portal for precise dates and hall allocations.</p>
              </li>
              <li style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
                <a href="#" style={{ color: 'var(--brand-navy)', textDecoration: 'none', fontWeight: 600, fontSize: '1.1rem' }}>Registration for AI Workshop</a>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>Limited seats available for the 3-day deep learning bootcamp.</p>
              </li>
            </ul>
          </div>

          <div style={{ flex: '1 1 40%' }}>
            <LoginForm 
              role="student"
              title="Student Portal Login"
              subtitle="Access your academic dashboard, grades, and schedules."
              onSubmit={handleStudentLogin}
              error={error}
              loading={loading}
            />
          </div>

        </div>
      </section>

      {/* About Section */}
      <section id="about" style={{ padding: '6rem 4rem', background: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'center' }}>
          <motion.div 
            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            style={{ flex: '1 1 50%' }}
          >
            <h2 className="section-title" style={{ textAlign: 'left' }}>About The Institution</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '1.5rem' }}>
              Established in 1995, Global Tech University is an autonomous institution affiliated with the highest national academic boards. We are committed to providing quality education in engineering and technology to prepare perfectly rounded technocrats.
            </p>
            <ul style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.8', paddingLeft: '1.5rem', marginBottom: '2rem' }}>
              <li>NAAC Accredited with 'A+' Grade</li>
              <li>Consistently ranked among Top 10 Engineering Colleges</li>
              <li>State-of-the-art research centers and laboratories</li>
              <li>Over 150+ international university tie-ups</li>
            </ul>
            <button className="btn-primary" style={{ width: 'auto', display: 'inline-flex', padding: '12px 32px' }}>Read More</button>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            style={{ flex: '1 1 40%', position: 'relative' }}
          >
            <div style={{ width: '100%', height: '400px', background: 'url(/campus_banner.png) center/cover no-repeat', borderRadius: '8px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
            <div style={{ position: 'absolute', bottom: '-20px', left: '-20px', background: 'var(--brand-navy)', color: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 10px 30px rgba(14, 39, 83, 0.3)' }}>
              <div style={{ fontSize: '3rem', fontWeight: 900, lineHeight: 1 }}>25+</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 500 }}>Years of Excellence</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section style={{ padding: '4rem 4rem', background: 'var(--brand-navy)', color: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 45%', padding: '2.5rem', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', background: 'rgba(255,255,255,0.02)' }}>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--brand-gold)', marginBottom: '1rem' }}>Our Vision</h3>
            <p style={{ lineHeight: '1.8', fontSize: '1.05rem', color: '#cbd5e1' }}>To be a premier institution of engineering and technology, pursuing excellence through innovation, research, and holistic education that transforms students into socially responsible global leaders.</p>
          </div>
          <div style={{ flex: '1 1 45%', padding: '2.5rem', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', background: 'rgba(255,255,255,0.02)' }}>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--brand-gold)', marginBottom: '1rem' }}>Our Mission</h3>
            <p style={{ lineHeight: '1.8', fontSize: '1.05rem', color: '#cbd5e1' }}>To impart quality technical education, cultivate an ecosystem of research and entrepreneurship, and bridge the gap between academic theory and deep industrial practice.</p>
          </div>
        </div>
      </section>

      {/* Founders / Leadership Section */}
      <section style={{ padding: '6rem 4rem', background: 'var(--bg-color)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 className="section-title">Leadership & Founders</h2>
          
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: '4rem', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '1.5rem' }}>The Story of Global Tech</h3>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-secondary)', maxWidth: '900px', margin: '0 auto' }}>
              Founded in memory of visionary philanthropists, Global Tech was established with a singular dream: to create an institution that rivaled the finest global academies while remaining deeply rooted in foundational ethics. The institution grew from a single block of classrooms in 1995 to a sprawling modern campus accommodating over 5,000 brilliant minds. We strive every day to produce thought leaders and innovators who will architect the future of our nation.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem' }}>
            {/* Profile 1 */}
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} style={{ textAlign: 'center' }}>
              <div style={{ width: '200px', height: '200px', borderRadius: '50%', background: '#e2e8f0', margin: '0 auto 1.5rem auto', overflow: 'hidden', border: '4px solid var(--brand-red)', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
                <img src="/top_students.png" alt="Founder Chairman" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(60%)' }} />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--brand-navy)' }}>Dr. Venkat Srinivasan</h3>
              <p style={{ color: 'var(--brand-red)', fontWeight: 600 }}>Founder Chairman</p>
            </motion.div>
            
            {/* Profile 2 */}
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} viewport={{ once: true }} style={{ textAlign: 'center' }}>
              <div style={{ width: '200px', height: '200px', borderRadius: '50%', background: '#e2e8f0', margin: '0 auto 1.5rem auto', overflow: 'hidden', border: '4px solid var(--brand-gold)', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
                <img src="/campus_banner.png" alt="Co-Founder" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(50%)' }} />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--brand-navy)' }}>Smt. Lakshmi Srinivasan</h3>
              <p style={{ color: 'var(--brand-red)', fontWeight: 600 }}>Co-Founder & Secretary</p>
            </motion.div>

            {/* Profile 3 */}
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} viewport={{ once: true }} style={{ textAlign: 'center' }}>
              <div style={{ width: '200px', height: '200px', borderRadius: '50%', background: '#e2e8f0', margin: '0 auto 1.5rem auto', overflow: 'hidden', border: '4px solid var(--brand-navy)', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
                <img src="/college_lab.png" alt="Principal" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(30%)' }} />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--brand-navy)' }}>Dr. K. Rajendran</h3>
              <p style={{ color: 'var(--brand-red)', fontWeight: 600 }}>Principal & Director</p>
            </motion.div>

            {/* Profile 4 */}
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} viewport={{ once: true }} style={{ textAlign: 'center' }}>
              <div style={{ width: '200px', height: '200px', borderRadius: '50%', background: '#e2e8f0', margin: '0 auto 1.5rem auto', overflow: 'hidden', border: '4px solid #cbd5e1', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
                <img src="/top_students.png" alt="Dean" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(20%)' }} />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--brand-navy)' }}>Prof. Anand Kumar</h3>
              <p style={{ color: 'var(--brand-red)', fontWeight: 600 }}>Dean of Academics</p>
            </motion.div>
          </div>

        </div>
      </section>

      {/* Academic Programs Section */}
      <section style={{ padding: '6rem 4rem', background: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 className="section-title">Academic Streams</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {['MPC (Maths, Physics, Chemistry)', 'BiPC (Biology, Physics, Chemistry)', 'MEC (Maths, Economics, Commerce)', 'CEC (Civics, Economics, Commerce)', 'HEC (History, Economics, Civics)', 'MBiPC (Maths, Bio, Physics, Chem)'].map((dept, idx) => (
              <motion.div key={idx} whileHover={{ y: -5 }} className="glass-panel" style={{ padding: '2rem', textAlign: 'center', borderTop: '4px solid var(--brand-navy)' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--brand-navy)', marginBottom: '1rem', height: '40px' }}>{dept}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>1st & 2nd Year Intermediate</p>
                <div style={{ cursor: 'pointer', color: 'var(--brand-red)', fontWeight: 600, fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center' }}>View Curriculum <ChevronRight size={14} /></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section style={{ padding: '6rem 4rem', background: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 className="section-title">Our Shining Stars - 2025 Results</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '3rem' }}>Consistent state-level top ranks in Board Examinations and Competitive Entrances (JEE/NEET).</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
            {[ 
              { rank: 'State 1st', exam: 'JEE Mains', name: 'R. Siddharth' }, 
              { rank: 'State 3rd', exam: 'NEET UG', name: 'M. Shruthi' }, 
              { rank: '99.2%', exam: 'Intermediate Boards', name: 'K. Aditya' }, 
              { rank: 'State 5th', exam: 'EAPCET', name: 'P. Vignesh' } 
            ].map((topper, idx) => (
              <motion.div key={idx} whileHover={{ y: -5 }} className="glass-panel" style={{ padding: '2rem', borderTop: '4px solid var(--brand-gold)' }}>
                 <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--brand-red)', marginBottom: '0.5rem' }}>{topper.rank}</div>
                 <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '0.5rem' }}>{topper.exam}</div>
                 <div style={{ color: 'var(--text-secondary)' }}>{topper.name}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section style={{ padding: '6rem 4rem', background: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 className="section-title">World-Class Facilities</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
             <motion.div whileHover={{ scale: 1.02 }} className="glass-panel" style={{ padding: '2rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ padding: '12px', background: 'rgba(14, 39, 83, 0.1)', borderRadius: '8px' }}><BookOpen color="var(--brand-navy)" size={24} /></div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '0.5rem' }}>Digital Library</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>Access to over 50,000 reference books, journals, and digital modules tailored for competitive exams.</p>
                </div>
             </motion.div>
             <motion.div whileHover={{ scale: 1.02 }} className="glass-panel" style={{ padding: '2rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ padding: '12px', background: 'rgba(14, 39, 83, 0.1)', borderRadius: '8px' }}><Globe color="var(--brand-navy)" size={24} /></div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '0.5rem' }}>Smart Classrooms</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>Interactive AC classrooms equipped with high-end projection systems to visualize complex concepts.</p>
                </div>
             </motion.div>
             <motion.div whileHover={{ scale: 1.02 }} className="glass-panel" style={{ padding: '2rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ padding: '12px', background: 'rgba(14, 39, 83, 0.1)', borderRadius: '8px' }}><MapPin color="var(--brand-navy)" size={24} /></div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '0.5rem' }}>Safe Transportation</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>A fleet of 50+ college buses connecting every major route across the city for safe and timely transit.</p>
                </div>
             </motion.div>
          </div>
        </div>
      </section>

      {/* Events & Functions Section */}
      <section style={{ padding: '6rem 4rem', background: 'var(--bg-color)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
          <h2 className="section-title">Events & Functions Gallery</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            
            {/* Event 1 */}
            <motion.div whileHover={{ y: -5 }} style={{ border: '1px solid #e2e8f0', borderRadius: '4px', overflow: 'hidden', background: 'white', display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: '100%', height: '350px', background: 'url(/top_students.png) center/cover no-repeat', borderBottom: '1px solid #e2e8f0' }} />
              <div style={{ display: 'flex', flex: 1 }}>
                <div style={{ background: 'var(--brand-navy)', color: 'white', padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: '90px' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>Aug</span>
                  <span style={{ fontSize: '2rem', fontWeight: 800 }}>27</span>
                </div>
                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '0.8rem', lineHeight: 1.3 }}>Valedictory function of PACE & IETE</h3>
                  <div style={{ cursor: 'pointer', color: 'var(--brand-navy)', fontWeight: 600, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '4px' }}>Learn More <span style={{ color: 'var(--brand-red)', marginLeft: '2px' }}>→</span></div>
                </div>
              </div>
            </motion.div>

            {/* Event 2 */}
            <motion.div whileHover={{ y: -5 }} style={{ border: '1px solid #e2e8f0', borderRadius: '4px', overflow: 'hidden', background: 'white', display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: '100%', height: '350px', background: 'url(/campus_banner.png) center/cover no-repeat', borderBottom: '1px solid #e2e8f0' }} />
              <div style={{ display: 'flex', flex: 1 }}>
                <div style={{ background: 'var(--brand-navy)', color: 'white', padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: '90px' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>Aug</span>
                  <span style={{ fontSize: '2rem', fontWeight: 800 }}>27</span>
                </div>
                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '0.8rem', lineHeight: 1.3 }}>Walk-In-Interview for Faculty Openings</h3>
                  <div style={{ cursor: 'pointer', color: 'var(--brand-navy)', fontWeight: 600, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '4px' }}>Learn More <span style={{ color: 'var(--brand-red)', marginLeft: '2px' }}>→</span></div>
                </div>
              </div>
            </motion.div>

            {/* Event 3 */}
            <motion.div whileHover={{ y: -5 }} style={{ border: '1px solid #e2e8f0', borderRadius: '4px', overflow: 'hidden', background: 'white', display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: '100%', height: '350px', background: 'url(/college_lab.png) center/cover no-repeat', borderBottom: '1px solid #e2e8f0' }} />
              <div style={{ display: 'flex', flex: 1 }}>
                <div style={{ background: 'var(--brand-navy)', color: 'white', padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: '90px' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>Aug</span>
                  <span style={{ fontSize: '2rem', fontWeight: 800 }}>25</span>
                </div>
                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '0.8rem', lineHeight: 1.3 }}>15 years of Excellence in Engineering</h3>
                  <div style={{ cursor: 'pointer', color: 'var(--brand-navy)', fontWeight: 600, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '4px' }}>Learn More <span style={{ color: 'var(--brand-red)', marginLeft: '2px' }}>→</span></div>
                </div>
              </div>
            </motion.div>
            
          </div>
          
          {/* Subtle dots indicator to match slider look */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '3rem' }}>
             {[1, 2, 3, 4, 5, 6, 7].map(num => (
               <div key={num} style={{ width: '12px', height: '12px', background: num === 4 ? 'var(--brand-navy)' : '#cbd5e1', borderRadius: '2px' }}></div>
             ))}
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section id="highlights" style={{ padding: '6rem 4rem', background: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 className="section-title">Campus Excellence</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
            <motion.div whileHover={{ y: -5 }} className="glass-panel" style={{ overflow: 'hidden' }}>
              <img src="/top_students.png" alt="Top Ranked Students" style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '0.5rem' }}>Academic Achievers</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Celebrating our top scholars who secured university ranks and gold medals in their respective disciplines.</p>
              </div>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="glass-panel" style={{ overflow: 'hidden' }}>
              <img src="/college_lab.png" alt="High Tech Labs" style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '0.5rem' }}>Research & Innovation</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Our modern laboratories are equipped with industry-standard technologies to bridge the gap between academia and corporate.</p>
              </div>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="glass-panel" style={{ overflow: 'hidden' }}>
              <img src="/campus_banner.png" alt="Campus Life" style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '0.5rem' }}>Vibrant Campus Life</h3>
                <p style={{ color: 'var(--text-secondary)' }}>A green, 100-acre campus providing the perfect ecosystem for athletic, cultural, and extracurricular growth.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact & Footer Section */}
      <section id="contact" style={{ background: 'var(--brand-navy)', color: 'white' }}>
        <div style={{ padding: '5rem 4rem', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '4rem' }}>
          <div style={{ flex: '1 1 300px' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
                <GraduationCap color="var(--brand-gold)" size={36} />
                <span style={{ fontSize: '1.4rem', fontWeight: 900 }}>GLOBAL TECH</span>
             </div>
             <p style={{ color: '#cbd5e1', lineHeight: '1.6', marginBottom: '2rem' }}>
                Pioneering education, nurturing talent, and building paths to a brighter tomorrow.
             </p>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: '#cbd5e1' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><MapPin size={18} color="var(--brand-gold)"/> 123 University Drive, Innovation City</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Phone size={18} color="var(--brand-gold)"/> +1 (800) 555-0198</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Mail size={18} color="var(--brand-gold)"/> admissions@globaltech.edu</div>
             </div>
          </div>

          <div style={{ flex: '1 1 200px' }}>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--brand-gold)' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><a href="#" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Admissions 2026</a></li>
              <li><a href="#" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Academic Calendar</a></li>
              <li><a href="#" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Examination Results</a></li>
              <li><a href="#" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Placement Cell</a></li>
            </ul>
          </div>
        </div>
        
        <div style={{ padding: '1.5rem 4rem', background: '#091936', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>
          <p>&copy; 2026 Global Tech University. All rights reserved.</p>
        </div>
      </section>
    </div>
  );
};

export default MainPage;

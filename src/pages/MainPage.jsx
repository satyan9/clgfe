import React from 'react';
import LoginForm from '../components/LoginForm';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Award, BookOpen, Globe, MapPin, Mail, Phone } from 'lucide-react';

const MainPage = () => {
  const navigate = useNavigate();

  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

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

  const FeatureCard = ({ icon: Icon, title, desc, delay }) => (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}
      className="glass-panel" 
      style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, minWidth: '250px' }}
    >
      <div style={{ padding: '16px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', width: 'fit-content' }}>
        <Icon color="#60a5fa" size={28} />
      </div>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{title}</h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>{desc}</p>
    </motion.div>
  );

  return (
    <div style={{ padding: '0', scrollBehavior: 'smooth' }}>
      
      {/* Navigation Bar */}
      <nav style={{ 
        position: 'fixed', top: 0, width: '100%', padding: '1.5rem 4rem', 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--glass-border)', zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: '#3b82f6', padding: '8px', borderRadius: '8px' }}>
            <GraduationCap color="white" size={24} />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '0.5px' }}>Global Tech University</span>
        </div>
        <div style={{ display: 'flex', gap: '2rem', fontWeight: 500 }}>
          <a href="#home" style={{ color: 'white', textDecoration: 'none' }}>Home</a>
          <a href="#about" style={{ color: 'white', textDecoration: 'none' }}>About Us</a>
          <a href="#academics" style={{ color: 'white', textDecoration: 'none' }}>Academics</a>
          <a href="#contact" style={{ color: 'white', textDecoration: 'none' }}>Contact</a>
        </div>
      </nav>

      {/* Hero Section (Home + Login) */}
      <section id="home" style={{ 
        width: '100%', 
        minHeight: '100vh',
        display: 'flex',
        flexWrap: 'wrap',
        paddingTop: '80px' // offset for fixed nav
      }}>
        
        {/* Left Side: Hero Text */}
        <div style={{ flex: '1 1 50%', padding: '4rem 4rem 4rem 8rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 style={{ fontSize: '4.5rem', fontWeight: 800, lineHeight: '1.1', marginBottom: '1.5rem' }}>
              Empowering the <br />
              <span style={{ 
                background: 'linear-gradient(to right, #60a5fa, #a78bfa)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>Next Generation</span>
            </h1>
            
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '500px', lineHeight: '1.6' }}>
              Join a premier institution dedicated to excellence in education, groundbreaking research, and holistic student development. 
            </p>

            <motion.a 
              href="#about"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ 
                display: 'inline-block', padding: '14px 28px', background: 'transparent',
                border: '1px solid #3b82f6', color: '#60a5fa', borderRadius: '30px',
                fontWeight: 600, textDecoration: 'none', transition: 'background 0.3s'
              }}
            >
              Explore Our Campus ↓
            </motion.a>
          </motion.div>
        </div>

        {/* Right Side: Student Login */}
        <div style={{ flex: '1 1 50%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem', background: 'rgba(0,0,0,0.2)' }}>
          <div style={{ width: '100%', maxWidth: '420px' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{ marginBottom: '2rem', textAlign: 'center' }}
            >
              <div style={{ 
                display: 'inline-block', 
                padding: '6px 16px', 
                background: 'rgba(59, 130, 246, 0.1)', 
                color: '#60a5fa',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 600,
                letterSpacing: '0.5px'
              }}>
                STUDENT PORTAL ACCESS
              </div>
            </motion.div>
            
            <LoginForm 
              role="student"
              title="Welcome Back"
              subtitle="Enter your credentials to access your academic dashboard."
              onSubmit={handleStudentLogin}
              error={error}
              loading={loading}
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" style={{ padding: '8rem 4rem', background: 'rgba(15, 23, 42, 0.3)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: '4rem' }}
          >
            <h2 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '1rem' }}>About Our College</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
              Established in 1995, Global Tech University has been at the forefront of technological innovation and academic excellence. 
              We nurture leaders who are prepared to face the challenges of tomorrow.
            </p>
          </motion.div>

          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <FeatureCard icon={Award} title="Top Ranked Institute" desc="Consistently ranked among the top 10 technological institutes globally for our rigorous curriculum and outstanding research output." delay={0.1} />
            <FeatureCard icon={BookOpen} title="Expert Faculty" desc="Learn from industry leaders, distinguished scholars, and renowned academic researchers who bring real-world experience to the classroom." delay={0.3} />
            <FeatureCard icon={Globe} title="Global Network" desc="Connect with an extensive alumni base and university partners across 150+ countries, opening doors to international opportunities." delay={0.5} />
          </div>
        </div>
      </section>

      {/* Highlights & Banners Section */}
      <section id="highlights" style={{ padding: '8rem 4rem', background: 'var(--bg-color)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: '4rem' }}
          >
            <h2 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '1rem' }}>Campus Highlights & Excellence</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
              From top-ranked students breaking records to state-of-the-art facilities, explore the vibrant life at Global Tech.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <motion.div 
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              style={{ borderRadius: '16px', overflow: 'hidden', height: '350px', position: 'relative', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', cursor: 'pointer' }}
            >
              <img src="/top_students.png" alt="Top Ranked Students" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '2rem 1.5rem', background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)', color: 'white' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Top Ranked Scholars</h3>
                <p style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>Our students winning national tech awards.</p>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              style={{ borderRadius: '16px', overflow: 'hidden', height: '350px', position: 'relative', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', cursor: 'pointer' }}
            >
              <img src="/campus_banner.png" alt="Campus Banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '2rem 1.5rem', background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)', color: 'white' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Welcoming Campus</h3>
                <p style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>Join the tradition of excellence.</p>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              style={{ borderRadius: '16px', overflow: 'hidden', height: '350px', position: 'relative', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', cursor: 'pointer' }}
            >
              <img src="/college_lab.png" alt="High Tech Labs" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '2rem 1.5rem', background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)', color: 'white' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Advanced Facilities</h3>
                <p style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>Hands-on learning with state of the art tech.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" style={{ padding: '8rem 4rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '4rem' }}>
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            style={{ flex: '1 1 40%' }}
          >
            <h2 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '1.5rem' }}>Get in Touch</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem', lineHeight: '1.6' }}>
              Have questions about admissions or programs? Our administration office is always here to help you navigate your academic journey.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ padding: '12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%' }}><MapPin color="#60a5fa" /></div>
                <div>
                  <h4 style={{ fontWeight: 600, fontSize: '1.1rem' }}>Campus Address</h4>
                  <p style={{ color: 'var(--text-secondary)' }}>123 University Drive, Innovation City, TC 90210</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ padding: '12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%' }}><Mail color="#60a5fa" /></div>
                <div>
                  <h4 style={{ fontWeight: 600, fontSize: '1.1rem' }}>Email Us</h4>
                  <p style={{ color: 'var(--text-secondary)' }}>admissions@globaltech.edu</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ padding: '12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%' }}><Phone color="#60a5fa" /></div>
                <div>
                  <h4 style={{ fontWeight: 600, fontSize: '1.1rem' }}>Call Us</h4>
                  <p style={{ color: 'var(--text-secondary)' }}>+1 (800) 555-0198</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-panel"
            style={{ flex: '1 1 50%', padding: '3rem' }}
          >
            <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '2rem' }}>Send a Message</h3>
            <form onSubmit={(e) => e.preventDefault()}>
              <input type="text" placeholder="Your Name" className="input-field" style={{ marginBottom: '1rem' }} />
              <input type="email" placeholder="Your Email" className="input-field" style={{ marginBottom: '1rem' }} />
              <textarea placeholder="How can we help you?" className="input-field" style={{ minHeight: '120px', resize: 'vertical', marginBottom: '1.5rem' }}></textarea>
              <button className="btn-primary" style={{ padding: '16px' }}>Submit Message</button>
            </form>
          </motion.div>

        </div>
      </section>
      
      {/* Footer */}
      <footer style={{ padding: '2rem 4rem', background: 'rgba(0,0,0,0.5)', textAlign: 'center', color: 'var(--text-secondary)', borderTop: '1px solid var(--glass-border)' }}>
        <p>&copy; 2026 Global Tech University. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default MainPage;

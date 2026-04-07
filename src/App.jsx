import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainPage from './pages/MainPage';
import TeacherPage from './pages/TeacherPage';
import AdminPage from './pages/AdminPage';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/teacher" element={<TeacherPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/student-dashboard" element={<Dashboard role="student" />} />
        <Route path="/teacher-dashboard" element={<Dashboard role="teacher" />} />
        <Route path="/admin-dashboard" element={<Dashboard role="admin" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

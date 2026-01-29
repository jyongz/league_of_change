import { useState } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import OverviewPage from './pages/OverviewPage';
import LessonsPage from './pages/LessonsPage';
import LessonDetailsPage from './pages/LessonDetailsPage';
import SchedulePage from './pages/SchedulePage';
import ProgressPage from './pages/ProgressPage';
import StaffPage from './pages/StaffPage';
import ServiceHealthPage from './pages/ServiceHealthPage';
import LoginPage from './pages/LoginPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className={`dashboard ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
      <Sidebar 
        isMobileMenuOpen={isMobileMenuOpen} 
        onLinkClick={() => setIsMobileMenuOpen(false)} 
      />

      <main className="main">
        <Routes>
          <Route path="/" element={<OverviewPage onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />} />
          <Route path="/lessons" element={<LessonsPage onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />} />
          <Route path="/lessons/:lessonId" element={<LessonDetailsPage onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />} />
          <Route path="/schedule" element={<SchedulePage onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />} />
          <Route path="/progress" element={<ProgressPage onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />} />
          <Route path="/staff" element={<StaffPage onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />} />
          <Route path="/health" element={<ServiceHealthPage onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;

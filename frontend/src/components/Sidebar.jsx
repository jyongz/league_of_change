import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { lessons } from '../data/lessons';

function Sidebar({ isMobileMenuOpen, onLinkClick }) {
  const navigate = useNavigate();

  const handleLinkClick = () => {
    if (onLinkClick) onLinkClick();
  };

  // Helper to parse "Feb 04 • 18:30" into a Date object (assuming year 2026)
  const parseDateTime = (dateTimeStr) => {
    if (!dateTimeStr || !dateTimeStr.includes(' • ')) return new Date(0);
    const months = {
      'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
      'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
    };
    const [datePart, timePart] = dateTimeStr.split(' • ');
    const [monthStr, dayStr] = datePart.split(' ');
    const [hours, minutes] = timePart.split(':');
    return new Date(2026, months[monthStr], parseInt(dayStr), parseInt(hours), parseInt(minutes));
  };

  // Find the next scheduled lesson
  const now = new Date(2026, 0, 28, 16, 28); // "Current" time as per system prompt
  const upcomingLessons = lessons
    .filter(l => l.dateTime)
    .map(l => ({ ...l, parsedDate: parseDateTime(l.dateTime) }))
    .filter(l => l.parsedDate > now)
    .sort((a, b) => a.parsedDate - b.parsedDate);

  const nextLesson = upcomingLessons[0];

  return (
    <aside className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
      {isMobileMenuOpen && (
        <button className="sidebar-collapsible-btn" onClick={onLinkClick}>
          ✕ Close Menu
        </button>
      )}
      <div className="brand">
        <span className="brand-mark">LC</span>
        <div className="brand-text">
          <p className="brand-title">Street League</p>
          <p className="brand-subtitle">Dashboard</p>
        </div>
      </div>

      <nav className="nav">
        <NavLink className="nav-item" to="/" end onClick={handleLinkClick}>
          Overview
        </NavLink>
        <NavLink className="nav-item" to="/lessons" onClick={handleLinkClick}>
          Lessons
        </NavLink>
        <NavLink className="nav-item" to="/schedule" onClick={handleLinkClick}>
          Schedule
        </NavLink>
        <NavLink className="nav-item" to="/progress" onClick={handleLinkClick}>
          Progress
        </NavLink>
      </nav>

      <div className="sidebar-card">
        <p className="sidebar-label">Next drop</p>
        {nextLesson ? (
          <>
            <h3 className="sidebar-title">{nextLesson.title}</h3>
            <p className="sidebar-meta">
              {nextLesson.dateTime?.includes(' • ') ? nextLesson.dateTime.split(' • ')[0] : ''} • {nextLesson.dateTime?.includes(' • ') ? nextLesson.dateTime.split(' • ')[1] : ''} • {nextLesson.location}
            </p>
            <button className="cta" onClick={() => {
              navigate(`/lessons/${nextLesson.id}`);
              handleLinkClick();
            }}>
              View lesson
            </button>
          </>
        ) : (
          <p className="sidebar-meta">No upcoming lessons</p>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;

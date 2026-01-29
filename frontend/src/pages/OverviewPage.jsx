import React from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../components/Topbar';
import StatCard from '../components/StatCard';
import AttendanceRate from '../components/AttendanceRate';
import { lessons } from '../data/lessons';

function OverviewPage({ onMenuToggle }) {
  const navigate = useNavigate();

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

  const now = new Date(2026, 0, 28, 16, 28);
  
  // Calculate lessons this month (February 2026)
  const febLessons = lessons.filter(l => l.dateTime && l.dateTime.startsWith('Feb'));
  
  // Find upcoming lessons
  const upcomingLessons = lessons
    .filter(l => l.dateTime)
    .map(l => ({ ...l, parsedDate: parseDateTime(l.dateTime) }))
    .filter(l => l.parsedDate > now)
    .sort((a, b) => a.parsedDate - b.parsedDate)
    .slice(0, 5);

  return (
    <>
      <Topbar 
        title="Dashboard"
        subtitle="View and manage lessons at a glance."
        onMenuToggle={onMenuToggle}
      />

      <section className="stats-grid">
        <StatCard 
          label="Scheduled Lessons this month" 
          value={febLessons.length.toString()} 
          trend="+2 vs last month" 
          trendType="up" 
          accent 
        />
        <StatCard 
          label="Total Participants this month" 
          value="142" 
          trend="+8% month" 
          trendType="up" 
        />
        <StatCard 
          label="Available volunteers this month" 
          value="34" 
          trend="Steady" 
          trendType="up" 
        />
      </section>

      <section className="content-grid">
        <AttendanceRate />
        <div className="panel">
          <div className="panel-header">
            <h3>Upcoming Lessons</h3>
            <span className="panel-chip">Next 5</span>
          </div>
          <ul className="activity">
            {upcomingLessons.map((lesson) => (
              <li 
                key={lesson.id} 
                className="table-row" 
                onClick={() => navigate(`/lessons/${lesson.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className="activity-info">
                  <p className="activity-title"><strong>{lesson.title}</strong></p>
                  <p className="activity-meta">
                    {lesson.dateTime} • {lesson.location}
                  </p>
                </div>
              </li>
            ))}
            {upcomingLessons.length === 0 && (
              <li>No upcoming lessons scheduled.</li>
            )}
          </ul>
        </div>
      </section>
    </>
  );
}

export default OverviewPage;

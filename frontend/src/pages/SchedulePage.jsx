import React, { useState } from 'react';
import { lessons } from '../data/lessons';
import { useNavigate } from 'react-router-dom';
import Topbar from '../components/Topbar';
import { useAuth } from '../context/AuthContext';

function SchedulePage({ onMenuToggle }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const canEdit = user && (user.role === 'admin' || user.role === 'coach');
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 1)); // Default to February 2026 as per data
  const [view, setView] = useState('month');
  const [localLessons, setLocalLessons] = useState(lessons);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [editFormData, setEditFormData] = useState({ date: '', time: '' });

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // --- Month View Logic ---
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);

  const prevMonthPadding = [];
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const d = new Date(year, month, 0 - i);
    prevMonthPadding.push({
      day: d.getDate(),
      month: d.getMonth(),
      year: d.getFullYear(),
      isCurrentMonth: false
    });
  }

  const currentMonthDays = [];
  for (let i = 1; i <= daysInMonth; i++) {
    currentMonthDays.push({
      day: i,
      month: month,
      year: year,
      isCurrentMonth: true
    });
  }

  const totalCells = 42; // 6 rows of 7 days
  const nextMonthPadding = [];
  const remainingCells = totalCells - prevMonthPadding.length - currentMonthDays.length;
  for (let i = 1; i <= remainingCells; i++) {
    const d = new Date(year, month + 1, i);
    nextMonthPadding.push({
      day: d.getDate(),
      month: d.getMonth(),
      year: d.getFullYear(),
      isCurrentMonth: false
    });
  }

  const calendarDays = [...prevMonthPadding, ...currentMonthDays, ...nextMonthPadding];

  // --- Week View Logic ---
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
  
  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    weekDays.push(day);
  }

  const timeSlots = [];
  for (let i = 8; i <= 22; i++) {
    timeSlots.push(`${i}:00`);
  }

  const changePeriod = (offset) => {
    if (view === 'month') {
      setCurrentDate(new Date(year, month + offset, 1));
    } else {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() + (offset * 7));
      setCurrentDate(newDate);
    }
  };

  const getLessonsForDay = (day, m, y) => {
    return localLessons.filter(lesson => {
      if (!lesson.dateTime || !lesson.dateTime.includes(' • ')) return false;
      const parts = lesson.dateTime.split(' • ');
      const dateParts = parts[0].split(' '); // ['Feb', '04']
      const lessonMonthStr = dateParts[0];
      const lessonDay = parseInt(dateParts[1]);

      const monthAbbr = monthNames[m].substring(0, 3);
      // Ensure we match year specifically for mock data consistency
      // The original code had y === 2026, but if we navigate to 2025 it won't show anything.
      // However, the issue was specifically about a crash.
      return lessonMonthStr === monthAbbr && lessonDay === day && y === 2026;
    });
  };

  const handleScheduleLesson = (lessonId) => {
    setLocalLessons(prev => prev.map(l => {
      if (l.id === lessonId) {
        return { ...l, dateTime: l.proposedTime || 'Feb 01 • 09:00' };
      }
      return l;
    }));
  };

  const handleOpenEditModal = (lesson) => {
    setEditingLesson(lesson);
    // Parse proposedTime (e.g., "Feb 04 • 18:30")
    let defaultDate = '2026-02-04';
    let defaultTime = '18:30';
    
    if (lesson.proposedTime && lesson.proposedTime.includes(' • ')) {
      const parts = lesson.proposedTime.split(' • ');
      const dateParts = parts[0].split(' '); // ["Feb", "04"]
      const monthIdx = monthNames.findIndex(m => m.startsWith(dateParts[0]));
      const day = dateParts[1];
      if (monthIdx !== -1) {
        defaultDate = `2026-${(monthIdx + 1).toString().padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
      defaultTime = parts[1];
    }
    
    setEditFormData({ date: defaultDate, time: defaultTime });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const { date, time } = editFormData;
    
    // Convert date "2026-02-04" to "Feb 04" using local time to avoid timezone shifts
    const [y, m, d] = date.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    const monthAbbr = monthNames[dateObj.getMonth()].substring(0, 3);
    const day = dateObj.getDate().toString().padStart(2, '0');
    const newDateTime = `${monthAbbr} ${day} • ${time}`;

    setLocalLessons(prev => prev.map(l => {
      if (l.id === editingLesson.id) {
        return { ...l, dateTime: newDateTime };
      }
      return l;
    }));
    
    setIsEditModalOpen(false);
    setEditingLesson(null);
  };

  const handleScheduleAll = () => {
    setLocalLessons(prev => prev.map(l => {
      if (!l.dateTime) {
        return { ...l, dateTime: l.proposedTime || 'Feb 01 • 09:00' };
      }
      return l;
    }));
  };

  const unscheduledLessons = localLessons.filter(l => !l.dateTime);

  const renderMonthView = () => (
    <div className="calendar-grid">
      {daysOfWeek.map(day => (
        <div key={day} className="calendar-weekday">{day}</div>
      ))}
      {calendarDays.map((dateObj, index) => {
        const dayLessons = getLessonsForDay(dateObj.day, dateObj.month, dateObj.year);
        return (
          <div 
            key={index} 
            className={`calendar-day ${!dateObj.isCurrentMonth ? 'other-month' : ''}`}
          >
            <span className="day-number">{dateObj.day}</span>
            <div className="day-lessons">
              {dayLessons.map(lesson => (
                <div 
                  key={lesson.id} 
                  className="calendar-lesson-tag"
                  onClick={() => navigate(`/lessons/${lesson.id}`, { state: { from: 'schedule' } })}
                >
                  <span className="lesson-time">{lesson.dateTime?.includes(' • ') ? lesson.dateTime.split(' • ')[1] : ''}</span>
                  <span className="lesson-title">{lesson.title}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderWeekView = () => {
    return (
      <div className="week-grid">
        <div className="time-column">
          <div className="week-grid-header"></div>
          {timeSlots.map(time => (
            <div key={time} className="time-slot-label">{time}</div>
          ))}
        </div>
        {weekDays.map((date, idx) => {
          const dayLessons = getLessonsForDay(date.getDate(), date.getMonth(), date.getFullYear());
          return (
            <div key={idx} className="day-column">
              <div className="week-grid-header">
                <span className="week-day-name">{daysOfWeek[idx]}</span>
                <span className="week-day-number">{date.getDate()}</span>
              </div>
              <div className="day-column-content">
                {timeSlots.map(time => (
                  <div key={time} className="time-slot-grid-line"></div>
                ))}
                {dayLessons.map(lesson => {
                  if (!lesson.dateTime || !lesson.dateTime.includes(' • ')) return null;
                  const timeStr = lesson.dateTime.split(' • ')[1];
                  const [hours, minutes] = timeStr.split(':').map(Number);
                  const startMinutes = (hours * 60) + minutes;
                  const dayStartMinutes = 8 * 60; // 08:00
                  const top = ((startMinutes - dayStartMinutes) / 60) * 60; // 60px per hour
                  const height = (lesson.durationMinutes / 60) * 60;

                  return (
                    <div 
                      key={lesson.id} 
                      className="week-lesson-block"
                      style={{ top: `${top}px`, height: `${height}px` }}
                      onClick={() => navigate(`/lessons/${lesson.id}`, { state: { from: 'schedule' } })}
                    >
                      <span className="lesson-time">{timeStr}</span>
                      <span className="lesson-title">{lesson.title}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <section className="page">
      <Topbar 
        title="Schedule" 
        subtitle="Upcoming sessions and key dates." 
        onMenuToggle={onMenuToggle}
      />
      <div className="calendar-controls-container">
        <div className="calendar-controls">
          <div className="calendar-nav">
            <button className="page-button" onClick={() => changePeriod(-1)}>&lt;</button>
            <span className="calendar-current-month">
              {view === 'month' 
                ? `${monthNames[month]} ${year}` 
                : `Week of ${monthNames[startOfWeek.getMonth()]} ${startOfWeek.getDate()}`
              }
            </span>
            <button className="page-button" onClick={() => changePeriod(1)}>&gt;</button>
          </div>
          <div className="view-selector">
            <button 
              className={`view-button ${view === 'month' ? 'active' : ''}`}
              onClick={() => setView('month')}
            >
              Month
            </button>
            <button 
              className={`view-button ${view === 'week' ? 'active' : ''}`}
              onClick={() => setView('week')}
            >
              Week
            </button>
          </div>
        </div>
      </div>

      <div className="calendar-layout">
        <div className="calendar-main">
          <div className="calendar-panel">
            {view === 'month' ? renderMonthView() : renderWeekView()}
          </div>
        </div>
        
        <aside className="unscheduled-sidebar">
          <div className="sidebar-header">
            <h3>Unscheduled</h3>
            {canEdit && unscheduledLessons.length > 0 && (
              <button className="schedule-all-btn" onClick={handleScheduleAll}>
                Schedule All
              </button>
            )}
          </div>
          <div className="unscheduled-list">
            {unscheduledLessons.length === 0 ? (
              <p className="empty-msg">No unscheduled lessons.</p>
            ) : (
              unscheduledLessons.map(lesson => (
                <div key={lesson.id} className="unscheduled-item">
                  <div className="unscheduled-info">
                    <p className="unscheduled-title">{lesson.title}</p>
                    <p className="unscheduled-meta">
                      Proposed: {lesson.proposedTime}
                      {canEdit && (
                        <button 
                          className="edit-proposed-btn" 
                          onClick={() => handleOpenEditModal(lesson)}
                        >
                          Edit
                        </button>
                      )}
                    </p>
                  </div>
                  {canEdit && (
                    <button 
                      className="add-to-schedule-btn"
                      onClick={() => handleScheduleLesson(lesson.id)}
                      title="Add to Schedule"
                    >
                      +
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </aside>
      </div>
      
      {isEditModalOpen && (
        <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Proposed Time</h2>
              <button className="close-button" onClick={() => setIsEditModalOpen(false)}>&times;</button>
            </div>
            <form className="modal-form" onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label>Lesson</label>
                <input type="text" value={editingLesson?.title} disabled />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input 
                    type="date" 
                    value={editFormData.date}
                    onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Time</label>
                  <input 
                    type="time" 
                    value={editFormData.time}
                    onChange={(e) => setEditFormData({ ...editFormData, time: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="ghost" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                <button type="submit" className="cta-button">Schedule Lesson</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default SchedulePage;

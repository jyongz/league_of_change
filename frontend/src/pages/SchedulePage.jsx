import React, { useState } from 'react';
import { lessons } from '../data/lessons';
import { useNavigate } from 'react-router-dom';
import Topbar from '../components/Topbar';

function SchedulePage() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 1)); // Default to February 2026 as per data
  const [view, setView] = useState('month');

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

  const prevMonthDays = getDaysInMonth(year, month - 1);
  const prevMonthPadding = [];
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    prevMonthPadding.push({
      day: prevMonthDays - i,
      month: month - 1,
      year: year,
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
    nextMonthPadding.push({
      day: i,
      month: month + 1,
      year: year,
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
    return lessons.filter(lesson => {
      const parts = lesson.dateTime.split(' • ');
      const dateParts = parts[0].split(' '); // ['Feb', '04']
      const lessonMonthStr = dateParts[0];
      const lessonDay = parseInt(dateParts[1]);

      const monthAbbr = monthNames[m].substring(0, 3);
      // Ensure we match year 2026 specifically for mock data consistency
      return lessonMonthStr === monthAbbr && lessonDay === day && y === 2026;
    });
  };

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
                  onClick={() => navigate(`/lessons/${lesson.id}`)}
                >
                  <span className="lesson-time">{lesson.dateTime.split(' • ')[1]}</span>
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
                      onClick={() => navigate(`/lessons/${lesson.id}`)}
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
      />
      <div className="calendar-controls-container">
        <div className="calendar-controls">
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
        </div>
      </div>

      <div className="calendar-panel">
        {view === 'month' ? renderMonthView() : renderWeekView()}
      </div>
    </section>
  );
}

export default SchedulePage;

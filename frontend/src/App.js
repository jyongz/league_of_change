import './App.css';
import { useMemo, useState } from 'react';

function App() {
  const [activePage, setActivePage] = useState('overview');
  const [lessonQuery, setLessonQuery] = useState('');
  const [lessonDateTime, setLessonDateTime] = useState('all');
  const [lessonDifficulty, setLessonDifficulty] = useState('all');
  const [lessonLocation, setLessonLocation] = useState('all');

  const lessons = [
    {
      id: 'LSN-204',
      title: 'Street Skills Foundations',
      dateTime: 'Feb 04 • 18:30',
      difficulty: 'Beginner',
      location: 'Hackney Hub',
      staff: 'A. Patel',
    },
    {
      id: 'LSN-219',
      title: 'Urban Movement Lab',
      dateTime: 'Feb 06 • 19:00',
      difficulty: 'Intermediate',
      location: 'Brixton Studio',
      staff: 'M. Reid',
    },
    {
      id: 'LSN-231',
      title: 'Creative Flow Session',
      dateTime: 'Feb 08 • 17:45',
      difficulty: 'All Levels',
      location: 'Southbank',
      staff: 'K. James',
    },
    {
      id: 'LSN-244',
      title: 'Advanced Footwork',
      dateTime: 'Feb 10 • 20:00',
      difficulty: 'Advanced',
      location: 'Camden Yard',
      staff: 'R. Lewis',
    },
  ];

  const uniqueDates = useMemo(
    () => Array.from(new Set(lessons.map((lesson) => lesson.dateTime))),
    [lessons]
  );
  const uniqueDifficulties = useMemo(
    () => Array.from(new Set(lessons.map((lesson) => lesson.difficulty))),
    [lessons]
  );
  const uniqueLocations = useMemo(
    () => Array.from(new Set(lessons.map((lesson) => lesson.location))),
    [lessons]
  );

  const filteredLessons = useMemo(() => {
    const query = lessonQuery.trim().toLowerCase();
    return lessons.filter((lesson) => {
      const matchesQuery =
        query.length === 0 ||
        lesson.id.toLowerCase() === query ||
        lesson.title.toLowerCase().includes(query);

      const matchesDate =
        lessonDateTime === 'all' || lesson.dateTime === lessonDateTime;

      const matchesDifficulty =
        lessonDifficulty === 'all' || lesson.difficulty === lessonDifficulty;

      const matchesLocation =
        lessonLocation === 'all' || lesson.location === lessonLocation;

      return matchesQuery && matchesDate && matchesDifficulty && matchesLocation;
    });
  }, [lessonQuery, lessonDateTime, lessonDifficulty, lessonLocation, lessons]);

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">LC</span>
          <div className="brand-text">
            <p className="brand-title">Street League</p>
            <p className="brand-subtitle">Dashboard</p>
          </div>
        </div>

        <nav className="nav">
          <button
            className={`nav-item ${activePage === 'overview' ? 'active' : ''}`}
            onClick={() => setActivePage('overview')}
          >
            Overview
          </button>
          <button
            className={`nav-item ${activePage === 'lessons' ? 'active' : ''}`}
            onClick={() => setActivePage('lessons')}
          >
            Lessons
          </button>
          <button
            className={`nav-item ${activePage === 'schedule' ? 'active' : ''}`}
            onClick={() => setActivePage('schedule')}
          >
            Schedule
          </button>
          <button
            className={`nav-item ${activePage === 'reports' ? 'active' : ''}`}
            onClick={() => setActivePage('reports')}
          >
            Reports
          </button>
        </nav>

        <div className="sidebar-card">
          <p className="sidebar-label">Next drop</p>
          <h3 className="sidebar-title">Urban Skills Jam</h3>
          <p className="sidebar-meta">Sat • 19:30 • London</p>
          <button className="cta">View event</button>
        </div>
      </aside>

      <main className="main">
        {activePage === 'overview' && (
          <>
            <header className="topbar">
              <div>
                <h1 className="page-title">Live Overview</h1>
                <p className="page-subtitle">Real-time impact, reach, and momentum.</p>
              </div>
              <div className="profile-control">
                <div className="user-icon" aria-label="User profile">
                  <span>SL</span>
                </div>
                <details className="menu">
                  <summary className="menu-toggle" aria-label="Open menu">
                    <span className="hamburger" />
                  </summary>
                  <div className="menu-list">
                    <button className="menu-item">Profile</button>
                    <button className="menu-item">Settings</button>
                    <button className="menu-item">Logout</button>
                  </div>
                </details>
              </div>
            </header>

            <section className="stats-grid">
              <article className="stat-card accent">
                <p className="stat-label">Active Programs</p>
                <h2 className="stat-value">12</h2>
                <p className="stat-trend up">+3 this month</p>
              </article>
              <article className="stat-card">
                <p className="stat-label">Youth Engaged</p>
                <h2 className="stat-value">4,860</h2>
                <p className="stat-trend up">+12% week</p>
              </article>
              <article className="stat-card">
                <p className="stat-label">Volunteer Hours</p>
                <h2 className="stat-value">1,420</h2>
                <p className="stat-trend down">-4% week</p>
              </article>
              <article className="stat-card">
                <p className="stat-label">Partners</p>
                <h2 className="stat-value">28</h2>
                <p className="stat-trend up">+2 new</p>
              </article>
            </section>

            <section className="content-grid">
              <div className="panel">
                <header className="panel-header">
                  <h3>Momentum Tracker</h3>
                  <span className="panel-chip">Live</span>
                </header>
                <div className="momentum">
                  <div className="bar">
                    <span className="bar-label">Outreach</span>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: '78%' }} />
                    </div>
                  </div>
                  <div className="bar">
                    <span className="bar-label">Participation</span>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: '64%' }} />
                    </div>
                  </div>
                  <div className="bar">
                    <span className="bar-label">Retention</span>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: '52%' }} />
                    </div>
                  </div>
                  <div className="bar">
                    <span className="bar-label">Outcomes</span>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: '86%' }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="panel">
                <header className="panel-header">
                  <h3>Recent Activity</h3>
                  <button className="ghost small">View all</button>
                </header>
                <ul className="activity">
                  <li>
                    <span className="badge">New</span>
                    <div>
                      <p className="activity-title">Hackney Workshop uploaded highlights</p>
                      <p className="activity-meta">10 minutes ago</p>
                    </div>
                  </li>
                  <li>
                    <span className="badge">Update</span>
                    <div>
                      <p className="activity-title">Brixton mentors added 3 sessions</p>
                      <p className="activity-meta">2 hours ago</p>
                    </div>
                  </li>
                  <li>
                    <span className="badge">Alert</span>
                    <div>
                      <p className="activity-title">Southbank session capacity nearing limit</p>
                      <p className="activity-meta">Today</p>
                    </div>
                  </li>
                  <li>
                    <span className="badge">Win</span>
                    <div>
                      <p className="activity-title">Community reach surpassed weekly goal</p>
                      <p className="activity-meta">Yesterday</p>
                    </div>
                  </li>
                </ul>
              </div>
            </section>
          </>
        )}

        {activePage === 'lessons' && (
              <section className="page">
                <h1 className="page-title">Lessons</h1>
                <p className="page-subtitle">Your learning programs at a glance.</p>
                <div className="panel">
                  <div className="table-wrap">
                    <table className="lessons-table">
                      <thead>
                        <tr>
                          <th>
                            Lesson ID
                            <input
                              className="header-input"
                              type="search"
                              placeholder="Exact match"
                              value={lessonQuery}
                              onChange={(event) => setLessonQuery(event.target.value)}
                              aria-label="Search by lesson ID or title"
                            />
                          </th>
                          <th>
                            Lesson Title
                            <input
                              className="header-input"
                              type="search"
                              placeholder="Partial match"
                              value={lessonQuery}
                              onChange={(event) => setLessonQuery(event.target.value)}
                              aria-label="Search by lesson ID or title"
                            />
                          </th>
                          <th>
                            Date &amp; Time
                            <select
                              className="header-select"
                              value={lessonDateTime}
                              onChange={(event) => setLessonDateTime(event.target.value)}
                              aria-label="Filter by date and time"
                            >
                              <option value="all">All</option>
                              {uniqueDates.map((date) => (
                                <option key={date} value={date}>
                                  {date}
                                </option>
                              ))}
                            </select>
                          </th>
                          <th>
                            Difficulty
                            <select
                              className="header-select"
                              value={lessonDifficulty}
                              onChange={(event) => setLessonDifficulty(event.target.value)}
                              aria-label="Filter by difficulty"
                            >
                              <option value="all">All</option>
                              {uniqueDifficulties.map((level) => (
                                <option key={level} value={level}>
                                  {level}
                                </option>
                              ))}
                            </select>
                          </th>
                          <th>
                            Location
                            <select
                              className="header-select"
                              value={lessonLocation}
                              onChange={(event) => setLessonLocation(event.target.value)}
                              aria-label="Filter by location"
                            >
                              <option value="all">All</option>
                              {uniqueLocations.map((place) => (
                                <option key={place} value={place}>
                                  {place}
                                </option>
                              ))}
                            </select>
                          </th>
                          <th>Teaching Staff</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredLessons.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="empty-state">
                              No lessons match your filters.
                            </td>
                          </tr>
                        ) : (
                          filteredLessons.map((lesson) => (
                            <tr key={lesson.id}>
                              <td>{lesson.id}</td>
                              <td>{lesson.title}</td>
                              <td>{lesson.dateTime}</td>
                              <td>{lesson.difficulty}</td>
                              <td>{lesson.location}</td>
                              <td>{lesson.staff}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            )}

        {activePage === 'schedule' && (
          <section className="page">
            <h1 className="page-title">Schedule</h1>
            <p className="page-subtitle">Upcoming sessions and key dates.</p>
            <div className="panel">
              <p>Dummy schedule page content goes here.</p>
            </div>
          </section>
        )}

        {activePage === 'reports' && (
          <section className="page">
            <h1 className="page-title">Reports</h1>
            <p className="page-subtitle">Insights and summaries.</p>
            <div className="panel">
              <p>Dummy reports page content goes here.</p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;

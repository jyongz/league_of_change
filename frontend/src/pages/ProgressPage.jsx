import React, { useMemo, useState, useEffect } from 'react';
import Topbar from '../components/Topbar';
import { participants } from '../data/participants';
import { SCOREBOARD_PAGE_SIZE } from '../data/lessons';

function ProgressPage({ onMenuToggle }) {
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [nameQuery, setNameQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [ageFilter, setAgeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const uniqueLocations = useMemo(
    () => Array.from(new Set(participants.map((p) => p.location))),
    []
  );

  const uniqueAges = useMemo(
    () => Array.from(new Set(participants.map((p) => p.age))).sort((a, b) => a - b),
    []
  );

  const filteredParticipants = useMemo(() => {
    const query = nameQuery.trim().toLowerCase();
    return participants.filter((p) => {
      const matchesName = query.length === 0 || p.name.toLowerCase().includes(query);
      const matchesLocation = locationFilter === 'all' || p.location === locationFilter;
      const matchesAge = ageFilter === 'all' || p.age.toString() === ageFilter;

      return matchesName && matchesLocation && matchesAge;
    });
  }, [nameQuery, locationFilter, ageFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [nameQuery, locationFilter, ageFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredParticipants.length / SCOREBOARD_PAGE_SIZE));
  const pagedParticipants = filteredParticipants.slice(
    (currentPage - 1) * SCOREBOARD_PAGE_SIZE,
    currentPage * SCOREBOARD_PAGE_SIZE
  );

  return (
    <section className="page">
      <Topbar 
        title="Progress" 
        subtitle="Participant performance and engagement." 
        onMenuToggle={onMenuToggle}
      />
      
      <div className={`progress-container ${selectedParticipant ? 'has-selection' : ''}`}>
        <div className="panel progress-main">
          <div className="table-wrap">
            <table className="lessons-table progress-table">
              <thead>
                <tr>
                  <th>
                    Name
                    <input
                      className="header-input"
                      type="search"
                      placeholder="Search name"
                      value={nameQuery}
                      onChange={(e) => setNameQuery(e.target.value)}
                    />
                  </th>
                  <th>
                    Age
                    <select
                      className="header-select"
                      value={ageFilter}
                      onChange={(e) => setAgeFilter(e.target.value)}
                    >
                      <option value="all">All Ages</option>
                      {uniqueAges.map((age) => (
                        <option key={age} value={age}>{age}</option>
                      ))}
                    </select>
                  </th>
                  <th>
                    Location
                    <select
                      className="header-select"
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                    >
                      <option value="all">All Locations</option>
                      {uniqueLocations.map((loc) => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </th>
                  <th>Attendance %</th>
                </tr>
              </thead>
              <tbody>
                {pagedParticipants.map((p) => (
                  <tr 
                    key={p.id} 
                    className={selectedParticipant?.id === p.id ? 'selected-row' : ''}
                    onClick={() => setSelectedParticipant(p)}
                  >
                    <td>{p.name}</td>
                    <td>{p.age}</td>
                    <td>{p.location}</td>
                    <td>
                      <div className="attendance-cell">
                        <div className="mini-bar-track">
                          <div 
                            className="mini-bar-fill" 
                            style={{ width: `${p.attendance}%` }}
                          ></div>
                        </div>
                        <span>{p.attendance}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
                {pagedParticipants.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '24px' }}>
                      No participants found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button
              className="page-button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Previous
            </button>
            <span className="page-info">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="page-button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </div>

        {selectedParticipant && (
          <div className="panel progress-preview">
            <div className="preview-header">
              <h3>{selectedParticipant.name}</h3>
              <button className="close-preview" onClick={() => setSelectedParticipant(null)}>&times;</button>
            </div>
            
            <div className="preview-section">
              <label className="sidebar-label">Career Goal</label>
              <p className="career-goal">{selectedParticipant.careerGoal}</p>
            </div>

            <div className="preview-section">
              <label className="sidebar-label">Recent Feedback</label>
              <div className="feedback-list">
                {selectedParticipant.feedback.map((f, i) => (
                  <div key={i} className="feedback-item">
                    <p className="feedback-comment">"{f.comment}"</p>
                    <p className="feedback-meta">{f.date} • {f.staff}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="preview-section">
              <label className="sidebar-label">Attendance History</label>
              <ul className="attendance-history">
                {selectedParticipant.attendanceRecords.map((r, i) => (
                  <li key={i} className="history-item">
                    <span className={`status-dot ${r.status.toLowerCase()}`}></span>
                    <div className="history-info">
                      <span className="history-lesson">{r.lesson}</span>
                      <span className="history-date">{r.date}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default ProgressPage;

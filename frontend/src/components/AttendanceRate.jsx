import React from 'react';

function AttendanceRate() {
  const stats = [
    { label: 'LSN-204 (Foundations)', width: '92%' },
    { label: 'LSN-219 (Movement Lab)', width: '85%' },
    { label: 'LSN-231 (Creative Flow)', width: '98%' },
    { label: 'LSN-244 (Footwork)', width: '78%' },
  ];

  return (
    <div className="panel">
      <header className="panel-header">
        <h3>Attendance Rate</h3>
        <span className="panel-chip">Last 4 Lessons</span>
      </header>
      <div className="momentum">
        {stats.map((stat) => (
          <div className="bar" key={stat.label}>
            <span className="bar-label">{stat.label}</span>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: stat.width }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AttendanceRate;

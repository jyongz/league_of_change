import React from 'react';

function MomentumTracker() {
  const stats = [
    { label: 'Outreach', width: '78%' },
    { label: 'Participation', width: '64%' },
    { label: 'Retention', width: '52%' },
    { label: 'Outcomes', width: '86%' },
  ];

  return (
    <div className="panel">
      <header className="panel-header">
        <h3>Momentum Tracker</h3>
        <span className="panel-chip">Live</span>
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

export default MomentumTracker;

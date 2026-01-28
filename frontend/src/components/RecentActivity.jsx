import React from 'react';

function RecentActivity() {
  const activities = [
    { badge: 'New', title: 'Hackney Workshop uploaded highlights', meta: '10 minutes ago' },
    { badge: 'Update', title: 'Brixton mentors added 3 sessions', meta: '2 hours ago' },
    { badge: 'Alert', title: 'Southbank session capacity nearing limit', meta: 'Today' },
    { badge: 'Win', title: 'Community reach surpassed weekly goal', meta: 'Yesterday' },
  ];

  return (
    <div className="panel">
      <header className="panel-header">
        <h3>Recent Activity</h3>
        <button className="ghost small">View all</button>
      </header>
      <ul className="activity">
        {activities.map((item, index) => (
          <li key={index}>
            <span className="badge">{item.badge}</span>
            <div>
              <p className="activity-title">{item.title}</p>
              <p className="activity-meta">{item.meta}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RecentActivity;

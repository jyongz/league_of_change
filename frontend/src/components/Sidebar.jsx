import React from 'react';
import { NavLink } from 'react-router-dom';

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark">LC</span>
        <div className="brand-text">
          <p className="brand-title">Street League</p>
          <p className="brand-subtitle">Dashboard</p>
        </div>
      </div>

      <nav className="nav">
        <NavLink className="nav-item" to="/" end>
          Overview
        </NavLink>
        <NavLink className="nav-item" to="/lessons">
          Lessons
        </NavLink>
        <NavLink className="nav-item" to="/schedule">
          Schedule
        </NavLink>
        <NavLink className="nav-item" to="/reports">
          Reports
        </NavLink>
      </nav>

      <div className="sidebar-card">
        <p className="sidebar-label">Next drop</p>
        <h3 className="sidebar-title">Urban Skills Jam</h3>
        <p className="sidebar-meta">Sat • 19:30 • London</p>
        <button className="cta">View event</button>
      </div>
    </aside>
  );
}

export default Sidebar;

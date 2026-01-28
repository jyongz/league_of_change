import React from 'react';

function Topbar({ title, subtitle }) {
  return (
    <header className="topbar">
      <div>
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
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
  );
}

export default Topbar;

import React from 'react';
import { useAuth } from '../context/AuthContext';

function Topbar({ title, subtitle, onMenuToggle }) {
  const { logout } = useAuth();

  return (
    <header className="topbar">
      <div className="topbar-left">
        {onMenuToggle && (
          <button className="mobile-menu-btn" onClick={onMenuToggle} aria-label="Toggle Navigation">
            <span className="hamburger" />
          </button>
        )}
        <div className="title-section">
          <h1 className="page-title">{title}</h1>
          {subtitle && <p className="page-subtitle">{subtitle}</p>}
        </div>
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
            <button className="menu-item" onClick={logout}>Logout</button>
          </div>
        </details>
      </div>
    </header>
  );
}

export default Topbar;

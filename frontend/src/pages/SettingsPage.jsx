import React, { useState } from 'react';
import Topbar from '../components/Topbar';
import { useAuth } from '../context/AuthContext';

function SettingsPage({ onMenuToggle }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    app: true,
    safeguarding: true
  });

  const handleToggle = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <section className="page">
      <Topbar 
        title="Settings" 
        subtitle="Configure your workspace and notification preferences." 
        onMenuToggle={onMenuToggle}
      />

      <div className="content-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="panel">
          <div className="panel-header">
            <h3>Account Settings</h3>
          </div>
          <div className="modal-form">
            <div className="form-group">
              <label>Current Email</label>
              <input type="email" value={`${user?.username.toLowerCase()}@streetleague.org`} disabled />
            </div>
            <div className="form-group">
              <label>Update Password</label>
              <input type="password" placeholder="New Password" />
            </div>
            <div className="form-group">
              <input type="password" placeholder="Confirm New Password" />
            </div>
            <button className="cta-button" style={{ width: '100%' }}>Update Account</button>
          </div>

          <div className="panel-header" style={{ marginTop: '32px' }}>
            <h3>Regional Settings</h3>
          </div>
          <div className="modal-form">
            <div className="form-group">
              <label>Default Timezone</label>
              <select defaultValue="GMT">
                <option value="GMT">GMT (London)</option>
                <option value="EST">EST (New York)</option>
              </select>
            </div>
            <div className="form-group">
              <label>Language</label>
              <select defaultValue="EN">
                <option value="EN">English (UK)</option>
                <option value="FR">French</option>
              </select>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h3>Staff Notifications</h3>
          </div>
          <p className="sidebar-meta" style={{ marginBottom: '24px' }}>Choose how you receive session reminders and system alerts.</p>
          
          <div className="settings-list">
            <div className="setting-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--color-border)' }}>
              <div>
                <p style={{ margin: 0, fontWeight: '600' }}>Email Alerts</p>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-muted)' }}>Daily schedule summaries</p>
              </div>
              <label className="switch">
                <input type="checkbox" checked={notifications.email} onChange={() => handleToggle('email')} />
                <span className="slider round"></span>
              </label>
            </div>

            <div className="setting-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--color-border)' }}>
              <div>
                <p style={{ margin: 0, fontWeight: '600' }}>SMS Reminders</p>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-muted)' }}>Urgent session changes</p>
              </div>
              <label className="switch">
                <input type="checkbox" checked={notifications.sms} onChange={() => handleToggle('sms')} />
                <span className="slider round"></span>
              </label>
            </div>

            <div className="setting-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--color-border)' }}>
              <div>
                <p style={{ margin: 0, fontWeight: '600' }}>In-App Notifications</p>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-muted)' }}>System updates and feedback</p>
              </div>
              <label className="switch">
                <input type="checkbox" checked={notifications.app} onChange={() => handleToggle('app')} />
                <span className="slider round"></span>
              </label>
            </div>

            <div className="setting-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--color-border)' }}>
              <div>
                <p style={{ margin: 0, fontWeight: '600', color: 'var(--color-danger)' }}>Safeguarding Priority</p>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-muted)' }}>Critical incidents (Always On)</p>
              </div>
              <label className="switch">
                <input type="checkbox" checked={notifications.safeguarding} disabled />
                <span className="slider round"></span>
              </label>
            </div>
          </div>

          <div className="panel-header" style={{ marginTop: '32px' }}>
            <h3>Data Export</h3>
          </div>
          <button className="ghost" style={{ width: '100%', marginBottom: '12px' }}>Export Personal Activity (CSV)</button>
          <button className="ghost" style={{ width: '100%' }}>Download Staff Handbook (PDF)</button>
        </div>
      </div>
    </section>
  );
}

export default SettingsPage;

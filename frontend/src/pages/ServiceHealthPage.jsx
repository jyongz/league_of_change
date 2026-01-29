import React from 'react';
import Topbar from '../components/Topbar';
import StatCard from '../components/StatCard';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

function ServiceHealthPage({ onMenuToggle }) {
  const { user } = useAuth();
  const isAdmin = user && user.role === 'admin';

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <section className="page">
      <Topbar 
        title="Service Health" 
        subtitle="Real-time platform performance and system status." 
        onMenuToggle={onMenuToggle}
      />

      <div className="stats-grid">
        <StatCard 
          label="Database Status" 
          value="Operational" 
          trend="Stable" 
          trendType="up" 
          accent 
        />
        <StatCard 
          label="API Latency" 
          value="42ms" 
          trend="-5ms" 
          trendType="up" 
        />
        <StatCard 
          label="Server Uptime" 
          value="99.98%" 
          trend="Steady" 
          trendType="up" 
        />
      </div>

      <div className="content-grid" style={{ marginTop: '24px' }}>
        <div className="panel">
          <div className="panel-header">
            <h3>Login Activity (Last 24h)</h3>
          </div>
          <div className="chart-container">
            {[45, 32, 67, 89, 120, 150, 210, 180, 140, 110, 95, 130].map((h, i) => (
              <div key={i} className="chart-bar" style={{ 
                height: `${(h / 210) * 100}%`,
                opacity: 0.7 + (i * 0.02)
              }} title={`Hour ${i}: ${h} logins`}></div>
            ))}
          </div>
          <div className="chart-labels">
            <span>00:00</span>
            <span>12:00</span>
            <span>23:59</span>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h3>System Logs</h3>
          </div>
          <div className="activity">
            <div className="activity-item" style={{ padding: '12px 20px', borderBottom: '1px solid var(--color-border)' }}>
              <p style={{ margin: 0, fontSize: '14px' }}><strong>DB Backup Completed</strong></p>
              <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--color-text-muted)' }}>10 mins ago • System</p>
            </div>
            <div className="activity-item" style={{ padding: '12px 20px', borderBottom: '1px solid var(--color-border)' }}>
              <p style={{ margin: 0, fontSize: '14px' }}><strong>Cache Cleared</strong></p>
              <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--color-text-muted)' }}>45 mins ago • Admin-Jordan</p>
            </div>
            <div className="activity-item" style={{ padding: '12px 20px', borderBottom: '1px solid var(--color-border)' }}>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--color-warning)' }}><strong>Memory Usage Spike</strong></p>
              <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--color-text-muted)' }}>2 hours ago • Monitor</p>
            </div>
            <div className="activity-item" style={{ padding: '12px 20px' }}>
              <p style={{ margin: 0, fontSize: '14px' }}><strong>New Security Certificate Issued</strong></p>
              <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--color-text-muted)' }}>Yesterday • SSL Manager</p>
            </div>
          </div>
        </div>
      </div>

      <div className="panel" style={{ marginTop: '24px' }}>
        <div className="panel-header">
          <h3>Traffic Overview</h3>
        </div>
        <div className="panel-content">
          <div className="traffic-row">
            <div className="traffic-label">Hackney Hub</div>
            <div className="traffic-bar-track">
              <div className="traffic-bar-fill" style={{ width: '75%' }}></div>
            </div>
            <div className="traffic-value">75%</div>
          </div>
          <div className="traffic-row">
            <div className="traffic-label">Brixton Studio</div>
            <div className="traffic-bar-track">
              <div className="traffic-bar-fill" style={{ width: '45%' }}></div>
            </div>
            <div className="traffic-value">45%</div>
          </div>
          <div className="traffic-row">
            <div className="traffic-label">Online Portal</div>
            <div className="traffic-bar-track">
              <div className="traffic-bar-fill" style={{ width: '92%' }}></div>
            </div>
            <div className="traffic-value">92%</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ServiceHealthPage;

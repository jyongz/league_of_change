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
          <div style={{ padding: '24px', height: '200px', display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
            {[45, 32, 67, 89, 120, 150, 210, 180, 140, 110, 95, 130].map((h, i) => (
              <div key={i} style={{ 
                flex: 1, 
                backgroundColor: 'var(--color-brand)', 
                height: `${(h / 210) * 100}%`,
                borderRadius: '4px 4px 0 0',
                opacity: 0.7 + (i * 0.02)
              }} title={`Hour ${i}: ${h} logins`}></div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 24px 16px', color: 'var(--color-text-muted)', fontSize: '12px' }}>
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
        <div style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ width: '120px', fontSize: '14px' }}>Hackney Hub</div>
            <div style={{ flex: 1, height: '12px', backgroundColor: 'var(--color-bg)', borderRadius: '6px', overflow: 'hidden' }}>
              <div style={{ width: '75%', height: '100%', backgroundColor: 'var(--color-brand)' }}></div>
            </div>
            <div style={{ width: '40px', textAlign: 'right', fontSize: '12px', marginLeft: '12px' }}>75%</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ width: '120px', fontSize: '14px' }}>Brixton Studio</div>
            <div style={{ flex: 1, height: '12px', backgroundColor: 'var(--color-bg)', borderRadius: '6px', overflow: 'hidden' }}>
              <div style={{ width: '45%', height: '100%', backgroundColor: 'var(--color-brand)' }}></div>
            </div>
            <div style={{ width: '40px', textAlign: 'right', fontSize: '12px', marginLeft: '12px' }}>45%</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '120px', fontSize: '14px' }}>Online Portal</div>
            <div style={{ flex: 1, height: '12px', backgroundColor: 'var(--color-bg)', borderRadius: '6px', overflow: 'hidden' }}>
              <div style={{ width: '92%', height: '100%', backgroundColor: 'var(--color-brand)' }}></div>
            </div>
            <div style={{ width: '40px', textAlign: 'right', fontSize: '12px', marginLeft: '12px' }}>92%</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ServiceHealthPage;

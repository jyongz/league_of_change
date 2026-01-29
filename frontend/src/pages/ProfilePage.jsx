import React from 'react';
import Topbar from '../components/Topbar';
import { useAuth } from '../context/AuthContext';
import { lessons } from '../data/lessons';

function ProfilePage({ onMenuToggle }) {
  const { user } = useAuth();
  
  // Role-specific impact and certification data
  const getRoleData = () => {
    switch (user?.role) {
      case 'admin':
        return {
          stats: [
            { label: 'Staff Managed', value: '12' },
            { label: 'System Uptime', value: '99.9%' },
            { label: 'Compliance Audits', value: '24' },
            { label: 'Service Health', value: '96%' }
          ],
          certifications: [
            { title: 'Data Protection Officer (DPO)', expiry: 'Valid until Jun 2027' },
            { title: 'Project Management Professional (PMP)', expiry: 'Valid until Nov 2026' },
            { title: 'Advanced Safeguarding Leadership', expiry: 'Valid until Mar 2028' }
          ]
        };
      case 'viewer':
        return {
          stats: [
            { label: 'Partners Managed', value: '8' },
            { label: 'Feedback Reports', value: '15' },
            { label: 'Funding Secured', value: '£120k' },
            { label: 'Impact Stories', value: '12' }
          ],
          certifications: [
            { title: 'Fundraising Regulation Compliance', expiry: 'Valid until Sep 2026' },
            { title: 'Impact Measurement & Reporting', expiry: 'Valid until May 2027' },
            { title: 'Donor Relations Management', expiry: 'Valid until Oct 2028' }
          ]
        };
      case 'coach':
      default:
        const sessionsCount = user?.staffId ? lessons.filter(l => l.staff === user.staffId).length : 0;
        return {
          stats: [
            { label: 'Sessions Delivered', value: sessionsCount },
            { label: 'Youth Supported', value: '156' },
            { label: 'Years at SL', value: '3' },
            { label: 'Compliance Score', value: '100%' }
          ],
          certifications: [
            { title: 'Level 2 Multi-Skills Coaching', expiry: 'Valid until Dec 2026' },
            { title: 'First Aid at Work', expiry: 'Valid until Feb 2027' },
            { title: 'Safeguarding Level 3', expiry: 'Valid until Jan 2028' }
          ]
        };
    }
  };

  const roleData = getRoleData();

  return (
    <section className="page">
      <Topbar 
        title="My Profile" 
        subtitle="Manage your personal information and view your impact." 
        onMenuToggle={onMenuToggle}
      />

      <div className="content-grid">
        <div className="panel">
          <div className="panel-header">
            <h3>Personal Information</h3>
          </div>
          <div className="profile-details">
            <div className="detail-row">
              <span className="detail-label">Full Name</span>
              <span className="detail-value">{user?.name}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Role</span>
              <span className="detail-value" style={{ textTransform: 'capitalize' }}>{user?.role === 'viewer' ? 'Fundraiser' : user?.role}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Username</span>
              <span className="detail-value">{user?.username}</span>
            </div>
            {user?.staffId && (
              <div className="detail-row">
                <span className="detail-label">Staff ID</span>
                <span className="detail-value">{user?.staffId}</span>
              </div>
            )}
            <div className="detail-row">
              <span className="detail-label">Email</span>
              <span className="detail-value">{user?.username.toLowerCase()}@streetleague.org</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Primary Hub</span>
              <span className="detail-value">London Central</span>
            </div>
          </div>
          
          <div className="form-actions" style={{ marginTop: '32px' }}>
            <button className="cta-button">Request Info Update</button>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h3>Your Impact</h3>
            <span className="panel-chip">Lifetime</span>
          </div>
          <div className="stats-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {roleData.stats.map((stat, index) => (
              <div key={index} className="stat-card" style={{ padding: '12px' }}>
                <p className="stat-label">{stat.label}</p>
                <p className="stat-value">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="panel-header" style={{ marginTop: '32px' }}>
            <h3>Certifications</h3>
          </div>
          <ul className="activity">
            {roleData.certifications.map((cert, index) => (
              <li key={index} className="table-row">
                <div className="activity-info">
                  <p className="activity-title"><strong>{cert.title}</strong></p>
                  <p className="activity-meta">{cert.expiry}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default ProfilePage;

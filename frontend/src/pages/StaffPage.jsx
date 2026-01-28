import React, { useState } from 'react';
import Topbar from '../components/Topbar';

function StaffPage({ onMenuToggle }) {
  const [staffData, setStaffData] = useState([
    { id: 'STF-001', canAddLessons: true, canScheduleLessons: true, canAdjustPermissions: false },
    { id: 'STF-002', canAddLessons: true, canScheduleLessons: false, canAdjustPermissions: false },
    { id: 'STF-003', canAddLessons: false, canScheduleLessons: true, canAdjustPermissions: true },
    { id: 'STF-004', canAddLessons: true, canScheduleLessons: true, canAdjustPermissions: true },
    { id: 'STF-005', canAddLessons: false, canScheduleLessons: false, canAdjustPermissions: false },
  ]);

  const handleToggle = (id, field) => {
    setStaffData(prevData => prevData.map(staff => 
      staff.id === id ? { ...staff, [field]: !staff[field] } : staff
    ));
  };

  return (
    <section className="page">
      <Topbar 
        title="Staff Management" 
        subtitle="Manage staff permissions and access levels." 
        onMenuToggle={onMenuToggle}
      />

      <div className="panel">
        <div className="table-wrap">
          <table className="lessons-table">
            <thead>
              <tr>
                <th>Staff ID</th>
                <th style={{ textAlign: 'center' }}>Can Add Lessons</th>
                <th style={{ textAlign: 'center' }}>Can Schedule Lessons</th>
                <th style={{ textAlign: 'center' }}>Can Adjust Staff Permissions</th>
              </tr>
            </thead>
            <tbody>
              {staffData.map((staff) => (
                <tr key={staff.id}>
                  <td>{staff.id}</td>
                  <td style={{ textAlign: 'center' }}>
                    <label className="switch">
                      <input 
                        type="checkbox" 
                        checked={staff.canAddLessons} 
                        onChange={() => handleToggle(staff.id, 'canAddLessons')}
                      />
                      <span className="slider round"></span>
                    </label>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <label className="switch">
                      <input 
                        type="checkbox" 
                        checked={staff.canScheduleLessons} 
                        onChange={() => handleToggle(staff.id, 'canScheduleLessons')}
                      />
                      <span className="slider round"></span>
                    </label>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <label className="switch">
                      <input 
                        type="checkbox" 
                        checked={staff.canAdjustPermissions} 
                        onChange={() => handleToggle(staff.id, 'canAdjustPermissions')}
                      />
                      <span className="slider round"></span>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default StaffPage;

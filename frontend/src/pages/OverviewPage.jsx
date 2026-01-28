import React from 'react';
import Topbar from '../components/Topbar';
import StatCard from '../components/StatCard';
import MomentumTracker from '../components/MomentumTracker';
import RecentActivity from '../components/RecentActivity';

function OverviewPage() {
  return (
    <>
      <Topbar 
        title="Live Overview" 
        subtitle="Real-time impact, reach, and momentum." 
      />

      <section className="stats-grid">
        <StatCard 
          label="Active Programs" 
          value="12" 
          trend="+3 this month" 
          trendType="up" 
          accent 
        />
        <StatCard 
          label="Youth Engaged" 
          value="4,860" 
          trend="+12% week" 
          trendType="up" 
        />
        <StatCard 
          label="Volunteer Hours" 
          value="1,420" 
          trend="-4% week" 
          trendType="down" 
        />
        <StatCard 
          label="Partners" 
          value="28" 
          trend="+2 new" 
          trendType="up" 
        />
      </section>

      <section className="content-grid">
        <MomentumTracker />
        <RecentActivity />
      </section>
    </>
  );
}

export default OverviewPage;

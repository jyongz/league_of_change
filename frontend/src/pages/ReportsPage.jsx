import React from 'react';
import Topbar from '../components/Topbar';

function ReportsPage() {
  return (
    <section className="page">
      <Topbar 
        title="Reports" 
        subtitle="Insights and summaries." 
      />
      <div className="panel">
        <p>Dummy reports page content goes here.</p>
      </div>
    </section>
  );
}

export default ReportsPage;

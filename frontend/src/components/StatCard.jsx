import React from 'react';

function StatCard({ label, value, trend, trendType, accent }) {
  return (
    <article className={`stat-card ${accent ? 'accent' : ''}`}>
      <p className="stat-label">{label}</p>
      <h2 className="stat-value">{value}</h2>
      <p className={`stat-trend ${trendType}`}>{trend}</p>
    </article>
  );
}

export default StatCard;

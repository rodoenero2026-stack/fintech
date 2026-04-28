// src/components/ActivityCard.jsx
import React from 'react';

const ActivityCard = ({ title, value, description, trend }) => {
  return (
    <div style={styles.card}>
      <span style={styles.title}>{title}</span>
      <div style={styles.valueContainer}>
        <h2 style={styles.value}>{value}</h2>
        {trend && <span style={styles.trend}>{trend}</span>}
      </div>
      <p style={styles.description}>{description}</p>
    </div>
  );
};

const styles = {
  card: {
    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
    padding: '24px',
    borderRadius: '16px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
    border: '1px solid rgba(0,0,0,0.03)',
    flex: '1',
    minWidth: '280px',
    margin: '12px',
    transition: 'transform 0.2s ease',
  },
  title: {
    color: '#64748b',
    fontSize: '0.85rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  valueContainer: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '10px',
    margin: '12px 0',
  },
  value: {
    fontSize: '2.2rem',
    fontWeight: '800',
    color: '#1e293b',
    margin: 0,
  },
  trend: {
    color: '#10b981',
    fontSize: '0.9rem',
    fontWeight: '600',
    backgroundColor: '#d1fae5',
    padding: '2px 8px',
    borderRadius: '20px',
  },
  description: {
    color: '#94a3b8',
    fontSize: '0.9rem',
    margin: 0,
  },
};

export default ActivityCard;
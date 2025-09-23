import React from 'react';

interface ClaimStatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const ClaimStatCard: React.FC<ClaimStatCardProps> = ({ title, value, icon, color, bgColor }) => (
  <div style={{
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    padding: '24px',
    borderLeft: `4px solid ${color}`
  }}>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{
        padding: '8px',
        backgroundColor: bgColor,
        borderRadius: '8px'
      }}>
        {icon}
      </div>
      <div style={{ marginLeft: '16px' }}>
        <p style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', margin: 0 }}>{title}</p>
        <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: 0 }}>{value}</p>
      </div>
    </div>
  </div>
);

export default ClaimStatCard;

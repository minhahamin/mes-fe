import React from 'react';
import { WarehouseData } from '../../types/warehouse';

interface WarehouseTableRowProps {
  item: WarehouseData;
  index: number;
}

const WarehouseTableRow: React.FC<WarehouseTableRowProps> = ({ item, index }) => {
  const getStatusBadge = (status: string) => {
    const statusMap = {
      'active': { color: '#d1fae5', textColor: '#065f46' },
      'full': { color: '#fee2e2', textColor: '#991b1b' },
      'inactive': { color: '#f3f4f6', textColor: '#6b7280' },
      'maintenance': { color: '#fef3c7', textColor: '#d97706' },
      'high': { color: '#fee2e2', textColor: '#991b1b' },
      'medium': { color: '#dbeafe', textColor: '#1e40af' },
      'low': { color: '#f3f4f6', textColor: '#6b7280' }
    };
    const statusInfo = statusMap[status as keyof typeof statusMap] || { color: '#f3f4f6', textColor: '#6b7280' };
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 12px',
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: '500',
        backgroundColor: statusInfo.color,
        color: statusInfo.textColor
      }}>
        {status}
      </span>
    );
  };

  const getProgressColor = (rate: number) => {
    if (rate >= 90) return '#ef4444';
    if (rate >= 70) return '#f59e0b';
    return '#22c55e';
  };

  return (
    <tr style={{
      backgroundColor: index % 2 === 0 ? 'white' : '#f9fafb',
      transition: 'all 0.2s ease'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.backgroundColor = '#f0f9ff';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'white' : '#f9fafb';
    }}>
      <td style={{ padding: '16px', fontSize: '14px', color: '#1f2937', borderBottom: '1px solid #e5e7eb' }}>
        {item.warehouseId}
      </td>
      <td style={{ padding: '16px', fontSize: '14px', color: '#1f2937', borderBottom: '1px solid #e5e7eb' }}>
        {item.warehouseName}
      </td>
      <td style={{ padding: '16px', fontSize: '14px', color: '#1f2937', borderBottom: '1px solid #e5e7eb' }}>
        {item.location}
      </td>
      <td style={{ padding: '16px', fontSize: '14px', color: '#1f2937', borderBottom: '1px solid #e5e7eb' }}>
        {item.capacity.toLocaleString()}
      </td>
      <td style={{ padding: '16px', fontSize: '14px', color: '#1f2937', borderBottom: '1px solid #e5e7eb' }}>
        {item.currentStock.toLocaleString()}
      </td>
      <td style={{ padding: '16px', fontSize: '14px', color: '#1f2937', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '100%',
            height: '8px',
            backgroundColor: '#e5e7eb',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div 
              style={{
                height: '100%',
                borderRadius: '4px',
                transition: 'width 0.3s ease',
                width: `${item.utilizationRate}%`,
                backgroundColor: getProgressColor(item.utilizationRate)
              }}
            />
          </div>
          <span>{item.utilizationRate}%</span>
        </div>
      </td>
      <td style={{ padding: '16px', fontSize: '14px', color: '#1f2937', borderBottom: '1px solid #e5e7eb' }}>
        {getStatusBadge(item.status)}
      </td>
      <td style={{ padding: '16px', fontSize: '14px', color: '#1f2937', borderBottom: '1px solid #e5e7eb' }}>
        {item.manager}
      </td>
      <td style={{ padding: '16px', fontSize: '14px', color: '#1f2937', borderBottom: '1px solid #e5e7eb' }}>
        {item.temperature} / {item.humidity}
      </td>
      <td style={{ padding: '16px', fontSize: '14px', color: '#1f2937', borderBottom: '1px solid #e5e7eb' }}>
        {getStatusBadge(item.securityLevel)}
      </td>
    </tr>
  );
};

export default WarehouseTableRow;

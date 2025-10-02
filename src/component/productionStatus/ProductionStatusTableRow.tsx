import React from 'react';
import { ProductionStatusData } from '../../types/productionStatus';

interface ProductionStatusTableRowProps {
  item: ProductionStatusData;
  index: number;
}

const ProductionStatusTableRow: React.FC<ProductionStatusTableRowProps> = ({ item, index }) => {
  const getStatusBadge = (status: string) => {
    const statusMap = {
      not_started: { text: '대기', color: '#f3f4f6', textColor: '#6b7280' },
      in_progress: { text: '진행중', color: '#dbeafe', textColor: '#1e40af' },
      paused: { text: '일시정지', color: '#fef3c7', textColor: '#d97706' },
      completed: { text: '완료', color: '#d1fae5', textColor: '#065f46' },
      cancelled: { text: '취소', color: '#fee2e2', textColor: '#991b1b' }
    };
    const statusInfo = statusMap[status as keyof typeof statusMap];
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
        {statusInfo.text}
      </span>
    );
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return '#10b981';
    if (progress >= 75) return '#f59e0b';
    if (progress >= 50) return '#3b82f6';
    return '#6b7280';
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return '#10b981';
    if (efficiency >= 70) return '#f59e0b';
    if (efficiency >= 50) return '#ef4444';
    return '#6b7280';
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
      <td style={{ padding: '24px 32px', whiteSpace: 'nowrap' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '16px'
          }}>
            <span style={{ color: 'white', fontWeight: 'bold', fontSize: '14px' }}>
              {item.orderId?.slice(-2) || 'OR'}
            </span>
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>
              {item.orderId}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              {item.productCode}
            </div>
          </div>
        </div>
      </td>
      <td style={{ padding: '24px 32px', whiteSpace: 'nowrap' }}>
        <div>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>
            {item.productName}
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            {item.workCenter}
          </div>
        </div>
      </td>
      <td style={{ padding: '24px 32px', whiteSpace: 'nowrap' }}>
        {getStatusBadge(item.status)}
      </td>
      <td style={{ padding: '24px 32px', whiteSpace: 'nowrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ 
            width: '100px', 
            height: '8px', 
            backgroundColor: '#e5e7eb', 
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${item.progress}%`,
              height: '100%',
              backgroundColor: getProgressColor(item.progress),
              transition: 'width 0.3s ease'
            }} />
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            {item.progress}%
          </div>
        </div>
      </td>
      <td style={{ padding: '24px 32px', whiteSpace: 'nowrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>
            {item.actualQuantity} / {item.plannedQuantity}
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            불량: {item.defectQuantity}
          </div>
        </div>
      </td>
      <td style={{ padding: '24px 32px', whiteSpace: 'nowrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ 
            fontSize: '14px', 
            fontWeight: '600', 
            color: getEfficiencyColor(item.efficiency)
          }}>
            {item.qualityRate}%
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            효율: {item.efficiency}%
          </div>
        </div>
      </td>
      <td style={{ padding: '24px 32px', whiteSpace: 'nowrap', fontSize: '14px', color: '#6b7280' }}>
        {item.operator}
      </td>
      <td style={{ padding: '24px 32px', whiteSpace: 'nowrap', fontSize: '14px', color: '#6b7280' }}>
        {item.currentStep}
      </td>
      <td style={{ padding: '24px 32px', whiteSpace: 'nowrap', fontSize: '14px', color: '#6b7280' }}>
        {item.startTime || '-'}
      </td>
      <td style={{ padding: '24px 32px', whiteSpace: 'nowrap', fontSize: '14px', color: '#6b7280' }}>
        {item.endTime || '-'}
      </td>
    </tr>
  );
};

export default ProductionStatusTableRow;

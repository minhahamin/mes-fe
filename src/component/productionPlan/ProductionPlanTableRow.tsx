import React from 'react';
import { ProductionPlanData } from '../../types/productionPlan';

interface ProductionPlanTableRowProps {
  item: ProductionPlanData;
  index: number;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const ProductionPlanTableRow: React.FC<ProductionPlanTableRowProps> = ({ item, index, onEdit, onDelete }) => {
  const getStatusBadge = (status: string) => {
    const statusMap = {
      planned: { text: '계획', color: '#dbeafe', textColor: '#1e40af' },
      in_progress: { text: '진행중', color: '#fef3c7', textColor: '#d97706' },
      completed: { text: '완료', color: '#d1fae5', textColor: '#065f46' },
      cancelled: { text: '취소', color: '#fee2e2', textColor: '#991b1b' },
      on_hold: { text: '보류', color: '#f3f4f6', textColor: '#6b7280' }
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

  const getPriorityBadge = (priority: string) => {
    const priorityMap = {
      low: { text: '낮음', color: '#f3f4f6', textColor: '#6b7280' },
      medium: { text: '보통', color: '#dbeafe', textColor: '#1e40af' },
      high: { text: '높음', color: '#fef3c7', textColor: '#d97706' },
      urgent: { text: '긴급', color: '#fee2e2', textColor: '#991b1b' }
    };
    const priorityInfo = priorityMap[priority as keyof typeof priorityMap];
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 12px',
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: '500',
        backgroundColor: priorityInfo.color,
        color: priorityInfo.textColor
      }}>
        {priorityInfo.text}
      </span>
    );
  };

  const getProgressPercentage = () => {
    if (!item.actualStartDate || !item.plannedStartDate || !item.plannedEndDate) return 0;
    
    const start = new Date(item.plannedStartDate).getTime();
    const end = new Date(item.plannedEndDate).getTime();
    const now = new Date().getTime();
    
    if (now < start) return 0;
    if (now > end) return 100;
    
    return Math.round(((now - start) / (end - start)) * 100);
  };

  const progress = getProgressPercentage();

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
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '16px'
          }}>
            <span style={{ color: 'white', fontWeight: 'bold', fontSize: '14px' }}>
              {item.planId.slice(-2)}
            </span>
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>
              {item.planId}
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
            {item.planQuantity}개
          </div>
        </div>
      </td>
      <td style={{ padding: '24px 32px', whiteSpace: 'nowrap' }}>
        {getStatusBadge(item.status)}
      </td>
      <td style={{ padding: '24px 32px', whiteSpace: 'nowrap' }}>
        {getPriorityBadge(item.priority)}
      </td>
      <td style={{ padding: '24px 32px', whiteSpace: 'nowrap', fontSize: '14px', color: '#6b7280' }}>
        {item.plannedStartDate}
      </td>
      <td style={{ padding: '24px 32px', whiteSpace: 'nowrap', fontSize: '14px', color: '#6b7280' }}>
        {item.plannedEndDate}
      </td>
      <td style={{ padding: '24px 32px', whiteSpace: 'nowrap', fontSize: '14px', color: '#6b7280' }}>
        {item.workCenter}
      </td>
      <td style={{ padding: '24px 32px', whiteSpace: 'nowrap', fontSize: '14px', color: '#6b7280' }}>
        {item.responsiblePerson}
      </td>
      <td style={{ padding: '24px 32px', whiteSpace: 'nowrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>
            {item.estimatedHours}h
          </div>
          {item.actualHours && (
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              실제: {item.actualHours}h
            </div>
          )}
        </div>
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
              width: `${progress}%`,
              height: '100%',
              backgroundColor: progress === 100 ? '#10b981' : progress > 50 ? '#f59e0b' : '#3b82f6',
              transition: 'width 0.3s ease'
            }} />
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            {progress}%
          </div>
        </div>
      </td>
      <td style={{ padding: '24px 32px', whiteSpace: 'nowrap', fontSize: '14px', fontWeight: '500' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => onEdit(item.id)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '8px 12px',
              border: 'none',
              fontSize: '12px',
              fontWeight: '500',
              borderRadius: '8px',
              color: 'white',
              backgroundColor: '#3b82f6',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#2563eb';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#3b82f6';
            }}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ marginRight: '4px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            수정
          </button>
          <button
            onClick={() => onDelete(item.id)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '8px 12px',
              border: 'none',
              fontSize: '12px',
              fontWeight: '500',
              borderRadius: '8px',
              color: 'white',
              backgroundColor: '#ef4444',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#dc2626';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#ef4444';
            }}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ marginRight: '4px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            삭제
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ProductionPlanTableRow;

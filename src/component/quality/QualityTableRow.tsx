import React from 'react';
import { QualityData } from '../../types/quality';

interface QualityTableRowProps {
  item: QualityData;
  index: number;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const QualityTableRow: React.FC<QualityTableRowProps> = ({ item, index, onEdit, onDelete }) => {
  const getStatusBadge = (status: string) => {
    const statusMap = {
      pass: { text: '합격', color: '#d1fae5', textColor: '#065f46' },
      fail: { text: '불합격', color: '#fee2e2', textColor: '#991b1b' },
      pending: { text: '대기', color: '#fef3c7', textColor: '#d97706' },
      rework: { text: '재작업', color: '#e0e7ff', textColor: '#3730a3' }
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

  const getInspectionTypeBadge = (type: string) => {
    const typeMap = {
      incoming: { text: '입고검사', color: '#dbeafe', textColor: '#1e40af' },
      in_process: { text: '공정검사', color: '#f3e8ff', textColor: '#7c2d12' },
      final: { text: '최종검사', color: '#d1fae5', textColor: '#065f46' },
      outgoing: { text: '출고검사', color: '#fef3c7', textColor: '#d97706' }
    };
    const typeInfo = typeMap[type as keyof typeof typeMap];
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 12px',
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: '500',
        backgroundColor: typeInfo.color,
        color: typeInfo.textColor
      }}>
        {typeInfo.text}
      </span>
    );
  };

  const getPassRateColor = (rate: number) => {
    if (rate >= 95) return '#065f46';
    if (rate >= 90) return '#d97706';
    return '#991b1b';
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
            background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '16px'
          }}>
            <span style={{ color: 'white', fontWeight: 'bold', fontSize: '14px' }}>
              {item.qualityId.slice(-2)}
            </span>
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>
              {item.qualityId}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              {item.productName}
            </div>
          </div>
        </div>
      </td>
      <td style={{ padding: '24px 32px', whiteSpace: 'nowrap' }}>
        <div>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>
            {item.productCode}
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            {item.batchNumber}
          </div>
        </div>
      </td>
      <td style={{ padding: '24px 32px', whiteSpace: 'nowrap' }}>
        {getInspectionTypeBadge(item.inspectionType)}
      </td>
      <td style={{ padding: '24px 32px', whiteSpace: 'nowrap', fontSize: '14px', color: '#6b7280' }}>
        {item.inspector}
      </td>
      <td style={{ padding: '24px 32px', whiteSpace: 'nowrap', fontSize: '14px', color: '#6b7280' }}>
        {item.inspectionDate}
      </td>
      <td style={{ padding: '24px 32px', whiteSpace: 'nowrap' }}>
        {getStatusBadge(item.status)}
      </td>
      <td style={{ padding: '24px 32px', whiteSpace: 'nowrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>
            {item.quantityPassed} / {item.quantityInspected}
          </div>
          <div style={{
            fontSize: '12px',
            fontWeight: '500',
            color: getPassRateColor(item.passRate)
          }}>
            {(typeof item.passRate === 'string' ? parseFloat(item.passRate) : item.passRate).toFixed(1)}%
          </div>
        </div>
      </td>
      <td style={{ padding: '24px 32px', whiteSpace: 'nowrap', fontSize: '14px', color: '#6b7280', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {item.defectType || '-'}
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

export default QualityTableRow;

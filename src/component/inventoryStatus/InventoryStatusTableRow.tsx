import React from 'react';
import { InventoryStatusData } from '../../types/inventoryStatus';

interface InventoryStatusTableRowProps {
  item: InventoryStatusData;
  index: number;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const InventoryStatusTableRow: React.FC<InventoryStatusTableRowProps> = ({ item, index, onEdit, onDelete }) => {
  const getStatusBadge = (status: string) => {
    const statusMap = {
      sufficient: { text: '충분', color: '#d1fae5', textColor: '#065f46' },
      low: { text: '부족', color: '#fef3c7', textColor: '#d97706' },
      out_of_stock: { text: '재고없음', color: '#fee2e2', textColor: '#991b1b' },
      overstock: { text: '과재고', color: '#e0e7ff', textColor: '#3730a3' }
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

  const getMovementTypeBadge = (type: string) => {
    const typeMap = {
      in: { text: '입고', color: '#d1fae5', textColor: '#065f46' },
      out: { text: '출고', color: '#fee2e2', textColor: '#991b1b' },
      adjustment: { text: '조정', color: '#dbeafe', textColor: '#1e40af' }
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount);
  };

  const getStockLevel = (current: number, min: number, max: number) => {
    if (current <= 0) return 'out_of_stock';
    if (current <= min) return 'low';
    if (current >= max) return 'overstock';
    return 'sufficient';
  };

  const stockLevel = getStockLevel(item.currentStock, item.minStock, item.maxStock);

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
            background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '16px'
          }}>
            <span style={{ color: 'white', fontWeight: 'bold', fontSize: '14px' }}>
              {item.productCode.slice(-2)}
            </span>
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>
              {item.productName}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              {item.productCode}
            </div>
          </div>
        </div>
      </td>
      <td style={{ padding: '24px 32px', whiteSpace: 'nowrap' }}>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '4px 12px',
          borderRadius: '9999px',
          fontSize: '12px',
          fontWeight: '500',
          backgroundColor: '#e0e7ff',
          color: '#3730a3'
        }}>
          {item.category}
        </span>
      </td>
      <td style={{ padding: '24px 32px', whiteSpace: 'nowrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>
            {item.currentStock}개
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            {item.minStock} / {item.maxStock}
          </div>
        </div>
      </td>
      <td style={{ padding: '24px 32px', whiteSpace: 'nowrap' }}>
        {getStatusBadge(stockLevel)}
      </td>
      <td style={{ padding: '24px 32px', whiteSpace: 'nowrap', fontSize: '14px', color: '#6b7280' }}>
        {item.location}
      </td>
      <td style={{ padding: '24px 32px', whiteSpace: 'nowrap', fontSize: '14px', color: '#6b7280' }}>
        {item.supplier}
      </td>
      <td style={{ padding: '24px 32px', whiteSpace: 'nowrap', fontSize: '14px', fontWeight: '600', color: '#111827' }}>
        {formatCurrency(item.totalValue)}
      </td>
      <td style={{ padding: '24px 32px', whiteSpace: 'nowrap', fontSize: '14px', color: '#6b7280' }}>
        {item.lastUpdated}
      </td>
      <td style={{ padding: '24px 32px', whiteSpace: 'nowrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {getMovementTypeBadge(item.movementType)}
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            {item.movementQuantity > 0 ? '+' : ''}{item.movementQuantity}
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

export default InventoryStatusTableRow;

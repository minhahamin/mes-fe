import React from 'react';
import { OrderingData } from '../../types/ordering';

interface OrderingTableRowProps {
  item: OrderingData;
  index: number;
}

const OrderingTableRow: React.FC<OrderingTableRowProps> = ({ item, index }) => {
  const getStatusBadge = (status: string) => {
    const statusMap = {
      '입고완료': { color: '#d1fae5', textColor: '#065f46' },
      '부분입고': { color: '#fef3c7', textColor: '#d97706' },
      '발주됨': { color: '#dbeafe', textColor: '#1e40af' },
      '대기': { color: '#f3f4f6', textColor: '#6b7280' },
      '취소': { color: '#fee2e2', textColor: '#991b1b' },
      '높음': { color: '#fee2e2', textColor: '#991b1b' },
      '보통': { color: '#dbeafe', textColor: '#1e40af' },
      '낮음': { color: '#f3f4f6', textColor: '#6b7280' },
      '긴급': { color: '#fee2e2', textColor: '#991b1b' }
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
        {item.orderId}
      </td>
      <td style={{ padding: '16px', fontSize: '14px', color: '#1f2937', borderBottom: '1px solid #e5e7eb' }}>
        {item.supplierName}
      </td>
      <td style={{ padding: '16px', fontSize: '14px', color: '#1f2937', borderBottom: '1px solid #e5e7eb' }}>
        {item.productName}
      </td>
      <td style={{ padding: '16px', fontSize: '14px', color: '#1f2937', borderBottom: '1px solid #e5e7eb' }}>
        {item.quantity.toLocaleString()}개
      </td>
      <td style={{ padding: '16px', fontSize: '14px', color: '#1f2937', borderBottom: '1px solid #e5e7eb' }}>
        {item.totalAmount.toLocaleString()}원
      </td>
      <td style={{ padding: '16px', fontSize: '14px', color: '#1f2937', borderBottom: '1px solid #e5e7eb' }}>
        {item.orderDate}
      </td>
      <td style={{ padding: '16px', fontSize: '14px', color: '#1f2937', borderBottom: '1px solid #e5e7eb' }}>
        {item.expectedDeliveryDate}
      </td>
      <td style={{ padding: '16px', fontSize: '14px', color: '#1f2937', borderBottom: '1px solid #e5e7eb' }}>
        {getStatusBadge(item.status)}
      </td>
      <td style={{ padding: '16px', fontSize: '14px', color: '#1f2937', borderBottom: '1px solid #e5e7eb' }}>
        {getStatusBadge(item.priority)}
      </td>
      <td style={{ padding: '16px', fontSize: '14px', color: '#1f2937', borderBottom: '1px solid #e5e7eb' }}>
        {item.purchasePerson}
      </td>
    </tr>
  );
};

export default OrderingTableRow;

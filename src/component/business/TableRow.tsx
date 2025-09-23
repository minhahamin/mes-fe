import React from 'react';

interface BusinessData {
  id: number;
  companyName: string;
  businessNumber: string;
  ceoName: string;
  address: string;
  phone: string;
  email: string;
  industry: string;
  establishedDate: string;
}

interface TableRowProps {
  item: BusinessData;
  index: number;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const TableRow: React.FC<TableRowProps> = ({ item, index, onEdit, onDelete }) => (
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
          background: 'linear-gradient(135deg, #3b82f6 0%, #4f46e5 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: '16px'
        }}>
          <span style={{ color: 'white', fontWeight: 'bold', fontSize: '14px' }}>
            {item.companyName.charAt(0)}
          </span>
        </div>
        <div>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>
            {item.companyName}
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
        backgroundColor: '#dbeafe',
        color: '#1e40af'
      }}>
        {item.businessNumber}
      </span>
    </td>
    <td style={{ padding: '24px 32px', whiteSpace: 'nowrap', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
      {item.ceoName}
    </td>
    <td style={{ padding: '24px 32px', whiteSpace: 'nowrap', fontSize: '14px', color: '#6b7280', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
      {item.address}
    </td>
    <td style={{ padding: '24px 32px', whiteSpace: 'nowrap', fontSize: '14px', color: '#6b7280' }}>
      {item.phone}
    </td>
    <td style={{ padding: '24px 32px', whiteSpace: 'nowrap', fontSize: '14px', color: '#6b7280' }}>
      {item.email}
    </td>
    <td style={{ padding: '24px 32px', whiteSpace: 'nowrap' }}>
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 12px',
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: '500',
        backgroundColor: '#d1fae5',
        color: '#065f46'
      }}>
        {item.industry}
      </span>
    </td>
    <td style={{ padding: '24px 32px', whiteSpace: 'nowrap', fontSize: '14px', color: '#6b7280' }}>
      {item.establishedDate}
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

export default TableRow;

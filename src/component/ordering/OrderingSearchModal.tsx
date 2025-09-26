import React, { useState, useEffect } from 'react';
import { getBusinesses } from '../../api/orderApi';
import { OrderReceiptData } from '../../types/orderReceipt';

interface OrderReceiptSearchModalProps {
  show: boolean;
  onClose: () => void;
  onSelect: (orderReceipt: OrderReceiptData) => void;
}

const OrderReceiptSearchModal: React.FC<OrderReceiptSearchModalProps> = ({ 
  show, 
  onClose, 
  onSelect 
}) => {
  const [orderReceipts, setOrderReceipts] = useState<OrderReceiptData[]>([]);
  const [filteredOrderReceipts, setFilteredOrderReceipts] = useState<OrderReceiptData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // 수주 데이터 로드
  const loadOrderReceipts = async () => {
    try {
      setLoading(true);
      const response = await getBusinesses();
      if (response.success && response.data) {
        setOrderReceipts(response.data);
        setFilteredOrderReceipts(response.data);
      }
    } catch (error) {
      console.error('수주 데이터 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 모달이 열릴 때 데이터 로드
  useEffect(() => {
    if (show) {
      loadOrderReceipts();
    }
  }, [show]);

  // 검색어 변경 핸들러
  useEffect(() => {
    if (!searchTerm) {
      setFilteredOrderReceipts(orderReceipts);
    } else {
      const filtered = orderReceipts.filter(orderReceipt =>
        orderReceipt.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        orderReceipt.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        orderReceipt.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        orderReceipt.productCode?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOrderReceipts(filtered);
    }
  }, [searchTerm, orderReceipts]);

  // 수주 정보 선택 핸들러
  const handleSelect = (orderReceipt: OrderReceiptData) => {
    onSelect(orderReceipt);
    onClose();
  };

  if (!show) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      overflowY: 'auto',
      height: '100%',
      width: '100%',
      zIndex: 60,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        width: '100%',
        maxWidth: '900px',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        {/* 모달 헤더 */}
        <div style={{
          padding: '24px',
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                padding: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '8px'
              }}>
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'white' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div>
                <h3 style={{ 
                  fontSize: '20px', 
                  fontWeight: 'bold', 
                  color: 'white',
                  margin: 0
                }}>
                  수주 정보 검색
                </h3>
                <p style={{ 
                  color: '#fed7aa', 
                  marginTop: '4px',
                  margin: 0
                }}>
                  기존 수주 정보를 선택하세요
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                color: 'white',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '8px',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.color = '#fed7aa';
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* 모달 바디 */}
        <div style={{ padding: '24px' }}>
          {/* 검색 바 */}
          <div style={{ marginBottom: '24px' }}>
            <input
              type="text"
              placeholder="수주 ID, 고객명, 제품명, 제품코드로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '12px',
                fontSize: '14px',
                outline: 'none',
                transition: 'all 0.2s ease'
              }}
            />
          </div>

          {/* 수주 목록 */}
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {loading ? (
              <div style={{ 
                textAlign: 'center', padding: '20px',
                color: '#6b7280' 
              }}>
                로딩 중...
              </div>
            ) : filteredOrderReceipts.length > 0 ? (
              filteredOrderReceipts.map((orderReceipt, index) => (
                <div
                  key={index}
                  onClick={() => handleSelect(orderReceipt)}
                  style={{
                    padding: '16px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    marginBottom: '8px',
                    ':hover': {
                      borderColor: '#f59e0b',
                      backgroundColor: '#fef3c7',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = '#f59e0b';
                    e.currentTarget.style.backgroundColor = '#fef3c7';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ marginBottom: '8px' }}>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>
                      {orderReceipt.orderId || '수주 ID 없음'}
                    </div>
                    <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
                      {orderReceipt.customerName} · {orderReceipt.productName}
                    </div>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: '8px',
                    fontSize: '12px',
                    color: '#6b7280'
                  }}>
                    <span>제품코드: {orderReceipt.productCode || '-'}</span>
                    <span>수량: {orderReceipt.orderQuantity || '-'}</span>
                    <span>단가: {(orderReceipt.unitPrice || 0).toLocaleString()}원</span>
                    <span>상태: {orderReceipt.status || '-'}</span>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px 20px',
                color: '#6b7280' 
              }}>
                {searchTerm ? '검색 결과가 없습니다' : '수주 정보가 없습니다'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderReceiptSearchModal;

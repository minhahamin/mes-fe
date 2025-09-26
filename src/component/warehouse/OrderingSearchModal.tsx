import React, { useState, useEffect } from 'react';
import { getBusinesses } from '../../api/purchaseApi';
import { OrderingData } from '../../types/ordering';

interface OrderingSearchModalProps {
  show: boolean;
  onClose: () => void;
  onSelect: (ordering: OrderingData) => void;
}

const OrderingSearchModal: React.FC<OrderingSearchModalProps> = ({
  show,
  onClose,
  onSelect
}) => {
  const [orderings, setOrderings] = useState<OrderingData[]>([]);
  const [filteredOrderings, setFilteredOrderings] = useState<OrderingData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const loadOrderings = async () => {
    try {
      setLoading(true);
      const response = await getBusinesses();
      if (response.success && response.data) {
        setOrderings(response.data);
        setFilteredOrderings(response.data);
      }
    } catch (error) {
      console.error('발주 데이터 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (show) {
      loadOrderings();
    }
  }, [show]);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredOrderings(orderings);
    } else {
      const filtered = orderings.filter(ordering =>
        ordering.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ordering.supplierName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ordering.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ordering.productCode?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOrderings(filtered);
    }
  }, [searchTerm, orderings]);

  const handleSelect = (ordering: OrderingData) => {
    onSelect(ordering);
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
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '800px',
        maxHeight: '80vh',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}>
        {/* 헤더 */}
        <div style={{
          padding: '24px',
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          color: 'white'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>
                발주 목록 검색
              </h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: '4px 0 0 0' }}>
                기존 발주 정보를 선택하세요
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '24px',
                cursor: 'pointer',
                padding: '4px'
              }}
            >
              ×
            </button>
          </div>
        </div>

        {/* 검색 입력 */}
        <div style={{ padding: '24px' }}>
          <input
            type="text"
            placeholder="발주 ID, 공급업체명, 제품명, 제품코드로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              marginBottom: '16px'
            }}
          />

          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                로딩 중...
              </div>
            ) : filteredOrderings.length > 0 ? (
              filteredOrderings.map((ordering, index) => (
                <div
                  key={index}
                  onClick={() => handleSelect(ordering)}
                  style={{
                    padding: '16px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    marginBottom: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                    e.currentTarget.style.borderColor = '#0ea5e9';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.borderColor = '#e5e7eb';
                  }}
                >
                  <div style={{ marginBottom: '8px' }}>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>
                      {ordering.orderId || '발주 ID 없음'}
                    </div>
                    <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
                      {ordering.supplierName} · {ordering.productName}
                    </div>
                  </div>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                    fontSize: '12px',
                    color: '#6b7280'
                  }}>
                    <span>제품코드: {ordering.productCode || '-'}</span>
                    <span>수량: {ordering.orderQuantity || '-'}</span>
                    <span>단가: {(ordering.unitPrice || 0).toLocaleString()}원</span>
                    <span>상태: {ordering.status || '-'}</span>
                  </div>
                </div>
              ))
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '40px',
                color: '#6b7280'
              }}>
                {searchTerm ? '검색 결과가 없습니다' : '발주 정보가 없습니다'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderingSearchModal;

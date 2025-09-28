import React, { useState, useEffect, useCallback } from 'react';
import { getBusinesses } from '../../api/orderApi';

interface OrderData {
  id: number;
  orderId: string;
  customerId: string;
  customerName: string;
  productCode: string;
  productName: string;
  orderQuantity: number;
  unitPrice: number;
  totalAmount: number;
  orderDate: string;
  deliveryDate: string;
  status: string;
  priority: string;
  salesPerson: string;
  paymentTerms: string;
  shippingAddress: string;
  specialInstructions?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface OrderSearchModalProps {
  show: boolean;
  onClose: () => void;
  onSelect: (order: OrderData) => void;
}

const OrderSearchModal: React.FC<OrderSearchModalProps> = ({ show, onClose, onSelect }) => {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // 수주 데이터 로드
  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getBusinesses();
      
      if (response.success && response.data) {
        setOrders(response.data);
      } else {
        setError(response.error || '수주 데이터를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('수주 데이터 로드 실패:', err);
      setError('수주 데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  // 모달이 열릴 때 데이터 로드
  useEffect(() => {
    if (show) {
      loadOrders();
    }
  }, [show, loadOrders]);

  // 검색 필터링
  const filteredOrders = orders.filter(order => 
    order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 수주 선택
  const handleSelect = useCallback((order: OrderData) => {
    onSelect(order);
    onClose();
  }, [onSelect, onClose]);

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
        position: 'relative',
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        width: '100%',
        maxWidth: '1000px',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        {/* 모달 헤더 */}
        <div style={{
          padding: '24px',
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
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
                  수주 검색
                </h3>
                <p style={{ 
                  color: '#fecaca', 
                  marginTop: '4px',
                  margin: 0,
                  fontSize: '14px'
                }}>
                  수주를 선택하여 출하 정보에 자동으로 적용합니다
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
                e.currentTarget.style.color = '#fecaca';
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

        {/* 검색 바 */}
        <div style={{ padding: '24px 24px 0' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="수주 ID, 고객명, 제품명으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px 12px 48px',
                border: '1px solid #d1d5db',
                borderRadius: '12px',
                fontSize: '14px',
                outline: 'none',
                transition: 'all 0.2s ease',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#ef4444';
                e.target.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d1d5db';
                e.target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
              }}
            />
            <div style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#6b7280'
            }}>
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* 모달 바디 */}
        <div style={{ padding: '24px' }}>
          {/* 에러 메시지 */}
          {error && (
            <div style={{
              padding: '12px 16px',
              backgroundColor: '#fef2f2',
              color: '#dc2626',
              borderRadius: '8px',
              marginBottom: '16px',
              border: '1px solid #fecaca'
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* 로딩 상태 */}
          {loading ? (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '40px',
              fontSize: '16px',
              color: '#6b7280'
            }}>
              수주 데이터를 불러오는 중...
            </div>
          ) : (
            /* 수주 목록 */
            <div style={{
              maxHeight: '400px',
              overflowY: 'auto',
              border: '1px solid #e5e7eb',
              borderRadius: '12px'
            }}>
              {filteredOrders.length === 0 ? (
                <div style={{
                  padding: '40px',
                  textAlign: 'center',
                  color: '#6b7280'
                }}>
                  {searchTerm ? '검색 결과가 없습니다.' : '수주 데이터가 없습니다.'}
                </div>
              ) : (
                filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    onClick={() => handleSelect(order)}
                    style={{
                      padding: '16px 20px',
                      borderBottom: '1px solid #f3f4f6',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      backgroundColor: 'white'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = '#f8fafc';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = 'white';
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '8px'
                    }}>
                      <div>
                        <h4 style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#111827',
                          margin: '0 0 4px 0'
                        }}>
                          {order.orderId}
                        </h4>
                        <p style={{
                          fontSize: '14px',
                          color: '#6b7280',
                          margin: 0
                        }}>
                          {order.customerName}
                        </p>
                      </div>
                      <div style={{
                        textAlign: 'right'
                      }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '4px 8px',
                          backgroundColor: order.status === 'completed' ? '#d1fae5' : 
                                         order.status === 'in_production' ? '#fef3c7' : '#f3f4f6',
                          color: order.status === 'completed' ? '#065f46' : 
                                order.status === 'in_production' ? '#92400e' : '#374151',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          {order.status === 'completed' ? '완료' :
                           order.status === 'in_production' ? '생산중' :
                           order.status === 'confirmed' ? '확정' :
                           order.status === 'pending' ? '대기' : order.status}
                        </span>
                      </div>
                    </div>
                    
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr 1fr',
                      gap: '16px',
                      fontSize: '14px',
                      color: '#6b7280'
                    }}>
                      <div>
                        <span style={{ fontWeight: '500', color: '#374151' }}>제품:</span> {order.productName}
                      </div>
                      <div>
                        <span style={{ fontWeight: '500', color: '#374151' }}>수량:</span> {order.orderQuantity.toLocaleString()}개
                      </div>
                      <div>
                        <span style={{ fontWeight: '500', color: '#374151' }}>금액:</span> {order.totalAmount.toLocaleString()}원
                      </div>
                    </div>
                    
                    <div style={{
                      marginTop: '8px',
                      fontSize: '12px',
                      color: '#9ca3af'
                    }}>
                      <span>주문일: {order.orderDate}</span>
                      <span style={{ margin: '0 8px' }}>•</span>
                      <span>납기일: {order.deliveryDate}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderSearchModal;

import React, { useState, useEffect } from 'react';
import { getBusinesses } from '../../api/customerApi';

interface CustomerData {
  id: number;
  customerName: string;
  customerId: string;
  businessNumber?: string;
  address?: string;
}

interface CustomerSearchModalProps {
  show: boolean;
  onClose: () => void;
  onSelect: (customer: CustomerData) => void;
}

const CustomerSearchModal: React.FC<CustomerSearchModalProps> = ({ 
  show, 
  onClose, 
  onSelect 
}) => {
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<CustomerData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // 고객 데이터 로드
  const loadCustomers = async () => {
    try {
      setLoading(true);
      const response = await getBusinesses();
      if (response.success && response.data) {
        setCustomers(response.data);
        setFilteredCustomers(response.data);
      }
    } catch (error) {
      console.error('고객 데이터 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 모달이 열릴 때 데이터 로드
  useEffect(() => {
    if (show) {
      loadCustomers();
    }
  }, [show]);

  // 검색어 변경 시 필터링
  useEffect(() => {
    if (searchTerm) {
      const filtered = customers.filter(customer => {
        const searchQuery = searchTerm.toLowerCase();
        return customer.customerName.toLowerCase().includes(searchQuery) ||
               customer.customerId.toLowerCase().includes(searchQuery) ||
               (customer.businessNumber && customer.businessNumber.includes(searchTerm))
      });
      setFilteredCustomers(filtered);
    } else {
      setFilteredCustomers(customers);
    }
  }, [searchTerm, customers]);

  const handleSelect = (customer: CustomerData) => {
    onSelect(customer);
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
        position: 'relative',
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        width: '100%',
        maxWidth: '800px',
        maxHeight: '80vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* 모달 헤더 */}
        <div style={{
          padding: '24px',
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          color: 'white'
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
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'white' }}>
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
                  거래처 조회
                </h3>
                <p style={{ 
                  color: '#93c5fd', 
                  marginTop: '4px',
                  margin: 0,
                  fontSize: '14px'
                }}>
                  고객을 검색하여 선택하세요
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
                borderRadius: '6px',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.color = '#93c5fd';
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* 검색 영역 */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="고객명, 거래처ID, 사업자번호로 검색..."
              style={{
                width: '100%',
                padding: '12px 16px 12px 44px',
                border: '1px solid #d1d5db',
                borderRadius: '12px',
                fontSize: '14px',
                outline: 'none',
                transition: 'all 0.2s ease',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
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
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* 고객 목록 */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          maxHeight: '400px'
        }}>
          {loading ? (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '40px',
              color: '#3b82f6'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                border: '4px solid #e5e7eb',
                borderTop: '4px solid #3b82f6',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              <span style={{ marginLeft: '12px', fontSize: '14px' }}>고객 정보를 불러오는 중...</span>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px',
              color: '#6b7280'
            }}>
              <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ opacity: 0.4 }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p style={{ marginTop: '12px', fontSize: '16px' }}>
                {searchTerm ? '검색 결과가 없습니다.' : '등록된 고객이 없습니다.'}
              </p>
            </div>
          ) : (
            <div style={{ padding: '0' }}>
              {filteredCustomers.map((customer, index) => (
                <div
                  key={customer.id}
                  onClick={() => handleSelect(customer)}
                  style={{
                    padding: '16px 24px',
                    borderBottom: index === filteredCustomers.length - 1 ? 'none' : '1px solid #f3f4f6',
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
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#111827',
                        marginBottom: '4px'
                      }}>
                        {customer.customerName}
                      </div>
                       <div style={{
                         fontSize: '14px',
                         color: '#6b7280',
                         marginBottom: '2px'
                       }}>
                         거래처 ID: {customer.businessNumber || customer.customerId}
                       </div>
                       {customer.customerId && customer.businessNumber && (
                         <div style={{
                           fontSize: '12px',
                           color: '#9ca3af'
                         }}>
                           고객 ID: {customer.customerId}
                         </div>
                       )}
                    </div>
                    <div style={{
                      padding: '6px 12px',
                      backgroundColor: '#dbeafe',
                      color: '#1d4ed8',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      선택
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default CustomerSearchModal;

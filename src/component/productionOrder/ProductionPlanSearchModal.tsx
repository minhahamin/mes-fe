import React, { useState, useEffect, useCallback } from 'react';
import { getBusinesses } from '../../api/productionPlanApi';

interface ProductionPlanSearchModalProps {
  show: boolean;
  onClose: () => void;
  onSelect: (plan: any) => void;
}

const ProductionPlanSearchModal: React.FC<ProductionPlanSearchModalProps> = ({ 
  show, 
  onClose, 
  onSelect 
}) => {
  const [plans, setPlans] = useState<any[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const loadPlans = async () => {
    try {
      setLoading(true);
      const response = await getBusinesses();
      if (response.success && response.data) {
        setPlans(response.data);
        setFilteredPlans(response.data);
      }
    } catch (error) {
      console.error('생산계획 데이터 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (show) {
      loadPlans();
    }
  }, [show]);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredPlans(plans);
    } else {
      const filtered = plans.filter(plan =>
        plan.planId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.productCode?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPlans(filtered);
    }
  }, [searchTerm, plans]);

  const handleSelect = (plan: any) => {
    onSelect(plan);
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
        maxWidth: '900px',
        maxHeight: '80vh',
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <div>
                <h3 style={{ 
                  fontSize: '20px', 
                  fontWeight: 'bold', 
                  color: 'white',
                  margin: 0
                }}>
                  생산계획 검색
                </h3>
                <p style={{ 
                  color: '#fed7aa', 
                  marginTop: '4px',
                  margin: 0,
                  fontSize: '14px'
                }}>
                  생산계획을 선택하여 생산지시에 자동으로 적용합니다
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

        {/* 검색 입력 */}
        <div style={{ padding: '24px', position: 'relative' }}>
          <input
            type="text"
            placeholder="계획 ID, 제품명, 제품코드로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '12px',
              fontSize: '14px',
              outline: 'none',
              transition: 'all 0.2s ease',
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#f59e0b';
              e.target.style.boxShadow = '0 0 0 3px rgba(245, 158, 11, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d1d5db';
              e.target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
            }}
          />
          <div style={{
            position: 'absolute',
            right: '40px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#6b7280'
          }}>
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* 생산계획 목록 */}
        <div style={{ padding: '0 24px 24px' }}>
          {loading ? (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '40px',
              color: '#6b7280'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid #e5e7eb',
                  borderTop: '2px solid #f59e0b',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                로딩 중...
              </div>
            </div>
          ) : filteredPlans.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: '#6b7280'
            }}>
              <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ margin: '0 auto 16px', color: '#d1d5db' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <p style={{ margin: 0, fontSize: '14px' }}>
                {searchTerm ? '검색 결과가 없습니다' : '생산계획 데이터가 없습니다'}
              </p>
            </div>
          ) : (
            <div style={{
              maxHeight: '400px',
              overflowY: 'auto',
              border: '1px solid #e5e7eb',
              borderRadius: '12px'
            }}>
              <table style={{ width: '100%' }}>
                <thead>
                  <tr style={{
                    backgroundColor: '#f9fafb',
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    <th style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#374151',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>계획 정보</th>
                    <th style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#374151',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>제품 정보</th>
                    <th style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#374151',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>계획 수량</th>
                    <th style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#374151',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>작업장</th>
                    <th style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#374151',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>상태</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPlans.map((plan, index) => (
                    <tr 
                      key={plan.id}
                      style={{
                        backgroundColor: index % 2 === 0 ? 'white' : '#f9fafb',
                        borderBottom: '1px solid #f3f4f6',
                        transition: 'all 0.2s ease',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#fffbeb';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'white' : '#f9fafb';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      onClick={() => handleSelect(plan)}
                    >
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: '12px'
                          }}>
                            <span style={{ color: 'white', fontWeight: 'bold', fontSize: '12px' }}>
                              {plan.planId?.slice(-2) || 'PL'}
                            </span>
                          </div>
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>
                              {plan.planId}
                            </div>
                            <div style={{ fontSize: '12px', color: '#6b7280' }}>
                              {plan.plannedStartDate} ~ {plan.plannedEndDate}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>
                            {plan.productName}
                          </div>
                          <div style={{ fontSize: '12px', color: '#6b7280' }}>
                            {plan.productCode}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '16px', fontSize: '14px', fontWeight: '600', color: '#111827' }}>
                        {(typeof plan.planQuantity === 'string' ? parseFloat(plan.planQuantity) || 0 : plan.planQuantity).toLocaleString('ko-KR')}개
                      </td>
                      <td style={{ padding: '16px', fontSize: '14px', color: '#6b7280' }}>
                        {plan.workCenter || '-'}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '4px 8px',
                          borderRadius: '9999px',
                          fontSize: '12px',
                          fontWeight: '500',
                          backgroundColor: plan.status === 'completed' ? '#d1fae5' : 
                                          plan.status === 'in_progress' ? '#dbeafe' :
                                          plan.status === 'planned' ? '#fef3c7' : '#f3f4f6',
                          color: plan.status === 'completed' ? '#065f46' : 
                                 plan.status === 'in_progress' ? '#1e40af' :
                                 plan.status === 'planned' ? '#d97706' : '#6b7280'
                        }}>
                          {plan.status === 'completed' ? '완료' :
                           plan.status === 'in_progress' ? '진행중' :
                           plan.status === 'planned' ? '계획됨' :
                           plan.status === 'on_hold' ? '보류' : plan.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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

export default ProductionPlanSearchModal;


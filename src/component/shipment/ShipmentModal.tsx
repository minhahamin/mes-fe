import React, { useState, useCallback } from 'react';
import { ShipmentData } from '../../types/shipment';
import { createBusiness, updateBusiness, deleteBusiness } from '../../api/shipmentApi';
import OrderSearchModal from './OrderSearchModal';

interface ShipmentModalProps {
  show: boolean;
  editingId: number | null;
  formData: Partial<ShipmentData>;
  onClose: () => void;
  onSuccess: () => void;
}

const ShipmentModal: React.FC<ShipmentModalProps> = ({ 
  show, 
  editingId, 
  formData, 
  onClose, 
  onSuccess 
}) => {
  // 상태 관리
  const [currentFormData, setCurrentFormData] = useState<Partial<ShipmentData>>(formData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [showOrderSearch, setShowOrderSearch] = useState(false);

  // 폼 데이터 초기화
  React.useEffect(() => {
    setCurrentFormData(formData);
    setError(null);
    setIsDeleteMode(false);
  }, [formData, show]);

  // 입력 변경 핸들러
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (['quantity', 'shippingCost'].includes(name)) {
      // 숫자 필드의 경우 천단위 구분 제거 후 숫자로 변환
      const numericValue = value.replace(/,/g, '');
      const numValue = numericValue === '' ? 0 : Number(numericValue) || 0;
      
      setCurrentFormData(prev => ({ 
        ...prev, 
        [name]: numValue
      }));
    } else {
      setCurrentFormData(prev => ({ 
        ...prev, 
        [name]: value 
      }));
    }
  }, []);

  // 숫자 포맷팅 함수
  const formatNumber = useCallback((value: number | string | undefined) => {
    if (value === undefined || value === null || value === '') return '';
    const num = typeof value === 'string' ? Number(value.replace(/,/g, '')) : value;
    return isNaN(num) ? '' : num.toLocaleString('ko-KR');
  }, []);

  // 저장 핸들러
  const handleSave = useCallback(async () => {
    if (!currentFormData.customerName || !currentFormData.productName) {
      setError('필수 항목을 모두 입력해주세요.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let response;
      if (editingId) {
        // 수정
        response = await updateBusiness({
          ...currentFormData,
          id: editingId
        } as any);
      } else {
        // 추가
        response = await createBusiness(currentFormData as any);
      }

      if (response.success) {
        alert(response.message || '저장되었습니다.');
        onSuccess();
      } else {
        setError(response.error || '저장에 실패했습니다.');
      }
    } catch (err) {
      console.error('저장 실패:', err);
      setError('저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, [currentFormData, editingId, onSuccess]);

  // 삭제 핸들러
  const handleDelete = useCallback(async () => {
    if (!editingId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await deleteBusiness(editingId);
      
      if (response.success) {
        alert(response.message || '삭제되었습니다.');
        onSuccess();
      } else {
        setError(response.error || '삭제에 실패했습니다.');
      }
    } catch (err) {
      console.error('삭제 실패:', err);
      setError('삭제 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, [editingId, onSuccess]);

  // 삭제 모드 토글
  const toggleDeleteMode = useCallback(() => {
    setIsDeleteMode(prev => !prev);
    setError(null);
  }, []);

  // 수주 검색 모달 열기
  const handleOpenOrderSearch = useCallback(() => {
    setShowOrderSearch(true);
  }, []);

  // 수주 검색 모달 닫기
  const handleCloseOrderSearch = useCallback(() => {
    setShowOrderSearch(false);
  }, []);

  // 수주 선택 시 폼 데이터 업데이트
  const handleOrderSelect = useCallback((order: any) => {
    setCurrentFormData(prev => ({
      ...prev,
      orderId: order.orderId,
      customerName: order.customerName,
      productCode: order.productCode,
      productName: order.productName,
      quantity: order.orderQuantity || 0
    }));
  }, []);

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
      zIndex: 50,
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
        maxWidth: '768px',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        {/* 모달 헤더 */}
        <div style={{
          padding: '32px',
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 009.586 13H7" />
                </svg>
              </div>
              <div>
                <h3 style={{ 
                  fontSize: '24px', 
                  fontWeight: 'bold', 
                  color: 'white',
                  margin: 0
                }}>
                  {isDeleteMode ? '출하 정보 삭제' : editingId ? '출하 정보 수정' : '새 출하 추가'}
                </h3>
                <p style={{ 
                  color: '#fecaca', 
                  marginTop: '4px',
                  margin: 0
                }}>
                  {isDeleteMode ? '정말로 이 출하 정보를 삭제하시겠습니까?' : editingId ? '기존 출하 정보를 수정합니다' : '수주관리 기반으로 새로운 출하 정보를 입력합니다'}
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

        {/* 모달 바디 */}
        <div style={{ padding: '32px' }}>
          {/* 에러 메시지 */}
          {error && (
            <div style={{
              padding: '12px 16px',
              backgroundColor: '#fef2f2',
              color: '#dc2626',
              borderRadius: '8px',
              marginBottom: '24px',
              border: '1px solid #fecaca'
            }}>
              ⚠️ {error}
            </div>
          )}

          {isDeleteMode ? (
            /* 삭제 확인 폼 */
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{
                fontSize: '48px',
                color: '#ef4444',
                marginBottom: '16px'
              }}>
                ⚠️
              </div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#374151',
                marginBottom: '8px'
              }}>
                출하 정보를 삭제하시겠습니까?
              </h3>
              <p style={{
                color: '#6b7280',
                marginBottom: '32px'
              }}>
                이 작업은 되돌릴 수 없습니다.
              </p>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '16px'
              }}>
                <button
                  type="button"
                  onClick={toggleDeleteMode}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    borderRadius: '12px',
                    fontWeight: '600',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={loading}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: loading ? '#9ca3af' : '#ef4444',
                    color: 'white',
                    borderRadius: '12px',
                    fontWeight: '600',
                    border: 'none',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {loading ? '삭제 중...' : '삭제'}
                </button>
              </div>
            </div>
          ) : (
            /* 일반 폼 */
            <form style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px'
            }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#374151', 
                  marginBottom: '8px' 
                }}>출하 ID</label>
                <input
                  type="text"
                  name="shipmentId"
                  value={currentFormData.shipmentId || ''}
                  onChange={handleInputChange}
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
                    e.target.style.borderColor = '#ef4444';
                    e.target.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                  }}
                  placeholder="SH001"
                />
              </div>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#374151', 
                  marginBottom: '8px' 
                }}>수주 ID *</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="text"
                    name="orderId"
                    value={currentFormData.orderId || ''}
                    onChange={handleInputChange}
                    style={{
                      flex: 1,
                      padding: '12px 16px',
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
                    placeholder="ORDER2024001"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleOpenOrderSearch}
                    style={{
                      padding: '12px 16px',
                      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                      color: 'white',
                      borderRadius: '12px',
                      fontWeight: '600',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)';
                      e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
                      e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                    }}
                  >
                    검색
                  </button>
                </div>
              </div>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#374151', 
                  marginBottom: '8px' 
                }}>고객명 *</label>
                <input
                  type="text"
                  name="customerName"
                  value={currentFormData.customerName || ''}
                  onChange={handleInputChange}
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
                    e.target.style.borderColor = '#ef4444';
                    e.target.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                  }}
                  placeholder="삼성전자"
                  required
                />
              </div>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#374151', 
                  marginBottom: '8px' 
                }}>제품코드 *</label>
                <input
                  type="text"
                  name="productCode"
                  value={currentFormData.productCode || ''}
                  onChange={handleInputChange}
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
                    e.target.style.borderColor = '#ef4444';
                    e.target.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                  }}
                  placeholder="PROD001"
                  required
                />
              </div>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#374151', 
                  marginBottom: '8px' 
                }}>제품명 *</label>
                <input
                  type="text"
                  name="productName"
                  value={currentFormData.productName || ''}
                  onChange={handleInputChange}
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
                    e.target.style.borderColor = '#ef4444';
                    e.target.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                  }}
                  placeholder="스마트폰 케이스"
                  required
                />
              </div>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#374151', 
                  marginBottom: '8px' 
                }}>수량 *</label>
                <input
                  type="text"
                  name="quantity"
                  value={formatNumber(currentFormData.quantity)}
                  onChange={handleInputChange}
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
                    e.target.style.borderColor = '#ef4444';
                    e.target.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                  }}
                  placeholder="1,000"
                  required
                />
              </div>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#374151', 
                  marginBottom: '8px' 
                }}>출하일 *</label>
                <input
                  type="date"
                  name="shipmentDate"
                  value={currentFormData.shipmentDate || ''}
                  onChange={handleInputChange}
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
                    e.target.style.borderColor = '#ef4444';
                    e.target.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                  }}
                  required
                />
              </div>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#374151', 
                  marginBottom: '8px' 
                }}>예상 납기일 *</label>
                <input
                  type="date"
                  name="expectedDeliveryDate"
                  value={currentFormData.expectedDeliveryDate || ''}
                  onChange={handleInputChange}
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
                    e.target.style.borderColor = '#ef4444';
                    e.target.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                  }}
                  required
                />
              </div>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#374151', 
                  marginBottom: '8px' 
                }}>실제 납기일</label>
                <input
                  type="date"
                  name="actualDeliveryDate"
                  value={currentFormData.actualDeliveryDate || ''}
                  onChange={handleInputChange}
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
                    e.target.style.borderColor = '#ef4444';
                    e.target.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                  }}
                />
              </div>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#374151', 
                  marginBottom: '8px' 
                }}>상태 *</label>
                <select
                  name="status"
                  value={currentFormData.status || ''}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '12px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                    backgroundColor: 'white'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#ef4444';
                    e.target.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                  }}
                  required
                >
                  <option value="">선택하세요</option>
                  <option value="preparing">준비중</option>
                  <option value="shipped">출하</option>
                  <option value="in_transit">배송중</option>
                  <option value="delivered">배송완료</option>
                  <option value="cancelled">취소</option>
                </select>
              </div>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#374151', 
                  marginBottom: '8px' 
                }}>우선순위 *</label>
                <select
                  name="priority"
                  value={currentFormData.priority || ''}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '12px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                    backgroundColor: 'white'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#ef4444';
                    e.target.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                  }}
                  required
                >
                  <option value="">선택하세요</option>
                  <option value="low">낮음</option>
                  <option value="normal">보통</option>
                  <option value="high">높음</option>
                  <option value="urgent">긴급</option>
                </select>
              </div>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#374151', 
                  marginBottom: '8px' 
                }}>운송사 *</label>
                <input
                  type="text"
                  name="carrier"
                  value={currentFormData.carrier || ''}
                  onChange={handleInputChange}
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
                    e.target.style.borderColor = '#ef4444';
                    e.target.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                  }}
                  placeholder="CJ대한통운"
                  required
                />
              </div>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#374151', 
                  marginBottom: '8px' 
                }}>운송장 번호</label>
                <input
                  type="text"
                  name="trackingNumber"
                  value={currentFormData.trackingNumber || ''}
                  onChange={handleInputChange}
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
                    e.target.style.borderColor = '#ef4444';
                    e.target.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                  }}
                  placeholder="1234567890"
                />
              </div>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#374151', 
                  marginBottom: '8px' 
                }}>배송 주소 *</label>
                <input
                  type="text"
                  name="shippingAddress"
                  value={currentFormData.shippingAddress || ''}
                  onChange={handleInputChange}
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
                    e.target.style.borderColor = '#ef4444';
                    e.target.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                  }}
                  placeholder="경기도 수원시 영통구 삼성로 129"
                  required
                />
              </div>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#374151', 
                  marginBottom: '8px' 
                }}>배송비 *</label>
                <input
                  type="text"
                  name="shippingCost"
                  value={formatNumber(currentFormData.shippingCost)}
                  onChange={handleInputChange}
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
                    e.target.style.borderColor = '#ef4444';
                    e.target.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                  }}
                  placeholder="50,000"
                  required
                />
              </div>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#374151', 
                  marginBottom: '8px' 
                }}>담당자 *</label>
                <input
                  type="text"
                  name="responsiblePerson"
                  value={currentFormData.responsiblePerson || ''}
                  onChange={handleInputChange}
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
                    e.target.style.borderColor = '#ef4444';
                    e.target.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                  }}
                  placeholder="김출하"
                  required
                />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#374151', 
                  marginBottom: '8px' 
                }}>비고</label>
                <input
                  type="text"
                  name="notes"
                  value={currentFormData.notes || ''}
                  onChange={handleInputChange}
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
                    e.target.style.borderColor = '#ef4444';
                    e.target.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                  }}
                  placeholder="수주관리 연계 정보를 입력하세요"
                />
              </div>
            </div>

            {/* 버튼 영역 */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '24px',
              borderTop: '1px solid #e5e7eb'
            }}>
              {/* 삭제 버튼 (수정 모드일 때만 표시) */}
              {editingId && !isDeleteMode && (
                <button
                  type="button"
                  onClick={toggleDeleteMode}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#fef2f2',
                    color: '#dc2626',
                    borderRadius: '12px',
                    fontWeight: '600',
                    border: '1px solid #fecaca',
                    cursor: 'pointer',
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#fee2e2';
                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#fef2f2';
                    e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                  }}
                >
                  삭제
                </button>
              )}

              <div style={{ display: 'flex', gap: '16px', marginLeft: 'auto' }}>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: loading ? '#f3f4f6' : '#f3f4f6',
                    color: loading ? '#9ca3af' : '#374151',
                    borderRadius: '12px',
                    fontWeight: '600',
                    border: 'none',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={loading}
                  style={{
                    padding: '12px 24px',
                    background: loading ? '#9ca3af' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    color: 'white',
                    borderRadius: '12px',
                    fontWeight: '600',
                    border: 'none',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {loading ? '처리 중...' : editingId ? '수정 완료' : '추가 완료'}
                </button>
              </div>
            </div>
          </form>
          )}
        </div>
      </div>

      {/* 수주 검색 모달 */}
      <OrderSearchModal
        show={showOrderSearch}
        onClose={handleCloseOrderSearch}
        onSelect={handleOrderSelect}
      />
    </div>
  );
};

export default ShipmentModal;

import React from 'react';
import { ProductionPlanData } from '../../types/productionPlan';

interface ProductionPlanModalProps {
  show: boolean;
  editingId: number | null;
  formData: Partial<ProductionPlanData>;
  onClose: () => void;
  onSave: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const ProductionPlanModal: React.FC<ProductionPlanModalProps> = ({ 
  show, 
  editingId, 
  formData, 
  onClose, 
  onSave, 
  onInputChange 
}) => {
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
          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
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
                  fontSize: '24px', 
                  fontWeight: 'bold', 
                  color: 'white',
                  margin: 0
                }}>
                  {editingId ? '생산계획 정보 수정' : '새 생산계획 추가'}
                </h3>
                <p style={{ 
                  color: '#bfdbfe', 
                  marginTop: '4px',
                  margin: 0
                }}>
                  {editingId ? '기존 생산계획 정보를 수정합니다' : '새로운 생산계획 정보를 입력합니다'}
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
                e.currentTarget.style.color = '#bfdbfe';
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
                }}>계획 ID *</label>
                <input
                  type="text"
                  name="planId"
                  value={formData.planId || ''}
                  onChange={onInputChange}
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
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                  }}
                  placeholder="PLAN2024001"
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
                  value={formData.productCode || ''}
                  onChange={onInputChange}
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
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
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
                  value={formData.productName || ''}
                  onChange={onInputChange}
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
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                  }}
                  placeholder="제품명을 입력하세요"
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
                }}>계획 수량 *</label>
                <input
                  type="number"
                  name="planQuantity"
                  value={formData.planQuantity || ''}
                  onChange={onInputChange}
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
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                  }}
                  placeholder="계획 수량을 입력하세요"
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
                }}>계획 시작일 *</label>
                <input
                  type="date"
                  name="plannedStartDate"
                  value={formData.plannedStartDate || ''}
                  onChange={onInputChange}
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
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
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
                }}>계획 완료일 *</label>
                <input
                  type="date"
                  name="plannedEndDate"
                  value={formData.plannedEndDate || ''}
                  onChange={onInputChange}
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
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
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
                }}>상태 *</label>
                <select
                  name="status"
                  value={formData.status || ''}
                  onChange={onInputChange}
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
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                  }}
                  required
                >
                  <option value="">선택하세요</option>
                  <option value="planned">계획</option>
                  <option value="in_progress">진행중</option>
                  <option value="completed">완료</option>
                  <option value="cancelled">취소</option>
                  <option value="on_hold">보류</option>
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
                  value={formData.priority || ''}
                  onChange={onInputChange}
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
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                  }}
                  required
                >
                  <option value="">선택하세요</option>
                  <option value="low">낮음</option>
                  <option value="medium">보통</option>
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
                }}>작업센터 *</label>
                <input
                  type="text"
                  name="workCenter"
                  value={formData.workCenter || ''}
                  onChange={onInputChange}
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
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                  }}
                  placeholder="작업센터를 입력하세요"
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
                  value={formData.responsiblePerson || ''}
                  onChange={onInputChange}
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
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                  }}
                  placeholder="담당자명을 입력하세요"
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
                }}>예상 작업시간 *</label>
                <input
                  type="number"
                  name="estimatedHours"
                  value={formData.estimatedHours || ''}
                  onChange={onInputChange}
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
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                  }}
                  placeholder="예상 작업시간을 입력하세요"
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
                }}>실제 작업시간</label>
                <input
                  type="number"
                  name="actualHours"
                  value={formData.actualHours || ''}
                  onChange={onInputChange}
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
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                  }}
                  placeholder="실제 작업시간을 입력하세요"
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
                  value={formData.notes || ''}
                  onChange={onInputChange}
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
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                  }}
                  placeholder="비고를 입력하세요"
                />
              </div>
            </div>

            {/* 버튼 영역 */}
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '16px',
              paddingTop: '24px',
              borderTop: '1px solid #e5e7eb'
            }}>
              <button
                type="button"
                onClick={onClose}
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
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#e5e7eb';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                  e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                }}
              >
                취소
              </button>
              <button
                type="button"
                onClick={onSave}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  color: 'white',
                  borderRadius: '12px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)';
                  e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {editingId ? '수정 완료' : '추가 완료'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductionPlanModal;

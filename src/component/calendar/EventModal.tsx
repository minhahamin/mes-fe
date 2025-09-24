import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: 'production' | 'maintenance' | 'meeting' | 'inspection' | 'other';
  priority: 'high' | 'medium' | 'low';
  description?: string;
}

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<CalendarEvent, 'id'>) => void;
  onUpdate?: (event: CalendarEvent) => void;
  onDelete?: (eventId: string) => void;
  selectedDate?: Date;
  event?: CalendarEvent | null;
}

const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onUpdate,
  onDelete,
  selectedDate,
  event
}) => {
  const [formData, setFormData] = useState({
    title: '',
    date: selectedDate || new Date(),
    type: 'production' as CalendarEvent['type'],
    priority: 'medium' as CalendarEvent['priority'],
    description: ''
  });

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        date: event.date,
        type: event.type,
        priority: event.priority,
        description: event.description || ''
      });
    } else if (selectedDate) {
      setFormData(prev => ({
        ...prev,
        date: selectedDate
      }));
    }
  }, [event, selectedDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (event && onUpdate) {
      onUpdate({
        ...event,
        ...formData
      });
    } else {
      onSave(formData);
    }
    
    onClose();
  };

  const handleDelete = () => {
    if (event && onDelete) {
      onDelete(event.id);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
    >
      <div 
        style={{ 
          backgroundColor: 'white',
          borderRadius: '8px',
          maxWidth: '448px',
          width: '100%',
          position: 'relative', 
          zIndex: 10000,
          margin: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05), 0 10px 20px -5px rgba(0, 0, 0, 0.1)',
          transform: 'scale(1)',
          transition: 'all 0.3s ease-out'
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '24px',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#111827',
            margin: 0
          }}>
            {event ? '일정 수정' : '새 일정 추가'}
          </h3>
          <button
            onClick={onClose}
            style={{
              color: '#9ca3af',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'color 0.2s ease',
              padding: '8px',
              borderRadius: '50%'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = '#6b7280';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = '#9ca3af';
            }}
          >
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>×</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          {/* 그리드 레이아웃 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '54px',
            width: '90%',
            marginBottom: '24px'
          }}>
            {/* 제목 */}
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                <span style={{
                  width: '4px',
                  height: '16px',
                  backgroundColor: '#3b82f6',
                  borderRadius: '2px',
                  marginRight: '8px'
                }}></span>
                제목 *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: '#f9fafb',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.backgroundColor = 'white';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.backgroundColor = '#f9fafb';
                  e.target.style.boxShadow = 'none';
                }}
                placeholder="일정 제목을 입력하세요"
                required
              />
            </div>

            {/* 날짜 */}
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                <span style={{
                  width: '4px',
                  height: '16px',
                  backgroundColor: '#22c55e',
                  borderRadius: '2px',
                  marginRight: '8px'
                }}></span>
                날짜 *
              </label>
              <input
                type="date"
                value={format(formData.date, 'yyyy-MM-dd')}
                onChange={(e) => setFormData(prev => ({ ...prev, date: new Date(e.target.value) }))}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: '#f9fafb',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#22c55e';
                  e.target.style.backgroundColor = 'white';
                  e.target.style.boxShadow = '0 0 0 3px rgba(34, 197, 94, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.backgroundColor = '#f9fafb';
                  e.target.style.boxShadow = 'none';
                }}
                required
              />
            </div>

            {/* 유형 */}
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                <span style={{
                  width: '4px',
                  height: '16px',
                  backgroundColor: '#8b5cf6',
                  borderRadius: '2px',
                  marginRight: '8px'
                }}></span>
                유형
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as CalendarEvent['type'] }))}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: '#f9fafb',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#8b5cf6';
                  e.target.style.backgroundColor = 'white';
                  e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.backgroundColor = '#f9fafb';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <option value="production">🏭 생산</option>
                <option value="maintenance">🔧 점검</option>
                <option value="meeting">👥 회의</option>
                <option value="inspection">🔍 검사</option>
                <option value="other">📝 기타</option>
              </select>
            </div>

            {/* 우선순위 */}
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                <span style={{
                  width: '4px',
                  height: '16px',
                  backgroundColor: '#f97316',
                  borderRadius: '2px',
                  marginRight: '8px'
                }}></span>
                우선순위
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as CalendarEvent['priority'] }))}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: '#f9fafb',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#f97316';
                  e.target.style.backgroundColor = 'white';
                  e.target.style.boxShadow = '0 0 0 3px rgba(249, 115, 22, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.backgroundColor = '#f9fafb';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <option value="low">🟢 낮음</option>
                <option value="medium">🟡 보통</option>
                <option value="high">🔴 높음</option>
              </select>
            </div>
          </div>

          {/* 설명 - 전체 너비 */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              <span style={{
                width: '4px',
                height: '16px',
                backgroundColor: '#6366f1',
                borderRadius: '2px',
                marginRight: '8px'
              }}></span>
              설명
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              style={{
                width: '87%',
                padding: '12px 16px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                backgroundColor: '#f9fafb',
                transition: 'all 0.2s ease',
                resize: 'none',
                fontFamily: 'inherit'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#6366f1';
                e.target.style.backgroundColor = 'white';
                e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.backgroundColor = '#f9fafb';
                e.target.style.boxShadow = 'none';
              }}
              placeholder="일정에 대한 설명을 입력하세요"
            />
          </div>

          {/* 버튼 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '16px',
            borderTop: '1px solid #e5e7eb'
          }}>
            <div>
              {event && onDelete && (
                <button
                  type="button"
                  onClick={handleDelete}
                  style={{
                    padding: '8px 16px',
                    color: '#dc2626',
                    backgroundColor: 'transparent',
                    border: 'none',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.color = '#991b1b';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.color = '#dc2626';
                  }}
                >
                  삭제
                </button>
              )}
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '8px 16px',
                  color: '#6b7280',
                  backgroundColor: 'transparent',
                  border: 'none',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'color 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = '#374151';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = '#6b7280';
                }}
              >
                취소
              </button>
              <button
                type="submit"
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  borderRadius: '6px',
                  border: 'none',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#1d4ed8';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#2563eb';
                }}
              >
                {event ? '수정' : '추가'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;

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
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4" 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div 
        className="bg-white rounded-lg max-w-md  transform transition-all duration-300 ease-out scale-100" 
        style={{ 
          position: 'relative', 
          zIndex: 10000,
          margin: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05), 0 10px 20px -5px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {event ? '일정 수정' : '새 일정 추가'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors bg-red-500"
          >
            <span className="text-gray-400 hover:text-gray-600 transition-colors  rounded-full p-2">
              X
            </span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 제목 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <span className="w-1 h-4 bg-blue-500 rounded-full mr-2"></span>
              제목 *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
              placeholder="일정 제목을 입력하세요"
              required
            />
          </div>

          {/* 날짜 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <span className="w-1 h-4 bg-green-500 rounded-full mr-2"></span>
              날짜 *
            </label>
            <input
              type="date"
              value={format(formData.date, 'yyyy-MM-dd')}
              onChange={(e) => setFormData(prev => ({ ...prev, date: new Date(e.target.value) }))}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white"
              required
            />
          </div>

          {/* 유형 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <span className="w-1 h-4 bg-purple-500 rounded-full mr-2"></span>
              유형
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as CalendarEvent['type'] }))}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 focus:bg-white"
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
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <span className="w-1 h-4 bg-orange-500 rounded-full mr-2"></span>
              우선순위
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as CalendarEvent['priority'] }))}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-gray-50 focus:bg-white"
            >
              <option value="low">🟢 낮음</option>
              <option value="medium">🟡 보통</option>
              <option value="high">🔴 높음</option>
            </select>
          </div>

          {/* 설명 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <span className="w-1 h-4 bg-indigo-500 rounded-full mr-2"></span>
              설명
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white resize-none"
              placeholder="일정에 대한 설명을 입력하세요"
            />
          </div>

          {/* 버튼 */}
          <div className="flex items-center justify-between pt-4">
            <div>
              {event && onDelete && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-4 py-2 text-red-600 hover:text-red-800 font-medium transition-colors"
                >
                  삭제
                </button>
              )}
            </div>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors"
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

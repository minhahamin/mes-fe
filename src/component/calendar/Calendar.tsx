import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendar.css';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: 'production' | 'maintenance' | 'meeting' | 'inspection' | 'other';
  priority: 'high' | 'medium' | 'low';
  description?: string;
}

interface CalendarProps {
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  onDateClick?: (date: Date) => void;
  onAddEvent?: (date: Date) => void;
}

const CustomCalendar: React.FC<CalendarProps> = ({ events, onEventClick, onDateClick, onAddEvent }) => {
  const [value, onChange] = useState(new Date());

  const handlePrevMonth = () => {
    // 이전 달로 이동
    const newDate = new Date(value.getFullYear(), value.getMonth() - 1, 1);
    onChange(newDate);
  };

  const handleNextMonth = () => {
    // 다음 달로 이동
    const newDate = new Date(value.getFullYear(), value.getMonth() + 1, 1);
    onChange(newDate);
  };

  const getEventTypeColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'production': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'meeting': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'inspection': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: CalendarEvent['priority']) => {
    switch (priority) {
      case 'high': return 'border-l-4 border-red-500';
      case 'medium': return 'border-l-4 border-yellow-500';
      case 'low': return 'border-l-4 border-green-500';
      default: return 'border-l-4 border-gray-300';
    }
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear()
    );
  };

  const handleDateClick = (date: Date) => {
    if (onDateClick) {
      onDateClick(date);
    }
  };

  const handleEventClick = (event: CalendarEvent) => {
    if (onEventClick) {
      onEventClick(event);
    }
  };

  const handleAddEvent = (date: Date) => {
    if (onAddEvent) {
      onAddEvent(date);
    }
  };

  return (
    <div className="bg-white">
      {/* 이전/다음 달 버튼 */}
      <div className="flex justify-center items-center mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-3 hover:bg-gray-100 rounded-lg transition-colors mr-6 border border-gray-200 hover:border-gray-300"
          title="이전 달"
        >
           <span className="text-gray-700">◀</span>
        </button>
        <h2 className="text-3xl font-bold text-blue-600 mx-6 mr-6">
          {value.getMonth() + 1}월
        </h2>
        <button
          onClick={handleNextMonth}
          className="p-3 hover:bg-gray-100 rounded-lg transition-colors ml-6 border border-gray-200 hover:border-gray-300"
          title="다음 달"
        >
          {/* <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg> */}
          <span className="text-gray-700">▶</span>
        </button>
      </div>

      <Calendar
        onChange={(value: any, event: React.MouseEvent<HTMLButtonElement>) => {
          if (value instanceof Date) {
            onChange(value);
          }
        }}
        value={value}
        onClickDay={handleDateClick}
        className="react-calendar"
        calendarType="gregory"
        formatShortWeekday={(locale, date) => {
          const weekdays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
          return weekdays[date.getDay()];
        }}
        formatMonthYear={(locale, date) => {
          return `${date.getMonth() + 1}월`;
        }}
        tileContent={({ date, view }: { date: Date; view: string }) => {
          // 기본 날짜 표시를 사용하므로 추가 내용 없음
          return null;
        }}
        tileClassName={({ date, view }: { date: Date; view: string }) => {
          if (view === 'month') {
            const isWeekend = date.getDay() === 0 || date.getDay() === 6;
            const isToday = date.toDateString() === new Date().toDateString();
            const dayNumber = date.getDate();
            
            return `
              ${isWeekend || dayNumber === 6 ? 'text-red-600' : 'text-blue-600'}
              ${isToday ? 'bg-blue-50' : ''}
            `;
          }
          return '';
        }}
      />
    </div>
  );
};

export default CustomCalendar;
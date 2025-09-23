import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendar.css';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  endDate?: Date; // 범위 이벤트를 위한 종료 날짜
  type: 'production' | 'maintenance' | 'meeting' | 'inspection' | 'other';
  priority: 'high' | 'medium' | 'low';
  description?: string;
  isRange?: boolean; // 범위 이벤트 여부
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
    return events.filter(event => {
      const eventDate = event.date;
      const eventEndDate = event.endDate || event.date;
      
      // 범위 이벤트인 경우
      if (event.isRange && event.endDate) {
        return date >= eventDate && date <= eventEndDate;
      }
      
      // 일반 이벤트인 경우
      return eventDate.getDate() === date.getDate() &&
             eventDate.getMonth() === date.getMonth() &&
             eventDate.getFullYear() === date.getFullYear();
    });
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
          {value.getFullYear()}년 {value.getMonth() + 1}월
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
        onChange={(value: any) => {
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
          if (view === 'month') {
            const dayEvents = getEventsForDate(date);
            return (
              <div className="flex flex-col h-full">
                {/* 이벤트 목록만 표시 (날짜는 react-calendar가 자동 표시) */}
                {dayEvents.length > 0 && (
                  <div className="space-y-1 w-full mt-1">
                    {dayEvents.slice(0, 2).map((event) => {
                      const isRangeStart = event.isRange && event.date.getTime() === date.getTime();
                      const isRangeEnd = event.isRange && event.endDate && event.endDate.getTime() === date.getTime();
                      const isRangeMiddle = event.isRange && event.endDate && 
                        date > event.date && date < event.endDate;
                      
                      return (
                        <div
                          key={event.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEventClick(event);
                          }}
                          className={`
                            text-xs p-1 rounded cursor-pointer truncate border-l-2
                            ${getEventTypeColor(event.type)}
                            ${getPriorityColor(event.priority)}
                            hover:shadow-sm
                            ${isRangeStart ? 'rounded-l-none' : ''}
                            ${isRangeEnd ? 'rounded-r-none' : ''}
                            ${isRangeMiddle ? 'rounded-none' : ''}
                          `}
                          title={event.title}
                        >
                          {isRangeStart && event.isRange ? event.title : 
                           isRangeMiddle ? '' : 
                           isRangeEnd ? event.title : event.title}
                        </div>
                      );
                    })}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-gray-500 text-center">
                        +{dayEvents.length - 2}개 더
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          }
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
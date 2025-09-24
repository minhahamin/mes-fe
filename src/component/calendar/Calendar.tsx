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
      case 'production': return { backgroundColor: '#dbeafe', color: '#1e40af', borderColor: '#bfdbfe' };
      case 'maintenance': return { backgroundColor: '#fef3c7', color: '#92400e', borderColor: '#fde68a' };
      case 'meeting': return { backgroundColor: '#e9d5ff', color: '#6b21a8', borderColor: '#d8b4fe' };
      case 'inspection': return { backgroundColor: '#dcfce7', color: '#166534', borderColor: '#bbf7d0' };
      default: return { backgroundColor: '#f3f4f6', color: '#374151', borderColor: '#d1d5db' };
    }
  };

  const getPriorityColor = (priority: CalendarEvent['priority']) => {
    switch (priority) {
      case 'high': return { borderLeft: '4px solid #ef4444' };
      case 'medium': return { borderLeft: '4px solid #eab308' };
      case 'low': return { borderLeft: '4px solid #22c55e' };
      default: return { borderLeft: '4px solid #d1d5db' };
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
    <div style={{ backgroundColor: 'white' }}>
      {/* 이전/다음 달 버튼 */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        <button
          onClick={handlePrevMonth}
          style={{
            padding: '12px',
            backgroundColor: 'transparent',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            marginRight: '24px'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#f3f4f6';
            e.currentTarget.style.borderColor = '#d1d5db';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.borderColor = '#e5e7eb';
          }}
          title="이전 달"
        >
           <span style={{ color: '#374151', fontSize: '16px' }}>◀</span>
        </button>
        <h2 style={{
          fontSize: '30px',
          fontWeight: 'bold',
          color: '#2563eb',
          margin: '0 24px'
        }}>
          {value.getFullYear()}년 {value.getMonth() + 1}월
        </h2>
        <button
          onClick={handleNextMonth}
          style={{
            padding: '12px',
            backgroundColor: 'transparent',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            marginLeft: '24px'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#f3f4f6';
            e.currentTarget.style.borderColor = '#d1d5db';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.borderColor = '#e5e7eb';
          }}
          title="다음 달"
        >
          <span style={{ color: '#374151', fontSize: '16px' }}>▶</span>
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
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                height: '100%',
                width: '100%',
                alignItems: 'flex-end'
              }}>
                {/* 이벤트 목록을 날짜 숫자 아래에 표시 */}
                {dayEvents.length > 0 && (
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '2px', 
                    width: '100%',
                    marginTop: 'auto',
                    paddingTop: '4px',
                    maxHeight: '60px',
                    overflowY: 'auto',
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#cbd5e1 transparent'
                  }}>
                    {dayEvents.map((event) => {
                      const isRangeStart = event.isRange && event.date.getTime() === date.getTime();
                      const isRangeEnd = event.isRange && event.endDate && event.endDate.getTime() === date.getTime();
                      const isRangeMiddle = event.isRange && event.endDate && 
                        date > event.date && date < event.endDate;
                      
                      const typeColors = getEventTypeColor(event.type);
                      const priorityColors = getPriorityColor(event.priority);
                      
                      return (
                        <div
                          key={event.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEventClick(event);
                          }}
                          style={{
                            fontSize: '10px',
                            padding: '2px 4px',
                            borderRadius: isRangeStart ? '3px 0 0 3px' : 
                                         isRangeEnd ? '0 3px 3px 0' : 
                                         isRangeMiddle ? '0' : '3px',
                            cursor: 'pointer',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            width: '100%',
                            flexShrink: 0,
                            ...typeColors,
                            ...priorityColors,
                            transition: 'box-shadow 0.2s ease'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                          title={event.title}
                        >
                          {isRangeStart && event.isRange ? event.title : 
                           isRangeMiddle ? '' : 
                           isRangeEnd ? event.title : event.title}
                        </div>
                      );
                    })}
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
            
            // 인라인 스타일을 위한 클래스명 반환 (react-calendar의 기본 스타일링 유지)
            return `
              ${isWeekend || dayNumber === 6 ? 'weekend-day' : 'weekday-day'}
              ${isToday ? 'today-day' : ''}
            `;
          }
          return '';
        }}
      />
    </div>
  );
};

export default CustomCalendar;
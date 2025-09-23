import React, { useState, useEffect } from 'react';
import Button from '../component/common/button';
import Calendar from '../component/calendar/Calendar';
import EventModal from '../component/calendar/EventModal';

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

const Dashboard: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // 샘플 이벤트 데이터 로딩
  useEffect(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    setEvents([
      // 1일
      {
        id: '1',
        title: '프로젝트 착수 준비',
        date: new Date(currentYear, currentMonth, 1),
        type: 'meeting',
        priority: 'high',
        description: '프로젝트 착수 준비 작업'
      },
      {
        id: '2',
        title: '전략분석',
        date: new Date(currentYear, currentMonth, 1),
        type: 'inspection',
        priority: 'high',
        description: '전략 분석 및 검토'
      },
      
      // 3일
      {
        id: '3',
        title: '9a 그룹 웹 전략 수립',
        date: new Date(currentYear, currentMonth, 3),
        type: 'meeting',
        priority: 'high',
        description: '그룹 웹 전략 수립 회의'
      },
      
      // 7일
      {
        id: '4',
        title: '2p Web 전략 심화',
        date: new Date(currentYear, currentMonth, 7),
        type: 'meeting',
        priority: 'medium',
        description: '웹 전략 심화 회의'
      },
      {
        id: '5',
        title: '3p Group Web Structure',
        date: new Date(currentYear, currentMonth, 7),
        type: 'production',
        priority: 'high',
        description: '그룹 웹 구조 설계'
      },
      
      // 11일 (특별한 날 - 여러 이벤트)
      {
        id: '6',
        title: '2p Group Web Structure Mo',
        date: new Date(currentYear, currentMonth, 11),
        type: 'production',
        priority: 'high',
        description: '그룹 웹 구조 모바일'
      },
      {
        id: '7',
        title: '5p 마케팅 전략 수립',
        date: new Date(currentYear, currentMonth, 11),
        type: 'meeting',
        priority: 'high',
        description: '마케팅 전략 수립'
      },
      {
        id: '8',
        title: '6p 클라이언트 니즈 분석',
        date: new Date(currentYear, currentMonth, 11),
        type: 'inspection',
        priority: 'high',
        description: '클라이언트 니즈 분석'
      },
      
      // 24-25일 범위 이벤트 (일정추가)
      {
        id: '13',
        title: '일정추가',
        date: new Date(currentYear, currentMonth, 24),
        endDate: new Date(currentYear, currentMonth, 25),
        type: 'meeting',
        priority: 'medium',
        description: '일정 추가 작업',
        isRange: true
      },
      
      // 25일 추가 이벤트들
      {
        id: '14',
        title: '미라클 모닝',
        date: new Date(currentYear, currentMonth, 25),
        type: 'other',
        priority: 'low',
        description: '미라클 모닝 루틴'
      },
      {
        id: '15',
        title: '달력 프로젝트 완성',
        date: new Date(currentYear, currentMonth, 25),
        type: 'production',
        priority: 'high',
        description: '달력 프로젝트 완성'
      },
      
      // 15일
      {
        id: '9',
        title: '1p 서버 화면설계서 수정 보완',
        date: new Date(currentYear, currentMonth, 15),
        type: 'maintenance',
        priority: 'high',
        description: '서버 화면설계서 수정 보완'
      },
      
      // 21일
      {
        id: '10',
        title: '9:30a 사용자 화면 - 모바일',
        date: new Date(currentYear, currentMonth, 21),
        type: 'production',
        priority: 'high',
        description: '사용자 화면 모바일 개발'
      },
      
      // 28일
      {
        id: '11',
        title: '12:30p 상세화면 디자인 - 웹',
        date: new Date(currentYear, currentMonth, 28),
        type: 'production',
        priority: 'medium',
        description: '상세화면 디자인 웹'
      },
      
      // 30일
      {
        id: '12',
        title: '2:30p 고급 시스템 분석',
        date: new Date(currentYear, currentMonth, 30),
        type: 'inspection',
        priority: 'high',
        description: '고급 시스템 분석'
      }
    ]);
  }, []);

  // 이벤트 핸들러
  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsEventModalOpen(true);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setSelectedEvent(null);
    setIsEventModalOpen(true);
  };

  const handleAddEvent = (date: Date) => {
    setSelectedDate(date);
    setSelectedEvent(null);
    setIsEventModalOpen(true);
  };

  const handleSaveEvent = (eventData: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: Date.now().toString(),
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const handleUpdateEvent = (updatedEvent: CalendarEvent) => {
    setEvents(prev => prev.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    ));
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
  };


  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
             
             
            </div>
            <div className="flex space-x-3 p-4">
              <Button 
                variant="primary" 
                size="sm"
                onClick={() => handleAddEvent(new Date())}
              >
                새 일정 추가
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 - 달력만 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Calendar 
          events={events}
          onEventClick={handleEventClick}
          onDateClick={handleDateClick}
          onAddEvent={handleAddEvent}
        />
      </div>

      {/* 이벤트 모달 */}
      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => {
          setIsEventModalOpen(false);
          setSelectedEvent(null);
          setSelectedDate(null);
        }}
        onSave={handleSaveEvent}
        onUpdate={handleUpdateEvent}
        onDelete={handleDeleteEvent}
       // selectedDate={selectedDate}
        event={selectedEvent}
      />
    </div>
  );
};

export default Dashboard;

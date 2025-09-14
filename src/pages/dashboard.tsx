import React, { useState, useEffect } from 'react';
import Button from '../component/common/button';
import Calendar from '../component/calendar/Calendar';
import EventModal from '../component/calendar/EventModal';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: 'production' | 'maintenance' | 'meeting' | 'inspection' | 'other';
  priority: 'high' | 'medium' | 'low';
  description?: string;
}

const Dashboard: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // 샘플 이벤트 데이터 로딩 - 깔끔한 달력을 위해 이벤트 없음
  useEffect(() => {
    setEvents([]);
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
              <h1 className="text-2xl font-bold text-gray-900">일정 관리</h1>
              <p className="text-sm text-gray-600">MES 시스템 일정 관리</p>
            </div>
            <div className="flex space-x-3">
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

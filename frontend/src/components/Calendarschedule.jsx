import React, { useState } from 'react';

const CalendarScheduleViewer = () => {
  // State for the currently selected date
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Sample schedule data - in a real app, this would come from an API or database
  const scheduleData = {
    '2025-03-24': [
      { id: 1, time: '09:00 AM', title: 'Team Meeting', location: 'Conference Room A' },
      { id: 2, time: '11:30 AM', title: 'Client Call', location: 'Phone' },
      { id: 3, time: '01:00 PM', title: 'Lunch with Bob', location: 'Cafe Bistro' },
      { id: 4, time: '03:00 PM', title: 'Project Review', location: 'Office' }
    ],
    '2025-03-25': [
      { id: 1, time: '10:00 AM', title: 'Dentist Appointment', location: 'Dental Clinic' },
      { id: 2, time: '02:00 PM', title: 'Budget Planning', location: 'Meeting Room B' }
    ],
    '2025-03-26': [
      { id: 1, time: '08:30 AM', title: 'Breakfast Seminar', location: 'Hotel Convention Center' },
      { id: 2, time: '01:30 PM', title: 'Department Meeting', location: 'Auditorium' },
      { id: 3, time: '04:00 PM', title: 'Happy Hour', location: 'Downtown Bar' }
    ]
  };
  
  // Calendar generation functions
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();
  
  const generateCalendar = () => {
    const currentDate = new Date(selectedDate);
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    
    // Calendar header
    const calendarHeader = (
      <div className="flex items-center justify-between mb-4">
        <button
          className="p-2 rounded hover:bg-gray-200"
          onClick={() => setSelectedDate(new Date(year, month - 1, 1))}
        >
          &lt;
        </button>
        <div className="font-bold text-lg">
          {monthNames[month]} {year}
        </div>
        <button
          className="p-2 rounded hover:bg-gray-200"
          onClick={() => setSelectedDate(new Date(year, month + 1, 1))}
        >
          &gt;
        </button>
      </div>
    );
    
    // Days of the week header
    const daysHeader = (
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-center font-medium text-sm p-2">
            {day}
          </div>
        ))}
      </div>
    );
    
    // Calendar grid
    const calendarDays = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(
        <div key={`empty-${i}`} className="p-2 text-center text-gray-400"></div>
      );
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = date.toISOString().split('T')[0];
      const isToday = new Date().toDateString() === date.toDateString();
      const isSelected = selectedDate.toDateString() === date.toDateString();
      const hasEvents = scheduleData[dateString] && scheduleData[dateString].length > 0;
      
      calendarDays.push(
        <div
          key={`day-${day}`}
          className={`p-2 text-center cursor-pointer ${isSelected ? 'bg-blue-500 text-white rounded' : ''} ${isToday && !isSelected ? 'border border-blue-500 rounded' : ''} ${hasEvents && !isSelected ? 'font-bold' : ''} hover:bg-gray-200`}
          onClick={() => setSelectedDate(new Date(year, month, day))}
        >
          {day}
          {hasEvents && (
            <div className="w-1 h-1 bg-blue-500 rounded-full mx-auto mt-1"></div>
          )}
        </div>
      );
    }
    
    return (
      <div className="bg-white rounded shadow p-4">
        {calendarHeader}
        {daysHeader}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays}
        </div>
      </div>
    );
  };
  
  // Format selected date for display
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(selectedDate);
  
  // Get schedule for selected date
  const dateString = selectedDate.toISOString().split('T')[0];
  const daySchedule = scheduleData[dateString] || [];
  
  return (
    <div className="flex flex-col md:flex-row gap-6 p-4 max-w-6xl mx-auto">
      {/* Left side - Calendar */}
      <div className="w-full md:w-1/2">
        {generateCalendar()}
      </div>
      
      {/* Right side - Schedule */}
      <div className="w-full md:w-1/2 bg-white rounded shadow p-4">
        <h2 className="text-xl font-bold mb-4">Schedule for {formattedDate}</h2>
        
        {daySchedule.length > 0 ? (
          <div className="space-y-3">
            {daySchedule.map(event => (
              <div key={event.id} className="border-l-4 border-blue-500 pl-3 py-2">
                <div className="font-bold">{event.time}</div>
                <div className="text-lg">{event.title}</div>
                <div className="text-gray-600">{event.location}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 py-4 text-center">
            No events scheduled for this day
          </div>
        )}
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
            Add New Event
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarScheduleViewer;
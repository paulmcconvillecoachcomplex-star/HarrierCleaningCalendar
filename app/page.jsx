import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';

export default function BookingCalendar() {
  const [currentTab, setCurrentTab] = useState(0);
  const [bookings, setBookings] = useState({});
  const [selectedCell, setSelectedCell] = useState(null);
  const [guestName, setGuestName] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Generate months from November 2025 to December 2026
  const startDate = new Date(2025, 10, 1); // November 2025
  const months = [];
  let currentDate = new Date(startDate);
  
  while (currentDate <= new Date(2026, 11, 31)) {
    months.push(new Date(currentDate));
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const currentMonth = months[currentTab];
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const monthKey = `${year}-${month}`;

  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = (getFirstDayOfMonth(currentMonth) + 6) % 7; // Adjust for Monday start
  
  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  const handleCellClick = (day) => {
    if (day) {
      setSelectedCell(`${monthKey}-${day}`);
      const cellKey = `${monthKey}-${day}`;
      setGuestName(bookings[cellKey] || '');
      setShowModal(true);
    }
  };

  const saveBooking = () => {
    const newBookings = { ...bookings };
    if (guestName.trim()) {
      newBookings[selectedCell] = guestName;
    } else {
      delete newBookings[selectedCell];
    }
    setBookings(newBookings);
    setShowModal(false);
    setGuestName('');
  };

  const downloadCSV = () => {
    let csv = '111 By Mayfair Cleaning & Booking Schedule\n\n';
    
    months.forEach((month) => {
      const y = month.getFullYear();
      const m = month.getMonth();
      const mk = `${y}-${m}`;
      csv += `${monthNames[m]} ${y}\n`;
      csv += 'Date,Guest Name\n';
      
      const days = getDaysInMonth(month);
      for (let i = 1; i <= days; i++) {
        const cellKey = `${mk}-${i}`;
        const guest = bookings[cellKey] || '';
        csv += `${m + 1}/${i}/${y},${guest}\n`;
      }
      csv += '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', '111_mayfair_bookings.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <div className="bg-white rounded-lg shadow-xl p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">111 By Mayfair Cleaning & Booking Schedule</h1>
          <p className="text-gray-600">Track bookings and manage cleaning schedule</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setCurrentTab(Math.max(0, currentTab - 1))}
            disabled={currentTab === 0}
            className="p-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {months.map((month, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentTab(idx)}
                className={`px-4 py-2 rounded font-semibold whitespace-nowrap transition ${
                  currentTab === idx
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {monthNames[month.getMonth()].slice(0, 3)} {month.getFullYear()}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentTab(Math.min(months.length - 1, currentTab + 1))}
            disabled={currentTab === months.length - 1}
            className="p-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Current Month Display */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {monthNames[month]} {year}
          </h2>

          {/* Calendar Grid */}
          <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
            {/* Day Headers */}
            <div className="grid grid-cols-7 bg-indigo-600">
              {dayNames.map(day => (
                <div key={day} className="p-3 text-center font-bold text-white">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7">
              {calendarDays.map((day, idx) => {
                const cellKey = day ? `${monthKey}-${day}` : null;
                const booking = cellKey ? bookings[cellKey] : null;
                
                return (
                  <div
                    key={idx}
                    onClick={() => handleCellClick(day)}
                    className={`aspect-square p-2 border border-gray-200 cursor-pointer transition ${
                      !day
                        ? 'bg-gray-50'
                        : booking
                        ? 'bg-green-100 hover:bg-green-200'
                        : 'bg-white hover:bg-blue-50'
                    }`}
                  >
                    {day && (
                      <div className="h-full flex flex-col">
                        <div className="font-bold text-gray-800">{day}</div>
                        {booking && (
                          <div className="text-xs text-green-700 font-semibold truncate mt-1">
                            {booking}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Download Button */}
        <div className="flex justify-end">
          <button
            onClick={downloadCSV}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            <Download size={20} />
            Download as CSV
          </button>
        </div>
      </div>

      {/* Modal for Adding/Editing Bookings */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">
              {monthNames[month]} {selectedCell.split('-')[2]}, {year}
            </h3>
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Enter guest name or booking details"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-indigo-600"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setGuestName('');
                }}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg font-semibold hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={saveBooking}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

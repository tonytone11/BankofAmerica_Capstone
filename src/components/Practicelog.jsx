import React, { useState, useEffect } from 'react';
import '../styles/Practicelog.css';

// Component for the Practice Log tab
const PracticeLog = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [hours, setHours] = useState('');
  const [trainingData, setTrainingData] = useState({});
  const [monthlyTotal, setMonthlyTotal] = useState(0);

  // Update monthly total whenever training data changes
  useEffect(() => {
    calculateMonthlyTotal();
  }, [trainingData, currentMonth]);

  // Calculate total hours for the current month
  const calculateMonthlyTotal = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    let total = 0;
    Object.keys(trainingData).forEach(dateKey => {
      const date = new Date(dateKey);
      if (date.getFullYear() === year && date.getMonth() === month) {
        total += parseFloat(trainingData[dateKey]) || 0;
      }
    });
    
    setMonthlyTotal(total);
  };

  // Handle previous month navigation
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  // Handle next month navigation
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Get days in month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get day of week for first day of month (0 = Sunday, 6 = Saturday)
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  // Format date as YYYY-MM-DD for using as keys
  const formatDateKey = (date) => {
    return date.toISOString().split('T')[0];
  };

  // Handle date selection
  const handleDateClick = (day) => {
    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(selectedDate);
    
    // Initialize hours input with existing data or empty string
    const dateKey = formatDateKey(selectedDate);
    setHours(trainingData[dateKey] || '');
  };

  // Save training hours for selected date
  const saveHours = () => {
    if (selectedDate && hours) {
      const dateKey = formatDateKey(selectedDate);
      setTrainingData(prevData => ({
        ...prevData,
        [dateKey]: parseFloat(hours)
      }));
      
      // Reset input after saving
      setHours('');
      setSelectedDate(null);
    }
  };

  // Render calendar
  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    
    // Create blank spaces for days before first day of month
    const blanks = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      blanks.push(
        <div key={`blank-${i}`} className="calendar-day empty"></div>
      );
    }
    
    // Create days of the month
    const days = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateKey = formatDateKey(date);
      const hasData = dateKey in trainingData;
      
      days.push(
        <div 
          key={`day-${day}`} 
          className={`calendar-day ${hasData ? 'has-data' : ''}`}
          onClick={() => handleDateClick(day)}
        >
          <div className="day-number">{day}</div>
          {hasData && <div className="hours-badge">{trainingData[dateKey]}h</div>}
        </div>
      );
    }
    
    const totalSlots = [...blanks, ...days];
    const rows = [];
    let cells = [];
    
    totalSlots.forEach((day, i) => {
      if (i % 7 !== 0) {
        cells.push(day);
      } else {
        rows.push(cells);
        cells = [day];
      }
      if (i === totalSlots.length - 1) {
        rows.push(cells);
      }
    });
    
    // fetch hours from db so that users can always see them on calender
    const fetchHours = async () => {
      const token = localStorage.getItem('token');
  
      try {
          const response = await fetch('/profile/practice-log', {
              headers: {
                  'Authorization': `Bearer ${token}`, // ✅ Space after Bearer
                  'Content-Type': 'application/json'
              }
          });
  
          const responseText = await response.text(); // Read response as text
          console.log("Raw response:", responseText); // Debugging
  
          if (!response.ok) {
              throw new Error(`Server error: ${response.status} - ${responseText}`);
          }
  
          const data = JSON.parse(responseText); // Manually parse JSON
          console.log("Parsed JSON:", data); // Debugging
          setTrainingData(data);
  
      } catch (error) {
          console.error("Error fetching hours:", error);
      }
  };
  
  
  // Call fetchHours when the component mounts
  useEffect(() => {
      fetchHours();
  }, []);
  



    return (
      
      <div className="calendar-container">
        <div className="calendar-header">
          <button onClick={prevMonth} className="month-nav">&lt;</button>
          <h3>{monthNames[month]} {year}</h3>
          <button onClick={nextMonth} className="month-nav">&gt;</button>
        </div>
        
        <div className="calendar-weekdays">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>
        
        <div className="calendar-days">
          {rows.map((row, i) => (
            <div key={`row-${i}`} className="calendar-row">
              {row}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="practice-log">
      <h2>Practice Log</h2>
      
      {renderCalendar()}
      
      {selectedDate && (
        <div className="hours-input">
          <h4>Add Training Hours for {selectedDate.toLocaleDateString()}</h4>
          <div className="input-group">
            <input 
            className='calInput'
              type="number"
              min="0"
              step="0.5"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              placeholder="Enter hours"
            />
            <button onClick={saveHours} className="save-button">Save</button>
          </div>
        </div>
      )}
      
      <div className="monthly-summary">
        <h3>Monthly Summary</h3>
        <div className="summary-stats">
          <div className="summary-stat">
            <span className="stat-label">Total Hours:</span>
            <span className="stat-value">{monthlyTotal.toFixed(1)}</span>
          </div>
          <div className="summary-stat">
            <span className="stat-label">Average Per Day:</span>
            <span className="stat-value">
              {(monthlyTotal / getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth())).toFixed(1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticeLog;







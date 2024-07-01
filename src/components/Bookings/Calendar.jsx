import React, { useEffect, useState } from "react";
import "./Calendar.scss";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const Calendar = () => {
  const [today] = useState(new Date());
  const [activeDay, setActiveDay] = useState(today.getDate());
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [days, setDays] = useState([]);

  useEffect(() => {
    initCalendar();
  }, [month, year]);

  const initCalendar = () => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevLastDay = new Date(year, month, 0);
    const prevDays = prevLastDay.getDate();
    const lastDate = lastDay.getDate();
    const day = firstDay.getDay();
    const nextDays = 7 - lastDay.getDay() - 1;

    let daysArray = [];

    for (let x = day; x > 0; x--) {
      daysArray.push({ date: prevDays - x + 1, currentMonth: false });
    }

    for (let i = 1; i <= lastDate; i++) {
      daysArray.push({ date: i, currentMonth: true });
    }

    for (let j = 1; j <= nextDays; j++) {
      daysArray.push({ date: j, currentMonth: false });
    }

    setDays(daysArray);
  };

  const handleDayClick = (day) => {
    setActiveDay(day.date);
    if (!day.currentMonth) {
      if (day.date > 15) {
        prevMonth();
      } else {
        nextMonth();
      }
    }
  };

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  return (
    <div className="calendar">
      <div className="month">
        <FaChevronLeft className="cursor-pointer" onClick={prevMonth} />
        <div className="date">
          {months[month]} {year}
        </div>
        <FaChevronRight className="cursor-pointer" onClick={nextMonth} />
      </div>
      <div className="weekdays">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>
      <div className="days">
        {days.map((day, index) => (
          <div
            key={index}
            className={`day ${day.currentMonth ? "" : "other-month"} ${
              day.date === activeDay && day.currentMonth ? "active" : ""
            }`}
            onClick={() => handleDayClick(day)}
          >
            {day.date}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;

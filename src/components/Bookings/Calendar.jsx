import React, { useEffect, useState } from 'react'
import "./Calendar.scss"
import { FaChevronLeft } from "react-icons/fa6";
import { FaChevronRight } from "react-icons/fa6";

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
     const [today, setToday] = useState(new Date());
     const [activeDay, setActiveDay] = useState(today.getDate());
     const [month, setMonth] = useState(today.getMonth());
     const [year, setYear] = useState(today.getFullYear());

      const initCalendar = () => {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const prevLastDay = new Date(year, month, 0);
        const prevDays = prevLastDay.getDate();
        const lastDate = lastDay.getDate();
        const day = firstDay.getDay();
        const nextDays = 7 - lastDay.getDay() - 1;

        const dateElement = document.querySelector(".date");
        dateElement.innerHTML = months[month] + " " + year;

        let days = "";

        for (let x = day; x > 0; x--) {
          days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
        }

        for (let i = 1; i <= lastDate; i++) {
          let event = false;
          if (
            i === today.getDate() &&
            year === today.getFullYear() &&
            month === today.getMonth()
          ) {
            setActiveDay(i);
            getActiveDay(i);
            if (event) {
              days += `<div class="day today active event">${i}</div>`;
            } else {
              days += `<div class="day today active">${i}</div>`;
            }
          } else {
            if (event) {
              days += `<div class="day event">${i}</div>`;
            } else {
              days += `<div class="day">${i}</div>`;
            }
          }
        }

        for (let j = 1; j <= nextDays; j++) {
          days += `<div class="day next-date">${j}</div>`;
        }

        const daysContainer = document.querySelector(".days");
        daysContainer.innerHTML = days;
        addListner();
      };

      const addListner = () => {
        const days = document.querySelectorAll(".day");
        days.forEach((day) => {
          day.addEventListener("click", (e) => {
            getActiveDay(e.target.innerHTML);
            setActiveDay(Number(e.target.innerHTML));
            days.forEach((day) => {
              day.classList.remove("active");
            });
            if (e.target.classList.contains("prev-date")) {
              prevMonth();
              setTimeout(() => {
                const days = document.querySelectorAll(".day");
                days.forEach((day) => {
                  if (
                    !day.classList.contains("prev-date") &&
                    day.innerHTML === e.target.innerHTML
                  ) {
                    day.classList.add("active");
                  }
                });
              }, 100);
            } else if (e.target.classList.contains("next-date")) {
              nextMonth();
              setTimeout(() => {
                const days = document.querySelectorAll(".day");
                days.forEach((day) => {
                  if (
                    !day.classList.contains("next-date") &&
                    day.innerHTML === e.target.innerHTML
                  ) {
                    day.classList.add("active");
                  }
                });
              }, 100);
            } else {
              day.classList.add("active");
            }
          });
        });
      };

      const getActiveDay = (date) => {
        const day = new Date(year, month, date);
        const dayName = day.toString().split(" ")[0];
      };

    useEffect(() => {
      initCalendar();
    }, [month, today, year]);

    const prevMonth = () => {
      setMonth((prevMonth) => (prevMonth - 1 + 12) % 12);
      if (month === 0) {
        setYear((prevYear) => prevYear - 1);
      }
      initCalendar();
    };

    const nextMonth = () => {
      setMonth((prevMonth) => (prevMonth + 1) % 12);
      if (month === 11) {
        setYear((prevYear) => prevYear + 1);
      }
      initCalendar();
    };

  return (
    <div className="calendar">
      <div className="month">
        <FaChevronLeft className='cursor-pointer' onClick={prevMonth} />
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
      <div className="days"></div>
    
    </div>
  );
}

export default Calendar
import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { formatDate } from "@fullcalendar/core";
import { INITIAL_EVENTS, createEventId } from "./event-utils";
import { Button } from "@nextui-org/react";

const Calendar = () => {
  const [events, setEvents] = useState([
    {
      id: createEventId(),
      title: "Event 1",
      start: "2024-06-01T15:00:00",
      end: "2024-06-01T12:00:00",
    },
    {
      id: createEventId(),
      title: "Event 2",
      start: "2024-06-02T14:00:00",
      end: "2024-06-02T16:00:00",
    },
  ]);

   const [weekendsVisible, setWeekendsVisible] = useState(true);
   const [currentEvents, setCurrentEvents] = useState([]);

   function handleWeekendsToggle() {
     setWeekendsVisible(!weekendsVisible);
   }

   function handleEventClick(clickInfo) {
     console.log(clickInfo.event);
   }

   function handleEvents(events) {
     setCurrentEvents(events);
   }

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        initialView="dayGridWeek"
        selectMirror={true}
        dayMaxEvents={true}
        selectable={true}
        nowIndicator={true}
        navLinks={true}
        expandRows={true}
        // weekends={weekendsVisible}
        initialEvents={INITIAL_EVENTS}
        eventContent={renderEventContent}
        eventClick={handleEventClick}
        eventsSet={handleEvents} 
        eventBackgroundColor="#01ab8e"
        eventMouseEnter={handleEventClick}
        buttonText={{
          today: "Today",
          month: "Month",
          week: "Week",
          day: "Day",
        }}
        displayEventTime={true}
      />
    </>
  );
};

function renderEventContent(eventInfo) {
  return (
    <div className="cursor-pointer px-3 py-0.5">
      <b className="mr-1">
        {formatDate(eventInfo.event.start, {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })}
      </b>
      <i>{eventInfo.event.title}</i>
    </div>
  );
}

export default Calendar;

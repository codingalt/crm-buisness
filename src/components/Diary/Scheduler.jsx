import React, { useEffect, useState } from 'react'
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css"
import "./bigCalendar.scss"
import { useMediaQuery } from '@uidotdev/usehooks';

const localizer = momentLocalizer(moment);


const Scheduler = ({
  data,
  currentView,
  setCurrentView,
  setFilterDate,
  isLoading,
}) => {
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");

  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    if (data) {
      const transformedAppointments = data.filteredAppointments.map((item) => {
        const appointmentDate = moment(item.appointment_date);
        return {
          title: item.service.name,
          start: new Date(
            appointmentDate.year(),
            appointmentDate.month(),
            appointmentDate.date(),
            appointmentDate.hour(),
            appointmentDate.minute()
          ),
          end: new Date(
            appointmentDate.year(),
            appointmentDate.month(),
            appointmentDate.date(),
            appointmentDate.hour() + Math.floor(item.service.time / 60),
            appointmentDate.minute() + (item.service.time % 60)
          ),
          status: item.status,
        };
      });

      setAppointments(transformedAppointments);
    }
  }, [data]);

  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const eventPropGetter = (event) => {
    let backgroundColor = "";
    let color = "";
    let border = "";

    switch (event.status) {
      case 0:
        backgroundColor = "#ECF3F9"; // Pending
        color = "#212121";
        border = "1px solid #95c8f4";
        break;
      case 1:
        backgroundColor = "#fdf3f1"; // Active
        color = "#212121";
        border = "1px solid #edbeb4";
        break;
      case 2:
        backgroundColor = `#13d3b3`; // Finished
        border = "1px solid #01ab8e";
        break;
      default:
        backgroundColor = "#13d3b3"; // Default color
    }

    return { style: { backgroundColor, color, border } };
  };

  const handleRangeChange = (range) => {
    if (Array.isArray(range)) {
      // For week and day views, range will be an array with a single Date object
      setFilterDate({
        startDate: moment(range[0]).format("YYYY-MM-DD"),
        endDate: moment(range[range.length - 1]).format("YYYY-MM-DD"),
      });
    } else {
      // For month view, range will be an object with 'start' and 'end' properties
      setFilterDate({
        startDate: moment(range.start).format("YYYY-MM-DD"),
        endDate: moment(range.end).format("YYYY-MM-DD"),
      });
    }
  };

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={appointments}
        startAccessor="start"
        endAccessor="end"
        selectable={true}
        style={{ height: isSmallDevice ? 520 : 640 }}
        onSelectEvent={handleEventClick}
        view={currentView}
        onView={(view) => setCurrentView(view)}
        eventPropGetter={eventPropGetter}
        onRangeChange={handleRangeChange}
      />
    </div>
  );
};

export default Scheduler
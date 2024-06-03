import React, { useState } from "react";
import css from "./Diary.module.scss";
import SchedulerCalendar from "./Scheduler";
import { useGetBookingsQuery } from "@/services/api/bookingsApi/bookingsApi";
import moment from "moment";

const Diary = () => {
  const [currentView, setCurrentView] = useState("month");
  const [filterDate, setFilterDate] = useState({
    startDate: moment().startOf("month").format("YYYY-MM-DD"),
    endDate: moment().endOf("month").format("YYYY-MM-DD"),
  });

  const { data, isLoading } = useGetBookingsQuery({
    start_date: filterDate.startDate,
    end_date: filterDate.endDate,
  });

  return (
    <div className={`${css.wrapper}`}>
      <div className={`${css.headingTop} max-w-screen-xl mx-auto `}>
        <h1 className="capitalize">Diary - {currentView}</h1>
      </div>

      <div className={`max-w-screen-xl w-full mx-auto my-6 md:my-6 pb-24`}>
        <SchedulerCalendar
          data={data}
          currentView={currentView}
          setCurrentView={setCurrentView}
        />
      </div>
    </div>
  );
};

export default Diary;

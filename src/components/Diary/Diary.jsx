import React, { useState } from "react";
import css from "./Diary.module.scss";
import SchedulerCalendar from "./Scheduler";
import { useGetBookingsQuery } from "@/services/api/bookingsApi/bookingsApi";
import moment from "moment";
import ClipSpinner from "../Loader/ClipSpinner";

const Diary = () => {
  const [currentView, setCurrentView] = useState("month");
  const [filterDate, setFilterDate] = useState({
    startDate: moment().startOf("month").format("YYYY-MM-DD"),
    endDate: moment().endOf("month").format("YYYY-MM-DD"),
  });

  const { data, isFetching: isLoading } = useGetBookingsQuery({
    start_date: filterDate.startDate,
    end_date: filterDate.endDate,
  });

  return (
    <div className={`${css.wrapper}`}>
      <div className={`${css.headingTop} max-w-screen-xl mx-auto `}>
        <h1 className="capitalize">Diary - {currentView}</h1>
      </div>

      <div className={`max-w-screen-xl w-full mx-auto my-5 md:my-5 pb-24`}>
        <SchedulerCalendar
          data={data}
          currentView={currentView}
          setCurrentView={setCurrentView}
          setFilterDate={setFilterDate}
        />

        {isLoading && (
          <div className="w-full absolute left-0 right-0 top-0 h-[750px] md:h-[640px] flex justify-center items-center flex-col space-y-1 z-50">
            <ClipSpinner size={30} />
            <span className="text-[#01ABAB]">Loading...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Diary;

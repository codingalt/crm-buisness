import React, { useEffect, useState } from "react";
import css from "./Bookings.module.scss";
import { RxCross2 } from "react-icons/rx";
import { MdDone } from "react-icons/md";
import { RiFilter3Fill } from "react-icons/ri";
import { Empty } from "antd";
import ClipSpinner from "../Loader/ClipSpinner";
import moment from "moment";
import { Button } from "@nextui-org/react";

const BookingsTable = ({
  setIsModal,
  data,
  isLoading,
  handleActivateBooking,
  isLoadingActivateBooking,
  handleMarkAsCompleteBooking,
  isLoadingCompleteBooking,
}) => {
  const [hours, setHours] = useState();

  useEffect(() => {
    const hoursTemp = [];
    if (data) {
      data.forEach((item) => {
        hoursTemp.push(item.appointment_date);
      });
      setHours(hoursTemp);
    }
  }, [data]);
  return (
    <div className={css.bookingsTable}>
      <div className={css.hoursHeading}>Hours</div>
      <div className={css.table}>
        <div className={css.hoursCol}>
          {!isLoading && data?.length > 0 && (
            <>
              <div className={css.item}></div>
              <div className={css.item}></div>
              {hours?.map((item, index) => (
                <div key={index} className={css.item}>
                  {moment(item).format("hh:mm a")}
                </div>
              ))}
            </>
          )}
        </div>

        <div className={css.tableData}>
          <div className="w-full flex items-center justify-between">
            <h3>Today</h3>
            <div
              onClick={() => setIsModal(true)}
              className="md:w-12 md:h-12 text-[25px] md:text-[28px] h-10 w-10 bg-[#01AB8E] cursor-pointer rounded-xl shadow-md flex justify-center items-center"
            >
              <RiFilter3Fill className="text-default-600" color="#fff" />
            </div>
          </div>
          <div className={`${css.employeesTable}`}>
            {/* Table Header  */}
            <div className={css.tableHeader}>
              <div className={css.item}>Customer Name</div>
              <div className={css.item}>Service Provider</div>
              <div className={css.item}>Time</div>
              <div className={css.item}>Payment</div>
              <div className={css.item}>
                <div className="bg-[#01AB8E] w-24 md:w-28 flex text-[12px] md:text-[14px] justify-center items-center text-white rounded-full px-0 md:px-7 py-1">
                  Approval
                </div>
              </div>
             
            </div>

            {/* Table Body  */}
            <div className={css.tableBody}>
              {!isLoading && data?.length === 0 && (
                <div className="w-full h-[150px] flex items-center justify-center">
                  <Empty />
                </div>
              )}

              {isLoading ? (
                <div className="w-full h-[150px] flex items-center justify-center">
                  <ClipSpinner size={35} />
                </div>
              ) : (
                data?.map((item) => (
                  <div
                    key={item.id}
                    className={css.tableRow}
                    style={
                      item.status === 1
                        ? { background: "#fdf3f1" }
                        : item.status === 0
                        ? { background: "" }
                        : { background: "#f6ffed" }
                    }
                  >
                    <p>{item.customer.name}</p>
                    <p>{item.service.name}</p>
                    <p>{item.service.time}min</p>
                    <p>{item.price} Nis</p>
                    <p>
                      {item.status === 1 ? (
                        <Button
                          isLoading={isLoadingCompleteBooking}
                          size="sm"
                          className="w-24 h-[28px] text-[13px] hover:text-white"
                          color="success"
                          variant="ghost"
                          radius="full"
                          onClick={() => handleMarkAsCompleteBooking(item.id)}
                        >
                          Complete
                        </Button>
                      ) : item.status === 0 ? (
                        <Button
                          isLoading={isLoadingActivateBooking}
                          size="sm"
                          className="w-24 h-[28px] text-[13px]"
                          color="primary"
                          variant="ghost"
                          radius="full"
                          onClick={() => handleActivateBooking(item.id)}
                        >
                          Activate
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className="w-24 h-[28px] text-[13px]"
                          color="success"
                          radius="full"
                          disabled
                        >
                          Finished
                        </Button>
                      )}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingsTable;

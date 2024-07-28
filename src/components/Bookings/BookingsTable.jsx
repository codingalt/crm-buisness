import React, { useEffect, useState } from "react";
import css from "./Bookings.module.scss";
import { RiFilter3Fill } from "react-icons/ri";
import { Empty } from "antd";
import ClipSpinner from "../Loader/ClipSpinner";
import moment from "moment";
import { Button } from "@nextui-org/react";
import { truncateText } from "@/utils/helpers/helpers";
import { useMediaQuery } from "@uidotdev/usehooks";
import { useApiErrorHandling } from "@/hooks/useApiErrors";
import {
  useActivateBookingMutation,
  useMarkAsCompleteBookingMutation,
} from "@/services/api/bookingsApi/bookingsApi";
import { toastSuccess } from "../Toast/Toast";

const BookingsTable = ({
  setIsModal,
  data,
  isLoading,
  clickedBooking,
  setClickedBooking,
}) => {
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
  const [hours, setHours] = useState();

  // Activate Booking
  const [activateBooking, res1] = useActivateBookingMutation();
  const {
    isLoading: isLoadingActivateBooking,
    isSuccess: isSuccessActivateBooking,
    error: activateBookingError,
  } = res1;

  const handleActivateBooking = async (id) => {
    setClickedBooking(id);
    await activateBooking(id);
  };

  useEffect(() => {
    if (isSuccessActivateBooking) {
      toastSuccess("Booking Activated.");
    }
  }, [isSuccessActivateBooking]);

  const apiErrors1 = useApiErrorHandling(activateBookingError);

  // Mark as Complete Booking
  const [markASComplete, res2] = useMarkAsCompleteBookingMutation();
  const {
    isLoading: isLoadingCompleteBooking,
    isSuccess: isSuccessCompleteBooking,
    error: completeBookingError,
  } = res2;

  const handleMarkAsCompleteBooking = async (id) => {
    setClickedBooking(id);
    await markASComplete(id);
  };

  useEffect(() => {
    if (isSuccessCompleteBooking) {
      toastSuccess("Booking Activated.");
    }
  }, [isSuccessCompleteBooking]);

  const apiErrors2 = useApiErrorHandling(completeBookingError);

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
              <div className={css.item}>Name</div>
              <div className={css.item}>Service</div>
              <div className={css.item}>Time</div>
              <div className={css.item}>Payment</div>
              <div className={css.item}>
                <div className="bg-[#01AB8E] w-24 md:w-28 flex text-[12px] md:text-[14px] justify-center items-center text-white rounded-full px-0 md:px-7 py-1">
                  Action
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
                    <div className={css.item}>
                      {truncateText(item.customer.name, 12)}
                    </div>
                    <div className={css.item}>
                      {truncateText(item.service.name, isSmallDevice ? 15 : 18)}
                    </div>
                    <div className={css.item}>
                      {moment(item?.appointment_date).format("MMMM D, h:mm a")}
                    </div>
                    <div
                      className={`${css.item} flex flex-col xl:flex-row xl:text-nowrap items-center gap-0 xl:gap-1`}
                    >
                      <span>{item.price} Nis</span>
                      <span className="text-tiny text-[#01ab8e]">
                       <span className="hidden xl:inline-block">|</span> {item.payment_method?.name}
                      </span>
                    </div>
                    <div className={css.item}>
                      {item.status === 1 ? (
                        <Button
                          isLoading={
                            item.id === clickedBooking &&
                            isLoadingCompleteBooking
                          }
                          size="sm"
                          className="w-24 h-[28px] text-[#01AB8E] border-[#01AB8E] text-[13px] hover:bg-[#01AB8E] focus:bg-[#01AB8E]"
                          // color="success"
                          variant="ghost"
                          radius="full"
                          onClick={() => handleMarkAsCompleteBooking(item.id)}
                        >
                          Complete
                        </Button>
                      ) : item.status === 0 ? (
                        <Button
                          isLoading={
                            item.id === clickedBooking &&
                            isLoadingActivateBooking
                          }
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
                          className="w-24 h-[28px] pointer-events-none text-[13px] bg-[#01AB8E] text-white"
                          color="success"
                          radius="full"
                          disabled
                        >
                          Finished
                        </Button>
                      )}
                    </div>
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

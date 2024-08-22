import React, { useContext, useEffect, useState } from "react";
import css from "./Bookings.module.scss";
import { HiMiniArrowLongRight } from "react-icons/hi2";
import BookingsTable from "./BookingsTable";
import FilterByDateModal from "./FilterByDateModal";
import {
  useActivateBookingMutation,
  useCancelBookingMutation,
  useGetBookingsQuery,
  useMarkAsCompleteBookingMutation,
} from "@/services/api/bookingsApi/bookingsApi";
import moment from "moment";
import { Avatar, Badge, Empty } from "antd";
import { LuUser2 } from "react-icons/lu";
import { Button, useDisclosure } from "@nextui-org/react";
import UpcomingBookingsModal from "./UpcomingBookingsModal";
import { Skeleton, Tooltip } from "@mui/material";
import ActiveBookingsModal from "./ActiveBookingsModal";
import { MdOutlineDone } from "react-icons/md";
import { toastSuccess } from "../Toast/Toast";
import { useApiErrorHandling } from "@/hooks/useApiErrors";
import { useTranslation } from "react-i18next";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { IoMdInformationCircleOutline } from "react-icons/io";
import ViewActiveAppointment from "./ViewActiveAppointment";
import { ClipLoader } from "react-spinners";
import ViewUpcomingAppointment from "./ViewUpcomingAppointment";
import { parseDate } from "@internationalized/date";

const Bookings = () => {
  const navigate = useNavigate();

  const {
    isOpen: isOpen1,
    onOpen: onOpen1,
    onOpenChange: onOpenChange1,
  } = useDisclosure();
  const {
    isOpen: isOpen2,
    onOpen: onOpen2,
    onOpenChange: onOpenChange2,
  } = useDisclosure();

  const {
    isOpen: isOpen3,
    onOpen: onOpen3,
    onOpenChange: onOpenChange3,
  } = useDisclosure();

  const {
    isOpen: isOpen4,
    onOpen: onOpen4,
    onOpenChange: onOpenChange4,
  } = useDisclosure();

  const { t } = useTranslation();

  const [isModal, setIsModal] = useState(false);
  const [clickedBooking, setClickedBooking] = useState(null);
  const [
    isApproveAppoinmentFromViewModal,
    setIsApproveAppoinmentFromViewModal,
  ] = useState(false);
  const [filterDate, setFilterDate] = useState({
    start: parseDate(moment().startOf("month").format("YYYY-MM-DD")),
    end: parseDate(moment().endOf("month").format("YYYY-MM-DD")),
  });

  const { data, isLoading, isFetching, error, refetch } = useGetBookingsQuery({
    start_date: filterDate.start,
    end_date: filterDate.end,
  });

  // Activate Booking
  const [activateBooking, res1] = useActivateBookingMutation();
  const {
    isLoading: isLoadingActivateBooking,
    isSuccess: isSuccessActivateBooking,
    error: activateBookingError,
  } = res1;

  const handleActivateBooking = async (item, onClose) => {
    setClickedBooking(item);
    await activateBooking(item.id);

    if (onClose) {
      onClose();
    }
  };

  useEffect(() => {
    if (isSuccessActivateBooking) {
      toastSuccess("Booking Activated.");
      setClickedBooking(null);
      setIsApproveAppoinmentFromViewModal(false);
      if (isOpen1) {
        onOpenChange1(false);
      }
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

  const handleMarkAsCompleteBooking = async (item, onClose) => {
    setClickedBooking(item);
    await markASComplete(item.id);

    if (onClose) {
      onClose();
    }
  };

  useEffect(() => {
    if (isSuccessCompleteBooking) {
      toastSuccess("Booking Completed.");
      setClickedBooking(null);
      setIsApproveAppoinmentFromViewModal(false);
      if (isOpen2) {
        onOpenChange2(false);
      }
    }
  }, [isSuccessCompleteBooking]);

  const apiErrors2 = useApiErrorHandling(completeBookingError);

  // Cancel Booking
  const [cancelBooking, res3] = useCancelBookingMutation();
  const {
    isLoading: isLoadingCancelBooking,
    isSuccess: isSuccessCancelBooking,
    error: cancelBookingError,
  } = res3;

  const handleCancelBooking = async (item,onClose) => {
    setClickedBooking(item);
    await cancelBooking(item.id);

    if(onClose){
      onClose();
    }

  };

  useEffect(() => {
    if (isSuccessCancelBooking) {
      toastSuccess("Booking Cancelled.");
      setClickedBooking(null);
      setIsApproveAppoinmentFromViewModal(false);
    }
  }, [isSuccessCancelBooking]);

  const apiErrors3 = useApiErrorHandling(cancelBookingError);

  return (
    <>
      {!error && (
        <div className={css.dashboardDetails}>
          <div className={css.top}>
            <h1>{t("yourQueues")}</h1>
            <button type="button" onClick={() => navigate("/addAppointment")}>
              <FaPlus /> <span>{t("addAppointment")}</span>
            </button>
          </div>

          <div className={css.cards}>
            {/* Active Bookings  */}
            <div className={css.inner}>
              <div className="flex items-center gap-3">
                <h3>{t("active")}</h3>
                <div className="cursor-pointer" onClick={() => onOpen2()}>
                  {data && data?.active?.length - 1 > 0 && (
                    <Badge
                      className="site-badge-count-109 mb-0.5"
                      count={
                        data?.active?.length - 1 > 9
                          ? "+9"
                          : `+${data?.active?.length - 1}`
                      }
                      style={{ background: "gray" }}
                    />
                  )}
                </div>
              </div>

              {isLoading ? (
                <div className="w-full">
                  <Skeleton variant="rounded" width={"100%"} height={139} />
                </div>
              ) : (
                data?.active?.length > 0 && (
                  <div className={css.card}>
                    {/* More Information Icon  */}
                    <Tooltip title={t("appointmentDetails")} placement="right">
                      <div
                        onClick={() => {
                          setClickedBooking(data?.active[0]);
                          onOpen3();
                        }}
                        className="w-10 h-10 rounded-full hover:bg-default-100 absolute top-3 md:top-1 cursor-pointer right-2 text-2xl text-[#13D3B3] font-normal flex items-center justify-center"
                      >
                        <IoMdInformationCircleOutline />
                      </div>
                    </Tooltip>
                    <div className={css.details}>
                      <Avatar
                        icon={<LuUser2 fontSize={22} />}
                        style={{ backgroundColor: "#13D3B3" }}
                        size={36}
                      >
                        {data?.active[0]?.customer?.name.slice(0, 1)}
                      </Avatar>
                      <div className={css.name}>
                        <p>
                          {data?.active[0]?.customer?.name.length > 18
                            ? `${data?.active[0]?.customer?.name.slice(
                                0,
                                18
                              )}..`
                            : data?.active[0]?.customer?.name}
                        </p>
                        <span>
                          {moment(data?.active[0]?.appointment_date).format(
                            "MMMM D, h:mm a"
                          )}
                        </span>
                      </div>
                    </div>

                    <div className={css.footer}>
                      <p>
                        {data?.active[0]?.service?.name.length > 22
                          ? `${data?.active[0]?.service?.name.slice(0, 22)}..`
                          : data?.active[0]?.service?.name}
                      </p>
                      <Button
                        isLoading={
                          !isApproveAppoinmentFromViewModal &&
                          isLoadingCompleteBooking
                        }
                        size="sm"
                        className="w-28 h-8 border-[#01AB8E] text-[#01AB8E] hover:bg-[#01AB8E]"
                        variant="ghost"
                        startContent={<MdOutlineDone fontSize={30} />}
                        onClick={() =>
                          handleMarkAsCompleteBooking(data?.active[0])
                        }
                      >
                        {t("complete")}
                      </Button>
                    </div>
                  </div>
                )
              )}

              {/* Show Empty Card when no data  */}
              {!isLoading && data?.active?.length === 0 && (
                <div className="flex gap-2 items-center h-[139px] border rounded-lg justify-center px-4">
                  <Empty
                    description={false}
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    imageStyle={{ height: 65 }}
                  />
                  <p className="text-sm text-default-500 mb-2">
                    {t("noActiveBookings")}
                  </p>
                </div>
              )}
            </div>

            <div className={css.arrow}>
              <HiMiniArrowLongRight />
            </div>

            {/* Upcoming Bookings */}
            <div className={css.inner}>
              <div className="flex items-center gap-3">
                <h3>{t("theNext")}</h3>
                <div className="cursor-pointer" onClick={() => onOpen1()}>
                  {data && data?.upComing?.length - 1 > 0 && (
                    <Badge
                      className="site-badge-count-109 mb-0.5"
                      count={
                        data?.upComing?.length - 1 > 9
                          ? "+9"
                          : `+${data?.upComing?.length - 1}`
                      }
                      style={{ background: "gray" }}
                    />
                  )}
                </div>
              </div>
              {isLoading ? (
                <div className="w-full">
                  <Skeleton variant="rounded" width={"100%"} height={139} />
                </div>
              ) : (
                data?.upComing?.length > 0 && (
                  <div
                    className={css.card}
                    style={{ backgroundColor: "#ECF3F9" }}
                  >
                    {/* More Information Icon  */}
                    <Tooltip title={t("appointmentDetails")} placement="right">
                      <div
                        onClick={() => {
                          setClickedBooking(data?.upComing[0]);
                          onOpen4();
                        }}
                        className="w-10 h-10 rounded-full hover:bg-default-100 absolute top-3 md:top-1 cursor-pointer right-2 text-2xl text-[#13D3B3] font-normal flex items-center justify-center"
                      >
                        <IoMdInformationCircleOutline />
                      </div>
                    </Tooltip>

                    <div className={css.details}>
                      <Avatar
                        icon={<LuUser2 fontSize={22} />}
                        style={{ backgroundColor: "#13D3B3" }}
                        size={36}
                      >
                        {data?.upComing[0]?.customer?.name.slice(0, 1)}
                      </Avatar>
                      <div className={css.name}>
                        <p>
                          {data?.upComing[0]?.customer?.name.length > 18
                            ? `${data?.upComing[0]?.customer?.name.slice(
                                0,
                                18
                              )}..`
                            : data?.upComing[0]?.customer?.name}
                        </p>
                        <span>
                          {moment(data?.upComing[0]?.appointment_date).format(
                            "MMMM D, h:mm a"
                          )}
                        </span>
                      </div>
                    </div>

                    <div className={css.footer}>
                      <p>
                        {data?.upComing[0]?.service?.name.length > 22
                          ? `${data?.upComing[0]?.service?.name.slice(0, 22)}..`
                          : data?.upComing[0]?.service?.name}
                      </p>
                      <Button
                        isLoading={
                          !isApproveAppoinmentFromViewModal &&
                          clickedBooking?.id === data?.upComing[0]?.id &&
                          isLoadingActivateBooking
                        }
                        size="sm"
                        className="w-24 h-8 text-sm"
                        color="primary"
                        variant="ghost"
                        onClick={() => {
                          setClickedBooking(data?.upComing[0]);
                          handleActivateBooking(data?.upComing[0]);
                        }}
                      >
                        {t("activate")}
                      </Button>
                    </div>
                  </div>
                )
              )}

              {/* Show Empty Card when no data  */}
              {!isLoading && data?.upComing?.length === 0 && (
                <div className="w-full flex gap-2 items-center h-[139px] border rounded-lg justify-center px-4">
                  <Empty
                    description={false}
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    imageStyle={{ height: 65 }}
                  />
                  <p className="text-sm text-default-500 mb-2">
                    {t("noUpcomingBookings")}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Bookings Table  */}
          {!error && (
            <BookingsTable
              setIsModal={setIsModal}
              data={data?.filteredAppointments}
              isLoading={isFetching}
              handleActivateBooking={handleActivateBooking}
              isLoadingActivateBooking={isLoadingActivateBooking}
              handleMarkAsCompleteBooking={handleMarkAsCompleteBooking}
              isLoadingCompleteBooking={isLoadingCompleteBooking}
              clickedBooking={clickedBooking}
              setClickedBooking={setClickedBooking}
              filterDate={filterDate}
              setFilterDate={setFilterDate}
            />
          )}

          {/* Filter Modal  */}
        </div>
      )}

      <FilterByDateModal isModal={isModal} setIsModal={setIsModal} />

      {/* Upcoming Bookings Modal  */}
      <UpcomingBookingsModal
        isOpen={isOpen1}
        onOpenChange={onOpenChange1}
        bookings={data?.upComing}
        data={clickedBooking}
        handleActivateBooking={handleActivateBooking}
        isLoadingActivateBooking={isLoadingActivateBooking}
      />

      {/* Active Bookings Modal  */}
      <ActiveBookingsModal
        isOpen={isOpen2}
        onOpenChange={onOpenChange2}
        bookings={data?.active}
        data={clickedBooking}
        handleMarkAsCompleteBooking={handleMarkAsCompleteBooking}
        isLoadingCompleteBooking={isLoadingCompleteBooking}
      />

      {/* View Active Booking Details Modal  */}
      <ViewActiveAppointment
        isOpen={isOpen3}
        onOpenChange={onOpenChange3}
        data={clickedBooking}
        handleMarkAsCompleteBooking={handleMarkAsCompleteBooking}
        isLoadingCompleteBooking={isLoadingCompleteBooking}
        isSuccessCompleteBooking={isSuccessCompleteBooking}
        setIsApproveAppoinmentFromViewModal={
          setIsApproveAppoinmentFromViewModal
        }
        handleCancelBooking={handleCancelBooking}
        isLoadingCancelBooking={isLoadingCancelBooking}
      />

      {/* View Active Booking Details Modal  */}
      <ViewUpcomingAppointment
        isOpen={isOpen4}
        onOpenChange={onOpenChange4}
        data={clickedBooking}
        handleActivateBooking={handleActivateBooking}
        isLoadingActivateBooking={isLoadingActivateBooking}
        isSuccessActivateBooking={isSuccessActivateBooking}
        setIsApproveAppoinmentFromViewModal={
          setIsApproveAppoinmentFromViewModal
        }
        handleCancelBooking={handleCancelBooking}
        isLoadingCancelBooking={isLoadingCancelBooking}
      />

      {/* Show Error If data fails to load  */}
      {!isLoading && error && (
        <div className="pt-48 w-full flex justify-center flex-col gap-2 items-center">
          <p className="font-medium text-[17px] text-[#01ab8e]">
            Let's try that again.
          </p>
          <span className="px-6 text-xs text-default-600 text-center max-w-xs">
            OOps! Something went wrong. We couldn't fetch the data.
          </span>
          <Button
            size="sm"
            radius="sm"
            className="mt-2 py-1 px-6 text-white bg-[#01ab8e]"
            onClick={refetch}
          >
            Try again
          </Button>
        </div>
      )}

      {/* Loader  while refetch */}
      {error && isLoading && (
        <div className="w-full pt-48 flex items-center justify-center">
          <ClipLoader color="#01AB8E" size={44} speedMultiplier={0.85} />
        </div>
      )}
    </>
  );
};

export default Bookings;

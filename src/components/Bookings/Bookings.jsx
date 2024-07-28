import React, { useContext, useEffect, useState } from "react";
import css from "./Bookings.module.scss";
import { HiMiniArrowLongRight } from "react-icons/hi2";
import BookingsTable from "./BookingsTable";
import FilterByDateModal from "./FilterByDateModal";
import {
  useActivateBookingMutation,
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
import { DirectionContext } from "@/context/DirectionContext";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaCreditCard } from "react-icons/fa";
import { IoWallet } from "react-icons/io5";
import { IoMdInformationCircleOutline } from "react-icons/io";
import ViewActiveAppointment from "./ViewActiveAppointment";

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

  const { t } = useTranslation();

  const [isModal, setIsModal] = useState(false);
  const [clickedBooking, setClickedBooking] = useState(null);
  const [filterDate, setFilterDate] = useState({
    startDate: moment().startOf("month").format("YYYY-MM-DD"),
    endDate: moment().endOf("month").format("YYYY-MM-DD"),
  });

  const { data, isLoading } = useGetBookingsQuery({
    start_date: filterDate.startDate,
    end_date: filterDate.endDate,
  });

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

  return (
    <>
      <div className={css.dashboardDetails}>
        <div className={css.top}>
          <h1>{t("heading")}</h1>
          <button type="button" onClick={() => navigate("/addAppointment")}>
            <FaPlus /> <span>Add Appointment</span>
          </button>
        </div>

        {/* Active Bookings  */}

        <div className={css.cards}>
          <div className={css.inner}>
            <div className="flex items-center gap-3">
              <h3>Active</h3>
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
                  {/* <div className="absolute top-3 md:top-4 right-3 text-default-500 text-xs font-normal flex items-center gap-2">
                    {data?.active[0]?.payment_method?.code == "card" ? (
                      <FaCreditCard />
                    ) : (
                      <IoWallet />
                    )}
                    <span>{data?.active[0]?.payment_method?.name}</span>
                  </div> */}

                  {/* More Information Icon  */}
                  <Tooltip title="Appointment Details" placement="right">
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
                          ? `${data?.active[0]?.customer?.name.slice(0, 18)}..`
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
                      isLoading={isLoadingCompleteBooking}
                      size="sm"
                      className="w-28 h-8 border-[#01AB8E] text-[#01AB8E] hover:bg-[#01AB8E]"
                      variant="ghost"
                      startContent={<MdOutlineDone fontSize={30} />}
                      onClick={() =>
                        handleMarkAsCompleteBooking(data?.active[0]?.id)
                      }
                    >
                      Complete
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
                  No active bookings
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
              <h3>The Next</h3>
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
                  <div className="absolute top-3 md:top-4 right-3 text-default-500 text-xs font-normal flex items-center gap-2">
                    {data?.upComing[0]?.payment_method?.code == "card" ? (
                      <FaCreditCard />
                    ) : (
                      <IoWallet />
                    )}
                    <span>{data?.upComing[0]?.payment_method?.name}</span>
                  </div>
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
                        clickedBooking === data?.upComing[0]?.id &&
                        isLoadingActivateBooking
                      }
                      size="sm"
                      className="w-24 h-8 text-sm"
                      color="primary"
                      variant="ghost"
                      onClick={() => {
                        setClickedBooking(data?.upComing[0]?.id);
                        handleActivateBooking(data?.upComing[0]?.id);
                      }}
                    >
                      Activate
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
                  No upcoming bookings
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Bookings Table  */}
        <BookingsTable
          setIsModal={setIsModal}
          data={data?.filteredAppointments}
          isLoading={isLoading}
          handleActivateBooking={handleActivateBooking}
          isLoadingActivateBooking={isLoadingActivateBooking}
          handleMarkAsCompleteBooking={handleMarkAsCompleteBooking}
          isLoadingCompleteBooking={isLoadingCompleteBooking}
          clickedBooking={clickedBooking}
          setClickedBooking={setClickedBooking}
        />

        {/* Filter Modal  */}
      </div>
      <FilterByDateModal isModal={isModal} setIsModal={setIsModal} />

      {/* Upcoming Bookings Modal  */}
      <UpcomingBookingsModal
        isOpen={isOpen1}
        onOpenChange={onOpenChange1}
        bookings={data?.upComing}
      />

      {/* Active Bookings Modal  */}
      <ActiveBookingsModal
        isOpen={isOpen2}
        onOpenChange={onOpenChange2}
        bookings={data?.active}
        handleMarkAsCompleteBooking={handleMarkAsCompleteBooking}
        isLoadingCompleteBooking={isLoadingCompleteBooking}
      />

      {/* View Active Booking Details Modal  */}
      <ViewActiveAppointment
        isOpen={isOpen3}
        onOpenChange={onOpenChange3}
        data={clickedBooking}
      />
    </>
  );
};

export default Bookings;

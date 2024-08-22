import React, { useContext, useEffect } from "react";
import { DirectionContext } from "@/context/DirectionContext";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Image,
} from "@nextui-org/react";
import { IoCallOutline } from "react-icons/io5";
import { RxCalendar } from "react-icons/rx";
import { LuAlarmClock, LuUser2 } from "react-icons/lu";
import { MdOutlineMedicalServices } from "react-icons/md";
import { FaRegUser } from "react-icons/fa6";
import moment from "moment";
import { Avatar } from "antd";
import { truncateText } from "@/utils/helpers/helpers";
import { useMediaQuery } from "@uidotdev/usehooks";
import { useTranslation } from "react-i18next";

const ViewUpcomingAppointment = ({
  isOpen,
  onOpenChange,
  data,
  handleActivateBooking,
  isLoadingActivateBooking,
  setIsApproveAppoinmentFromViewModal,
  handleCancelBooking,
  isLoadingCancelBooking,
}) => {
  const { t } = useTranslation();
  const { direction } = useContext(DirectionContext);
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="xl"
      placement="center"
      className="max-w-[92%] md:max-w-xl"
      dir={direction}
      scrollBehavior="inside"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1"></ModalHeader>
            <ModalBody className="min-h-56">
              <div className="px-1 md:px-3 w-full mt-4 md:mt-0">
                {/* User Profile Details  */}
                <div className="flex items-center gap-3 md:gap-2">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-full">
                    <Avatar
                      icon={<LuUser2 fontSize={31} />}
                      style={{ backgroundColor: "#13D3B3" }}
                      size={56}
                    >
                      {data?.customer?.name.slice(0, 1)}
                    </Avatar>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg md:text-2xl font-bold">
                      {data?.customer?.name}
                    </h2>
                    <p className="text-sm text-gray-500 flex items-center gap-1 md:gap-1.5 mt-0.5 md:mt-1">
                      <IoCallOutline className="text-[#13D3B3] text-medium md:text-lg" />
                      <span>{data?.customer?.phone_number}</span>
                    </p>
                  </div>
                </div>

                {/* Service Image  */}

                <div className="w-full flex flex-wrap justify-between gap-1 rounded-2xl py-7 bg-[#F4F6F8] mt-5">
                  <div className="w-full flex justify-between gap-4">
                    <div className="flex-1 flex flex-col items-center gap-3 text-center">
                      <div className="w-12 h-12 shadow-lg rounded-full bg-white flex items-center justify-center text-xl text-blue-500">
                        <RxCalendar />
                      </div>
                      <p className="font-medium text-medium">
                        {moment(data?.appointment_date).format("D MMM, YYYY")}
                      </p>
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-3 text-center">
                      <div className="w-12 h-12 shadow-lg rounded-full bg-white flex items-center justify-center text-xl text-red-400">
                        <LuAlarmClock />
                      </div>
                      <p className="font-medium text-medium">
                        {moment(data?.appointment_date).format("hh:mm a")}
                      </p>
                    </div>
                  </div>
                  <div className="w-full flex justify-between gap-4 mt-5">
                    <div className="flex-1 flex flex-col items-center gap-3 text-center">
                      <div className="w-12 h-12 shadow-lg rounded-full bg-white flex items-center justify-center text-xl text-purple-500">
                        <MdOutlineMedicalServices />
                      </div>
                      <p className="font-medium text-medium max-w-[90%]">
                        {truncateText(
                          data?.service?.name,
                          isSmallDevice ? 17 : 33
                        )}
                      </p>
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-3 text-center">
                      <div className="w-12 h-12 shadow-lg rounded-full bg-white flex items-center justify-center text-lg text-green-400">
                        <FaRegUser />
                      </div>
                      <p className="font-medium text-medium">Zahid Yousaf</p>
                    </div>
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <div className="flex flex-col-reverse md:flex-row items-center justify-center w-full px-1 md:px-3 gap-4 pt-4 pb-8">
                <Button
                  variant="ghost"
                  color="danger"
                  className="flex-1 w-full uppercase py-3 md:py-[25px] font-medium"
                  size="lg"
                  radius="sm"
                  isLoading={isLoadingCancelBooking}
                  onClick={() => {
                    setIsApproveAppoinmentFromViewModal(true);
                    handleCancelBooking(data, onClose);
                  }}
                >
                  {t("cancelAppointment")}
                </Button>
                <Button
                  color="primary"
                  isLoading={isLoadingActivateBooking}
                  onClick={() => {
                    setIsApproveAppoinmentFromViewModal(true);
                    handleActivateBooking(data, onClose);
                  }}
                  className="bg-[#01AB8E] w-full py-4 md:py-7 flex-1 uppercase font-medium"
                  size="lg"
                  radius="sm"
                >
                  {t("activateAppointment")}
                </Button>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ViewUpcomingAppointment;

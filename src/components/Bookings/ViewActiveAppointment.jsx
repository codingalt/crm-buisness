import React, { useContext } from "react";
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
import { LuAlarmClock } from "react-icons/lu";
import { MdOutlineMedicalServices } from "react-icons/md";
import { FaRegUser } from "react-icons/fa6";
import s1 from "@/assets/h1.jpg"
import moment from "moment";

const ViewActiveAppointment = ({ isOpen, onOpenChange,data }) => {
  const { direction } = useContext(DirectionContext);
  console.log(data);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="xl"
      placement="center"
      //   backdrop="blur"
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
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-full">
                    <Image
                      src="https://i.pravatar.cc/150?u=7"
                      alt="User"
                      className="object-cover w-full h-full rounded-full"
                      radius="full"
                    />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl md:text-2xl font-bold">
                      {data?.customer?.name}
                    </h2>
                    <p className="text-sm text-gray-500 flex items-center gap-1 md:gap-2 mt-1.5">
                      <IoCallOutline className="text-[#13D3B3] text-lg" />
                      <span>{data?.customer?.phone_number}</span>
                    </p>
                  </div>
                </div>

                {/* Service Image  */}
                {/* <div className="w-full py-3">
                  <div className="w-full h-56 rounded-md overflow-hidden">
                    <Image
                      src={s1}
                      alt="Service"
                      className="object-fill align-middle w-full h-full rounded-xl"
                      radius="md"
                      width={"100%"}
                    />
                  </div>
                  <div>
                    <h2 className="hidden font-bold text-2xl mt-1">Male Yoga</h2>
                  </div>
                </div> */}

                {/* Time and Date  */}
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
                      <p className="font-medium text-medium">{data?.service?.name}</p>
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
                  onPress={onClose}
                  className="flex-1 w-full uppercase py-3 md:py-[25px] font-medium"
                  size="lg"
                  radius="sm"
                >
                  Cancel Appointment
                </Button>
                <Button
                  color="primary"
                  onPress={onClose}
                  className="bg-[#01AB8E] w-full py-4 md:py-7 flex-1 uppercase font-medium"
                  size="lg"
                  radius="sm"
                >
                  Complete Appointment
                </Button>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ViewActiveAppointment;

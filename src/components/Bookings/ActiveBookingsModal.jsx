import React, { useContext } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { Avatar, Badge } from "antd";
import { LuUser2 } from "react-icons/lu";
import css from "./Modal.module.scss";
import moment from "moment";
import { DirectionContext } from "@/context/DirectionContext";
import { FaCreditCard } from "react-icons/fa";
import { IoWallet } from "react-icons/io5";
import { MdOutlineDone } from "react-icons/md";

const ActiveBookingsModal = ({
  isOpen,
  onOpenChange,
  bookings,
  handleMarkAsCompleteBooking,
}) => {
  const { direction } = useContext(DirectionContext);

  return (
    <div className={css.wrapper}>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="3xl"
        placement="center"
        backdrop="blur"
        className="max-w-[90%] md:max-w-3xl"
        dir={direction}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <span>Active Appointments</span>
                  <div>
                    {bookings?.length != 0 && (
                      <Badge
                        className="site-badge-count-109 mb-0.5"
                        count={
                          bookings?.length - 1 > 9
                            ? "9+"
                            : `${bookings?.length - 1}`
                        }
                        style={{ background: "gray" }}
                      />
                    )}
                  </div>
                </div>
              </ModalHeader>

              <ModalBody className="min-h-56">
                <div className="w-full gap-5 grid grid-cols-1 md:grid-cols-2">
                  {bookings?.slice(1).map((item) => (
                    <div
                      key={item.id}
                      className={css.card}
                      style={{ backgroundColor: "#fdf3f1" }}
                    >
                      <div className="absolute top-3 md:top-4 right-3 text-default-500 text-xs font-normal flex items-center gap-2">
                        {item?.payment_method?.code == "card" ? (
                          <FaCreditCard />
                        ) : (
                          <IoWallet />
                        )}
                        <span>{item?.payment_method?.name}</span>
                      </div>
                      <div className={css.details}>
                        <Avatar
                          icon={<LuUser2 fontSize={22} />}
                          style={{ backgroundColor: "#13D3B3" }}
                          size={36}
                        >
                          {item?.customer?.name.slice(0, 1)}
                        </Avatar>
                        <div className={css.name}>
                          <p>
                            {item.customer?.name.length > 18
                              ? `${item.customer?.name.slice(0, 18)}..`
                              : item.customer?.name}
                          </p>
                          <span>
                            {moment(item?.appointment_date).format(
                              "MMMM D, h:mm a"
                            )}
                          </span>
                        </div>
                      </div>

                      <div className={css.footer}>
                        <p>
                          {item.service.name.length > 22
                            ? `${item.service.name.slice(0, 22)}..`
                            : item.service.name}
                        </p>
                        <Button
                          size="sm"
                          className="w-24 h-8 text-sm border-[#01AB8E] text-[#01AB8E] hover:bg-[#01AB8E]"
                          variant="ghost"
                          startContent={<MdOutlineDone fontSize={30} />}
                          onClick={() =>
                            handleMarkAsCompleteBooking(item?.id)
                          }
                        >
                          Complete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  onPress={onClose}
                  className="bg-[#01AB8E]"
                >
                  Done
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ActiveBookingsModal;

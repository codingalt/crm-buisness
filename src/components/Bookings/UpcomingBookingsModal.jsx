import React from "react";
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

const UpcomingBookingsModal = ({ isOpen, onOpenChange, bookings }) => {
  return (
    <div className={css.wrapper}>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="3xl"
        placement="center"
        backdrop="blur"
        className="max-w-[90%] md:max-w-3xl"
        style={{ zIndex: "9999999" }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <span>Upcoming Appointments</span>
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
                      style={{ backgroundColor: "#ECF3F9" }}
                    >
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
                            {" "}
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
                          className="w-24 h-8 text-sm"
                          color="primary"
                          variant="ghost"
                        >
                          Activate
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

export default UpcomingBookingsModal;

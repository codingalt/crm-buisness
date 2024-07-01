import React, { useCallback, useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
} from "@nextui-org/react";
import { IoClose } from "react-icons/io5";
import EmployeesDropdown from "./EmployeesDropdown";
import { useGetEmployeesQuery } from "@/services/api/servicesApi/servicesApi";
import { useAssignChatToEmployeeMutation } from "@/services/api/chat/chatApi";
import { useApiErrorHandling } from "@/hooks/useApiErrors";
import { toastError, toastSuccess } from "../Toast/Toast";

const AssignChatModal = ({
  isOpen,
  onOpenChange,
  communicationId,
  refetchChats,
  isUninitialized,
}) => {
  const [selected, setSelected] = useState(null);
  const { data, isLoading } = useGetEmployeesQuery();
  const [refreshKey, setRefreshKey] = useState(0);

  const [assignChat, res] = useAssignChatToEmployeeMutation();
  const { isLoading: isLoadingAssign, isSuccess, error } = res;

  const apiErrors = useApiErrorHandling(error);

  const handleAssignChat = () => {
    if (!selected || !communicationId) {
      toastError("Please select employee first");
      return;
    }

    assignChat({ communicationId: communicationId, employeeId: selected });
  };

  const handleRefetchChats = useCallback(() => {
    if (!isUninitialized) {
      refetchChats();
      setRefreshKey((prevKey) => prevKey + 1);
    }
  }, [isUninitialized, refetchChats]);


  useEffect(() => {
    if (isSuccess) {
      onOpenChange(false);
      toastSuccess("Chat Assigned.");
      handleRefetchChats();
    }
  }, [isSuccess]);

  return (
    <Modal
      className="z-[9999] shadow-lg max-w-[85%] md:max-w-md"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="center"
      hideCloseButton
      onClose={() => setSelected(null)}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1 mb-4">
                  <p>Choose Employee</p>
                </div>

                <div
                  onClick={() => {
                    onClose();
                  }}
                  className="w-7 h-7 mb-4 rounded-full bg-blue-50 text-default-700 text-medium cursor-pointer flex items-center justify-center"
                >
                  <IoClose />
                </div>
              </div>
            </ModalHeader>
            <ModalBody className="pt-0">
              <div className="w-full pb-6">
                <EmployeesDropdown
                  users={data?.employees}
                  isLoading={isLoading}
                  setSelected={setSelected}
                />

                <div className="flex w-full justify-end items-center mt-10">
                  <Button
                    isLoading={isLoadingAssign}
                    onClick={handleAssignChat}
                    className="bg-[#01ab8e] text-white"
                  >
                    Assign Chat
                  </Button>
                </div>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default AssignChatModal;

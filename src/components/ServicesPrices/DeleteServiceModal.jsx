import React, { useEffect } from 'react'
import { useMediaQuery } from "@uidotdev/usehooks";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
} from "@nextui-org/react";
import { useDeleteServiceMutation } from '@/services/api/servicesApi/servicesApi';
import { toastSuccess } from '../Toast/Toast';
import { useApiErrorHandling } from '@/hooks/useApiErrors';

const DeleteServiceModal = ({ isOpen, onOpenChange,serviceId }) => {
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");

  const [deleteService, res] = useDeleteServiceMutation();
  const { isLoading, error, isSuccess } = res;

  const apiErrors = useApiErrorHandling(error);

  useEffect(()=>{
    if(isSuccess){
      onOpenChange(false);
      toastSuccess("Successfully deleted");
    }
  },[isSuccess]);

  const handleDeleteService = async () => {
    await deleteService(serviceId);
  };

  return (
    <Modal
      className="z-[9999] shadow-lg max-w-[88%] md:max-w-lg"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement={isSmallDevice ? "center" : "center"}
      hideCloseButton
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              <div className="w-full py-6 mx-auto px-1 md:px-3 flex flex-col items-center justify-center gap-3">
                <h2 className="text-xl md:text-2xl max-w-xs font-medium text-default-800 text-center">
                  Are you sure you want to delete the service?
                </h2>
                <p className="text-sm max-w-xs font-normal text-default-600 text-center">
                  The service will be permanently deleted. This action cannot be
                  undone
                </p>

                <div className="w-full md:px-5 mt-9 mx-auto flex items-center gap-3">
                  <Button
                    size="lg"
                    radius="sm"
                    onClick={onClose}
                    className="bg-transparent font-medium flex-1 border border-[#01ab8e] text-[#01ab8e] uppercase"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="lg"
                    radius="sm"
                    color="danger"
                    isLoading={isLoading}
                    onClick={handleDeleteService}
                    className="font-medium flex-1 uppercase"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </ModalHeader>
            <ModalBody className="rounded-lg"></ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default DeleteServiceModal
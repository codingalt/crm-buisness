import React from "react";
import { Modal, ModalContent, ModalBody, Button } from "@nextui-org/react";
import done from "@/assets/done2.png"
import { useNavigate } from "react-router-dom";

const SuccessModal = () => {
    const navigate = useNavigate();

  return (
    <div>
      <Modal
        isOpen={true}
        size="md"
        placement="center"
        backdrop="blur"
        className="max-w-[80%] md:max-w-md"
        hideCloseButton
        isKeyboardDismissDisabled
        isDismissable={false}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody className="min-h-56 py-11">
                <div className="w-full flex flex-col gap-y-2 items-center justify-center">
                  <div className="w-36 mb-6">
                    <img src={done} alt="" className="w-full" />
                  </div>
                  <h3 className="text-xl font-bold text-[#01AB8E]">
                    Congratulations
                  </h3>
                  <p className="text-sm text-default-500 font-medium max-w-[100%] md:max-w-[75%] text-center">
                    Awesome, you have successfully setup your password.
                  </p>

                  <Button
                    color="primary"
                    onClick={()=> navigate("/login")}
                    className="bg-[#01AB8E] mt-9 w-[84%]"
                  >
                    Go to login
                  </Button>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default SuccessModal;

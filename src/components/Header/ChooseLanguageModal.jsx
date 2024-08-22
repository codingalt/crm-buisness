import React, { useContext, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Image,
} from "@nextui-org/react";
import { useTranslation } from "react-i18next";
import { DirectionContext } from "../../context/DirectionContext";
import { IoClose } from "react-icons/io5";
import ukFlag from "../../assets/uk.png";
import israelFlag from "../../assets/israel.png";
import i18n from "../../i18n";

const languagesData = [
  {
    id: 1,
    name: "English (UK)",
    localName: "English",
    flag: ukFlag,
    key: "en"
  },
  {
    id: 2,
    name: "Hebrew (Israel)",
    localName: "עִברִית",
    flag: israelFlag,
    key: "he"
  },
];

const ChooseLanguageModal = ({ isOpen, onOpenChange }) => {
  const { t } = useTranslation();
  const storedLanguage = localStorage.getItem("language") || i18n.language;
  const { direction, toggleLanguage } = useContext(DirectionContext);
  const [selectedLanguage, setSelectedLanguage] = useState(storedLanguage);

  const handleLanguageChange = (key) => {
    setSelectedLanguage(key);
    toggleLanguage(key);
    onOpenChange(false);
  }

  return (
    <Modal
      className="z-[9999] shadow-lg max-w-[88%] md:max-w-md"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="center"
      hideCloseButton
      dir={direction}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex justify-between items-center pt-5 md:pt-2">
                <div className="flex text-xl md:items-center gap-1 mb-4 font-semibold">
                  <p>{t("chooseLanguage")}</p>
                </div>

                <div
                  onClick={() => {
                    onClose();
                  }}
                  className="w-7 h-7 mb-4 rounded-full bg-blue-50 text-default-700 text-medium cursor-pointer hidden md:flex items-center justify-center"
                >
                  <IoClose />
                </div>
              </div>
            </ModalHeader>
            <ModalBody className="rounded-lg pb-11 md:pb-14">
              <div className="w-full flex flex-col gap-5">
                {languagesData?.map((item) => (
                  <div
                    key={item.id}
                    className={`w-full border-2 ${
                      selectedLanguage === item.key
                        ? "border-green-500"
                        : "border-default-300"
                    }  rounded-xl px-4 md:px-5 py-6 hover:bg-green-50 transition-all cursor-pointer`}
                    onClick={() => handleLanguageChange(item.key)}
                  >
                    <div className="w-full flex items-center justify-between">
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-6 h-6 md:w-7 md:h-7 rounded-full">
                          <Image
                            src={item.flag}
                            width={"100%"}
                            height={"100%"}
                            radius="full"
                          />
                        </div>
                        <p className="font-medium text-medium text-default-800">
                          {item.name}
                        </p>
                      </div>

                      <p className="font-medium text-sm md:text-medium text-default-600">
                        {item.localName}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ChooseLanguageModal;

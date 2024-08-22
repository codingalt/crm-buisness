import React from "react";
import * as ai from "react-icons/ai";
import css from "./chat.module.scss";
import { useMediaQuery } from "@uidotdev/usehooks";
import Avvvatars from "avvvatars-react";
import { LuUserPlus2 } from "react-icons/lu";
import { Tooltip } from "@nextui-org/react";
import { useTranslation } from "react-i18next";

const ChatHeader = ({ selectedChat, activeChatMob, handleChatMob, onOpen }) => {
  const {t} = useTranslation()
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");

  return (
    <div className={`${css.chatHeader} shadow-sm border`}>
      {selectedChat && (
        <>
          {/* Mobile Back Button  */}
          {activeChatMob && (
            <div
              className={`cursor-pointer w-9 h-9 md:h-10 md:w-10 -ml-2.5 mr-1 flex items-center justify-center hover:bg-default-100 rounded-full transition-all`}
            >
              <ai.AiOutlineArrowLeft
                onClick={() => handleChatMob(false)}
                style={{
                  color: "#01AB8E",
                }}
                className="text-lg md:text-xl"
              />
            </div>
          )}

          <div className={css.image}>
            <Avvvatars
              value={selectedChat?.customer?.name}
              size={isSmallDevice ? 30 : 45}
            />
            {/* <Image
              src={null}
              width={isSmallDevice ? 40 : 48}
              height={isSmallDevice ? 40 : 48}
              fallbackSrc={`https://placehold.co/${
                isSmallDevice ? "40x40" : "48x48"
              }`}
              radius="full"
              loading="lazy"
            /> */}
          </div>
          <div className={css.chatProfile}>
            <div className={css.name}>{selectedChat?.customer?.name}</div>
            {/* <div className={css.onlineStatus}>
              {selectedChat?.customer?.email}
            </div> */}
          </div>

          {/* Assign Chat to Employee Icon  */}
          {selectedChat.assigned_to ? (
            <div className="hidden absolute right-3 top-1/2 ml-auto transform -translate-y-1/2 md:flex items-center justify-center px-3 py-1 text-[#989898] text-[12px] font-medium bg-[#ECFAFE] rounded-full">
              {t("assignedTo")}{" "}
              <span className="text-[#1F84A3] font-medium ml-[3px]">
                {selectedChat.assigned_to.employee.user.name}
              </span>
            </div>
          ) : (
            <Tooltip size="sm" content={t("assignChatToEmployees")}>
              <div
                onClick={onOpen}
                className="absolute -right-1 md:right-1 top-1/2 text-default-700 text-[20px] md:text-[21px] cursor-pointer w-9 h-9 md:w-10 md:h-10 transform -translate-x-1/2 -translate-y-1/2 border flex items-center justify-center hover:bg-default-100 rounded-full transition-all"
              >
                <LuUserPlus2 />
              </div>
            </Tooltip>
          )}
        </>
      )}
    </div>
  );
};

export default ChatHeader;

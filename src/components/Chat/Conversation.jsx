import React from "react";
import css from "./chat.module.scss";
import { useMediaQuery } from "@uidotdev/usehooks";
import Avvvatars from "avvvatars-react";
import { truncateText } from "@/utils/helpers/helpers";

const Conversation = ({ chat, chatId, handleChatMob }) => {
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
  const isMediumDevice = useMediaQuery(
    "only screen and (min-width : 769px) and (max-width : 992px)"
  );
  const isLargeDevice = useMediaQuery(
    "only screen and (min-width : 993px) and (max-width : 1200px)"
  );

  return (
    <li
      onClick={handleChatMob}
      className={chat.id === parseInt(chatId) ? css.activeChat : ""}
    >
      <div className={css.image}>
        <Avvvatars value={chat.customer.name} size={isSmallDevice ? 47 : 51} />
      </div>
      <div className={css.cDetail}>
        <div className={css.name}>{chat.customer.name}</div>
        {chat.assigned_to ? (
          <p
            style={{ lineHeight: "9px" }}
            className="py-1.5 mb-[14px] bg-[#ECFAFE] w-fit px-2.5 rounded-full text-[#989898] text-[10px] font-medium"
          >
            Assigned to{" "}
            <span className="text-[#1F84A3] font-medium ml-[3px]">
              {truncateText(
                chat.assigned_to.employee.user.name,
                isSmallDevice ? 16 : isMediumDevice || isLargeDevice ? 6 : 18
              )}
            </span>
          </p>
        ) : (
          <div className={css.preview}>Click to View Messages.</div>
        )}
      </div>
    </li>
  );
};

export default Conversation;

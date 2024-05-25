import React, { useEffect, useState } from "react";
import * as ai from "react-icons/ai";
import css from "./chat.module.scss";
import { Image } from "@nextui-org/react";
import { useMediaQuery } from "@uidotdev/usehooks";
import Avvvatars from "avvvatars-react";

const ChatHeader = ({ selectedChat, activeChatMob, handleChatMob }) => {
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");

  return (
    <div className={`${css.chatHeader} shadow-sm border`}>
      {selectedChat && (
        <>
          {/* Mobile Back Button  */}
          <div className={css.mobileBackButton}>
            {activeChatMob && (
              <ai.AiOutlineArrowLeft
                onClick={() => handleChatMob(false)}
                style={{
                  fontSize: "1.2rem",
                  marginLeft: "5px",
                  marginRight: "15px",
                  color: "#01AB8E",
                }}
              />
            )}
          </div>

          <div className={css.image}>
            <Avvvatars
              value={selectedChat?.customer?.name}
              size={isSmallDevice ? 39 : 48}
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
            <div className={css.onlineStatus}>Online</div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatHeader;

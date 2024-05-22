import React, { useEffect, useState } from "react";
import defaultProfile from "@/assets/avatar.png";
import * as ai from "react-icons/ai";
import css from "./chat.module.scss";
import { Image } from "@nextui-org/react";

const ChatHeader = ({ selectedChat }) => {
  return (
    <div className={`${css.chatHeader} shadow-sm border`}>
      {selectedChat && (
        <>
          <div className={css.image}>
            <Image
              src={null}
              width={48}
              height={48}
              fallbackSrc={`https://placehold.co/48x48`}
              radius="full"
              loading="lazy"
            />
          </div>
          <div className={css.chatProfile}>
            <div className={css.name}>
              {selectedChat?.customer?.name}
            </div>
            <div className={css.onlineStatus}>Online</div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatHeader;

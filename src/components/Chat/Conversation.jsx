import React from "react";
import * as bi from "react-icons/bi";
import defaultProfile from "@/assets/avatar.png";
import css from "./chat.module.scss";
import { Image } from "@nextui-org/react";
import { useMediaQuery } from "@uidotdev/usehooks";
import Avvvatars from "avvvatars-react";

const Conversation = ({ chat, chatId, handleChatMob }) => {
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");

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
        <div className={css.preview}>Click to View Messages.</div>
      </div>
    </li>
  );
};

export default Conversation;

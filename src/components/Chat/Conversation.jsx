import React from "react";
import * as bi from "react-icons/bi";
import defaultProfile from "@/assets/avatar.png";
import css from "./chat.module.scss";
import { Image } from "@nextui-org/react";

const Conversation = ({ chat, chatId }) => {
  return (
    <li className={chat.id === parseInt(chatId) ? css.activeChat : ""}>
      <div className={css.image}>
        <Image
          src={chat.profile}
          width={58}
          height={58}
          fallbackSrc={`https://placehold.co/58x58`}
          radius="full"
          loading="lazy"
        />
      </div>
      <div className={css.cDetail}>
        <div className={css.name}>{chat.customer.name}</div>
        <div className={css.preview}>Click to View Messages.</div>
      </div>
    </li>
  );
};

export default Conversation;

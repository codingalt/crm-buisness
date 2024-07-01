import React, { useContext, useEffect, useRef, useState } from "react";
import InputEmoji from "react-input-emoji";
import * as fi from "react-icons/fi";
import noChat from "@/assets/nochat.png";
import ScrollableFeed from "react-scrollable-feed";
import css from "./chat.module.scss";
import "./emoji.scss";
import { useSelector } from "react-redux";
import MessageSkeleton from "./MessageSkeleton";
import formatTimestamp from "@/hooks/customTimeFormatter";
import { DirectionContext } from "@/context/DirectionContext";
import Avvvatars from "avvvatars-react";
import { useMediaQuery } from "@uidotdev/usehooks";

const ChatBody = ({
  messages,
  selectedChat,
  newMessage,
  handleKeyDown,
  handleChange,
  handleSendMessage,
  isLoadingMessages,
  businessData,
}) => {
  const { user } = useSelector((state) => state.auth);
  
  const { direction } = useContext(DirectionContext);
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");

  const checkMessageType = (message) => {
  
    if (
      message.sender_id === businessData?.business?.id &&
      message.sender_type === `App\\Models\\Business`
    ) {
      return 0;
    } else {
      return 1;
    }
  };

  return (
    <>
      <div className={`${css.chatBody}`}>
        <ScrollableFeed>
          {isLoadingMessages ? (
            <MessageSkeleton />
          ) : selectedChat ? (
            messages?.map((message, index) => (
              <div
                className={
                  checkMessageType(message) === 0
                    ? css.myMessage
                    : css.messageBox
                }
                key={index}
              >
                {checkMessageType(message) === 0 ? (
                  <div className={css.image}>
                    <Avvvatars
                      value={user?.name}
                      size={isSmallDevice ? 35 : 46}
                    />
                  </div>
                ) : (
                  <div className={css.image}>
                    <Avvvatars
                      value={selectedChat?.customer?.name}
                      size={isSmallDevice ? 35 : 46}
                    />
                  </div>
                )}

                <div
                  className={
                    checkMessageType(message) === 0
                      ? `${css.message} ${css.own}`
                      : css.message
                  }
                >
                  <span>{message.body}</span>
                  <span>{formatTimestamp(message.created_at)}</span>
                </div>
              </div>
            ))
          ) : (
            <div className={css.noChatMessage}>
              <img src={noChat} alt="" />
              <span>Tap on the Chat to Start a Conversation</span>
            </div>
          )}
        </ScrollableFeed>

        {selectedChat ? (
          <div className={css.chatSender} dir={direction}>
            <InputEmoji
              value={newMessage}
              onKeyDown={handleKeyDown}
              onChange={handleChange}
              cleanOnEnter
              placeholder={"Type your message here"}
              inputClass={css.inputMessageBox}
            />
            <button
              disabled={newMessage === ""}
              className={css.sendButton}
              onClick={handleSendMessage}
            >
              <fi.FiSend />
            </button>
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default ChatBody;

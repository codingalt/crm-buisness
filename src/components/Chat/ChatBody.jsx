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
import FileUploader from "./FileUploader";
import { FaFileAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Image } from "@nextui-org/react";

const ChatBody = ({
  messages,
  selectedChat,
  newMessage,
  files,
  setFiles,
  filePreviews,
  setFilePreviews,
  handleKeyDown,
  handleChange,
  handleSendMessage,
  isLoadingMessages,
  businessData,
  isLoadingSendMessage,
  setIsOpenMediaModal,
}) => {
  const { user } = useSelector((state) => state.auth);
  const inputRef = useRef();
  const lastMessageRef = useRef();
  const [sources, setSources] = useState(null);

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

  useEffect(() => {
    if (filePreviews?.length > 0) {
      inputRef?.current.focus();
    }
  }, [filePreviews, inputRef]);

  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedChat]);

  return (
    <>
      <div className={`${css.chatBody}`} ref={chatContainerRef}>
        {isLoadingMessages ? (
          <MessageSkeleton />
        ) : selectedChat ? (
          messages?.map((message, index) => (
            <div
              className={
                checkMessageType(message) === 0 ? css.myMessage : css.messageBox
              }
              key={index}
              style={{
                flexDirection:
                  message.files && message.files.length > 0 ? "row" : undefined,
                gap: message.files && message.files.length > 0 ? 0 : undefined,
                zIndex: 30,
                paddingBottom: index === messages.length - 1 && "23px",
              }}
              ref={index === messages.length - 1 ? lastMessageRef : null}
            >
              <div className="flex justify-end gap-x-2.5 mb-5">
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

                <div className="max-w-80">
                  {message.body && message.body !== "" && (
                    <div
                      className={
                        checkMessageType(message) === 0
                          ? `${css.message} ${css.own} ${css.fileMessage}`
                          : `${css.message} ${css.fileMessage}`
                      }
                      style={
                        message.files && message.files.length > 0
                          ? {
                              backgroundColor: "transparent",
                              color: "#000",
                              padding: "0.1rem .4rem",
                              marginTop: ".4rem",
                            }
                          : {}
                      }
                    >
                      <span>{message.body}</span>
                      <span
                        style={
                          message.files && message.files.length > 0
                            ? { display: "none" }
                            : {}
                        }
                      >
                        {formatTimestamp(message.created_at)}
                      </span>
                    </div>
                  )}

                  {/* Show Mesage Files If attatched  */}
                  {message.files && message.files?.length > 0 && (
                    <div
                      className={
                        checkMessageType(message) === 0 ? `` : css.message
                      }
                      style={{
                        backgroundColor: "transparent",
                        padding: ".5rem .6rem",
                        marginRight: 0,
                        paddingRight: 0,
                      }}
                    >
                      <div className="w-full mt-1 min-h-52 min-w-52 flex flex-wrap flex-col items-center justify-end gap-x-3 gap-y-4">
                        {message?.files?.map((file, index) => (
                          <div key={index} className="w-full h-full">
                            {file.type.startsWith("image/") ? (
                              <div className="w-full cursor-zoom-in z-0 h-full rounded-xl flex items-center justify-center object-cover">
                                <Image
                                  src={file.src}
                                  alt={file.name}
                                  className="object-cover align-middle w-full rounded-xl z-0"
                                  loading="lazy"
                                  onClick={() =>
                                    setIsOpenMediaModal(file)
                                  }
                                />
                                {/* <ViewMediaGallery file={file} /> */}
                                {/* <ViewMediaGallery
                                  galleryID="my-test-gallery"
                                  file={file}
                                /> */}
                              </div>
                            ) : file.type.startsWith("video/") ? (
                              <div className="w-full md:h-full rounded-xl flex items-center justify-center">
                                <video
                                  controls
                                  src={file.src}
                                  alt={file.name}
                                  className="object-cover align-middle w-full h-full rounded-lg md:rounded-xl"
                                />
                              </div>
                            ) : (
                              <Link
                                to={file.src}
                                target="_blank"
                                download={file.src}
                              >
                                <div className="w-full max-w-sm flex items-center gap-x-3 py-2.5 px-4 pr-6 rounded-xl shadow border bg-slate-50 text-default-800 hover:text-blue-600 transition-all">
                                  <div className="w-12 h-12 bg-blue-500 text-2xl flex items-center justify-center rounded-xl">
                                    <FaFileAlt className="text-white" />
                                  </div>
                                  <span>{file?.name?.slice(0, 24)}</span>
                                </div>
                              </Link>
                            )}
                          </div>
                        ))}
                        {/* TimeStamp  */}
                        <span
                          className="text-xs md:text-sm ml-auto -mt-1.5 text-default-600 text-right mr-0.5"
                          style={
                            message.files && message.files.length > 0
                              ? { display: "block" }
                              : { display: "none" }
                          }
                        >
                          {formatTimestamp(message.created_at)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={css.noChatMessage}>
            <img src={noChat} alt="" />
            <span className="text-center">
              Tap on the Chat to Start a Conversation
            </span>
          </div>
        )}

        {selectedChat ? (
          <div className={css.chatSender} dir={direction}>
            {/* Upload File Button  */}
            <FileUploader
              setFiles={setFiles}
              filePreviews={filePreviews}
              setFilePreviews={setFilePreviews}
              isLoadingSendMessage={isLoadingSendMessage}
            />

            <InputEmoji
              value={newMessage}
              onKeyDown={handleKeyDown}
              onChange={handleChange}
              cleanOnEnter
              placeholder={"Type your message here"}
              inputClass={css.inputMessageBox}
              ref={inputRef}
            />
            <button
              disabled={
                isLoadingSendMessage ||
                (files?.length === 0 && newMessage?.trim() === "")
                  ? true
                  : false
              }
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

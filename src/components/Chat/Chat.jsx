import React, { useEffect, useRef, useState } from "react";
import css from "./chat.module.scss";
import Conversation from "./Conversation";
import * as bi from "react-icons/bi";
import ChatBody from "./ChatBody";
import ChatHeader from "./ChatHeader";
import { useSelector } from "react-redux";
import {
  useGetConversationsQuery,
  useOneOoneCommunicationQuery,
  useReadMessagesMutation,
  useSendMessageMutation,
} from "@/services/api/chat/chatApi";
import ConversationSkeleton from "./ConversationSkeleton";
import { useLocation, useNavigate } from "react-router-dom";
import { TbMessage } from "react-icons/tb";
import { useGetBusinessProfileQuery } from "@/services/api/profileApi/profileApi";
import { useMediaQuery } from "@uidotdev/usehooks";
import { useDisclosure } from "@nextui-org/react";
import AssignChatModal from "./AssignChatModal";
import ViewMediaModal from "./ViewMediaModal";
import { usePusherContext } from "@/context/PusherContext";
import { debounce } from "lodash";

const Chat = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const echo = usePusherContext();
  const searchParams = new URLSearchParams(location.search);
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
  const chatId = searchParams.get("chatId");
  const [activeChatMob, setActiveChatMob] = useState(
    isSmallDevice ? (chatId ? true : false) : false
  );
  const [searchQuery, setSearchQuery] = useState("");

  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [files, setFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isOpenMediaModal, setIsOpenMediaModal] = useState(null);

  const handleChatMob = () => {
    if (isSmallDevice) {
      setActiveChatMob(true);
    }
  };

  const { user } = useSelector((state) => state.auth);

  const props = {
    user_type: "seller",
    receiver_id: selectedChat?.customer?.id,
  };

  // Get Business Profile
  const { data: businessData } = useGetBusinessProfileQuery();

  // Get Conversations
  const {
    data: conversations,
    isLoading: isLoadingConversations,
    refetch: refetchChats,
    isUninitialized,
  } = useGetConversationsQuery(props, {
    skip: !user || selectedChat,
  });

  // Read Messages Mutation
  const [readMessages, resp] = useReadMessagesMutation();

  const handleReadMessages = async (selectedChatId) => {
    // Update State Count First
    setChats((prevChats) => {
      return prevChats.map((chatItem) => {
        if (chatItem.id === selectedChatId) {
          return {
            ...chatItem,
            unread_messages: 0,
          };
        }
        return chatItem;
      });
    });

    // Send Request to Api
    await readMessages({
      communication_id: selectedChatId,
      user_type: "seller",
    });
  };

  useEffect(() => {
    if (conversations) {
      setChats(conversations?.communications);
    }
  }, [conversations]);

  useEffect(() => {
    const handleNewMessage = (data) => {
      setMessages((prevMessages) => [...prevMessages, data.message]);
    };

    const increaseUnreadMessages = (chatId) => {
      setChats((prevChats) => {
        return prevChats.map((chat) => {
          if (chat.id === chatId) {
            return {
              ...chat,
              unread_messages: (chat.unread_messages || 0) + 1,
            };
          }
          return chat;
        });
      });
    };

    // Array to store all subscribed channel names
    const subscribedChannels = [];

    if (echo && conversations) {
      // Listen to the private channels for the 'private_channel' event
      // Subscribe to Pusher channels for each communication/chat
      conversations.communications.forEach((item) => {
        const channelName = `chat.${item.id}`;
        subscribedChannels.push(channelName);

        echo.private(channelName).listen("NewMessage", (e) => {
          if (e?.message?.sender_type !== `App\\Models\\Business`) {
            if (
              selectedChat &&
              e.message.communication_id === selectedChat?.id
            ) {
              // Read Messages
              const debouncedHandleReadMessages = debounce(
                handleReadMessages,
                1000
              );
              debouncedHandleReadMessages(parseInt(chatId));

              // It means chat is open. process received message
              handleNewMessage(e);
            } else {
              // It means chat is closed. Increase unread_messages count
              increaseUnreadMessages(e.message.communication_id);
            }
          }
        });
      });
    }

    // Clean up the subscription when the component is unmounted
    return () => {
      subscribedChannels.forEach((channelName) => {
        if (echo) {
          echo.leave(channelName);
        }
      });
    };
  }, [conversations, echo]);

  // Get oneOone Communication | Messages
  const { data: messagesData } = useOneOoneCommunicationQuery(props, {
    refetchOnMountOrArgChange: true,
    skip: !selectedChat,
  });

  // Send Message Mutation
  const [sendMessage, res] = useSendMessageMutation();
  const { isLoading: isLoadingSendMessage } = res;

  useEffect(() => {
    if (messagesData) {
      setMessages(messagesData?.communication?.messages);
      setIsLoadingMessages(false);
    }
  }, [messagesData, activeChatMob]);

  // Check If ChatId is present in the Url
  useEffect(() => {
    if (chatId) {
      const chat = chats?.find((chat) => chat.id === parseInt(chatId));
      if (chat) {
        setSelectedChat(chat);

        // Read Messages
        if (parseInt(chat.unread_messages) > 0) {
          const debouncedHandleReadMessages = debounce(
            handleReadMessages,
            1000
          );
          debouncedHandleReadMessages(parseInt(chatId));
        }
      }
    }
  }, [chatId, chats]);

  const updateSearchParams = (newChatId) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("chatId", newChatId);
    navigate({ search: searchParams.toString() });
  };

  // Execute when any chat from left side is clicked
  const handleChatClick = (chat) => {
    if (selectedChat?.id != chat.id) {
      setIsLoadingMessages(true);
    }

    // Read Messages
    if (parseInt(chat.unread_messages) > 0) {
      const debouncedHandleReadMessages = debounce(handleReadMessages, 1000);
      debouncedHandleReadMessages(chat.id);
    }

    setSelectedChat(chat);
    updateSearchParams(chat.id);
  };

  console.log(messages);

  // Send Message
  const handleSendMessage = async () => {
    if (newMessage.trim() !== "" || files.length > 0) {
      if (files.length === 0) {
        setNewMessage("");
      }

      const tempId = `temp-${Date.now()}`;
      let formData = new FormData();
      if (newMessage?.trim() !== "") {
        formData.append("body", newMessage.trim());
      }
      formData.append("user_type", `seller`);

      for (let i = 0; i < files.length; i++) {
        formData.append("files[]", files[i]);
      }

      const tempMessage = {
        id: tempId,
        body: newMessage,
        communication_id: selectedChat.id,
        sender_id: businessData?.business?.id,
        sender_type: `App\\Models\\Business`,
        files: filePreviews,
        filePreviews: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (files.length === 0) {
        setMessages([...messages, tempMessage]);
      }
      const { data } = await sendMessage({
        chatId: selectedChat.id,
        data: formData,
      });

      if (files.length > 0) {
        setMessages([...messages, tempMessage]);
      }

      setFiles([]);
      setFilePreviews([]);
      setNewMessage("");

      if (!data || !data.success) {
        // If message failed to be sent
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg.id !== tempId)
        );
      }
    }
  };

  const handleChange = (newMessage) => {
    setNewMessage(newMessage);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter conversations based on search query
  const filteredConversations = chats?.filter((chat) =>
    chat.customer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Assign Chat to Employee Modal  */}
      {isOpen && (
        <AssignChatModal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          communicationId={selectedChat?.id}
          refetchChats={refetchChats}
          isUninitialized={isUninitialized}
        />
      )}

      {/* View Media Modal  */}
      <ViewMediaModal
        isOpen={isOpenMediaModal}
        setIsOpen={setIsOpenMediaModal}
      />

      <div className="w-full xl:max-w-screen-xl md:max-w-screen-2xl mx-auto px-0 md:px-4 pt-1 md:pt-5 pb-0 max-h-[79.5vh]">
        <div className={css.chatWrapper}>
          <div className={css.chatContainer}>
            <div
              className={`${css.chatLeft} shadow-sm border`}
              style={activeChatMob ? { display: "none" } : { display: "block" }}
            >
              <div className={css.cLeftHeading}>
                <span>Chats</span>
              </div>
              <div className={`${css.chatSearch}`}>
                <bi.BiSearch />
                <input
                  type="text"
                  value={searchQuery}
                  placeholder="SEARCH"
                  onChange={handleSearchChange}
                />
              </div>

              {/* Conversations  */}
              <div className={`${css.conversation} border-t-1`}>
                <ul
                  style={
                    isLoadingConversations ? { scrollbarWidth: "none" } : {}
                  }
                >
                  {isLoadingConversations ? (
                    <ConversationSkeleton />
                  ) : (
                    filteredConversations?.map((chat, index) => (
                      <div
                        key={chat.id}
                        onClick={() =>
                          chat.id === parseInt(chatId)
                            ? null
                            : handleChatClick(chat)
                        }
                      >
                        <Conversation
                          chat={chat}
                          chatId={chatId}
                          handleChatMob={handleChatMob}
                        />
                      </div>
                    ))
                  )}

                  {/* No Conversation Message  */}
                  {!isLoadingConversations && chats?.length === 0 && (
                    <div className="w-full h-full flex gap-y-3 items-center justify-center px-20 text-center flex-col">
                      <TbMessage fontSize={60} color="#01AB8E" />
                      <p className="text-tiny text-default-500 font-medium">
                        Messages from your customer will appear here.
                      </p>
                    </div>
                  )}
                </ul>
              </div>
            </div>

            {/* Messages  */}

            {
              <div
                className={
                  activeChatMob
                    ? `${css.chatRight} ${css.active_chat_section}`
                    : css.chatRight
                }
              >
                <ChatHeader
                  selectedChat={selectedChat}
                  activeChatMob={activeChatMob}
                  handleChatMob={setActiveChatMob}
                  onOpen={onOpen}
                />

                <div className={`${css.messageContainer} shadow-sm border`}>
                  <ChatBody
                    selectedChat={selectedChat}
                    newMessage={newMessage}
                    handleKeyDown={handleKeyDown}
                    handleChange={handleChange}
                    messages={messages}
                    handleSendMessage={handleSendMessage}
                    isLoadingMessages={isLoadingMessages}
                    businessData={businessData}
                    files={files}
                    setFiles={setFiles}
                    filePreviews={filePreviews}
                    setFilePreviews={setFilePreviews}
                    isLoadingSendMessage={isLoadingSendMessage}
                    setIsOpenMediaModal={setIsOpenMediaModal}
                  />
                </div>
                {/* end of message container div  */}
              </div>
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;

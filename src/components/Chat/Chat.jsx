import React, { useEffect, useRef, useState } from "react";
import css from "./chat.module.scss";
import Conversation from "./Conversation";
import * as bi from "react-icons/bi";
import ChatBody from "./ChatBody";
import ChatHeader from "./ChatHeader";
import { Container } from "@mui/material";
import { useSelector } from "react-redux";
import {
  useGetConversationsQuery,
  useOneOoneCommunicationQuery,
  useSendMessageMutation,
} from "@/services/api/chat/chatApi";
import ConversationSkeleton from "./ConversationSkeleton";
import { useLocation, useNavigate } from "react-router-dom";
import { TbMessage } from "react-icons/tb";
import { useGetBusinessProfileQuery } from "@/services/api/profileApi/profileApi";
import { useMediaQuery } from "@uidotdev/usehooks";
import { usePusher } from "@/context/PusherContext";

const Chat = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const chatId = searchParams.get("chatId");
  const [activeChatMob, setActiveChatMob] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
  const pusher = usePusher();
  const channelsRef = useRef({});
  const [messages, setMessages] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");

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
  const { data: conversations, isLoading: isLoadingConversations } =
    useGetConversationsQuery(props, { skip: !user || selectedChat });

 useEffect(() => {
   if (conversations && pusher) {
     const handleNewMessage = (data) => {
       setMessages((prevMessages) => [...prevMessages, data.message]);
     };

     // Subscribe to Pusher channels for each communication
     conversations.communications.forEach((item) => {
       const channelName = `channel.${item.id}`;

       // Check if the channel is already subscribed
       if (!channelsRef.current[channelName]) {
         const channel = pusher.subscribe(channelName);
         channel.bind("NewMessage", handleNewMessage);
         channelsRef.current[channelName] = channel; // Store the channel in the ref
       }
     });

     // Cleanup function to unsubscribe from all channels
     return () => {
       Object.keys(channelsRef.current).forEach((channelName) => {
         const channel = channelsRef.current[channelName];
         channel.unbind("NewMessage", handleNewMessage);
         pusher.unsubscribe(channelName);
         delete channelsRef.current[channelName]; // Remove the channel from the ref
       });
     };
   }
 }, [conversations, pusher]);

  // Get oneOone Communication | Messages
  const {
    data: messagesData,
    isFetching: isLoadingMessages,
    refetch,
  } = useOneOoneCommunicationQuery(props, {
    refetchOnMountOrArgChange: true,
    skip: !selectedChat,
  });

  // Send Message
  const [sendMessage, res] = useSendMessageMutation();

  useEffect(() => {
    if (messagesData) {
      setMessages(messagesData?.communications?.messages);
    }
  }, [messagesData]);

  // Check If ChatId is present in the Url
  useEffect(() => {
    if (chatId) {
      setSelectedChat(
        conversations?.communications?.find(
          (chat) => chat.id === parseInt(chatId)
        )
      );
    }
  }, [chatId, conversations]);

  const updateSearchParams = (newChatId) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("chatId", newChatId);
    navigate({ search: searchParams.toString() });
  };

  const handleChatClick = (chat) => {
    setSelectedChat(chat);
    updateSearchParams(chat.id);
  };

  // Send Message
  const handleSendMessage = async () => {
    if (newMessage) {
      setNewMessage("");

      const tempId = `temp-${Date.now()}`;
      const tempMessage = {
        id: tempId,
        body: newMessage,
        communication_id: selectedChat.id,
        sender_id: businessData?.business?.id,
        sender_type: `App\\Models\\Business`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setMessages([...messages, tempMessage]);
      const { data } = await sendMessage({
        chatId: selectedChat.id,
        body: newMessage,
        user_type: "seller",
      });

      if (!data.success) {
        // If message failed to be sent
        console.log("Message failed to be sent");
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
  const filteredConversations = conversations?.communications?.filter((chat) =>
    chat.customer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
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
                style={isLoadingConversations ? { scrollbarWidth: "none" } : {}}
              >
                {isLoadingConversations ? (
                  <ConversationSkeleton />
                ) : (
                  filteredConversations?.map((chat, index) => (
                    <div key={chat.id} onClick={() => handleChatClick(chat)}>
                      <Conversation
                        chat={chat}
                        chatId={chatId}
                        handleChatMob={handleChatMob}
                      />
                    </div>
                  ))
                )}

                {/* No Conversation Message  */}
                {!isLoadingConversations &&
                  conversations?.communications?.length === 0 && (
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
              // className={css.chatRight}
            >
              <ChatHeader
                selectedChat={selectedChat}
                activeChatMob={activeChatMob}
                handleChatMob={setActiveChatMob}
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
                />
              </div>
              {/* end of message container div  */}
            </div>
          }
        </div>
      </div>
    </div>
  );
};

export default Chat;

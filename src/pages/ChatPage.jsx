import Chat from "@/components/Chat/Chat";
import Layout from "@/components/Layout/Layout";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ChatPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (user) {
      const canSee =
        user.employee &&
        user.flags.roles.some((role) => role.name === "can_chat");
      if (user.owner || canSee) {
        setShow(true);
      } else {
        navigate(-1);
      }
    }
  }, [user, navigate]);

  return <Layout children={show && <Chat />} options={{ overflow: false }} />;
};

export default ChatPage;

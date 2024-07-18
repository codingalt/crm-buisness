import React, { createContext, useContext, useEffect, useState } from "react";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import useToken from "@/hooks/useToken";

const PusherContext = createContext(null);

export const PusherProvider = ({ children }) => {
  const token = useToken();
  const [echo, setEcho] = useState(null);

  useEffect(() => {
    if (token) {
      const newEcho = new Echo({
        broadcaster: "pusher",
        key: import.meta.env.VITE_PUSHER_KEY,
        cluster: "ap1",
        forceTLS: true,
        encrypted: true,
        authEndpoint: import.meta.env.VITE_PUSHER_AUTH,
        auth: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      });

      setEcho(newEcho);
    } else {
      if (echo) {
        echo.disconnect();
        setEcho(null);
      }
    }
  }, [token]);

  return (
    <PusherContext.Provider value={echo}>{children}</PusherContext.Provider>
  );
};

export const usePusherContext = () => {
  return useContext(PusherContext);
};

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
} from "react";
import Pusher from "pusher-js";

const PusherContext = createContext(null);

export const PusherProvider = ({ children }) => {
  const pusherRef = useRef(null);
  const authToken = localStorage.getItem("crmBusinessToken");
 
  useEffect(() => {
    // Initialize Pusher
    pusherRef.current = new Pusher("780f80aa730f317c2da5", {
      cluster: "ap1",
      encrypted: true,
      channelAuthorization: {
        endpoint: `${import.meta.env.VITE_URI}broadcasting/auth`,
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Access-Control-Allow-Origin": "*",
        },
      },
    });
    
    // Cleanup function to unsubscribe from the channel
    return () => {
      pusherRef.current.disconnect();
    };
  }, []);

  return (
    <PusherContext.Provider value={pusherRef.current}>
      {children}
    </PusherContext.Provider>
  );
};

export const usePusher = () => {
  return useContext(PusherContext);
};

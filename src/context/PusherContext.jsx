import React, { createContext, useContext, useEffect, useRef } from "react";
import Pusher from "pusher-js";

const PusherContext = createContext(null);

export const PusherProvider = ({ children }) => {
  const pusherRef = useRef(null);
  const authToken = localStorage.getItem("crmBusinessToken");

  // useEffect(() => {
  //   // Initialize Pusher
  //   pusherRef.current = new Pusher("c97e34cef67351b4f948", {
  //     cluster: "ap1",
  //     secret: "secret",
  //     encrypted: true,
  //     authEndpoint: `${import.meta.env.VITE_URI}broadcasting/auth`,
  //     auth: {
  //       headers: {
  //         Authorization: `Bearer 1000`,
  //         "Content-Type": "application/json",
  //       },
  //     },
  //   });

  //   const channel = pusherRef.current.subscribe("messages");
  //   console.log(channel);

  //   // Listening to the 'PrivateEvent' event
  //   channel.bind("PrivateMessageSent", (data) => {
  //     console.log("New message:", data);
  //     alert(data);
  //   });

  //   // Cleanup function to unsubscribe from the channel
  //   return () => {
  //     pusherRef.current.disconnect();
  //   };
  // }, [authToken]);

  return (
    <PusherContext.Provider value={pusherRef.current}>
      {children}
    </PusherContext.Provider>
  );
};

export const usePusher = () => {
  return useContext(PusherContext);
};

// import React, { createContext, useContext, useEffect, useRef } from "react";
// import Pusher from "pusher-js";
// import axios from "axios";

// const PusherContext = createContext(null);

// export const PusherProvider = ({ children }) => {
//   const pusherRef = useRef(null);
//   const authToken = localStorage.getItem("crmBusinessToken");

//   useEffect(() => {
//     // Initialize Pusher
//     pusherRef.current = new Pusher("c97e34cef67351b4f948", {
//       cluster: "ap1",
//       encrypted: true,
//       userAuthentication: {
//         endpoint: "http://192.168.151.250/paycust/public/api/broadcasting/auth",
//         // headers: {
//         //   Authorization: `Bearer ${authToken}`,
//         //   "Content-Type": "application/json",
//         // },
//       },
//       // authorizer: (channel, options) => {
//       //   return {
//       //     authorize: (socketId, callback) => {
//       //       axios
//       //         .post(
//       //           "http://192.168.151.250/paycust/public/api/broadcasting/auth",
//       //           {
//       //             socket_id: socketId,
//       //             channel_name: channel.name,
//       //           },
//       //           {
//       //             headers: {
//       //               "Authorization": `Bearer ${authToken}`,
//       //               "Content-Type": "application/json",
//       //             },
//       //           }
//       //         )
//       //         .then((response) => {
//       //           callback(false, response.data);
//       //         })
//       //         .catch((error) => {
//       //           callback(true, error);
//       //         });
//       //     },
//       //   };
//       // },

//       // channelAuthorization: {
//       //   endpoint: `http://192.168.151.250/paycust/public/api/broadcasting/auth`,
//       //   headers: {
//       //     Authorization: `Bearer ${authToken}`,
//       //     // "Access-Control-Allow-Origin": "*",
//       //     Accept: "application/json",
//       //   },
//       // },
//     });

//     // const channel = pusherRef.current.subscribe("private-channel.1");
//     // channel.bind("private_channel", (data) => {
//     //   alert("listeinign", data);
//     // });

//     const channel = pusherRef.current.subscribe("private-channel.10");

//     // Listening to the 'PrivateMessageSent' event
//     channel.bind("PrivateEvent", (data) => {
//       console.log("New message:", data);
//       alert(data);
//       // Handle the event data as needed
//     });

//     // Cleanup function to unsubscribe from the channel
//     return () => {
//       pusherRef.current.disconnect();
//     };
//   }, []);

//   return (
//     <PusherContext.Provider value={pusherRef.current}>
//       {children}
//     </PusherContext.Provider>
//   );
// };

// export const usePusher = () => {
//   return useContext(PusherContext);
// };

import React from "react";
import { Outlet } from "react-router-dom";
import ScrollRestore from "../components/ScrollRestore/ScrollRestore";
import "../styles/global.scss";
import { PusherProvider } from "@/context/PusherContext";

const Root = () => {
 
  return (
    <>
      {/* <PusherProvider> */}
        <wc-toast theme="light"></wc-toast>
        <div className="App w-full h-full">
          <ScrollRestore />
          <Outlet />
        </div>
      {/* </PusherProvider>  */}
    </>
  );
};

export default Root;

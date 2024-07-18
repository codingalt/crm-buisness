import React, { useContext, useEffect } from "react";
import { Outlet } from "react-router-dom";
import ScrollRestore from "../components/ScrollRestore/ScrollRestore";
import "../styles/global.scss";
import { DirectionContext } from "@/context/DirectionContext";
import { useDispatch } from "react-redux";
import { useJsApiLoader } from "@react-google-maps/api";
import { setIsLoaded } from "@/services/slices/auth/authSlice";

const libraries = ["places"];

const Root = () => {
 const { direction } = useContext(DirectionContext);
 const dispatch = useDispatch();
 const { isLoaded } = useJsApiLoader({
   id: "google-map-script",
   googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API,
   libraries, 
 });

 useEffect(() => {
   dispatch(setIsLoaded(isLoaded));
 }, [isLoaded, dispatch]);
 
  return (
    <>
      <wc-toast theme="light"></wc-toast>
      <div className="App w-full h-full" dir={direction}>
        <ScrollRestore />
        <Outlet />
      </div>
    </>
  );
};

export default Root;

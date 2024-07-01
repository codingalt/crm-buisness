import React from "react";
import notFound404 from "../../assets/404-computer.svg";
import { NavLink } from "react-router-dom";
import {Image} from "@nextui-org/react"

const NotFound = () => {
  return (
    <div className="scrollbar-hide w-full h-screen">
      <section className="flex items-center justify-center w-full h-full scrollbar-hide">
        <div className="px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div className="mx-auto max-w-screen-sm text-center">
            <div className="min-h-80">
              <Image
                className="mx-auto w-full RV8RoaI_SlEMC5CEQ3ms _9OKVeTXzfSwD_NYO6_G"
                src={notFound404}
                alt="404 Not Found"
              />
            </div>

            <h1 className="mb-4 text-2xl tracking-tight font-extrabold lg:text-2xl text-[#01AB8E]">
              404 Not Found
            </h1>
            <p className="mb-7 text-3xl tracking-tight font-bold md:text-3xl">
              Something's missing.
            </p>
            <NavLink
              to={"/"}
              className="inline-flex text-white bg-[#01AB8E] focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center my-4"
            >
              Back to Homepage
            </NavLink>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NotFound;

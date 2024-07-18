import React, { useRef } from "react";
import { MdClose } from "react-icons/md";
import ImagePlaceholder from "../ui/Image/ImagePlaceholder";
import { LiaDownloadSolid } from "react-icons/lia";
import { Link } from "react-router-dom";
import useClickOutside from "@/hooks/useClickOutside";

const ViewMediaModal = ({ isOpen, setIsOpen }) => {
    const ref = useRef();
  useClickOutside(ref, () => setIsOpen(null));

  return (
    <div
      className={`fixed top-0 left-0 right-0 bottom-0 transition-all ${
        isOpen ? "visible opacity-100" : "opacity-0 invisible"
      } h-screen w-screen overflow-hidden bg-black bg-opacity-95`}
      style={{ zIndex: 9999 }}
    >
      <div className="w-full h-full relative flex items-center justify-center py-16">
        {/* Close button */}
        <div className="absolute top-6 right-7 md:right-8 z-50">
          <div className="flex items-center gap-6 text-white text-3xl">
            <Link to={isOpen?.src} target="_blank" download={isOpen?.src}>
              <LiaDownloadSolid />
            </Link>
            <button
              onClick={() => setIsOpen(null)}
              className="bg-transparent outline-none border-none"
            >
              <MdClose />
            </button>
          </div>
        </div>

        {/* Media  */}
        <div className="w-full h-full max-w-3xl flex items-center justify-center">
          {/* Content goes here */}
          <img
            ref={ref}
            className="w-full align-middle"
            src={isOpen?.src}
            alt={isOpen?.name}
          />
        </div>
      </div>
    </div>
  );
};

export default ViewMediaModal;

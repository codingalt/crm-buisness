import React, { useRef } from "react";
import { GrAttachment } from "react-icons/gr";
import {
  FaFilePdf,
  FaFileArchive,
  FaFileAlt,
  FaFileVideo,
} from "react-icons/fa";
import css from "./chat.module.scss";
import { IoClose } from "react-icons/io5";
import ClipSpinner from "../Loader/ClipSpinner";
import { Oval } from "react-loader-spinner";

const FileUploader = ({
  setFiles,
  filePreviews,
  setFilePreviews,
  isLoadingSendMessage,
}) => {
  const fileRef = useRef();

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

  const openFile = (e) => {
    const selectedFiles = e.target.files;
    const filePaths = [];
    const previews = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];

      if (file.size > MAX_FILE_SIZE) {
        alert(`${file.name} exceeds the 10 MB file size limit.`);
        continue;
      }

      filePaths.push(file);

      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          previews.push({
            name: file.name,
            type: file.type,
            src: reader.result,
          });
          if (i === selectedFiles.length - 1) setFilePreviews(previews);
        };
        reader.readAsDataURL(file);
      } else if (file.type.startsWith("video/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          previews.push({
            name: file.name,
            type: file.type,
            src: reader.result,
          });
          if (i === selectedFiles.length - 1) setFilePreviews(previews);
        };
        reader.readAsDataURL(file);
      } else {
        let icon;
        if (file.type === "application/pdf") {
          icon = <FaFilePdf />;
        } else if (file.type === "application/zip") {
          icon = <FaFileArchive />;
        } else {
          icon = <FaFileAlt />;
        }
        previews.push({ name: file.name, type: "file", icon });
        if (i === selectedFiles.length - 1) setFilePreviews(previews);
      }
    }
    setFiles(filePaths);
  };

  return (
    <>
      <button
        onClick={() => fileRef?.current?.click()}
        size="sm"
        className={`${css.fileSelect} md:-mt-0.5 w-8 h-8 md:w-11 md:h-11 ml-1 md:ml-2 rounded-full bg-transparent text-default-800 text-lg md:text-2xl border-none outline-none hover:bg-default-100 transition-all flex items-center justify-center`}
      >
        <GrAttachment />
      </button>

      {/* Select file hidden input  */}
      <input
        ref={fileRef}
        type="file"
        id="filemsg"
        multiple
        name="filemsg"
        onChange={openFile}
        style={{ display: "none" }}
      />

      {/* Files Preview  */}
      <div
        className={`${
          filePreviews?.length > 0 ? "opacity-100 visible" : "opacity-0 hidden"
        } w-[95%] max-h-96 overflow-y-auto mx-auto transition-all duration-250 absolute bottom-[48px] md:bottom-[51px] left-3 right-3 z-50 bg-white rounded-xl px-5 md:px-6 pt-3 pb-5 border border-default-200 shadow-md`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl text-default-800 font-semibold">
            Files Preview
          </h3>
          <button
            onClick={() => {
              setFilePreviews([]);
              setFiles([]);
            }}
            className="h-7 w-7 rounded-full flex items-center justify-center outline-none border-none bg-slate-100 text-default-800 text-lg cursor-pointer"
          >
            <IoClose />
          </button>
        </div>
        <div className="w-full flex flex-wrap items-center gap-x-3 md:gap-x-3 gap-y-4">
          {filePreviews?.map((file, index) => (
            <div key={index}>
              {file.type.startsWith("image/") ? (
                <div className="w-32 h-16 md:w-36 md:h-24 relative bg-slate-50 rounded-lg md:rounded-xl flex items-center justify-center">
                  <img
                    src={file.src}
                    alt={file.name}
                    className="object-cover align-middle w-full h-full rounded-lg md:rounded-xl"
                  />

                  {/* Show Loader when files are uploading  */}
                  {isLoadingSendMessage && (
                    <div className="absolute top-0 left-0 right-0 bottom-0 w-full h-full z-50">
                      <div className="flex items-center justify-center w-full h-full bg-black bg-opacity-60 rounded-lg">
                        <div className=" text-white text-2xl flex items-center justify-center">
                          <Oval
                            visible={true}
                            height="55"
                            width="55"
                            color="#4fa94d"
                            ariaLabel="oval-loading"
                            wrapperClass=""
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : file.type.startsWith("video/") ? (
                <div className="w-32 h-20 md:w-52 md:h-32 relative bg-slate-50 rounded-lg md:rounded-xl flex items-center justify-center">
                  <video
                    controls
                    src={file.src}
                    alt={file.name}
                    className="object-cover align-middle w-full h-full rounded-lg md:rounded-xl"
                  />

                  {/* Show Loader when files are uploading  */}
                  {isLoadingSendMessage && (
                    <div className="absolute top-0 left-0 right-0 bottom-0 w-full h-full z-50">
                      <div className="flex items-center justify-center w-full h-full bg-black bg-opacity-60 rounded-lg">
                        <div className=" text-white text-2xl flex items-center justify-center">
                          <Oval
                            visible={true}
                            height="55"
                            width="55"
                            color="#4fa94d"
                            secondaryColor="#fff"
                            ariaLabel="oval-loading"
                            wrapperClass=""
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex relative items-center gap-x-3 py-2.5 px-4 pr-6 rounded-xl shadow border bg-blue-50">
                  <div className="w-12 h-12 bg-blue-500 text-white text-2xl flex items-center justify-center rounded-xl">
                    {file.icon}
                  </div>
                  <span className="text-default-800">
                    {file.name.slice(0, 24)}
                  </span>

                  {/* Show Loader when files are uploading  */}
                  {isLoadingSendMessage && (
                    <div className="absolute top-0 left-0 right-0 bottom-0 w-full h-full z-50">
                      <div className="flex items-center justify-center w-full h-full bg-black bg-opacity-60 rounded-lg">
                        <div className=" text-white text-2xl flex items-center justify-center">
                          <Oval
                            visible={true}
                            height="55"
                            width="55"
                            color="#4fa94d"
                            ariaLabel="oval-loading"
                            wrapperClass=""
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default FileUploader;

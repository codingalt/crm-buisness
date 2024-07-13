import React, { useEffect, useState } from "react";
import errorImage from "@/assets/errorImage.png";

const ImagePlaceholder = ({
  src,
  className,
  isZoomed = false,
  radius,
  width = "100%",
  height = "100%",
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageLoaded(true);
    };

    img.onerror = () => {
      setIsError(true);
    };
    img.src = src;
  }, [src]);

  if (isError) {
    return (
      <div
        className={`shadow-black/5 shadow-none group relative overflow-hidden bg-content3 before:opacity-100 before:absolute before:inset-0 before:-translate-x-full before:border-t before:border-content4/30 before:bg-gradient-to-r before:from-transparent before:via-content4 before:to-transparent after:opacity-100 after:absolute after:inset-0 after:-z-10 after:bg-content3 rounded-small`}
        style={{
          maxWidth: "100%",
          width: width,
          height: height,
          borderRadius: radius ? radius : 0,
        }}
      >
        {/* If Image Fails to Load  */}
        <div
          style={{
            display: !isError ? "none" : "flex",
            borderRadius: radius ? radius : "0px",
          }}
          className="h-full w-full flex items-center justify-center"
        >
          <img
            src={errorImage}
            style={{ width: "100%", margin: "auto", transform: "scale(.52)" }}
            loading="lazy"
            alt="Image"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${
        !imageLoaded &&
        "shadow-black/5 shadow-none bg-content3 before:opacity-100 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_3s_infinite] before:border-t before:border-content4/30 before:bg-gradient-to-r before:from-transparent before:via-content4 before:to-transparent after:opacity-100 after:absolute after:inset-0 after:-z-10 after:bg-content3"
      } rounded-small group relative overflow-hidden bg-transparent`}
      style={{
        maxWidth: "100%",
        width: width,
        height: height,
        borderRadius: radius ? radius : 0,
      }}
    >
      <div
        className="relative z-0 overflow-hidden rounded-inherit rounded-small"
        style={{ borderRadius: radius ? radius : 0 }}
      >
        <img
          src={src}
          className={`relative z-10 shadow-black/5 ${
            imageLoaded && "opacity-100"
          } shadow-none object-cover transform ${
            isZoomed && "hover:scale-125"
          } opacity-0 z-0 transition-transform-opacity motion-reduce:transition-none !duration-300 rounded-small`}
          width="100%"
          height="100%"
          loading="lazy"
          style={{ borderRadius: radius ? radius : 0 }}
        />
      </div>
    </div>
  );
};

export default ImagePlaceholder;

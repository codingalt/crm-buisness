import React, { useEffect } from "react";
import LightGallery from "lightgallery/react";

// import styles
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";
import "lightgallery/css/lg-fullscreen.css";
import "lightgallery/css/lg-video.css";

// import plugins if you need
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import lgVideo from "lightgallery/plugins/video";
import lgFullscreen from "lightgallery/plugins/fullscreen";
import { Link } from "react-router-dom";
import { Image } from "@nextui-org/react";
import errorImage from "@/assets/errorImage.png";
import ImagePlaceholder from "../ui/Image/ImagePlaceholder";

import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";

const ViewMediaGallery = ({ file, galleryID }) => {
  useEffect(() => {
    let lightbox = new PhotoSwipeLightbox({
      gallery: "#" + galleryID,
      children: "a",
      pswpModule: () => import("photoswipe"),
    });
    lightbox.init();

    return () => {
      lightbox.destroy();
      lightbox = null;
    };
  }, []);

  return (
    <>
      {/* <div className="pswp-gallery" id={galleryID}>
        <a
          href={file.src}
          data-pswp-width="900"
          data-pswp-height="900"
          target="_blank"
          rel="noreferrer"
          className="max-w-sm"
        >
          {file.type.startsWith("image/") ? (
            <Image
              src={file.src}
              alt={file.name}
              loading="lazy"
              className="z-0 object-cover max-w-md align-middle w-full h-full rounded-xl"
              radius={"12px"}
            />
          ) : (
            <></>
          )}
        </a>
      </div> */}
      <LightGallery
        speed={500}
        plugins={[lgThumbnail, lgZoom, lgVideo, lgFullscreen]}
        mode="lg-lollipop-rev"
      >
        <Link to={file.src} className="cursor-zoom-in h-full w-full">
          {file.type.startsWith("image/") ? (
            <Image
              src={file.src}
              alt={file.name}
              loading="lazy"
              width={"100%"}
              height={"100%"}
              className="z-0 object-cover align-middle w-full h-full rounded-xl"
              radius={"lg"}
            />
          ) : (
            <></>
          )}
        </Link>
      </LightGallery>
    </>
  );
};

export default ViewMediaGallery;

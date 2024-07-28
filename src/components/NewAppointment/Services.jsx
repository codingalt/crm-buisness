import React, { useEffect, useState } from "react";
import css from "./NewAppointment.module.scss";
import { useGetServicesQuery } from "@/services/api/servicesApi/servicesApi";
import { useMediaQuery } from "@uidotdev/usehooks";
import ImagePlaceholder from "../ui/Image/ImagePlaceholder";
import { Skeleton } from "@nextui-org/react";

const Services = ({ selectedService, setSelectedService,data,isLoading }) => {
  const [value, setValue] = useState(0);

  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
  const isMediumDevice = useMediaQuery(
    "only screen and (min-width : 769px) and (max-width : 1024px)"
  );
  const isLargeDevice = useMediaQuery(
    "only screen and (min-width : 1024px) and (max-width : 1280px)"
  );
  const isExtraLargeDevice = useMediaQuery(
    "only screen and (min-width : 1280px) and (max-width : 1536px)"
  );

  useEffect(() => {
    isSmallDevice
      ? setValue(6)
      : isMediumDevice
      ? setValue(5)
      : isLargeDevice
      ? setValue(8)
      : isExtraLargeDevice
      ? setValue(8)
      : setValue(8);
  }, [isSmallDevice, isMediumDevice, isLargeDevice, isExtraLargeDevice]);

  return (
    <div
      className={`${css.services} h-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-x-4 md:gap-x-8`}
    >
      {isLoading
        ? Array.from({ length: value }).map((_, index) => (
            <Skeleton
              key={index}
              className="w-full h-[65px] rounded-[10px] mb-5"
              disableAnimation
            />
          ))
        : data?.services?.map((item) => (
            <div
              onClick={() => setSelectedService(item.id)}
              key={item.id}
              className={
                selectedService === item.id
                  ? `${css.cardService} ${css.activeCard}`
                  : css.cardService
              }
            >
              <div className={css.image}>
                <ImagePlaceholder
                  src={
                    import.meta.env.VITE_SERVICE_IMAGE + item.image
                  }
                  radius={"50%"}
                />
              </div>
              <p>{item.name}</p>
            </div>
          ))}
    </div>
  );
};

export default Services;

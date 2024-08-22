import React, { useEffect, useState } from "react";
import css from "./NewAppointment.module.scss";
import { useGetServicesQuery } from "@/services/api/servicesApi/servicesApi";
import { useMediaQuery } from "@uidotdev/usehooks";
import ImagePlaceholder from "../ui/Image/ImagePlaceholder";
import { Button, Skeleton } from "@nextui-org/react";
import { Empty } from "antd";
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Services = ({ selectedService, setSelectedService, data, isLoading }) => {
  const {t} = useTranslation();
  const [value, setValue] = useState(0);
  const navigate = useNavigate();

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
                  src={import.meta.env.VITE_SERVICE_IMAGE + item.image}
                  radius={"50%"}
                />
              </div>
              <p>{item.name}</p>
            </div>
          ))}

      {/* No Data Message  */}
      {!isLoading && data?.services?.length === 0 && (
        <div className="w-full py-4 flex gap-3 items-center justify-center">
          <Empty
            description={
              <span className="inline-block text-xs max-w-[170px] text-center">
                {t("noServiceCreated")}
              </span>
            }
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button
              size="sm"
              className="border-[#01AB8E] text-[#01AB8E]"
              variant="bordered"
              startContent={<FaPlus />}
              onClick={() => navigate("/newService")}
            >
              {t("createNow")}
            </Button>
          </Empty>
        </div>
      )}
    </div>
  );
};

export default Services;

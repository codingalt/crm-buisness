import React, { useState } from "react";
import css from "./Services.module.scss";
import Card from "./Card";
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useGetServicesQuery } from "../../services/api/servicesApi/servicesApi";
import { ClipLoader } from "react-spinners";
import empty from "../../assets/empty.png";
import { Image, useDisclosure,Button } from "@nextui-org/react";
import DeleteServiceModal from "./DeleteServiceModal";
import { Empty } from "antd";
import { useTranslation } from "react-i18next";

const Services = () => {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const { data, isLoading, error, refetch } = useGetServicesQuery();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedServiceId, setSelectedServiceId] = useState(null);

  return (
    <div className={css.services}>
      <div className={css.headingTop}>
        <h1>{t("servicesAndPrices")}</h1>
        <div className={css.bottom}>
          <p className="hidden md:block">{t("existingServices")}</p>
          <button type="button" onClick={() => navigate("/newService")}>
            <FaPlus /> <span>{t("addService")}</span>
          </button>
        </div>
      </div>

      {/* Loader  */}
      {isLoading && (
        <div className="w-full pt-40 flex items-center justify-center">
          <ClipLoader color="#01AB8E" size={44} speedMultiplier={0.85} />
        </div>
      )}

      {/* No Data Message  */}
      {!isLoading && data?.services?.length === 0 && (
        <div className="w-full h-[70%] flex flex-col gap-0 items-center justify-center">
          <Empty
            description={
              <span className="text-sm">{t("noServicesAvailable")}</span>
            }
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

      {/* Show Error If data fails to load  */}
      {!isLoading && error && (
        <div className="px-4 mx-auto pt-32 w-full flex justify-center flex-col gap-2 items-center">
          <p className="font-medium text-[17px] text-[#01ab8e]">
            {t("letsTryAgain")}
          </p>
          <span className="px-6 text-xs text-default-600 text-center max-w-xs">
            {t("fetchError")}
          </span>
          <Button
            size="sm"
            radius="sm"
            className="mt-2 py-1 px-6 text-white bg-[#01ab8e]"
            onClick={refetch}
          >
            {t("tryAgain")}
          </Button>
        </div>
      )}

      {/* Services Cards  */}
      <div
        className={`${css.cards} grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 gap-y-7`}
      >
        {!isLoading &&
          data?.services?.map((item) => (
            <Card
              key={item.id}
              item={item}
              onOpen={onOpen}
              setSelectedServiceId={setSelectedServiceId}
            />
          ))}
      </div>

      {/* Delete Service Modal  */}
      <DeleteServiceModal
        serviceId={selectedServiceId}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      />
    </div>
  );
};

export default Services;

import React, { useState } from "react";
import css from "./PaymentMethod.module.scss";
import { Button } from "@nextui-org/react";
import { Skeleton } from "@mui/material";
import { MdErrorOutline } from "react-icons/md";
import { useMediaQuery } from "@uidotdev/usehooks";
import { iconMap } from "./Icons";
import { useGetPaymentMethodsQuery } from "@/services/api/bookingsApi/bookingsApi";

const PaymentMethod = ({  }) => {
  const { data, isLoading, refetch, error } = useGetPaymentMethodsQuery();
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");

  return (
    <div className={css.paymentMethodWrapper}>
      <div
        className={`${css.methodCards} px-0 md:px-12 pl-0 flex flex-col md:flex-row gap-24 md:gap-9 items-center`}
      >
        {isLoading ? (
          <>
            <Skeleton
              variant="rounded"
              width={isSmallDevice ? "87%" : "100%"}
              height={isSmallDevice ? 111 : 163}
              sx={{ borderRadius: "10px" }}
            />
            <Skeleton
              variant="rounded"
              width={isSmallDevice ? "87%" : "100%"}
              height={isSmallDevice ? 111 : 163}
              sx={{ borderRadius: "10px" }}
            />
          </>
        ) : (
          <>
            {data?.paymentMethods?.map((item) => (
              <div
                key={item.id}
                className={`${css.card} ${
                  paymentMethod === item.code
                    ? "bg-[#01ABAB] hover:bg-[#01ABAB] text-white"
                    : "hover:bg-[#f7f7f7] text-[#3C3C3C]"
                }`}
                onClick={() => {
                  setPaymentMethod(item.code);
                }}
              >
                <div
                  className={`${
                    paymentMethod === item.code
                      ? "text-white"
                      : "text-[#01ABAB]"
                  }`}
                >
                  {iconMap[item.code]}
                </div>
                <p>{item.name}</p>
              </div>
            ))}
          </>
        )}

        {/* Error Message if Faied to fetch  */}
        {!isLoading && error && (
          <div className="flex flex-col gap-2 justify-center items-center mx-auto">
            <MdErrorOutline className="text-[#01ABAB] text-[35px]" />
            <p className="text-medium text-default-900 font-medium">
              Failed to fetch payment methods
            </p>
            <Button
              className="bg-[#01ABAB] text-white mt-4"
              onClick={() => refetch()}
            >
              Try again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentMethod;

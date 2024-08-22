import React from "react";
import css from "./Statistics.module.scss";
import { ScaleLoader } from "react-spinners";
import { Button } from "@nextui-org/react";
import { IoMdRefresh } from "react-icons/io";

const BottomCard = ({
  data,
  index,
  isInitialized,
  error,
  refetch,
  isLoading,
}) => {
  return (
    <>
      {/* First Main Card  */}
      <h3>{data?.heading}</h3>
      <span>{data?.subHeading}</span>
      <div className={css.line}></div>
      <div className={css.value}>
        {!error && !isInitialized ? (
          <div className="py-[1px]">
            <ScaleLoader
              color="#555"
              height={18}
              width={3}
              speedMultiplier={0.75}
            />
          </div>
        ) : (
          <p style={index === 0 ? { fontSize: "20px", fontWeight: "600" } : {}}>
            {data?.value}
          </p>
        )}

        {/* Show Error If data failed to load  */}
        {!isLoading && error && (
          <div className="flex">
            <Button
              startContent={<IoMdRefresh />}
              variant="ghost"
              size="sm"
              onClick={refetch}
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Error and Loader for try again  */}
        {error && isLoading && (
          <div className="py-[1px]">
            <ScaleLoader
              color="#555"
              height={18}
              width={3}
              speedMultiplier={0.75}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default BottomCard;

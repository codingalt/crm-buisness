import React, { useEffect, useState } from "react";
import css from "./Statistics.module.scss";
import { ScaleLoader, SyncLoader } from "react-spinners";
import { Button } from "@nextui-org/react";
import { IoMdRefresh } from "react-icons/io";

const TopCard = ({ data, isInitialized, error, refetch, isLoading }) => {
  return (
    <>
      <h3>{data.name}</h3>
      <div className={css.line}></div>
      <div className={css.time}>
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
          <p>{data.value}</p>
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

export default TopCard;

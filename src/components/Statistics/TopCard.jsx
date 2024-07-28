import React, { useEffect, useState } from "react";
import css from "./Statistics.module.scss";
import { ScaleLoader, SyncLoader } from "react-spinners";

const TopCard = ({ data, isInitialized }) => {
  return (
    <>
      <h3>{data.name}</h3>
      <div className={css.line}></div>
      <div className={css.time}>
        {!isInitialized ? (
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
      </div>
    </>
  );
};

export default TopCard;

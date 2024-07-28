import React from "react";
import css from "./Statistics.module.scss";
import { ScaleLoader } from "react-spinners";

const BottomCard = ({ data, index, isInitialized }) => {
  return (
    <>
      {/* First Main Card  */}
      <>
        <h3>{data?.heading}</h3>
        <span>{data?.subHeading}</span>
        <div className={css.line}></div>
        <div className={css.value}>
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
            <p
              style={index === 0 ? { fontSize: "20px", fontWeight: "600" } : {}}
            >
              {data?.value}
            </p>
          )}
        </div>
      </>

      {/* Second Main Card  */}
      {/* <div className={css.cardBottom}>
        <div className={css.subCard}>
          <h3>Best Turn </h3>
          <span>Sold</span>
          <div className={css.line}></div>
          <div className={css.value}>
            <p>Queue Description</p>
          </div>
        </div>

        <div className={css.subCard}>
          <h3>The Fast Queue</h3>
          <span>Most</span>
          <div className={css.line}></div>
          <div className={css.value}>
            <p>Queue Description</p>
          </div>
        </div>

        <div className={css.subCard}>
          <h3>The Space Queue</h3>
          <span>Most</span>
          <div className={css.line}></div>
          <div className={css.value}>
            <p>Queue Description</p>
          </div>
        </div>
      </div> */}
    </>
  );
};

export default BottomCard;

import React, { useState } from "react";
import css from "./Dashboard.module.scss";
import { FaChevronDown } from "react-icons/fa6";
import user from "../../assets/girl.jpg"

const Dashboard = () => {
  return (
    <>
      <div className={css.dashboardDetails}>
        <div className={css.top}>
          <h1>Your Queues</h1>
        </div>

        {/* Cards  */}
        {/* <div className={css.cards}>
          <h3>Active</h3>
          <div className={css.card}>
            <div className={css.details}>
              <img src={user} alt="" />
              <div className={css.name}>
                <p>Zahid Yousaf</p>
                <span>12:00 - 13:00</span>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </>
  );
};

export default Dashboard;

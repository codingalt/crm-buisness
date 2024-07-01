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
      </div>
    </>
  );
};

export default Dashboard;

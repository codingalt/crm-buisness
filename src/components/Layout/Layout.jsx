import React, { useRef, useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";
import css from "./Layout.module.scss";

const Layout = ({ children, options }) => {
  const [activeSidebar, setActiveSidebar] = useState(false);
  const buttonRef = useRef();

  return (
    <div className={css.wrapper}>
      <div className={css.wrapperInner}>
        <Header
          activeSidebar={activeSidebar}
          setActiveSidebar={setActiveSidebar}
          buttonRef={buttonRef}
        />
        <div
          className={css.container}
          style={options?.overflow ? {} : { maxHeight: "79.5vh" }}
        >
          <Sidebar
            activeSidebar={activeSidebar}
            setActiveSidebar={setActiveSidebar}
            buttonRef={buttonRef}
          />

          <div className={css.mainContent}>
            {/* Content  */}
            <div className={css.dashboardContent}>{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;

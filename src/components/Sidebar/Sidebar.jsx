import React, { useEffect, useRef, useState } from "react";
import css from "./Sidebar.module.scss";
import { NavLink, useNavigate } from "react-router-dom";
import { BiHomeAlt2 } from "react-icons/bi";
import { IoSettingsOutline } from "react-icons/io5";
import InsertChartOutlinedIcon from "@mui/icons-material/InsertChartOutlined";
import { Grid, Tooltip } from "@mui/material";
import { FaLightbulb } from "react-icons/fa";
import { LuClock4 } from "react-icons/lu";
import { MdMedicalServices } from "react-icons/md";
import { IoStatsChart } from "react-icons/io5";
import { FaUserFriends } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import { AiFillHome } from "react-icons/ai";
import useClickOutside from "../../hooks/useClickOutside";
import { IoChatboxEllipses } from "react-icons/io5";
import { MdChat } from "react-icons/md";

const Sidebar = ({ activeSidebar, setActiveSidebar, buttonRef }) => {
  let pathname = window.location.pathname;
  const sidebarRef = useRef();

  useEffect(() => {
    pathname = window.location.pathname;
  }, [window.location.pathname]);

  useClickOutside(sidebarRef, () => setActiveSidebar(false), buttonRef);

  return (
    <>
      <input type="checkbox" id="nav-toggle" hidden />
      <div
        className={
          activeSidebar ? `${css.sidebar} ${css.sidebarActive}` : css.sidebar
        }
        id="sidebar"
        ref={sidebarRef}
      >
        <div className={css.sidebarProfile}>
          <FaLightbulb />
          <LuClock4 />
        </div>
        <div className={css.sidebarMenu}>
          <ul style={{ paddingLeft: "0" }}>
            <Grid item>
              <Tooltip title="Dashboard" placement="right-end">
                <li className={css.sidebarli}>
                  <NavLink
                    to={"/dashboard"}
                    className={
                      pathname.match("/dashboard") ? css.activeMenuLi : ""
                    }
                  >
                    <AiFillHome />
                  </NavLink>
                </li>
              </Tooltip>
            </Grid>
            <Grid item>
              <Tooltip title="Statistics" placement="right-end">
                <li className="sidebar-li">
                  <NavLink
                    to={"/statistics"}
                    className={
                      pathname.match("/statistics") ? css.activeMenuLi : ""
                    }
                  >
                    <IoStatsChart />
                  </NavLink>
                </li>
              </Tooltip>
            </Grid>

            <Grid item>
              <Tooltip title="Services" placement="right-end">
                <li className="sidebar-li">
                  <NavLink
                    to={"/services"}
                    className={
                      pathname.match("/services") ? css.activeMenuLi : ""
                    }
                  >
                    <MdMedicalServices />
                  </NavLink>
                </li>
              </Tooltip>
            </Grid>
            <Grid item>
              <Tooltip title="Employees" placement="right-end">
                <li className="sidebar-li">
                  <NavLink
                    to={"/employees"}
                    className={
                      pathname.match("/employees") ? css.activeMenuLi : ""
                    }
                  >
                    <FaUserFriends />
                  </NavLink>
                </li>
              </Tooltip>
            </Grid>
            <Grid item>
              <Tooltip title="Messages" placement="right-end">
                <li className="sidebar-li">
                  <NavLink
                    to={`/chat`}
                    className={pathname.match("/chat") ? css.activeMenuLi : ""}
                  >
                    <IoChatboxEllipses />
                  </NavLink>
                </li>
              </Tooltip>
            </Grid>
            <Grid item>
              <Tooltip title="Profile" placement="right-end">
                <li className="sidebar-li">
                  <NavLink
                    to={"/profile"}
                    className={
                      pathname.match("/profile") ? css.activeMenuLi : ""
                    }
                  >
                    <FaUserCircle />
                  </NavLink>
                </li>
              </Tooltip>
            </Grid>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

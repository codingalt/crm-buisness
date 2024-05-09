import React, { useEffect, useState } from "react";
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
import { FaUserGroup } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";
import { RiHome2Fill } from "react-icons/ri";
import { AiFillHome } from "react-icons/ai";

const Sidebar = () => {
  const [activeLink, setActiveLink] = useState("");
  let pathname = window.location.pathname;
  const navigate = useNavigate();

  useEffect(() => {
    pathname = window.location.pathname;
  }, [window.location.pathname]);

  return (
    <>
      <input type="checkbox" id="nav-toggle" hidden />
      <div className={`${css.sidebar}`} id="sidebar">
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

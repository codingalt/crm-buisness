import React, { useEffect, useRef, useState } from "react";
import css from "./Sidebar.module.scss";
import { NavLink } from "react-router-dom";
import { Grid, Tooltip } from "@mui/material";
import {
  FaLightbulb,
  FaUserFriends,
  FaUserCircle,
  FaCalendarCheck,
} from "react-icons/fa";
import { LuClock4 } from "react-icons/lu";
import { MdMedicalServices } from "react-icons/md";
import { IoStatsChart, IoChatboxEllipses } from "react-icons/io5";
import { AiFillHome } from "react-icons/ai";
import useClickOutside from "../../hooks/useClickOutside";
import { useSelector } from "react-redux";

const Sidebar = ({ activeSidebar, setActiveSidebar, buttonRef }) => {
  const sidebarRef = useRef();
  const { user } = useSelector((store) => store.auth);
  const [roles, setRoles] = useState([]);
  const [pathname, setPathname] = useState(window.location.pathname);

  useEffect(() => {
    if (user) {
      const rolesTemp = user?.flags?.roles?.map((role) => role.name) || [];
      setRoles(rolesTemp);
    }
  }, [user]);

  useEffect(() => {
    const handlePathnameChange = () => setPathname(window.location.pathname);
    window.addEventListener("popstate", handlePathnameChange);
    return () => window.removeEventListener("popstate", handlePathnameChange);
  }, []);

  useClickOutside(sidebarRef, () => setActiveSidebar(false), buttonRef);

  const menuItems = [
    {
      to: "/dashboard",
      icon: <AiFillHome />,
      title: "Dashboard",
      role: "can_dashboard",
    },
    {
      to: "/statistics",
      icon: <IoStatsChart />,
      title: "Statistics",
      role: "can_view_statistics",
    },
    {
      to: "/services",
      icon: <MdMedicalServices />,
      title: "Services",
      role: "can_services",
    },
    {
      to: "/employees",
      icon: <FaUserFriends />,
      title: "Employees",
      role: "can_employees",
    },
    {
      to: "/chat",
      icon: <IoChatboxEllipses />,
      title: "Messages",
      role: "can_chat",
    },
    {
      to: "/diary",
      icon: <FaCalendarCheck />,
      title: "Diary",
      role: "can_business_diary",
    },
    {
      to: "/profile",
      icon: <FaUserCircle />,
      title: "Profile",
      role: "can_profile",
    },
  ];

  const isBusinessOwner = user?.owner;

  const accessibleMenuItems = isBusinessOwner
    ? menuItems
    : menuItems.filter((item) => roles.includes(item.role));

  return (
    <div
      className={
        activeSidebar ? `${css.sidebar} ${css.sidebarActive}` : css.sidebar
      }
      ref={sidebarRef}
    >
      <div className={css.sidebarProfile}>
        <FaLightbulb />
        <LuClock4 />
      </div>
      <div className={css.sidebarMenu}>
        <ul style={{ paddingLeft: "0" }}>
          {accessibleMenuItems.map((item) => (
            <Grid item key={item.to}>
              <Tooltip title={item.title} placement="right-end">
                <li className={css.sidebarli}>
                  <NavLink
                    to={item.to}
                    className={
                      pathname.startsWith(item.to) ? css.activeMenuLi : ""
                    }
                  >
                    {item.icon}
                  </NavLink>
                </li>
              </Tooltip>
            </Grid>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;

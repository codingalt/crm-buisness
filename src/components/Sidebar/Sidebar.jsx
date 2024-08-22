import React, { useEffect, useRef, useState } from "react";
import css from "./Sidebar.module.scss";
import { NavLink } from "react-router-dom";
import { Grid, Tooltip } from "@mui/material";
import {
  FaUserFriends,
  FaUserCircle,
  FaCalendarCheck,
} from "react-icons/fa";
import { MdMedicalServices } from "react-icons/md";
import { IoStatsChart, IoChatboxEllipses } from "react-icons/io5";
import { AiFillHome } from "react-icons/ai";
import useClickOutside from "../../hooks/useClickOutside";
import { useSelector } from "react-redux";
import { TbLogout2 } from "react-icons/tb";
import { removeToken } from "@/utils/helpers/tokenUtils";
import { useTranslation } from "react-i18next";


const Sidebar = ({ activeSidebar, setActiveSidebar, buttonRef }) => {
  const {t} = useTranslation();
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
      title: t("dashboard"),
    },
    {
      to: "/statistics",
      icon: <IoStatsChart />,
      title: t("statistics"),
      role: "can_view_statistics",
    },
    {
      to: "/services",
      icon: <MdMedicalServices />,
      title: t("services"),
      role: "can_services",
    },
    {
      to: "/employees",
      icon: <FaUserFriends />,
      title: t("employees"),
      role: "can_employees",
    },
    {
      to: "/chat",
      icon: <IoChatboxEllipses />,
      title: t("messages"),
      role: "can_chat",
    },
    {
      to: "/diary",
      icon: <FaCalendarCheck />,
      title: t("diary"),
    },
    {
      to: "/profile",
      icon: <FaUserCircle />,
      title: t("profile"),
      role: "can_profile",
    },
  ];

  const isBusinessOwner = user?.owner;

  const accessibleMenuItems = isBusinessOwner
    ? menuItems
    : menuItems.filter((item) => !item.role || roles.includes(item.role));

  const handleLogout = () => {
    removeToken();
    window.location.reload(false);
  };

  return (
    <div
      className={
        activeSidebar ? `${css.sidebar} ${css.sidebarActive}` : css.sidebar
      }
      ref={sidebarRef}
    >
      <Tooltip title={t("logout")} placement="right">
        <div className={css.sidebarProfile}>
          <TbLogout2 onClick={handleLogout} />
        </div>
      </Tooltip>
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

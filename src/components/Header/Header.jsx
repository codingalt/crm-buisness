import React, { useContext, useEffect, useMemo, useState } from "react";
import css from "./Header.module.scss";
import { useNavigate } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { FaChevronDown } from "react-icons/fa6";
import logo from "../../assets/logo.svg";
import { useMediaQuery } from "@uidotdev/usehooks";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import Avvvatars from "avvvatars-react";
import { useSelector } from "react-redux";
import { MdClose } from "react-icons/md";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  useDisclosure,
} from "@nextui-org/react";
import { DirectionContext } from "@/context/DirectionContext";
import { removeToken } from "@/utils/helpers/tokenUtils";
import ChooseLanguageModal from "./ChooseLanguageModal";
import { useTranslation } from "react-i18next";

const Header = ({ activeSidebar, setActiveSidebar, buttonRef }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
  const handleChange = () => {};

  const {
    isOpen: isOpenLangModal,
    onOpen: onOpenLangModal,
    onOpenChange: onOpenChangeLangModal,
  } = useDisclosure();

  const { direction } = useContext(DirectionContext);

  const handleLogout = () => {
    removeToken();
    window.location.reload(false);
  };

  return (
    <>
      {/* Choose Language Modal  */}
      <ChooseLanguageModal
        isOpen={isOpenLangModal}
        onOpenChange={onOpenChangeLangModal}
      />

      <header className={`${css.Header} z-40`}>
        <div className={`${css.header_left} flex items-center gap-2`}>
          <div className={css.logo}>
            <img src={logo} alt="" />
          </div>
         
        </div>
        <div className={`text-[19px] font-medium text-[#01AB8E] md:hidden`}>
          Paycust
        </div>
        <div className={css.header_right}>
          <div
            ref={buttonRef}
            onClick={() => isSmallDevice && setActiveSidebar(!activeSidebar)}
            className="md:hidden text-[29px] text-[#01AB8E]"
          >
            {activeSidebar ? <MdClose /> : <HiOutlineMenuAlt2 />}
          </div>

          <div className="flex items-center space-x-6">
            <Dropdown placement="bottom-end" dir={direction}>
              <DropdownTrigger>
                <div className={`${css.profile}`}>
                  <Avvvatars
                    value={user?.name}
                    size={isSmallDevice ? 30 : 35}
                  />
                  <span>{user?.name}</span>
                  <FaChevronDown />
                </div>
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem
                  key="signedInAs"
                  className="h-14 gap-2 cursor-default hover:bg-white"
                >
                  <p className="font-semibold">{t("signedInAs")}</p>
                  <p className="font-semibold">{user?.email}</p>
                </DropdownItem>
                <DropdownItem
                  onClick={() => navigate("/profile")}
                  key="profile"
                >
                  {t("profile")}
                </DropdownItem>
                <DropdownItem onClick={onOpenLangModal} key="languages">
                  {t("languages")}
                </DropdownItem>
                <DropdownItem
                  onClick={handleLogout}
                  key="logout"
                  color="danger"
                >
                  {t("logOut")}
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;

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
  Image,
  Tooltip,
} from "@nextui-org/react";
import { DirectionContext } from "@/context/DirectionContext";
import ukFlag from "@/assets/uk.png";
import pakFlag from "@/assets/pakistan.png";
import israelFlag from "@/assets/israel.png";
import i18n from "@/i18n";

const Header = ({ activeSidebar, setActiveSidebar, buttonRef }) => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
  const handleChange = () => {};
  const storedLanguage = localStorage.getItem("language") || i18n.language;

  const [selectedKeys, setSelectedKeys] = useState(new Set([storedLanguage]));

  const selectedValue = useMemo(
    () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
    [selectedKeys]
  );

  const { toggleLanguage } = useContext(DirectionContext);

  const handleLogout = () => {
    localStorage.removeItem("crmBusinessToken");
    window.location.reload(false);
  };

  return (
    <header className={`${css.Header}`}>
      <div className={`${css.header_left} flex items-center gap-2`}>
        <div className={css.logo}>
          <img src={logo} alt="" />
        </div>
        <div className={css.searchBox}>
          <CiSearch />
          <input onKeyUp={handleChange} type="text" placeholder="Search..." />
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
          <Dropdown>
            <DropdownTrigger>
              <div className="flex items-center space-x-2 cursor-pointer">
                <Tooltip size="sm" content="Select Language">
                  <div className="w-5 h-5 md:w-6 md:h-6 rounded-full">
                    <Image
                      src={
                        selectedValue === "en"
                          ? ukFlag
                          : selectedValue === "pk"
                          ? pakFlag
                          : israelFlag
                      }
                      width={50}
                      height={50}
                      radius="full"
                    />
                  </div>
                </Tooltip>
              </div>
            </DropdownTrigger>
            <DropdownMenu
              selectionMode="single"
              selectedKeys={selectedKeys}
              onSelectionChange={setSelectedKeys}
              onAction={(key) => toggleLanguage(key)}
              variant="faded"
              aria-label="Dropdown menu with icons"
            >
              <DropdownItem
                key="en"
                startContent={
                  <Image src={ukFlag} width={27} height={27} radius="full" />
                }
              >
                English
              </DropdownItem>
              <DropdownItem
                key="pk"
                startContent={
                  <Image src={pakFlag} width={27} height={27} radius="full" />
                }
              >
                Pakistan
              </DropdownItem>
              <DropdownItem
                key="israel"
                startContent={
                  <Image
                    src={israelFlag}
                    width={27}
                    height={27}
                    radius="full"
                  />
                }
              >
                Israeli
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>

          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <div className={`${css.profile}`}>
                <Avvvatars value={user?.name} size={isSmallDevice ? 30 : 35} />
                <span>{user?.name}</span>
                <FaChevronDown />
              </div>
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">{user?.email}</p>
              </DropdownItem>
              <DropdownItem onClick={handleLogout} key="logout" color="danger">
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </header>
  );
};

export default Header;

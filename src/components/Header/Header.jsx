import React, { useEffect } from "react";
import css from "./Header.module.scss";
import { useNavigate } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import user from "../../assets/user.jpg";
import { FaChevronDown } from "react-icons/fa6";
import logo from "../../assets/logo.svg";
import { useMediaQuery } from "@uidotdev/usehooks";
import { MdMenu } from "react-icons/md";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import Avvvatars from "avvvatars-react";
import { useSelector } from "react-redux";
import { MdClose } from "react-icons/md";

const Header = ({ activeSidebar, setActiveSidebar, buttonRef }) => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
  const handleChange = () => {};

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
        <div className={`${css.profile}`}>
          <Avvvatars value={user?.name} size={isSmallDevice ? 30 : 35} />
          <span>{user?.name}</span>
          <FaChevronDown />
        </div>
      </div>
    </header>
  );
};

export default Header;

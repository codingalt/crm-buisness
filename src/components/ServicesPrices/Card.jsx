import css from "./Services.module.scss";
import React from "react";
import { HiPencil } from "react-icons/hi2";
import { FiCopy } from "react-icons/fi";
import { FaUser } from "react-icons/fa6";
import { MdAccessTime } from "react-icons/md";
import { FaRegTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "@mui/material";
import { truncateText } from "@/utils/helpers/helpers";
import { useTranslation } from "react-i18next";

const Card = ({ item, onOpen, setSelectedServiceId }) => {
  const {t} = useTranslation();
  const navigate = useNavigate();

  return (
    <div className={`${css.card} shadow-md border`}>
      <header>
        <div className={css.left}>
          <p>{truncateText(item.name, 18)}</p>
          <Tooltip title={t("edit")} placement="right">
            <p>
              <HiPencil onClick={() => navigate(`/service/${item.id}/edit`)} />
            </p>
          </Tooltip>
        </div>
        <div className={css.icon}>
          <FiCopy />
        </div>
      </header>

      {/* Tags  */}
      <div className={css.tags}>
        {item.tags?.map((tag) => (
          <div className={css.tag} key={tag.id}>
            <p>{tag.name}</p>
          </div>
        ))}
      </div>

      <div className={css.user}>
        <FaUser />
        <p>
          {item.employees?.map(
            (emp, index) =>
              `${emp?.user?.name}${
                index !== item.employees.length - 1 ? "," : ""
              }`
          )}
        </p>
      </div>

      <div className={css.timeInfo}>
        <div className={css.left}>
          <MdAccessTime />
          <span>
            {item.time} {t("minutes")}
          </span>
        </div>
        <div className={css.right}>{item.price} Nis</div>
      </div>

      <div className={css.actions}>
        <p>{truncateText(item.category.name, 18)}</p>
        <Tooltip title={t("deleteRecord")}>
          <div
            onClick={() => {
              setSelectedServiceId(item.id);
              onOpen();
            }}
            className="w-10 h-10 mr-1 cursor-pointer transition-all rounded-full flex items-center justify-center hover:bg-gray-100"
          >
            <FaRegTrashAlt />
          </div>
        </Tooltip>
      </div>
    </div>
  );
};

export default Card;

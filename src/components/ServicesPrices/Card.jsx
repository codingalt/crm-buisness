import css from "./Services.module.scss";
import React from "react";
import { HiPencil } from "react-icons/hi2";
import { FiCopy } from "react-icons/fi";
import { FaUser } from "react-icons/fa6";
import { MdAccessTime } from "react-icons/md";
import { FaRegTrashAlt } from "react-icons/fa";

const Card = ({item}) => {
  return (
    <div className={`${css.card} shadow-md border`}>
      <header>
        <div className={css.left}>
          <p>{item.name}</p>
          <HiPencil />
        </div>
        <div className={css.icon}>
          <FiCopy />
        </div>
      </header>

      {/* Tags  */}
      <div className={css.tags}>
        {
          item.tags?.map((tag)=>(
            <div className={css.tag} key={tag.id}>
              <p>{tag.name}</p>
            </div>
          ))
        }
      </div>

      <div className={css.user}>
        <FaUser />
            <p>{item.employees[0].name}</p>
      </div>

      <div className={css.timeInfo}>
        <div className={css.left}>
            <MdAccessTime />
            <span>{item.time} mints</span>
        </div>
        <div className={css.right}>{item.price} Nis</div>
      </div>

      <div className={css.actions}>
        <p>{item.category.name}</p>
        <FaRegTrashAlt />
      </div>


    </div>
  );
};

export default Card;

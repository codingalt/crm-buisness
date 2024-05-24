import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useClickOutside from "../../hooks/useClickOutside";
import css from "./FilterModal.module.scss";
import { RxCross2 } from "react-icons/rx";
import Calendar from "./Calendar";
import Calendar2 from "./Calendar2";

const FilterByDateModal = ({ isModal, setIsModal }) => {
  const modalRef = useRef(null);

  useClickOutside(modalRef, () => setIsModal(false));
  return (
    <div className={css.modalWrapper}>
      {/* Select Modal  */}
      <AnimatePresence>
        {isModal && (
          <motion.div
            className={`${css.selectModal}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            <motion.div
              className={css.selectCard}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
              ref={modalRef}
            >
              <div className={`${css.heading} max-w-5xl mx-auto`}>
                <span>Daily - Monthly</span>
                <div
                  className="w-8 h-8 md:w-10 md:h-10 cursor-pointer rounded-full bg-default-200 flex items-center justify-center"
                  onClick={() => setIsModal(false)}
                >
                  {" "}
                  <RxCross2 className="text-[19px] md:text-[22px]" color="#222" />
                </div>
              </div>
              
              <div className={`${css.calendarWrapper} max-w-5xl`}>
                <Calendar2 />
              </div>

              <div className={`${css.button} max-w-5xl mx-auto flex justify-end items-center`}>
                <button>Apply Filters</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterByDateModal;

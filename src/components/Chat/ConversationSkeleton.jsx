import React from "react";
import css from "./chat.module.scss";
import { Skeleton } from "@mui/material";

const ConversationSkeleton = () => {
  const skeletonArray = Array.from({ length: 4 });

  return (
    <div className="h-full overflow-hidden scrollbar-hide">
      {skeletonArray.map((_, index) => (
        <li key={index}>
          <div className={css.image}>
            <Skeleton variant="circular" width={"100%"} height={"97%"} />
          </div>
          <div className={css.cDetail}>
            <div className={css.name}>
              <Skeleton variant="text" sx={{ fontSize: "1.08rem" }} className="w-24" />
            </div>
            <div className={css.preview}>
              <Skeleton variant="text" sx={{ fontSize: "0.8rem" }} className="w-44" />
            </div>
          </div>
        </li>
      ))}
    </div>
  );
};

export default ConversationSkeleton;

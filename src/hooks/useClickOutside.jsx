import { useEffect } from "react";

const useClickOutside = (ref, callback, excludeRef) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        ref.current &&
        !ref.current.contains(event.target) &&
        (!excludeRef ||
          (excludeRef.current && !excludeRef.current.contains(event.target)))
      ) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback, excludeRef]);
};

export default useClickOutside;

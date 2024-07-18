import { useState, useEffect } from "react";

const useToken = () => {
  const [token, setToken] = useState(localStorage.getItem("crmBusinessToken"));

  useEffect(() => {
    const handleTokenChange = () => {
      setToken(localStorage.getItem("crmBusinessToken"));
    };

    // Custom event to handle token change
    window.addEventListener("tokenChanged", handleTokenChange);

    return () => {
      window.removeEventListener("tokenChanged", handleTokenChange);
    };
  }, []);

  return token;
};

export default useToken;

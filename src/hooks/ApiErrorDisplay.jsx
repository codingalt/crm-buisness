import { Alert } from "@mui/material";
import React from "react";

const ApiErrorDisplay = ({ apiErrors, className }) => {
  if (!apiErrors) return null;

  return (
    <div className={`w-full ${className}`}>
        <Alert icon={false} severity="error">
          {apiErrors.map((error, index) => (
            <li key={index}>
              {error}
            </li>
          ))}
        </Alert>
    </div>
  );
};

export default ApiErrorDisplay;

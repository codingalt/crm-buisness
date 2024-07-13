import React from 'react'
import { ClipLoader } from 'react-spinners';

const ClipSpinner = ({ size = 43, color = "#01ABAB", speed = 0.9 }) => {
  return <ClipLoader color={color} size={size} speedMultiplier={speed} />;
};

export default ClipSpinner
import React from 'react'
import { ClipLoader } from 'react-spinners';

const ClipSpinner = ({ size = 43, color = "#01ABAB" }) => {
  return <ClipLoader color={color} size={size} speedMultiplier={0.9} />;
};

export default ClipSpinner
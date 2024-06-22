import React from "react";

const ReloadIcon = ({ size = 24, color = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 4a8 8 0 1 1-8 8 .75.75 0 0 1 1.5 0A6.5 6.5 0 1 0 12 5.5h-1.79l1.14 1.14a.75.75 0 0 1-1.06 1.06l-2.5-2.5a.75.75 0 0 1 0-1.06l2.5-2.5a.75.75 0 1 1 1.06 1.06L10.21 4H12z"
      fill={color}
    />
  </svg>
);

export default ReloadIcon;

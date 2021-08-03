import React from 'react';

const AnalyticsIcon = ({ color = '8E97A3', smallIcon = false, ...props }) => {
  const size = smallIcon ? 20 : 28;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 28 28"
      {...props}
    >
      <path
        fill={color}
        d="M15.333.668A1.333 1.333 0 0014 2.001v10.667a1.334 1.334 0 001.333 1.333H26a1.333 1.333 0 001.333-1.333 12 12 0 00-12-12zm1.334 10.667V3.428a9.333 9.333 0 017.906 7.907h-7.906z"
      />

      <path
        fill={color}
        d="M25.76 16.747a1.332 1.332 0 00-1.707.814A10.666 10.666 0 1110.44 3.947a1.335 1.335 0 10-.88-2.52 13.333 13.333 0 1017.013 17.014 1.333 1.333 0 00-.813-1.694z"
      />
    </svg>
  );
};

export default AnalyticsIcon;

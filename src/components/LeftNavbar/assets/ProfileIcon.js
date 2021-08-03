import React from 'react';

const ProfileIcon = ({ color = '8E97A3', smallIcon = false, ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={smallIcon ? 14 : 18}
      height={smallIcon ? 18 : 24}
      fill="none"
      viewBox="0 0 20 24"
      {...props}
    >
      <path
        fill={color}
        d="M10 10.667A5.333 5.333 0 1010 0a5.333 5.333 0 000 10.667zm0-8A2.667 2.667 0 1110 8a2.667 2.667 0 010-5.333zM10 13.333a9.334 9.334 0 00-9.334 9.334 1.333 1.333 0 002.667 0 6.667 6.667 0 0113.333 0 1.334 1.334 0 002.667 0 9.333 9.333 0 00-9.334-9.334z"
      />
    </svg>
  );
};

export default ProfileIcon;

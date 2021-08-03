import * as React from 'react';

function ActiveProfileIcon({ color = '#1689CA', smallIcon = false, ...props }) {
  return (
    <svg
      width={smallIcon ? 14 : 18}
      height={smallIcon ? 18 : 24}
      viewBox="0 0 20 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M10.001 10.667a5.333 5.333 0 100-10.666 5.333 5.333 0 000 10.666zM18.001 24a1.333 1.333 0 001.334-1.333 9.333 9.333 0 10-18.667 0A1.333 1.333 0 002.001 24h16z"
        fill={color}
      />
    </svg>
  );
}

export default ActiveProfileIcon;

import * as React from 'react';

function DownArrowIcon({ color, ...props }) {
  return (
    <svg
      {...props}
      width={8}
      height={5}
      viewBox="0 0 8 5"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 4.333a.667.667 0 01-.473-.194L.86 1.473a.67.67 0 01.947-.947L4 2.733 6.2.613a.667.667 0 11.92.96L4.453 4.146A.667.667 0 014 4.333z"
        fill={color ? color : '#1689CA'}
      />
    </svg>
  );
}

export default DownArrowIcon;

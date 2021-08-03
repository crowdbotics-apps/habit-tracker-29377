import * as React from 'react';

const ThreeDotsIcon = ({ color = '#8E97A3', ...props }) => {
  return (
    <svg
      width={4}
      height={12}
      viewBox="0 0 4 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M2 7.333a1.333 1.333 0 100-2.666 1.333 1.333 0 000 2.666zM2 2.667A1.333 1.333 0 102 0a1.333 1.333 0 000 2.667zM2 12a1.333 1.333 0 100-2.667A1.333 1.333 0 002 12z"
        fill={color}
      />
    </svg>
  );
};

export default ThreeDotsIcon;

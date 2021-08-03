import * as React from 'react';

function PlusIcon({ color }) {
  return (
    <svg
      width={12}
      height={12}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.667 5.333h-4v-4a.667.667 0 00-1.333 0v4h-4a.667.667 0 000 1.333h4v4a.667.667 0 101.333 0v-4h4a.667.667 0 100-1.333z"
        fill={color ? color : '#000'}
      />
    </svg>
  );
}

export default PlusIcon;

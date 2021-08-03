import * as React from 'react';

function CloseIcon({ color = '#fff', ...props }) {
  return (
    <svg
      width={10}
      height={10}
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M5.94 5l2.867-2.86a.67.67 0 00-.946-.946L5 4.06 2.14 1.194a.67.67 0 10-.947.946L4.06 5 1.194 7.86a.667.667 0 00.217 1.093.667.667 0 00.73-.146L5 5.94l2.86 2.867a.667.667 0 001.092-.217.667.667 0 00-.146-.73L5.941 5z"
        fill={color}
      />
    </svg>
  );
}

export default CloseIcon;

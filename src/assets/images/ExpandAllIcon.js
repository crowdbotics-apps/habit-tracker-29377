import * as React from 'react';

function ExpandAllIcon({ color = '#8E97A3', ...props }) {
  return (
    <svg
      width={12}
      height={12}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M11.333 1.334a.667.667 0 00-.667-.667H7.333a.667.667 0 100 1.333h1.713L6.86 4.194a.667.667 0 00.217 1.092.667.667 0 00.73-.146L10 2.947v1.72a.667.667 0 001.333 0V1.334zM5.14 6.86a.667.667 0 00-.947 0L2 9.047V7.334a.667.667 0 00-1.333 0v3.333a.667.667 0 00.666.667h3.333a.667.667 0 000-1.334h-1.72L5.14 7.807a.667.667 0 000-.947z"
        fill={color}
      />
    </svg>
  );
}

export default ExpandAllIcon;

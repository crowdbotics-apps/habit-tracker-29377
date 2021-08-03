import * as React from 'react';

function CollapseAllIcon({ color = '#1689CA', ...props }) {
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
        d="M10.667 4h-1.72l2.194-2.193a.67.67 0 00-.947-.947L8.001 3.047V1.333a.667.667 0 10-1.334 0v3.334a.667.667 0 00.667.666h3.333a.666.666 0 100-1.333zM4.667 6.667H1.334a.667.667 0 000 1.333h1.713L.861 10.194a.666.666 0 000 .946.668.668 0 00.946 0l2.194-2.193v1.72a.667.667 0 101.333 0V7.333a.667.667 0 00-.667-.666z"
        fill={color}
      />
    </svg>
  );
}

export default CollapseAllIcon;

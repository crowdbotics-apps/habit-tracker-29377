import * as React from 'react';

const leftArrowIcon = () => {
  const style = {
    margin: '0 7px 0 0',
  };
  return (
    <svg
      width={12}
      height={10}
      viewBox="0 0 12 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
    >
      <path
        d="M10.666 4.333H2.759l2.42-2.907A.668.668 0 004.153.573l-3.334 4a.793.793 0 00-.06.1c0 .033 0 .053-.046.087A.667.667 0 00.666 5c0 .082.016.163.047.24 0 .033 0 .053.046.086a.794.794 0 00.06.1l3.334 4a.667.667 0 001.026-.853L2.76 5.666h7.907a.667.667 0 100-1.333z"
        fill="#1689CA"
      />
    </svg>
  );
};

export default leftArrowIcon;

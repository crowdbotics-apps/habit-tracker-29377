import * as React from 'react';

function ArrowDown({ color = '#1B2A3D', ...props }) {
  return (
    <svg
      {...props}
      width={9}
      height={7}
      viewBox="0 0 9 7"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 6.666a1.147 1.147 0 01-.886-.427L.307 2.84a1.4 1.4 0 01-.173-1.473 1.173 1.173 0 011.06-.7h5.613a1.173 1.173 0 011.06.7 1.4 1.4 0 01-.173 1.473l-2.807 3.4a1.147 1.147 0 01-.886.427z"
        fill={color}
      />
    </svg>
  );
}

export default ArrowDown;

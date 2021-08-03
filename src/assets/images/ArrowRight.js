import * as React from 'react';

function ArrowRight({ color = '#1B2A3D', ...props }) {
  return (
    <svg
      width={6}
      height={9}
      viewBox="0 0 6 9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.307 8.999A1.487 1.487 0 01.7 8.865a1.173 1.173 0 01-.7-1.06V2.192a1.173 1.173 0 01.7-1.06 1.4 1.4 0 011.473.173l3.4 2.807a1.133 1.133 0 010 1.773l-3.4 2.807A1.373 1.373 0 011.307 9z"
        fill={color}
      />
    </svg>
  );
}

export default ArrowRight;

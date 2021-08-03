import * as React from 'react';

function MobileNavToggleIcon({ color = '#fff', ...props }) {
  return (
    <svg
      width={12}
      height={8}
      viewBox="0 0 12 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M11.367 3.333H.633A.633.633 0 000 3.967v.066c0 .35.284.634.633.634h10.734c.35 0 .633-.284.633-.634v-.066a.633.633 0 00-.633-.634zM11.367 6.667H.633A.633.633 0 000 7.3v.067C0 7.717.284 8 .633 8h10.734c.35 0 .633-.284.633-.633V7.3a.633.633 0 00-.633-.633zM11.367 0H.633A.633.633 0 000 .633V.7c0 .35.284.633.633.633h10.734c.35 0 .633-.283.633-.633V.633A.633.633 0 0011.367 0z"
        fill={color}
      />
    </svg>
  );
}

export default MobileNavToggleIcon;

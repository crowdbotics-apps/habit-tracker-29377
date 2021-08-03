import * as React from 'react';

function ActiveDashboardIcon({
  color = '#1689CA',
  smallIcon = false,
  ...props
}) {
  const size = smallIcon ? 18 : 24;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M8 0H2.667A2.667 2.667 0 000 2.667V8a2.667 2.667 0 002.667 2.667H8A2.667 2.667 0 0010.667 8V2.667A2.667 2.667 0 008 0zM21.333 0H16a2.667 2.667 0 00-2.667 2.667V8A2.667 2.667 0 0016 10.667h5.333A2.667 2.667 0 0024 8V2.667A2.667 2.667 0 0021.333 0zM8 13.333H2.667A2.667 2.667 0 000 16v5.333A2.667 2.667 0 002.667 24H8a2.667 2.667 0 002.667-2.667V16A2.667 2.667 0 008 13.333zM21.333 13.333H16A2.667 2.667 0 0013.333 16v5.333A2.667 2.667 0 0016 24h5.333A2.667 2.667 0 0024 21.333V16a2.667 2.667 0 00-2.667-2.667z"
        fill={color}
      />
    </svg>
  );
}

export default ActiveDashboardIcon;

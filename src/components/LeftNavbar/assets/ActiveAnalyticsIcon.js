import * as React from 'react';

function ActiveAnalyticsIcon({
  color = '#1689CA',
  smallIcon = false,
  ...props
}) {
  const size = smallIcon ? 20 : 28;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M17.296 11.814h8.893a1.107 1.107 0 001.107-1.107 10 10 0 00-10-10 1.107 1.107 0 00-1.107 1.107v8.893a1.107 1.107 0 001.107 1.107z"
        fill={color}
      />
      <path
        d="M26.069 14.04H15.202a1.215 1.215 0 01-1.213-1.213V1.932a1.226 1.226 0 00-1.36-1.227 13.333 13.333 0 1014.666 14.667 1.229 1.229 0 00-1.226-1.333z"
        fill={color}
      />
    </svg>
  );
}

export default ActiveAnalyticsIcon;

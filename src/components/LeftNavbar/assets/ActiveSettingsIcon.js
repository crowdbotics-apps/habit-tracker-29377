import * as React from 'react';

function ActiveSettingsIcon({
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
      <path d="M14.007 15.993a2 2 0 100-4 2 2 0 000 4z" fill={color} />
      <path
        d="M27.194 11.754l-1.054-3.36A3.013 3.013 0 0022.3 6.38l-.453.147a2.32 2.32 0 01-2.12-.347l-.147-.107a2.347 2.347 0 01-.92-1.906v-.374a3.16 3.16 0 00-.906-2.24A3.014 3.014 0 0015.62.66h-3.4a3.094 3.094 0 00-3.053 3.107v.32A2.587 2.587 0 018.194 6.1l-.174.133a2.573 2.573 0 01-2.373.387 2.853 2.853 0 00-2.24.16 2.907 2.907 0 00-1.493 1.773L.82 12.02a3.12 3.12 0 001.974 3.92h.213A2.44 2.44 0 014.5 17.567l.08.213a2.746 2.746 0 01-.306 2.48 3.16 3.16 0 00.653 4.4l2.76 2.093a3 3 0 001.8.574c.173.017.347.017.52 0a3 3 0 001.96-1.334l.307-.44a2.399 2.399 0 011.906-1.026 2.333 2.333 0 012 1.04l.16.227a2.989 2.989 0 004.294.706l2.706-2.026a3.173 3.173 0 00.667-4.307l-.347-.507a2.667 2.667 0 01-.32-2.2 2.52 2.52 0 011.613-1.707l.267-.093a3.147 3.147 0 001.974-3.906zM14.007 18.66a4.667 4.667 0 110-9.333 4.667 4.667 0 010 9.333z"
        fill={color}
      />
    </svg>
  );
}

export default ActiveSettingsIcon;

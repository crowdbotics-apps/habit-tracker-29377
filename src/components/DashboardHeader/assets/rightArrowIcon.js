import * as React from 'react';

const RightArrowIcon = ({ isFutureWeek }) => {
  const style = {
    margin: '0 0 0 7px',
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
        d="M1.333 5.667h7.906L6.82 8.574a.667.667 0 101.027.853l3.333-4a.783.783 0 00.06-.1c0-.033.034-.053.047-.086a.666.666 0 00.047-.24.667.667 0 00-.047-.24c0-.034-.033-.054-.047-.087a.782.782 0 00-.06-.1l-3.333-4a.667.667 0 00-1.027.853l2.42 2.907H1.333a.667.667 0 100 1.333z"
        fill={isFutureWeek ? '#ccc' : '#1689CA'}
      />
    </svg>
  );
};

export default RightArrowIcon;

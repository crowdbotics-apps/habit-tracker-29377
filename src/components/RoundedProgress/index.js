import React, { useEffect, useState, useRef, Fragment } from 'react';
import styled from 'styled-components';

const RoundedProgress = ({
  label = '',
  size = 36,
  progress = 1,
  strokeWidth = 2,
  innerStrokeWidth = 2,
  circleOneStroke = '#F2F2F2',
  circleTwoStroke = '#448FFF',
}) => {
  const circleRef = useRef(null);
  const [offset, setOffset] = useState(0);

  const center = size / 2;
  const radius = size / 2 - strokeWidth / 2;
  const radius2 = size / 2 - innerStrokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const progressOffset = ((100 - progress) / 100) * circumference;
    setOffset(progressOffset);
  }, [setOffset, circumference, progress, offset]);

  return (
    <Fragment>
      <Label>{label}</Label>
      <svg
        width={size}
        height={size}
        fill="transparent"
        style={{ transform: 'rotate(-90deg)' }}
      >
        <circle
          stroke={circleOneStroke}
          cx={center}
          cy={center}
          r={radius2}
          strokeWidth={innerStrokeWidth}
        />
        <circle
          ref={circleRef}
          stroke={circleTwoStroke}
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
    </Fragment>
  );
};
export default RoundedProgress;

const Label = styled.div`
  position: absolute;
  height: 100%;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Roboto;
  font-size: 14px;
  line-height: 16px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.palette.text.primary};
`;

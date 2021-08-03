import React from 'react';
import styled, { css } from 'styled-components';

const Badge = ({
  text,
  bgColor = '#FAFAFA',
  color = '#1b2a3d',
  largeText = false,
}) => {
  return (
    <BadgeWrapper bgColor={bgColor} color={color} largeText={largeText}>
      {text}
    </BadgeWrapper>
  );
};

export default Badge;

const BadgeWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  font-family: Roboto;
  font-size: 8px;
  line-height: 12px;
  padding: 4px 8px;
  color: ${({ color }) => color};
  background-color: ${({ bgColor }) => bgColor};
  ${({ largeText }) =>
    largeText &&
    css`
      font-size: 12px;
      line-height: 16px;
    `}
`;

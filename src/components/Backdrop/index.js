import React from 'react';
import styled, { css } from 'styled-components';

const Backdrop = ({ transparent = false, onClose }) => {
  return <StyledBackdrop onClick={onClose} transparent={transparent} />;
};

export default Backdrop;

const StyledBackdrop = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 11;
  top: 0;
  right: 0;
  ${({ transparent }) =>
    transparent &&
    css`
      background: transparent;
    `}
`;

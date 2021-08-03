import React from 'react';
import styled, { css } from 'styled-components';

import DragIcon from '../../assets/images/DragIcon';

const WeightDragIcon = ({
  weight,
  withoutBorder = false,
  activeBorder = false,
}) => {
  return (
    <WeightDragWrapper>
      <WeightWrapper activeBorder={activeBorder} withoutBorder={withoutBorder}>
        <Weight>{weight}</Weight>
      </WeightWrapper>

      <div className="drag-icon">
        <DragIconWrapper>
          <DragIcon />
        </DragIconWrapper>
      </div>
    </WeightDragWrapper>
  );
};

export default WeightDragIcon;

const WeightDragWrapper = styled.div`
  position: relative;
  margin: 0 4px;
  .drag-icon {
    display: none;
  }
  &:hover {
    .drag-icon {
      display: block;
    }
  }
`;

const WeightWrapper = styled.div`
  height: 28px;
  width: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${({ theme }) => theme.palette.text.secondaryLight};
  border-radius: 4px;
  font-family: Roboto;
  font-size: 14px;
  line-height: 20px;
  color: ${({ theme }) => theme.palette.primary.main};
  ${({ activeBorder }) =>
    activeBorder &&
    css`
      border-color: ${({ theme }) => theme.palette.primary.main};
    `}
  ${({ withoutBorder }) =>
    withoutBorder &&
    css`
      border: none;
    `}
`;

const Weight = styled.div`
  font-family: Roboto;
  font-size: 14px;
  line-height: 20px;
  color: ${({ theme }) => theme.palette.primary.main};
  background-image: ${({ image }) => image};
`;

const DragIconWrapper = styled.div`
  position: absolute;
  left: 0px;
  top: 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 28px;
  width: 28px;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.palette.primary.main};
`;

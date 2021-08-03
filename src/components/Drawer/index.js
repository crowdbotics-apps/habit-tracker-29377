import React from 'react';
import styled, { css } from 'styled-components';

import Backdrop from '../Backdrop';
import closeIcon from '../../assets/images/closeIcon.svg';

const Index = ({ open, onClose, header, subHeader, children }) => {
  return (
    <>
      <Backdrop transparent onClose={onClose} />
      <DrawerWrapper open={open}>
        <DrawerHeader>
          <div className="d-flex">
            {header}
            {subHeader && <SubHeader>{subHeader}</SubHeader>}
          </div>
          <CloseIcon src={closeIcon} alt="" onClick={onClose} />
        </DrawerHeader>
        <DrawerContent>{children}</DrawerContent>
      </DrawerWrapper>
    </>
  );
};
export default Index;

const DrawerWrapper = styled.div`
  width: 446px;
  height: calc(100% - 100px);
  position: fixed;
  bottom: 0;
  right: -450px;
  z-index: 12;
  background: ${({ theme }) => theme.palette.common.white};
  box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.1);
  transition: right 0.3s ease-in;
  -moz-transition: right 0.3s ease-in;
  -webkit-transition: right 0.3s ease-in;
  -o-transition: right 0.3s ease-in;
  ${({ open }) =>
    open &&
    css`
      right: 0;
    `}
  ${({ theme }) => theme.max('sm')`
      width: 100%;
      height: 100%;
    `}
`;

const DrawerHeader = styled.div`
  font-family: Roboto;
  font-weight: bold;
  font-size: 20px;
  line-height: 20px;
  padding: 20px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.palette.text.secondaryLight};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const SubHeader = styled.div`
  color: #8e97a3;
  font-family: Roboto;
  font-size: 14px;
  line-height: 20px;
  display: flex;
  align-items: flex-end;
  margin: 0 0 0 5px;
`;
const CloseIcon = styled('img')`
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.palette.text.secondaryLight};
`;
const DrawerContent = styled.div`
  height: calc(100% - 74px);
`;

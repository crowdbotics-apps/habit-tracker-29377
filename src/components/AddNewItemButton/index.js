import React from 'react';
import styled from 'styled-components';

import PlusIcon from '../DashboardHeader/assets/plusIcon';

const AddNewItemButton = ({ buttonText, ...props }) => {
  return (
    <ButtonWrapper {...props}>
      <PlusIcon color="#1689CA" />
      <Text>{buttonText}</Text>
    </ButtonWrapper>
  );
};

export default AddNewItemButton;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const Text = styled.div`
  font-family: Roboto;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.palette.primary.main};
  margin-left: 7px;
`;

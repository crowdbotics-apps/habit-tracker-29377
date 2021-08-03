import React from 'react';
import styled from 'styled-components';

import PlusIcon from '../DashboardHeader/assets/plusIcon';

const AddIcon = ({ onClick }) => {
  return (
    <AddIconWrapper onClick={onClick}>
      <PlusIcon color="#1689CA" />
    </AddIconWrapper>
  );
};

export default AddIcon;

const AddIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 36px;
  width: 36px;
  border: 1px solid ${({ theme }) => theme.palette.text.secondaryLight};
  box-sizing: border-box;
  border-radius: 4px;
  cursor: pointer;
`;

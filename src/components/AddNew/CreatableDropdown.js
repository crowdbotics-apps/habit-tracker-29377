import React from 'react';
import CreatableSelect from 'react-select/creatable';
import styled from 'styled-components';

import PlusIcon from '../DashboardHeader/assets/plusIcon';
import { customDropdownStyles } from './styles';

const CreatableCategory = ({
  placeholder = 'Select an option or create one',
  value,
  options,
  handleChange,
}) => {
  return (
    <CreatableSelect
      isClearable
      value={value}
      placeholder={placeholder}
      options={options}
      styles={customDropdownStyles}
      onChange={handleChange}
      isOptionDisabled={(option) => option.disabled}
      components={{
        DropdownIndicator: null,
      }}
      formatCreateLabel={(value) => (
        <AddNewItemWrapper>
          <PlusIcon color="#1689CA" />
          <AddNewItemText>{`Add Category "${value}"`}</AddNewItemText>
        </AddNewItemWrapper>
      )}
    />
  );
};

export default CreatableCategory;

const AddNewItemWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const AddNewItemText = styled.div`
  margin-left: 7px;
  font-family: Roboto;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.palette.primary.main};
`;

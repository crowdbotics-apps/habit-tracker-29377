import React from 'react';
import { useSelector } from 'react-redux';
import styled, { css } from 'styled-components';
import moment from 'moment';
import Dropdown from 'react-bootstrap/Dropdown';

import DownArrowIcon from '../DashboardHeader/assets/downArrowIcon';

const CustomDropdownToggle = React.forwardRef(({ children, onClick }, ref) => (
  <div
    ref={ref}
    className="customDropdown"
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    {children}
    <DownArrowIcon color="#1689CA" />
  </div>
));

const TableHeader = ({ dropDownItem, handleDropdown }) => {
  const { selectedWeek } = useSelector(({ dashboard }) => dashboard);

  const getDropDownTitle = () => {
    return dropDownItem === 'avg' ? dropDownItem + ' %' : dropDownItem;
  };

  return (
    <TableHeaderWrapper>
      <DatesWrapper>
        {selectedWeek.map((date, i) => {
          const isToday =
            moment(date).format('YYYY-MM-DD') ===
            moment(new Date()).format('YYYY-MM-DD');
          return (
            <HeaderItem key={i}>
              <DateText activeItem={isToday}>
                {moment(date).format('MMM D')}
              </DateText>
              <DayText activeItem={isToday}>
                {moment(date).format('ddd')}
              </DayText>
            </HeaderItem>
          );
        })}
        <DurationHeader>
          <StyledDropdown>
            <Dropdown.Toggle as={CustomDropdownToggle} id="dropdown-basic">
              <DropDownTitle>{getDropDownTitle()}</DropDownTitle>
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <StyledDropdownItem
                activeItem={dropDownItem === 'avg'}
                onClick={handleDropdown('avg')}
              >
                AVG %
              </StyledDropdownItem>
              <StyledDropdownItem
                activeItem={dropDownItem === 'points'}
                onClick={handleDropdown('points')}
              >
                Points
              </StyledDropdownItem>
              <StyledDropdownItem
                activeItem={dropDownItem === 'duration'}
                onClick={handleDropdown('duration')}
              >
                Duration
              </StyledDropdownItem>
            </Dropdown.Menu>
          </StyledDropdown>
        </DurationHeader>
      </DatesWrapper>
    </TableHeaderWrapper>
  );
};

export default TableHeader;

const TableHeaderWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 16px 4rem 16px 20px;
  z-index: 2;
  background-color: ${({ theme }) => theme.palette.background.main};
  position: sticky;
  top: 0;
  ${({ theme }) => theme.min('xl')`
    top: -24px;
  `}
`;

const DatesWrapper = styled.div`
  display: flex;
  width: 45%;
`;

const Text = styled.div`
  font-family: Roboto;
  color: ${({ theme }) => theme.palette.text.secondary};
`;

const HeaderItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 12%;
`;

const DateText = styled(Text)`
  font-size: 12px;
  line-height: 16px;
  white-space: nowrap;
  ${({ activeItem }) =>
    activeItem &&
    css`
      color: ${({ theme }) => theme.palette.primary.main};
    `}
`;

const DayText = styled(Text)`
  font-size: 16px;
  line-height: 20px;
  white-space: nowrap;
  ${({ activeItem }) =>
    activeItem &&
    css`
      color: ${({ theme }) => theme.palette.primary.main};
    `}
`;

const DurationHeader = styled(Text)`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  cursor: pointer;
  width: 16%;
  padding-left: 10px;
`;

const StyledDropdown = styled(Dropdown)`
  & > .customDropdown {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #1689ca;
    &:hover {
      color: #1689ca;
      text-decoration: underline;
    }
  }
  & .dropdown-menu {
    min-width: 115px;
    box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.05);
    border-radius: 10px;
    border: none;
  }
`;

const StyledDropdownItem = styled(Dropdown.Item)`
  padding: 10px 24px;
  font-family: Roboto;
  font-size: 12px;
  line-height: 14px;
  color: #313b4c;
  ${({ activeItem }) =>
    activeItem &&
    css`
      color: #1689ca !important;
      font-weight: bold;
    `}
  &:focus {
    color: ${({ theme }) => theme.palette.common.white} !important;
    background-color: ${({ theme }) => theme.palette.primary.main};
  }
`;

const DropDownTitle = styled(Text)`
  white-space: nowrap;
  font-size: 12px;
  line-height: 16px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.palette.primary.main};
  margin-right: 4px;
`;

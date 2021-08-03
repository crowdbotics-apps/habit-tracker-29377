import React, { useState, Fragment } from 'react';
import styled, { css } from 'styled-components';
import { Dropdown } from 'react-bootstrap';
import Statistics from '../Analytics/Statistics';
import BalanceSheet from '../Analytics/BalanceSheet';
import Charts from '../Analytics/Charts';
import Button from '../Button';
import ExportToExcel from '../ExportToExcel';

const { Toggle, Menu, Item } = Dropdown;

const AnalyticsMenu = ({ dropDownItem, handleDropdown, setActiveTab }) => {
  const [key, setKey] = useState('statistics');

  const buttonClickHandler = (e) => () => {
    setKey(e);
    setActiveTab(e);
  };
  const [netWorthPoints, setNetWorthPoints] = useState(0);
  const render = () => {
    switch (key) {
      case 'statistics':
        return <Statistics dropDownItem={dropDownItem} />;
      case 'balance-sheet':
        return <BalanceSheet setNetWorthPoints={setNetWorthPoints} />;
      case 'charts':
        return <Charts />;
      default:
        return <Statistics />;
    }
  };

  return (
    <Fragment>
      <AnalyticsMenuWrapper>
        <TabButtonWrapper>
          <TabButton
            onClick={buttonClickHandler('statistics')}
            IsActive={key === 'statistics'}
          >
            Statistics
          </TabButton>
          <TabButton
            onClick={buttonClickHandler('balance-sheet')}
            IsActive={key === 'balance-sheet'}
          >
            Balance Sheet
          </TabButton>
          <TabButton
            onClick={buttonClickHandler('charts')}
            IsActive={key === 'charts'}
          >
            Charts
          </TabButton>
        </TabButtonWrapper>
        <ActionButtonWrapper>
          {key === 'statistics' && (
            <>
              <DropdownWrapper onSelect={handleDropdown}>
                <Toggle variant="primary">{`SHOW ${dropDownItem.toUpperCase()}`}</Toggle>
                <StyledMenu>
                  <StyledDropdownItem
                    activeItem={dropDownItem === 'duration'}
                    eventKey="duration"
                  >
                    Show Duration
                  </StyledDropdownItem>
                  <StyledDropdownItem
                    activeItem={dropDownItem === 'avg'}
                    eventKey="avg"
                  >
                    Show Avg
                  </StyledDropdownItem>
                  <StyledDropdownItem
                    activeItem={dropDownItem === 'points'}
                    eventKey="points"
                  >
                    Show Points
                  </StyledDropdownItem>
                </StyledMenu>
              </DropdownWrapper>
              <ExportToExcel
                type={dropDownItem}
                button={<ExportButton>Export To Excel</ExportButton>}
              />
            </>
          )}
          {key === 'balance-sheet' && (
            <WorthButton>
              <WorthTitle>Net Worth</WorthTitle>
              <AreaPoint>{netWorthPoints}</AreaPoint>
            </WorthButton>
          )}
        </ActionButtonWrapper>
      </AnalyticsMenuWrapper>
      <AnalyticsContainer>{render()}</AnalyticsContainer>
    </Fragment>
  );
};

export default AnalyticsMenu;

const AnalyticsMenuWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  ${({ theme }) => theme.max('sm')`
      flex-direction: column-reverse;
  `}
`;

const TabButtonWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  ${({ theme }) => theme.max('sm')`
        width: 100%;
  `}
  ${({ theme }) => theme.max('md')`
        width: 100%;
  `}
`;

const TabButton = styled(Button)`
  width: 200px;
  height: 50px;
  margin: 0 10px;
  background-color: #fff;
  color: #818ea3;
  font-size: 12px;
  border-radius: 10px;
  &:first-child {
    margin-left: 0;
  }
  ${({ IsActive }) =>
    IsActive &&
    css`
      background-color: ${({ theme }) => theme.palette.text.secondaryLight};
    `}
  ${({ theme }) => theme.max('md')`
    width: 100%;
    margin-top: 5px;
    text-align:left;
    padding-left:20px;
    &:first-child {
    margin-left: 10px;
    }
  `}
  ${({ theme }) => theme.between('md', 'xl')`
    width: 160px;
  `}
`;

const ActionButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  ${({ theme }) => theme.max('md')`
    width: 100%;
    display: flex;
    justify-content: center;
  `}
  ${({ theme }) => theme.max('sm')`
    margin-bottom: 20px;
  `}
`;

const ExportButton = styled(Button)`
  margin-left: 10px;
  height: 35px;
  width: 140px;
  padding: 10px;
  background: #789f08;
`;

const AnalyticsContainer = styled.div`
  display: flex;
  ${({ theme }) => theme.max('md')`
    margin: 10px 10px 0 10px;
    overflow-x: auto;
    -ms-overflow-style: none; 
    scrollbar-width: none; 
    &::-webkit-scrollbar {
      display: none;
    }
  `}
`;

const DropdownWrapper = styled(Dropdown)`
  button {
    height: 35px;
    width: 140px;
    text-align: center;
    position: relative;
    font-size: 12px;
    background-color: ${({ theme }) => theme.palette.primary.main} !important;
    box-shadow: none !important;
    border-color: ${({ theme }) => theme.palette.primary.main}!important;
  }
`;

const StyledMenu = styled(Menu)`
  min-width: 115px;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.05);
  border-radius: 10px;
  border: none;
`;

const StyledDropdownItem = styled(Item)`
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

const WorthButton = styled.div`
  background-color: #1689ca;
  width: 570px;
  height: 50px;
  border-radius: 10px;
  color: #fff;
  padding: 13px 20px;
  font-size: 16px;
  display: flex;
  justify-content: space-between;
  ${({ theme }) => theme.max('sm')`
    width: 100%;
    margin: 10px;
  `}
  ${({ theme }) => theme.between('md', 'xl')`
    width: 290px;
  `}
`;

const WorthTitle = styled.p``;

const AreaPoint = styled.p``;

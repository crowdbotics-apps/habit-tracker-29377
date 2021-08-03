import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled, { css } from 'styled-components';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

import CommonAddScoreDialog from '../CommonAddScoreDialog';
import progressComplete from '../Header/assets/progressComplete.png';
import PlusIcon from './assets/plusIcon';
import DownArrowIcon from './assets/downArrowIcon';
import eyeIcon from './assets/eyeIcon.svg';
import AddModifyViewDialog from '../AddModifyViewDialog/AddModifyViewDialog';

import Button from '../Button';
import Dropdown from 'react-bootstrap/Dropdown';
import AddScoreDialog from '../AddScoreDialog';
import Drawer from '../Drawer';
import AddCategory from '../AddNew/AddCategory';
import AddSubCategory from '../AddNew/AddSubCategory';
import AddHabit from '../AddNew/AddHabbit';
import WeekPicker from './WeekPicker';

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
  </div>
));

const DashboardHeader = ({ dropDownItem }) => {
  const dispatch = useDispatch();

  const {
    areasList: { subHeaderData },
  } = useSelector(({ dashboard }) => dashboard);

  const { weekAverage, weekDayAverage, weekendAverage } = subHeaderData;

  const [showAddScoreDialog, setShowAddScoreDialog] = useState(false);

  const [openAddCategoryModal, setOpenAddCategoryModal] = useState(false);
  const toggleOpenAddCategoryModal = () =>
    setOpenAddCategoryModal((prev) => !prev);

  const [openAddSubCategoryModal, setOpenAddSubCategoryModal] = useState(false);
  const toggleOpenAddSubCategoryModal = () =>
    setOpenAddSubCategoryModal((prev) => !prev);

  const [openAddHabitModal, setOpenAddHabitModal] = useState(false);
  const toggleOpenAddHabitModal = () => setOpenAddHabitModal((prev) => !prev);

  const getAvgValue = (value, type) => {
    switch (value) {
      case 'avg':
        return type === 'week'
          ? weekAverage?.avg
          : type === 'weekDays'
          ? weekDayAverage?.avg
          : weekendAverage?.avg;
      case 'points':
        return type === 'week'
          ? weekAverage?.points
          : type === 'weekDays'
          ? weekDayAverage?.points
          : weekendAverage?.points;
      case 'duration':
      default:
        return type === 'week'
          ? weekAverage?.duration
          : type === 'weekDays'
          ? weekDayAverage?.duration
          : weekendAverage?.duration;
    }
  };

  const addModifyViewDialog = (
    <StyledPopover id="popover-basic">
      <AddModifyViewDialog />
    </StyledPopover>
  );

  const addCategoryDialogOpen = () => setShowAddScoreDialog(true);
  const addCategoryDialogClose = () => setShowAddScoreDialog(false);

  const handleDropdown = (type) => () => {
    if (type === 'category') {
      toggleOpenAddCategoryModal();
      setOpenAddSubCategoryModal(false);
      setOpenAddHabitModal(false);
    } else if (type === 'sub-category') {
      toggleOpenAddSubCategoryModal();
      setOpenAddCategoryModal(false);
      setOpenAddHabitModal(false);
    } else {
      toggleOpenAddHabitModal();
      setOpenAddSubCategoryModal(false);
      setOpenAddCategoryModal(false);
    }
  };
  return (
    <>
      <DashboardHeaderWrapper>
        {showAddScoreDialog && (
          <CommonAddScoreDialog
            show={showAddScoreDialog}
            handleClose={addCategoryDialogClose}
          />
        )}
        <TrackingWeekWrapper>
          <TrackingWeekText>Tracking week</TrackingWeekText>
          <WeekPicker />
        </TrackingWeekWrapper>
        <WeekStatisticsWrapper>
          <ProgressBarWrapper>
            <Percentage color="#448FFF">
              {getAvgValue(dropDownItem, 'week')}%
            </Percentage>
            <ProgressBar />
            <ProgressBarStripe
              width={getAvgValue(dropDownItem, 'week')}
              color="#448FFF"
            />
            <ProgressLabel>Week Score</ProgressLabel>
          </ProgressBarWrapper>
          <ProgressBarWrapper>
            <Percentage color="#8281F4">
              {getAvgValue(dropDownItem, 'weekDays')}%
            </Percentage>
            <ProgressBar />
            <ProgressBarStripe
              width={getAvgValue(dropDownItem, 'weekDays')}
              color="#8281F4"
            />
            <ProgressLabel>Weekdays Avg</ProgressLabel>
          </ProgressBarWrapper>
          <ProgressBarWrapper>
            <Percentage color="#099EB5">
              {getAvgValue(dropDownItem, 'weekendDays')}%
            </Percentage>
            <ProgressBar />
            <ProgressBarStripe
              width={getAvgValue(dropDownItem, 'weekendDays')}
              color="#099EB5"
            />
            <ProgressLabel>Weekend Avg</ProgressLabel>
          </ProgressBarWrapper>
        </WeekStatisticsWrapper>
      </DashboardHeaderWrapper>

      <DashboardHeaderButtonsWrapper>
        <StyledDropdown>
          <Dropdown.Toggle as={CustomDropdownToggle} id="dropdown-basic">
            <NavButton>
              <PlusIcon color="#FFFFFF" />
              Add New
              <DownArrowIcon color="white" />
            </NavButton>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <StyledDropdownItem
              // activeItem={dropDownItem === 'avg'}
              onClick={handleDropdown('category')}
            >
              Category
            </StyledDropdownItem>
            <StyledDropdownItem onClick={handleDropdown('sub-category')}>
              Subcategory
            </StyledDropdownItem>
            <StyledDropdownItem onClick={handleDropdown('habit')}>
              Habit
            </StyledDropdownItem>
          </Dropdown.Menu>
        </StyledDropdown>

        <OverlayTrigger
          rootClose
          trigger="click"
          placement="bottom-start"
          overlay={addModifyViewDialog}
        >
          <ModifyNavButton icon={eyeIcon} isLeft>
            Modify view
          </ModifyNavButton>
        </OverlayTrigger>
      </DashboardHeaderButtonsWrapper>
      {openAddCategoryModal && (
        <Drawer
          open={openAddCategoryModal}
          onClose={toggleOpenAddCategoryModal}
          header="Add new category"
        >
          <AddCategory onClose={toggleOpenAddCategoryModal} />
        </Drawer>
      )}
      {openAddSubCategoryModal && (
        <Drawer
          open={openAddSubCategoryModal}
          onClose={toggleOpenAddSubCategoryModal}
          header="Add new subcategory"
        >
          <AddSubCategory onClose={toggleOpenAddSubCategoryModal} />
        </Drawer>
      )}
      {openAddHabitModal && (
        <Drawer
          open={openAddHabitModal}
          onClose={toggleOpenAddHabitModal}
          header="Add new habit"
        >
          <AddHabit onClose={toggleOpenAddHabitModal} />
        </Drawer>
      )}
    </>
  );
};

export default DashboardHeader;

const StyledDropdown = styled(Dropdown)`
  & > .customDropdown {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #1689ca;
  }
  & .dropdown-menu {
    min-width: 117px;
    height: 116px;
    padding: 4px 0;
    border: 1px solid ${({ theme }) => theme.palette.text.secondaryLight};
    box-sizing: border-box;
    box-shadow: 0px 2px 20px rgba(27, 42, 61, 0.04);
    border-radius: 4px;
  }
`;

const StyledDropdownItem = styled(Dropdown.Item)`
  font-family: Roboto;
  font-size: 14px;
  line-height: 20px;
  padding: 8px 12px;
  color: ${({ theme }) => theme.palette.text.primary};
`;

const DashboardHeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  > * {
    &:first-child {
      margin-right: 20px;
    }
  }
  ${({ theme }) => theme.max('sm')`
    flex-direction: column;
    align-items: flex-start;
  }
  `}
`;

const TrackingWeekWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  > * {
    &:first-child {
      margin-bottom: 13px;
    }
  }
  ${({ theme }) => theme.max('sm')`
    width: 100%;
  `}
`;

const TrackingWeekText = styled.div`
  font-family: Roboto;
  font-size: 18px;
  line-height: 20px;
  color: ${({ theme }) => theme.palette.text.primary};
`;

const WeekStatisticsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  height: auto;
  padding: 24px 32px;
  background: #ffffff;
  border-radius: 12px;
  justify-content: space-evenly;
  > * {
    &:nth-child(2) {
      margin: 0px 32px;
    }
  }
  ${({ theme }) => theme.between('md', 'xl')`
     justify-content: center;
     padding: 24px 16px;
     > * {
      &:nth-child(2) {
        margin: 0px 16px;
        }
      }
  `}
  ${({ theme }) => theme.max('md')`
    width: 100%;
    justify-content: space-evenly;
    flex-direction: column;
  `}
  ${({ theme }) => theme.max('sm')`
      padding: 24px 3px;
      margin-top: 20px;
      > * {
      &:nth-child(2) {
        margin: 0px 3px;
        }
      }
  `}
`;

const ProgressBarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  > * {
    &:first-child {
      margin-bottom: 7px;
    }
  }
  position: relative;
  width: 160px;
  max-width: 160px;
  flex: 0.5;
  ${({ theme }) => theme.max('md')`
    max-width: 100%;
    width: 100%;
    flex: 1;
  `}
`;

const Percentage = styled.div`
  font-family: Roboto;
  font-size: 18px;
  line-height: 21px;
  color: #6bb3dc;
  ${({ color }) =>
    color &&
    css`
      color: ${color};
    `}
`;

const ProgressBar = styled.div`
  min-width: 160px;
  max-width: 141px;
  height: 8px;
  border: 1px solid ${({ theme }) => theme.palette.text.secondaryLight};
  border-radius: 20px;
  background: ${({ theme }) => theme.palette.background.main};
  ${({ theme }) => theme.max('md')`
    min-width: 100%;
    max-width: 100%;
  `}
`;

const ProgressBarStripe = styled.div`
  position: absolute;
  top: 30.4px;
  height: 4px;
  width: 0;
  left: 2px;
  border-radius: 20px;
  background: #6bb3dc;
  ${({ width, color }) =>
    width &&
    css`
      width: ${width}%;
      background: ${color};
    `}
`;

const ProgressLabel = styled.div`
  font-family: Roboto;
  font-size: 12px;
  line-height: 14px;
  color: #8e97a3;
  margin-top: 7px;
`;

const DashboardHeaderButtonsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const NavButton = styled(Button)`
  background: ${({ theme }) => theme.palette.primary.main};
  border-radius: 5px;
  width: 117px;
  text-transform: uppercase;
  font-weight: 500;
  font-size: 12px;
  line-height: 20px;
  text-align: center;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const ModifyNavButton = styled(Button)`
  background: none;
  color: ${({ theme }) => theme.palette.primary.main};
  border-radius: 5px;
  width: 124px;
  height: 36px;
  text-transform: uppercase;
  font-weight: 500;
  font-size: 12px;
  line-height: 20px;
  text-align: center;
  border: 2px solid #dddddd;
`;

const StyledPopover = styled(Popover)`
  border: none !important;
  & .arrow {
    &::after {
      display: none !important;
    }
    &::before {
      border-color: transparent !important;
    }
  }
`;

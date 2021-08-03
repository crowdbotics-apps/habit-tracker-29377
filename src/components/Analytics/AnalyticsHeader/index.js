import React, { useState, Fragment, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled, { css } from 'styled-components';
import DayPicker, { DateUtils } from 'react-day-picker';
import moment from 'moment';

import datePickerIcon from './assets/datePickerIcon.png';
import CommonAddScoreDialog from '../../CommonAddScoreDialog';
import { setSelectedMonthForAnalytics } from '../../../modules/actions/AnalyticsAction';
import Button from '../../Button';

const DashboardHeader = ({
  dropDownItem,
  activeTab,
  compareResultsDialogOpen,
}) => {
  const dispatch = useDispatch();

  const {
    selectedMonths,
    areasList: { analyticsSubHeaderData },
  } = useSelector(({ analytics }) => analytics);

  const { weekAverage, weekDayAverage, weekendAverage } =
    analyticsSubHeaderData;

  const [showAddScoreDialog, setShowAddScoreDialog] = useState(false);

  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const [selectedDays, setSelectedDays] = useState(
    selectedMonths.from && selectedMonths.to
      ? selectedMonths
      : {
          from: new Date(
            moment()
              .subtract(6, 'months')
              .startOf('month')
              .format('MM/DD/YYYY'),
          ),
          to: new Date(
            moment().subtract('months').endOf('month').format('MM/DD/YYYY'),
          ),
        },
  );

  useEffect(() => {
    dispatch(setSelectedMonthForAnalytics(selectedDays));
  }, [selectedDays]);

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

  const handleDayChange = (date) => {
    const range = DateUtils.addDayToRange(date, selectedDays);
    setSelectedDays(range);
  };

  const toggleDatePicker = () => {
    setDatePickerOpen((prev) => !prev);
    setSelectedDays({
      from: undefined,
      to: undefined,
    });
  };

  const addCategoryDialogOpen = () => setShowAddScoreDialog(true);
  const addCategoryDialogClose = () => setShowAddScoreDialog(false);

  const onClickHandler = () => compareResultsDialogOpen();

  const { from, to } = selectedDays;
  const modifiers = { start: from, end: to };
  return (
    <DashboardHeaderWrapper>
      {showAddScoreDialog && (
        <CommonAddScoreDialog
          show={showAddScoreDialog}
          handleClose={addCategoryDialogClose}
        />
      )}
      <TrackingWeekWrapper>
        <HeadingWrapper>
          <TrackingWeekText>Tracking period</TrackingWeekText>
          <TrackActivityButton onClick={addCategoryDialogOpen}>
            Track activity
          </TrackActivityButton>
        </HeadingWrapper>
        <WeekPickerWrapper>
          <WeekPicker>
            <StyledDayPicker
              className="Selectable"
              disabledDays={{ after: new Date() }}
              open={datePickerOpen}
              selectedDays={[from, { from, to }]}
              modifiers={modifiers}
              onDayClick={handleDayChange}
            />
            <WeekPickerToggler onClick={toggleDatePicker}>
              <WeekText>
                {selectedDays.from && selectedDays.to && (
                  <Fragment>
                    {moment(selectedDays.from).format('MMM D')}
                    {' - '}
                    {moment(selectedDays.to).format('MMM D')}
                  </Fragment>
                )}
              </WeekText>
              <img src={datePickerIcon} alt="icon" />
            </WeekPickerToggler>
          </WeekPicker>
        </WeekPickerWrapper>
      </TrackingWeekWrapper>
      <CompareButtonWrapper>
        {activeTab === 'balance-sheet' && (
          <CompareResultsButton onClick={onClickHandler}>
            compare results
          </CompareResultsButton>
        )}
        <WeekStatisticsWrapper>
          <ProgressBarWrapper>
            <Percentage color="#6BB3DC">
              {getAvgValue(dropDownItem, 'week')}%
            </Percentage>
            <ProgressBar />
            <ProgressBarStripe
              width={getAvgValue(dropDownItem, 'week')}
              color="#6BB3DC"
            />
            <ProgressLabel>Week Score</ProgressLabel>
          </ProgressBarWrapper>
          <ProgressBarWrapper>
            <Percentage color="#9696F4">
              {getAvgValue(dropDownItem, 'weekDays')}%
            </Percentage>
            <ProgressBar />
            <ProgressBarStripe
              width={getAvgValue(dropDownItem, 'weekDays')}
              color="#9696F4"
            />
            <ProgressLabel>Weekdays Avg</ProgressLabel>
          </ProgressBarWrapper>
          <ProgressBarWrapper>
            <Percentage color="#E9B67B">
              {getAvgValue(dropDownItem, 'weekendDays')}%
            </Percentage>
            <ProgressBar />
            <ProgressBarStripe
              width={getAvgValue(dropDownItem, 'weekendDays')}
              color="#E9B67B"
            />
            <ProgressLabel>Weekend Avg</ProgressLabel>
          </ProgressBarWrapper>
        </WeekStatisticsWrapper>
      </CompareButtonWrapper>
    </DashboardHeaderWrapper>
  );
};

export default DashboardHeader;

const DashboardHeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  ${({ theme }) => theme.max('md')`
    flex-direction: column;
    align-items: flex-start;
    margin: 20px 10px 0 10px;
  `}
  ${({ theme }) => theme.max('sm')`
    gap: 0px;
  `}
`;

const HeadingWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const TrackingWeekWrapper = styled.div`
  display: flex;
  flex-direction: column;
  > * {
    &:first-child {
      margin-bottom: 13px;
    }
  }
  ${({ theme }) => theme.max('sm')`
    padding: 20px; 
    width: 100%;
    padding-bottom: 0;
  `}
`;

const TrackActivityButton = styled.div`
  display: none;
  ${({ theme }) => theme.max('sm')`
      width: 118px;
      height: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: ${({ theme }) => theme.palette.primary.main};
      border-radius: 5px;
      font-family: Roboto;
      font-size: 12px;
      line-height: 14px;
      text-transform: uppercase;
      color: ${({ theme }) => theme.palette.common.white};
      cursor: pointer;
  `}
`;

const TrackingWeekText = styled.div`
  font-family: Roboto;
  font-size: 18px;
  line-height: 21px;
  color: ${({ theme }) => theme.palette.text.primary};
`;

const WeekPickerWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 13px;
  ${({ theme }) => theme.max('sm')`
    justify-content: center;
  `}
`;

const WeekPicker = styled.div`
  position: relative;
`;

const WeekPickerToggler = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-width: 143px;
  padding: 7px 10px;
  border-radius: 5px;
  background: ${({ theme }) => theme.palette.common.white};
  cursor: pointer;
  position: relative;
  ${({ theme }) => theme.max('md')`
    min-width: 229px;
    padding: 8px 10px;
  `}
`;

const StyledDayPicker = styled(DayPicker)`
  display: none;
  position: absolute;
  top: 35px;
  left: 0;
  z-index: 13;
  ${({ open }) =>
    open &&
    css`
      display: block;
    `}
  ${({ theme }) => theme.max('md')`
    top: 45px;
  `}
`;

const WeekText = styled.div`
  font-family: Roboto;
  font-size: 12px;
  line-height: 14px;
  text-transform: uppercase;
  color: #313b4c;
  ${({ theme }) => theme.max('md')`
    font-size: 16px;
    line-height: 19px;
  `}
`;

const WeekStatisticsWrapper = styled.div`
  display: flex;
  gap: 10px 40px;
  flex-wrap: wrap;
  ${({ theme }) => theme.max('md')`
    width: 100%;
    gap: 10px 20px;
    padding: 20px;
    background: #FFFFFF;
    border-radius: 10px;
  `}
  ${({ theme }) => theme.max('sm')`
    display: none;
  `}
`;

const ProgressBarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
  position: relative;
  min-width: 223px;
  flex: 0.5;
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
  height: 5px;
  background: ${({ theme }) => theme.palette.text.secondaryLight};
  border-radius: 5px;
`;

const ProgressBarStripe = styled.div`
  position: absolute;
  top: 28px;
  height: 5px;
  width: 0;
  border-radius: 5px;
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
`;

const CompareButtonWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  ${({ theme }) => theme.max('sm')`
    width: 100%;
  `}
  ${({ theme }) => theme.between('md', 'xl')`
    width: 100%;
    gap: 20px; 
  `}
`;

const CompareResultsButton = styled(Button)`
  background-color: #789f08;
  width: max-content;
  padding: 11px 34px;
  margin-right: 30px;
  ${({ theme }) => theme.max('md')`
    margin-bottom: 20px;
  `}
  ${({ theme }) => theme.max('sm')`
      margin: 10px 10px 0 10px;
      width: 100%;
  `}
`;

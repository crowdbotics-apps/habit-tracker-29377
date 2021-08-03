import React, { useState, Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled, { css } from 'styled-components';
import DayPicker from 'react-day-picker';
import moment from 'moment';

import datePickerIcon from './assets/datePickerIcon.png';
import Backdrop from '../Backdrop';
import { getWeekRange, getWeekDays } from '../../utils/utility';
import LeftArrowIcon from './assets/leftArrowIcon';
import RightArrowIcon from './assets/rightArrowIcon';
import { setSelectedWeek } from '../../modules/actions/DashboardActions';

const currentYear = new Date().getFullYear();
const fromMonth = new Date(currentYear, 0);
const toMonth = new Date(currentYear + 10, 11);

function YearMonthForm({ date, localeUtils, onChange }) {
  const months = localeUtils.getMonths();

  const years = [];
  for (let i = fromMonth.getFullYear(); i <= toMonth.getFullYear(); i += 1) {
    years.push(i);
  }

  const handleChange = function handleChange(e) {
    const { year, month } = e.target.form;
    onChange(new Date(year.value, month.value));
  };

  return (
    <form className="DayPicker-Caption">
      <select name="month" onChange={handleChange} value={date.getMonth()}>
        {months.map((month, i) => (
          <option key={month} value={i}>
            {month}
          </option>
        ))}
      </select>
      <select name="year" onChange={handleChange} value={date.getFullYear()}>
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </form>
  );
}

const WeekPickerComponent = () => {
  const dispatch = useDispatch();

  const { selectedWeek } = useSelector(({ dashboard }) => dashboard);

  const [month, setMonth] = useState(fromMonth);
  const [datePickerOpen, setDatePickerOpen] = useState();
  const [datePickerData, setDatePickerData] = useState({
    hoverRange: undefined,
    selectedDays: selectedWeek.length
      ? [...selectedWeek]
      : [...getWeekDays(getWeekRange(new Date()).from)],
  });

  const isFutureWeek =
    new Date(selectedWeek[new Date().getDay() - 1]).toDateString() ===
    new Date(new Date()).toDateString();

  const { hoverRange, selectedDays } = datePickerData;

  const daysAreSelected = selectedDays.length > 0;

  useEffect(() => {
    dispatch(setSelectedWeek(selectedDays));
  }, [selectedDays]); // eslint-disable-line react-hooks/exhaustive-deps

  const modifiers = {
    hoverRange,
    selectedRange: daysAreSelected && {
      from: selectedDays[0],
      to: selectedDays[6],
    },
    hoverRangeStart: hoverRange && hoverRange.from,
    hoverRangeEnd: hoverRange && hoverRange.to,
    selectedRangeStart: daysAreSelected && selectedDays[0],
    selectedRangeEnd: daysAreSelected && selectedDays[6],
  };

  const handleDayChange = (date) => {
    const checkFutureDate = moment(date, 'YYYY-MM-DD', true).isBefore(
      moment(new Date(), 'YYYY-MM-DD', true),
    );
    if (checkFutureDate) {
      setDatePickerData((prev) => ({
        ...prev,
        selectedDays: getWeekDays(getWeekRange(date).from),
      }));
    }
  };

  const handleYearMonthChange = (month) => {
    setMonth(month);
  };

  const handleDayEnter = (date) => {
    setDatePickerData((prev) => ({
      ...prev,
      hoverRange: getWeekRange(date),
    }));
  };

  const handleDayLeave = () => {
    setDatePickerData((prev) => ({
      ...prev,
      hoverRange: undefined,
    }));
  };

  const handleWeekClick = (days) => {
    setDatePickerData((prev) => ({
      ...prev,
      selectedDays: days,
    }));
  };

  const toggleDatePicker = () => {
    setDatePickerOpen((prev) => !prev);
  };

  const handlePreviousWeekClick = () => {
    setDatePickerData((prev) => ({
      ...prev,
      selectedDays: getWeekDays(
        getWeekRange(moment(selectedDays[0]).weekday(-7)).from,
      ),
    }));
  };

  const handleNextWeekClick = () => {
    if (!isFutureWeek) {
      setDatePickerData((prev) => ({
        ...prev,
        selectedDays: getWeekDays(
          getWeekRange(moment(selectedDays[0]).weekday(7)).from,
        ),
      }));
    }
  };

  return (
    <>
      {datePickerOpen && <Backdrop transparent onClose={toggleDatePicker} />}

      <WeekPickerWrapper>
        <PrevNextText onClick={handlePreviousWeekClick}>
          <LeftArrowIcon />
          Prev
        </PrevNextText>
        <WeekPicker>
          <StyledDayPicker
            firstDayOfWeek={1}
            showOutsideDays
            disabledDays={{ after: new Date() }}
            open={datePickerOpen}
            selectedDays={selectedDays}
            modifiers={modifiers}
            month={month}
            toMonth={new Date()}
            weekdaysShort={['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']}
            captionElement={({ date, localeUtils }) => (
              <YearMonthForm
                date={date}
                localeUtils={localeUtils}
                onChange={handleYearMonthChange}
              />
            )}
            onDayClick={handleDayChange}
            onDayMouseEnter={handleDayEnter}
            onDayMouseLeave={handleDayLeave}
            onWeekClick={handleWeekClick}
          />
          <WeekPickerToggler onClick={toggleDatePicker}>
            <WeekText>
              {selectedDays.length === 7 && (
                <Fragment>
                  {moment(selectedDays[0]).format('MMM D')}
                  {' - '}
                  {moment(selectedDays[6]).format('MMM D')}
                </Fragment>
              )}
            </WeekText>
            <img src={datePickerIcon} alt="icon" />
          </WeekPickerToggler>
        </WeekPicker>
        <PrevNextText isFutureWeek={isFutureWeek} onClick={handleNextWeekClick}>
          Next
          <RightArrowIcon isFutureWeek={isFutureWeek} />
        </PrevNextText>
      </WeekPickerWrapper>
    </>
  );
};

export default WeekPickerComponent;

const WeekPickerWrapper = styled.div`
  display: flex;
  align-items: center;
  > * {
    &:nth-child(2) {
      margin: 0 12px;
    }
  }
  ${({ theme }) => theme.max('sm')`
      justify-content: center;
  `}
`;

const PrevNextText = styled.button`
  font-family: Roboto;
  font-size: 12px;
  line-height: 16px;
  font-weight: 500;
  padding: 0;
  text-transform: uppercase;
  color: ${({ theme }) => theme.palette.primary.main};
  cursor: pointer;
  border: none;
  background: none;
  display: flex;
  align-items: center;
  ${({ isFutureWeek }) =>
    isFutureWeek &&
    css`
      color: #ccc;
      cursor: auto !important;
    `}
`;

const WeekPicker = styled.div`
  position: relative;
`;

const StyledDayPicker = styled(DayPicker)`
  display: none;
  position: absolute;
  top: 40px;
  left: 0;
  z-index: 13;
  ${({ open }) =>
    open &&
    css`
      display: block;
    `}
  ${({ theme }) => theme.max('md')`
    left: -38%;
    top: 40px;
  `}
`;

const WeekText = styled.div`
  font-family: Roboto;
  font-size: 14px;
  line-height: 20px;
  color: #313b4c;
`;

const WeekPickerToggler = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 193px;
  height: 36px;
  padding: 8px 12px;
  border-radius: 5px;
  background: ${({ theme }) => theme.palette.common.white};
  cursor: pointer;
  position: relative;
  border: 1px solid ${({ theme }) => theme.palette.text.secondaryLight};
  ${({ theme }) => theme.max('md')`
    min-width: 180px;
    padding: 8px 10px;
  `}
`;

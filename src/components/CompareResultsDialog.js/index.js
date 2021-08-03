import React, { Fragment, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled, { css } from 'styled-components';
import DayPicker from 'react-day-picker';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';
import { ButtonGroup } from 'react-bootstrap';

import closeIcon from '../AddScoreDialog/assets/closeIcon.png';
import Button from '../Button';
import { getStartEndDates } from '../../utils/utility';
import TextBoxLabel from '../../atoms/TextBoxLabel';
import datePickerIcon from '../DashboardHeader/assets/datePickerIcon.png';
import moment from 'moment';
import { getAreasListForCompareResults } from '../../modules/actions/AnalyticsAction';
import { rangeTextRendering } from '../../utils/analyticsCalculations';

const CompareResultsDialog = ({ show, handleClose }) => {
  const dispatch = useDispatch();
  const [selectedPriod, setSelectedPriod] = useState(1);
  const [datePickerOpen, setDatePickerOpen] = useState();
  const [datePickerData, setDatePickerData] = useState({ from: '', to: '' });

  const rangeSelecter = (selectedPriod, date) => {
    let startDate = moment(date).format('MM/DD/YYYY');
    let endDate = moment(date)
      .subtract(selectedPriod, 'days')
      .format('MM/DD/YYYY');
    let previousRangeEndDate = moment(date)
      .subtract(selectedPriod * 2, 'days')
      .format('MM/DD/YYYY');
    switch (selectedPriod) {
      case 1:
        return { from: [startDate], to: [endDate] };
      case 7:
      case 30:
      case 90:
      case 180:
      case 365:
        return {
          from: [startDate, endDate],
          to: [endDate, previousRangeEndDate],
        };
    }
  };

  useEffect(() => {
    setDatePickerData(rangeSelecter(selectedPriod, new Date()));
  }, [selectedPriod]);

  const {
    analyticsLoader: { loading: areasListLoading, success, error },
  } = useSelector(({ analytics }) => analytics);
  const toggleDatePicker = () => {
    setDatePickerOpen((prev) => !prev);
  };
  useEffect(() => {
    if (success) {
      handleClose();
    }
  }, [success]);

  const handleAddScoreClick = () => {
    const currentRangeBody =
      selectedPriod !== 1
        ? getStartEndDates(datePickerData.to[0], datePickerData.from[0])
        : getStartEndDates(datePickerData.from[0], datePickerData.from[0]);
    const privousRangeBody =
      selectedPriod !== 1
        ? getStartEndDates(datePickerData.to[1], datePickerData.from[1])
        : getStartEndDates(datePickerData.to[0], datePickerData.to[0]);
    dispatch(
      getAreasListForCompareResults({
        body: [currentRangeBody, privousRangeBody],
        range: selectedPriod,
        showLoader: true,
      }),
    );
  };

  const onHandleClick = (range) => () => {
    setSelectedPriod(range);
  };

  const handleDayChange = (date) => {
    toggleDatePicker();
    const checkFutureDate = moment(date, 'YYYY-MM-DD', true).isBefore(
      moment(new Date(), 'YYYY-MM-DD', true),
    );

    if (checkFutureDate) {
      setDatePickerData(rangeSelecter(selectedPriod, date));
    }
  };

  const buttonStyles = {
    width: 'max-content',
    padding: '11px 34px',
    background: '#789F08',
  };

  return (
    <StyledModal show={show} onHide={handleClose} dialogClassName="dialogClass">
      <CommonAddScoreDialogWrapper>
        <Header>
          <CloseIcon src={closeIcon} alt="icon" onClick={handleClose} />
          <Text>Compare results</Text>
        </Header>
        <Content>
          {error && <Alert variant="danger">{error}</Alert>}
          <Label>Compare period</Label>
          <FormControlWrapper>
            <RightSideWrapper>
              <StyledButtonGroup>
                <DayButton
                  onClick={onHandleClick(1)}
                  activeStyle={selectedPriod === 1}
                >
                  Daily
                </DayButton>
                <DayButton
                  onClick={onHandleClick(7)}
                  activeStyle={selectedPriod === 7}
                >
                  Weekly
                </DayButton>
                <DayButton
                  onClick={onHandleClick(30)}
                  activeStyle={selectedPriod === 30}
                >
                  Monthly
                </DayButton>
                <DayButton
                  onClick={onHandleClick(90)}
                  activeStyle={selectedPriod === 90}
                >
                  3 months
                </DayButton>
                <DayButton
                  onClick={onHandleClick(180)}
                  activeStyle={selectedPriod === 180}
                >
                  6 months
                </DayButton>
                <DayButton
                  onClick={onHandleClick(365)}
                  activeStyle={selectedPriod === 365}
                >
                  Year
                </DayButton>
              </StyledButtonGroup>
            </RightSideWrapper>
          </FormControlWrapper>
          <WeekPickerWrapper>
            <DatePickerWrapper>
              <DatePickerText>Select date</DatePickerText>
              <WeekPicker>
                <StyledDayPicker
                  firstDayOfWeek={1}
                  showOutsideDays
                  modifiers={{
                    selectedRange: datePickerData && {
                      from: new Date(datePickerData.from[0]),
                      to: new Date(datePickerData.to[0]),
                    },
                  }}
                  selectedDays={new Date(datePickerData.from)}
                  onDayClick={handleDayChange}
                  open={datePickerOpen}
                  disabledDays={{ after: new Date() }}
                />
                <WeekPickerToggler onClick={toggleDatePicker}>
                  <WeekText>
                    {datePickerData &&
                      rangeTextRendering(
                        selectedPriod,
                        datePickerData,
                        'start',
                      )}
                  </WeekText>
                  <img src={datePickerIcon} alt="icon" />
                </WeekPickerToggler>
              </WeekPicker>
            </DatePickerWrapper>

            <DatePickerWrapper>
              <DatePickerText>Compares to</DatePickerText>
              <WeekPicker>
                <StyledDayPicker
                  firstDayOfWeek={1}
                  showOutsideDays
                  disabledDays={{ after: new Date() }}
                />
                <WeekPickerToggler disable>
                  <WeekText>
                    {datePickerData &&
                      rangeTextRendering(selectedPriod, datePickerData, 'end')}
                  </WeekText>
                  <img src={datePickerIcon} alt="icon" />
                </WeekPickerToggler>
              </WeekPicker>
            </DatePickerWrapper>
          </WeekPickerWrapper>
          <ButtonWrapper>
            <Button
              loading={areasListLoading}
              styles={buttonStyles}
              onClick={handleAddScoreClick}
            >
              View
            </Button>
          </ButtonWrapper>
        </Content>
      </CommonAddScoreDialogWrapper>
    </StyledModal>
  );
};

export default CompareResultsDialog;

const StyledModal = styled(Modal)`
  & .modal {
    padding-left: 0;
  }
  & .modal-content {
    border: none;
    border-radius: 10px;
  }
  & .dialogClass {
    max-width: 595px;
    margin: 78px auto;
    ${({ theme }) => theme.max('sm')`
      margin: 49px 10px;
    `}
  }
`;

const CommonAddScoreDialogWrapper = styled.div`
  background: ${({ theme }) => theme.palette.background.main};
  box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
`;

const Header = styled.div`
  padding: 20px 20px 23px;
  background: ${({ theme }) => theme.palette.common.white};
  box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px 10px 0px 0px;
  margin-bottom: 5px;
`;

const CloseIcon = styled.img`
  float: right;
  cursor: pointer;
`;

const Text = styled.span`
  font-family: Roboto;
  font-size: 18px;
  line-height: 24px;
  color: ${({ theme }) => theme.palette.text.primary};
`;

const Content = styled.div`
  padding: 30px;
  ${({ theme }) => theme.max('sm')`
    padding: 20px 10px 30px;
  `}
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 30px;
  ${({ theme }) => theme.max('sm')`
    & > button {
      width: 100%;
    }
  `}
`;

const DayButton = styled(Button)`
  background: ${({ theme }) => theme.palette.primary.main} !important;
  color: ${({ theme }) => theme.palette.text.primary};
  border: 1px solid ${({ theme }) => theme.palette.text.secondaryLight} !important;
  border-radius: 0px !important;
  text-transform: capitalize;
  &:nth-child(1) {
    border-radius: 5px 0px 0px 5px !important;
  }
  &:nth-child(6) {
    border-radius: 0px 5px 5px 0px !important;
  }

  box-shadow: none !important;
  font-family: Roboto;
  font-size: 12px;
  line-height: 14px;
  ${({ activeStyle }) =>
    activeStyle &&
    css`
      background: ${({ theme }) => theme.palette.primary.main} !important;
      color: ${({ theme }) => theme.palette.common.white};
      &:hover {
        background: ${({ theme }) => theme.palette.primary.main} !important;
        color: ${({ theme }) => theme.palette.common.white};
      }
    `}
  ${({ activeStyle }) =>
    !activeStyle &&
    css`
      background: ${({ theme }) => theme.palette.common.white} !important;
      color: ${({ theme }) => theme.palette.text.primary} !important;
      &:hover {
        background: ${({ theme }) => theme.palette.common.white} !important;
        color: ${({ theme }) => theme.palette.text.primary};
      }
    `}
`;

const FormControlWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
  &:last-child {
    margin-bottom: 0;
  }
  ${({ theme }) => theme.max('sm')`
    flex-direction: column;
    margin-bottom: 20px;
  `}
`;

const Label = styled(TextBoxLabel)`
  white-space: nowrap;
  margin-bottom: 20px;
  min-width: 136px;
  font-family: Roboto;
  font-size: 14px;
  line-height: 24px;

  ${({ lessSpacing }) =>
    lessSpacing &&
    css`
      min-width: max-content;
    `}
  ${({ theme }) => theme.max('sm')`
    margin-top: 0;
    ${({ lessSpacing }) =>
      lessSpacing &&
      css`
        margin-top: 7px;
      `}
  `}
`;

const RightSideWrapper = styled.div`
  display: flex;
  width: 100%;
`;

const StyledButtonGroup = styled(ButtonGroup)`
  height: 36px;
  width: 100%;
`;

const WeekPickerWrapper = styled.div`
  display: flex;
  justify-content: space-between;

  align-items: center;
  ${({ theme }) => theme.max('sm')`
    flex-direction:column; 
    align-items: inherit;
  `}
`;

const DatePickerText = styled.div`
  font-family: Roboto;
  font-size: 14px;
  line-height: 16px;
  margin-right: 30px;
  text-transform: capitalize;
  color: ${({ theme }) => theme.palette.text.primary};
  cursor: pointer;
  ${({ theme }) => theme.max('md')`
    font-size: 16px;
    line-height: 19px;
  `}
`;

const DatePickerWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const WeekPicker = styled.div`
  position: relative;
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

const WeekPickerToggler = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid ${({ theme }) => theme.palette.text.secondaryLight};
  min-width: 143px;
  padding: 7px 10px;
  border-radius: 5px;
  background: ${({ theme }) => theme.palette.common.white};
  cursor: pointer;
  position: relative;
  ${({ theme }) => theme.max('md')`
    min-width: 180px;
    padding: 8px 10px;
  `}
  ${({ disable }) =>
    disable &&
    css`
      background: ${({ theme }) => theme.palette.text.secondaryLight};
      cursor: not-allowed;
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

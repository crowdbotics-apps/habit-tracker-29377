import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled, { css } from 'styled-components';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';

import closeIcon from '../AddScoreDialog/assets/closeIcon.png';
import TextBoxLabel from '../../atoms/TextBoxLabel';
import TextBox from '../../atoms/TextBox';
import ButtonComponent from '../Button';
import AreaCategoryBadge from '../AreaCategoryBadge';
import AdvancedSettings from './AdvancedSettings';
import downArrow from './assets/downArrow.png';
import rightArrow from './assets/rightArrow.png';
import Backdrop from '../Backdrop';
import { DurationHoursData, DurationMinutesData } from '../../utils/constants';
import { getStartEndDates } from '../../utils/utility';
import {
  addCategory,
  getAreasList,
} from '../../modules/actions/DashboardActions';

const weightList = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

const AddNewCategoryDialog = ({ areaId, show, handleClose }) => {
  const dispatch = useDispatch();

  const {
    areasList: { data, loading: areasListLoading, success: areasListSuccess },
    addCategory: { loading, success, error },
    selectedWeek,
  } = useSelector(({ dashboard }) => dashboard);

  useEffect(() => {
    if (success) {
      const body = getStartEndDates(selectedWeek[0], selectedWeek[6]);
      dispatch(getAreasList(body));
    }
    if (areasListSuccess) handleClose();
  }, [success, areasListSuccess]); // eslint-disable-line react-hooks/exhaustive-deps

  const selectedArea = data.find((item) => item.id === areaId);

  const [errorMessage, setErrorMessage] = useState('');
  const [advancedSettingsOpen, setAdvancedSettingsOpen] = useState(false);
  const [categoryDetails, setCategoryDetails] = useState({
    area: areaId,
    category: '',
    weight: 10,
    description: '',
    type_of_habit: 'build',
    durationHour: '00',
    durationMinute: '00',
    startsHour: '12',
    startsMinute: '00',
    ampm: 'AM',
    note: '',
    scoring_type: 'standard',
    motivation: '',
    trigger: '',
    obstacle: '',
  });
  const [selectedDays, setSelectedDays] = useState([
    'mon',
    'tue',
    'wed',
    'thu',
    'fri',
    'sat',
    'sun',
  ]);

  const [startsOpen, setStartsopen] = useState(false);

  const handleStartsOpen = () => {
    setStartsopen(true);
  };

  const handleStartsClose = () => {
    setStartsopen(false);
  };

  const handleChange = ({ target: { name, value } }) => {
    setCategoryDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleDayClick = (day) => () => {
    let prevDays = [...selectedDays];
    if (selectedDays.includes(day)) {
      prevDays.splice(prevDays.indexOf(day), 1);
      setSelectedDays(prevDays);
    } else {
      setSelectedDays((prev) => [...prev, day]);
    }
  };

  const handleTypeOfHabitClick = (type_of_habit) => () => {
    setCategoryDetails((prev) => ({
      ...prev,
      type_of_habit,
      weight: prev.weight > 0 ? -prev.weight : Math.abs(prev.weight),
    }));
  };

  const handleAmPmClick = (ampm) => () => {
    setCategoryDetails((prev) => ({ ...prev, ampm }));
  };

  const handleAdvancedSettingClick = () => {
    setAdvancedSettingsOpen((prev) => !prev);
  };

  const getCategoryOptions = () => {
    return selectedArea?.area.categories.map((c) => (
      <option key={c.id} value={c.id}>
        {c.name}
      </option>
    ));
  };

  const getCategoryWeightOptions = (type_of_habit) => {
    return weightList.map((weight, index) => (
      <option key={index} value={type_of_habit === 'build' ? weight : -weight}>
        {type_of_habit === 'build' ? weight : -weight}
      </option>
    ));
  };

  const buttonStyles = {
    width: 'max-content',
    padding: '11px 34px',
    background: '#789F08',
  };

  const {
    category,
    weight,
    description,
    type_of_habit,
    durationHour,
    durationMinute,
    startsHour,
    startsMinute,
    ampm,
    note,
    scoring_type,
    motivation,
    trigger,
    obstacle,
  } = categoryDetails;

  const handleAddCategoryClick = () => {
    if (!category) return setErrorMessage('Please select category to be add.');
    const isPresent = selectedArea?.categories.filter(
      (c) => c.category.id === +category || c.weight === +weight,
    );
    if (isPresent.length) {
      if (isPresent[0].category.id === +category)
        return setErrorMessage('Selected category has already been added.');
      if (isPresent[0].weight === +weight)
        return setErrorMessage(
          'Selected weight is associated with other category, please select different one.',
        );
    }
    if (!description) return setErrorMessage('Please add description.');
    setErrorMessage('');
    let body = {
      ...categoryDetails,
      weight: weight,
      monday: selectedDays.includes('mon'),
      tuesday: selectedDays.includes('tue'),
      wednesday: selectedDays.includes('wed'),
      thursday: selectedDays.includes('thu'),
      friday: selectedDays.includes('fri'),
      saturday: selectedDays.includes('sat'),
      sunday: selectedDays.includes('sun'),
      starts: `${startsHour}:${startsMinute}`,
      duration: `${durationHour}.${durationMinute}`,
    };
    dispatch(addCategory(body));
  };

  return (
    <StyledModal show={show} onHide={handleClose} dialogClassName="dialogClass">
      {startsOpen && <Backdrop transparent onClose={handleStartsClose} />}
      <MainWrapper>
        <Header>
          <CloseIcon src={closeIcon} alt="icon" onClick={handleClose} />
          <HeaderWrapper>
            <HeaderText>Add new category for</HeaderText>
            <AreaCategoryBadge areaId={areaId} isLast />
          </HeaderWrapper>
        </Header>

        <Content>
          {(error || errorMessage) && (
            <Alert variant="danger">{error || errorMessage}</Alert>
          )}

          <FormControlWrapper>
            <Label>Type of habit *</Label>
            <RightSideWrapper>
              <StyledButtonGroup toggle>
                <ToggleButton
                  onClick={handleTypeOfHabitClick('build')}
                  activeStyle={type_of_habit === 'build'}
                >
                  Build
                </ToggleButton>
                <ToggleButton
                  onClick={handleTypeOfHabitClick('quit')}
                  activeStyle={type_of_habit === 'quit'}
                >
                  Quit
                </ToggleButton>
              </StyledButtonGroup>
            </RightSideWrapper>
          </FormControlWrapper>

          <FormControlWrapper>
            <Label>Category Name *</Label>
            <RightSideWrapper>
              <CategorySelect>
                <Form.Control
                  as="select"
                  name="category"
                  value={category}
                  onChange={handleChange}
                >
                  <option>Select category</option>
                  {getCategoryOptions()}
                </Form.Control>
              </CategorySelect>
              <WeightSelectWrapper>
                <Label lessSpacing>Weight</Label>
                <WeightSelect>
                  <Form.Control
                    as="select"
                    name="weight"
                    value={weight}
                    onChange={handleChange}
                  >
                    {getCategoryWeightOptions(type_of_habit)}
                  </Form.Control>
                </WeightSelect>
              </WeightSelectWrapper>
            </RightSideWrapper>
          </FormControlWrapper>

          <FormControlWrapper>
            <Label>Description *</Label>
            <RightSideWrapper>
              <TextBox
                type="text"
                required
                name="description"
                value={description}
                onChange={handleChange}
              />
            </RightSideWrapper>
          </FormControlWrapper>

          <FormControlWrapper>
            <Label>Days to track *</Label>
            <RightSideWrapper>
              <StyledButtonGroup>
                <DayButton
                  onClick={handleDayClick('mon')}
                  activeStyle={selectedDays.includes('mon')}
                >
                  Mon
                </DayButton>
                <DayButton
                  onClick={handleDayClick('tue')}
                  activeStyle={selectedDays.includes('tue')}
                >
                  Tue
                </DayButton>
                <DayButton
                  onClick={handleDayClick('wed')}
                  activeStyle={selectedDays.includes('wed')}
                >
                  Wed
                </DayButton>
                <DayButton
                  onClick={handleDayClick('thu')}
                  activeStyle={selectedDays.includes('thu')}
                >
                  Thu
                </DayButton>
                <DayButton
                  onClick={handleDayClick('fri')}
                  activeStyle={selectedDays.includes('fri')}
                >
                  Fri
                </DayButton>
                <DayButton
                  onClick={handleDayClick('sat')}
                  activeStyle={selectedDays.includes('sat')}
                >
                  Sat
                </DayButton>
                <DayButton
                  onClick={handleDayClick('sun')}
                  activeStyle={selectedDays.includes('sun')}
                >
                  Sun
                </DayButton>
              </StyledButtonGroup>
            </RightSideWrapper>
          </FormControlWrapper>
          <FormControlWrapper>
            <Label>Timing</Label>
            <RightSideWrapper>
              <TimingWrapper>
                <DurationWrapper>
                  <Label lessSpacing>Duration</Label>
                  <DurationSelectCont>
                    <Form.Control
                      as="select"
                      name="durationHour"
                      className="px-2"
                      value={durationHour}
                      onChange={handleChange}
                    >
                      <option>HH</option>
                      {DurationHoursData.map((d, i) => (
                        <option key={i} value={d}>
                          {d}
                        </option>
                      ))}
                    </Form.Control>
                    <Form.Control
                      as="select"
                      name="durationMinute"
                      className="px-2"
                      value={durationMinute}
                      onChange={handleChange}
                    >
                      <option>MM</option>
                      {DurationMinutesData.map((d, i) => (
                        <option key={i} value={d}>
                          {d}
                        </option>
                      ))}
                    </Form.Control>
                  </DurationSelectCont>
                </DurationWrapper>
                <DurationWrapper>
                  <Label lessSpacing>Starts</Label>
                  <TimingSelectCont>
                    <StartsSelect open={startsOpen} onClick={handleStartsOpen}>
                      <TimingSelectTitle>
                        <TimingSelectText selected>
                          {`${startsHour}:${startsMinute} ${ampm}`}
                        </TimingSelectText>
                        <img src={downArrow} alt="icon" />
                      </TimingSelectTitle>
                      <StartsControl open={startsOpen}>
                        <HourMinuteWrapper>
                          <TextBox
                            type="number"
                            min="1"
                            max="12"
                            name="startsHour"
                            className="px-2"
                            value={startsHour}
                            onChange={handleChange}
                          />
                          <TextBox
                            type="number"
                            min="0"
                            max="59"
                            name="startsMinute"
                            className="px-2"
                            value={startsMinute}
                            onChange={handleChange}
                          />
                        </HourMinuteWrapper>
                        <StyledButtonGroup toggle>
                          <ToggleButton
                            onClick={handleAmPmClick('AM')}
                            activeStyle={ampm === 'AM'}
                          >
                            AM
                          </ToggleButton>
                          <ToggleButton
                            onClick={handleAmPmClick('PM')}
                            activeStyle={ampm === 'PM'}
                          >
                            PM
                          </ToggleButton>
                        </StyledButtonGroup>
                      </StartsControl>
                    </StartsSelect>
                  </TimingSelectCont>
                </DurationWrapper>
              </TimingWrapper>
            </RightSideWrapper>
          </FormControlWrapper>
          <TextAreaWrapper>
            <Label>Notes</Label>
            <RightSideWrapper>
              <Form.Control
                as="textarea"
                rows={3}
                name="note"
                value={note}
                onChange={handleChange}
              />
            </RightSideWrapper>
          </TextAreaWrapper>
        </Content>

        <StyledAccordion open={advancedSettingsOpen}>
          <Card>
            <Accordion.Toggle
              as={Card.Header}
              eventKey="0"
              onClick={handleAdvancedSettingClick}
            >
              <img
                src={advancedSettingsOpen ? downArrow : rightArrow}
                alt="icon"
              />
              <span>Advanced settings</span>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="0">
              <AdvancedSettings
                scoring_type={scoring_type}
                handleChange={handleChange}
                motivation={motivation}
                trigger={trigger}
                obstacle={obstacle}
              />
            </Accordion.Collapse>
          </Card>
        </StyledAccordion>

        <AddButtonWrapper>
          <ButtonComponent
            styles={buttonStyles}
            loading={loading || areasListLoading}
            onClick={handleAddCategoryClick}
          >
            Add
          </ButtonComponent>
        </AddButtonWrapper>
      </MainWrapper>
    </StyledModal>
  );
};

export default AddNewCategoryDialog;

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
    margin-top: 78px;
    ${({ theme }) => theme.max('sm')`
      margin-top: 49px;
    `}
  }
`;

const MainWrapper = styled.div`
  background: ${({ theme }) => theme.palette.background.main};
  box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
`;

const Header = styled.div`
  padding: 31px 31px 29px;
  background: ${({ theme }) => theme.palette.common.white};
  box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px 10px 0px 0px;
  ${({ theme }) => theme.max('sm')`
    padding: 25px 30px 18px;
  `}
`;

const CloseIcon = styled.img`
  float: right;
  cursor: pointer;
  margin-top: 15px;
  ${({ theme }) => theme.max('sm')`
    margin-top: -2px;
  `}
`;

const Text = styled.span`
  font-family: Roboto;
  font-size: 18px;
  line-height: 24px;
  color: ${({ theme }) => theme.palette.text.primary};
`;

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  ${({ theme }) => theme.max('sm')`
      flex-direction: column;
      align-items: flex-start;
  `}
`;

const HeaderText = styled(Text)`
  margin-right: 21px;
`;

const Content = styled.div`
  padding: 30px;
  ${({ theme }) => theme.max('sm')`
    padding: 21px 14px 20px 10px;
  `}
`;

const FormControlWrapper = styled.div`
  display: flex;
  > * {
    &:first-child {
      margin-right: 11px;
    }
  }
  justify-content: space-between;
  margin-bottom: 30px;
  &:last-child {
    margin-bottom: 0;
  }
  ${({ theme }) => theme.max('sm')`
    flex-direction: column;
    margin-bottom: 20px;
    > * {
    &:first-child {
      margin-bottom: 8px;
    }
  }
  `}
`;

const WeightSelectWrapper = styled(FormControlWrapper)`
  ${({ theme }) => theme.max('sm')`
    flex-direction: row;
  `}
`;

const TextAreaWrapper = styled(FormControlWrapper)`
  max-height: 100%;
`;

const RightSideWrapper = styled.div`
  display: flex;
  gap: 28px;
  width: 100%;
`;

const Label = styled(TextBoxLabel)`
  white-space: nowrap;
  margin-top: 7px;
  min-width: 136px;
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

const CategorySelect = styled.div`
  width: 222px;
  max-width: 222px;
`;

const WeightSelect = styled.div`
  width: 84px;
  max-width: 84px;
`;

const StyledButtonGroup = styled(ButtonGroup)`
  height: 36px;
  width: 100%;
  border-radius: 5px;
`;

const ToggleButton = styled(Button)`
  background: ${({ theme }) => theme.palette.common.white} !important;
  border: 1px solid ${({ theme }) => theme.palette.text.secondaryLight} !important;
  box-shadow: none !important;
  font-family: Roboto;
  font-size: 14px;
  line-height: 16px;
  color: ${({ theme }) => theme.palette.text.primary};
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
      &:hover {
        background: ${({ theme }) => theme.palette.common.white} !important;
        color: ${({ theme }) => theme.palette.text.primary};
      }
    `}
`;

const DayButton = styled(Button)`
  background: ${({ theme }) => theme.palette.primary.main} !important;
  color: ${({ theme }) => theme.palette.text.primary};
  border: 1px solid ${({ theme }) => theme.palette.text.secondaryLight} !important;
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

const TimingWrapper = styled.div`
  width: 100%;
  display: flex;
  gap: 20px;
`;

const DurationWrapper = styled.div`
  width: 55%;
  display: flex;
  gap: 9px;
  &:last-child {
    width: 45%;
  }
`;

const TimingSelectCont = styled.div`
  position: relative;
`;

const DurationSelectCont = styled.div`
  display: flex;
  width: 100%;
  & > select {
    margin-right: 4px;
    &:last-child {
      margin-right: 0;
    }
  }
`;

const TimingSelectTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 4px;
`;

const TimingSelectText = styled.div`
  width: 100px;
  font-family: Roboto;
  font-size: 14px;
  line-height: 24px;
  padding: 0 4px;
  color: ${({ theme }) => theme.palette.text.primary};
  cursor: pointer;
  &:hover {
    background: #dcdbdb;
  }
  ${({ selected }) =>
    selected &&
    css`
      &:hover {
        color: ${({ theme }) => theme.palette.text.primary};
        background: ${({ theme }) => theme.palette.common.white};
      }
    `}
  ${({ active }) =>
    active &&
    css`
      color: ${({ theme }) => theme.palette.common.white};
      background: ${({ theme }) => theme.palette.primary.main};
    `}
`;

const StartsSelect = styled.div`
  position: absolute;
  padding: 5px 12px;
  width: 120px;
  height: 36px;
  background-color: #fff;
  border: 1px solid #ced4da;
  border-radius: 4px;
  z-index: 12;
  ${({ open }) =>
    open &&
    css`
      height: 140px;
      width: 140px;
    `}
  ${({ theme }) => theme.max('xs')`
    width: 105px;
  `}
`;

const HourMinuteWrapper = styled.div`
  display: flex;
  gap: 6px;
  margin: 8px 0 13px;
`;

const StartsControl = styled.div`
  display: none;
  ${({ open }) =>
    open &&
    css`
      display: block;
    `}
`;

const StyledAccordion = styled(Accordion)`
  & .card {
    border: none;
    border-radius: 0;
    box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.1);
    ${({ open }) =>
      open &&
      css`
        box-shadow: none;
      `}
  }
  & .card-header {
    display: flex;
    align-items: center;
    gap: 26px;
    cursor: pointer;
    padding: 21px 30px;
    background: ${({ theme }) => theme.palette.common.white};
    ${({ open }) =>
      open &&
      css`
        z-index: 1;
        box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.1);
      `}
  }
`;

const AddButtonWrapper = styled.div`
  padding: 30px;
  display: flex;
  justify-content: flex-end;
  ${({ theme }) => theme.max('sm')`
    padding: 20px 10px 30px;
    & > button {
      width: 100%;
    }
  `}
`;

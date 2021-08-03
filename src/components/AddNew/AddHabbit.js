import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Select from 'react-select';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import styled, { css } from 'styled-components';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import orderBy from 'lodash.orderby';
import Alert from 'react-bootstrap/Alert';
import Picker from 'react-mobile-picker-scroll';

import ButtonComponent from '../Button';
import Backdrop from '../Backdrop';
import {
  WeightDropDownList,
  addbuttonStyles,
  cancelButtonStyles,
  NegativeWeightDropDownList,
} from '../../utils/constants';
import WatchIcon from '../../assets/images/WatchIcon.svg';
import { customDropdownStyles, areaDropdownStyles } from './styles';
import {
  getAreaBackgroundColor,
  getAreaColor,
  getStartEndDatesV2,
} from '../../utils/utility';
import {
  addHabit,
  getUserInfo,
  resetFlagsDashboard,
} from '../../modules/actions/DashboardActions';

const FrequencyMenuItem = ['Daily', 'Weekly', 'Monthly', 'Specific days'];

const Hours = Array(12)
  .fill()
  .map((element, index) => index);

const Minutes = Array(60)
  .fill()
  .map((element, index) => (index < 10 ? '0' + index : index));

const AddHabit = ({
  onClose,
  areaId = '',
  categoryId = '',
  subCategoryId = '',
}) => {
  const dispatch = useDispatch();
  const [selectedCategory, setSelectedCategory] = useState('');

  const {
    addHabit: { success, loading, error },
    getUserInfoList: {
      data: userInfoData,
      loading: userInfoLoading,
      success: userInfoSuccess,
    },
    selectedWeek,
  } = useSelector(({ dashboard }) => dashboard);

  useEffect(() => {
    if (areaId) {
      const selectedAreaRow = userInfoData.find((item) => item.id === areaId);
      const selectedArea = {
        label: selectedAreaRow.system_area_name.name,
        value: selectedAreaRow.id,
        color: getAreaColor(selectedAreaRow.system_area_name.code),
        bgColor: getAreaBackgroundColor(selectedAreaRow.system_area_name.code),
      };
      setSelectedArea(selectedArea);
      handleAreaChange(selectedArea);

      if (categoryId) {
        const selectedCategoryRow = selectedAreaRow.userCategories.find(
          (item) => item.id === categoryId,
        );
        const selectedCategory = {
          label: selectedCategoryRow.custom_category_name,
          value: selectedCategoryRow.id,
        };
        setSelectedCategory(selectedCategory);
        handleCategoryChange(selectedCategory, selectedArea);

        if (subCategoryId) {
          const selectedSubCategoryRow =
            selectedCategoryRow.userSubCategories.find(
              (item) => item.id === subCategoryId,
            );
          const selectedSubCategory = {
            label: selectedSubCategoryRow.custom_subcategory_name,
            value: selectedSubCategoryRow.id,
          };
          setSelectedSubcategory(selectedSubCategory);
        }
      }
    }

    const options = userInfoData.map((d) => ({
      label: d.system_area_name.name,
      value: d.id,
      color: getAreaColor(d.system_area_name.code),
      bgColor: getAreaBackgroundColor(d.system_area_name.code),
    }));
    setAreaOptions(orderBy(options, 'label', 'asc'));

    return () => {
      setErrorMessage('');
      dispatch(resetFlagsDashboard({ blockType: 'addSubcategory' }));
    };
  }, []);

  useEffect(() => {
    if (success) {
      dispatch(getUserInfo());
    }
    if (userInfoSuccess) onClose();
  }, [userInfoSuccess, success]); // eslint-disable-line react-hooks/exhaustive-deps

  const [areaOptions, setAreaOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedWeight, setSelectedWeight] = useState(null);
  const [frequency, setFrequency] = useState('Daily');
  const [typeOfHabit, setTypeOfHabit] = useState('build');
  const [habitDetails, setHabitDetails] = useState({
    habitName: '',
    description: '',
    motivation: '',
    obstacles: '',
    triggers: '',
  });
  const [openTimePicker, setOpenTimePicker] = useState(false);
  const [openDurationPicker, setOpenDurationPicker] = useState(false);
  const [duration, setDuration] = useState({
    options: {
      hour: Hours,
      minute: Minutes,
    },
    values: {
      hour: '',
      minute: '',
    },
  });
  const [time, setTime] = useState({
    options: {
      hour: Hours,
      minute: Minutes,
      ampm: ['AM', 'PM'],
    },
    values: {
      hour: '',
      minute: '',
      ampm: '',
    },
  });

  const toggleTimePicker = () => setOpenTimePicker((prev) => !prev);
  const toggleDurationPicker = () => setOpenDurationPicker((prev) => !prev);
  const handleAreaChange = (newValue) => {
    setSelectedArea(newValue);
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    const selectedArea = userInfoData.find((d) => d.id === newValue.value);
    const categories = selectedArea.userCategories.map((c) => ({
      label: c.custom_category_name,
      value: c.id,
    }));
    setCategoryOptions(categories);
  };
  const handleCategoryChange = (newValue, selectedArea) => {
    setSelectedCategory(newValue);
    setSelectedSubcategory(null);
    const area = userInfoData.find((d) => d.id === selectedArea.value);
    const category = area.userCategories.find((d) => d.id === newValue.value);
    const subcategories = category.userSubCategories.map((c) => ({
      label: c.custom_subcategory_name,
      value: c.id,
    }));
    setSubCategoryOptions(subcategories);
  };

  const handleSubcategoryChange = (newValue) =>
    setSelectedSubcategory(newValue);

  const handleWeightChange = (newValue) => setSelectedWeight(newValue);

  const handleFrequencyChange = (type) => () => setFrequency(type);

  const handleTypeOfHabitClick = (type_of_habit) => () => {
    if (selectedWeight?.value) {
      setSelectedWeight(null);
    }
    setTypeOfHabit(type_of_habit);
  };

  const handleChange = ({ target: { name, value } }) => {
    setHabitDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleTimeChange = (name, value) => {
    setTime(({ values, options }) => ({
      options: { ...options },
      values: {
        ...values,
        [name]: value,
      },
    }));
  };
  const handleDurationChange = (name, value) => {
    setDuration(({ values, options }) => ({
      options: { ...options },
      values: {
        ...values,
        [name]: value,
      },
    }));
  };

  const getRepeatFrequencyText = () => {
    switch (frequency) {
      case 'Daily':
        return 'every day.';
      case 'Weekly':
        return 'every week.';
      case 'Monthly':
        return 'every month.';
      case 'Specific days':
        return 'specific days.';
      case 'Periodic':
        return 'periodic.';
      default:
        return '';
    }
  };

  const handleSubmit = () => {
    if (!selectedArea?.value) return setErrorMessage('Please select area.');
    if (!selectedCategory?.value)
      return setErrorMessage('Please provide category.');
    if (!selectedSubcategory)
      return setErrorMessage('Please provide subcategory.');
    if (!habitDetails.habitName)
      return setErrorMessage('Please provide habit name.');
    if (!selectedWeight?.value) return setErrorMessage('Please select weight.');

    setErrorMessage('');
    const dates = getStartEndDatesV2(selectedWeek[0], selectedWeek[6]);
    const addHabitPayload = {
      custom_habit_name: habitDetails.habitName,
      description: habitDetails.description,
      parent_subcategory: selectedSubcategory.value,
      weight: selectedWeight.value,
      type: typeOfHabit === 'build' ? 1 : 0,
      start_date: dates.start,
      end_date: dates.end,
      duration: duration.values.hour,
      motivation: habitDetails.motivation,
      trigger: habitDetails.triggers,
      obstacle: habitDetails.obstacles,
    };

    dispatch(addHabit(addHabitPayload));
  };

  const { habitName, description, motivation, obstacles, triggers } =
    habitDetails;
  return (
    <Wrapper>
      <StyledForm open={openTimePicker || openDurationPicker}>
        {(error || errorMessage) && (
          <Alert variant="danger">{error || errorMessage}</Alert>
        )}
        <HeaderWrapper header="location">Location</HeaderWrapper>
        <Form.Group as={Row} controlId="area">
          <Form.Label column xs="4" className="input-text-label">
            Area
          </Form.Label>
          <Col xs="8">
            <Select
              placeholder="Select area"
              options={areaOptions}
              styles={areaDropdownStyles}
              value={selectedArea}
              onChange={handleAreaChange}
              components={{
                IndicatorSeparator: null,
              }}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="category">
          <Form.Label column xs="4" className="input-text-label">
            Category
          </Form.Label>
          <Col xs="8">
            <Select
              placeholder="Select category"
              options={categoryOptions}
              styles={areaDropdownStyles}
              value={selectedCategory}
              onChange={(value) => handleCategoryChange(value, selectedArea)}
              components={{
                IndicatorSeparator: null,
              }}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="subcategory">
          <Form.Label column xs="4" className="input-text-label">
            Subcategory
          </Form.Label>
          <Col xs="8">
            <Select
              placeholder="Select subcategory"
              options={subCategoryOptions}
              styles={areaDropdownStyles}
              value={selectedSubcategory}
              onChange={handleSubcategoryChange}
              components={{
                IndicatorSeparator: null,
              }}
            />
          </Col>
        </Form.Group>

        <HeaderWrapper>General information</HeaderWrapper>

        <Form.Group as={Row} controlId="location">
          <Form.Label column xs="4" className="input-text-label">
            Habit name
          </Form.Label>
          <Col xs="8">
            <Form.Control
              type="text"
              placeholder="Enter habit name"
              name="habitName"
              value={habitName}
              onChange={handleChange}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label column xs="4" className="input-text-label">
            Type of habit
          </Form.Label>
          <Col xs="8">
            <StyledButtonGroup toggle>
              <ToggleButton
                onClick={handleTypeOfHabitClick('build')}
                activeStyle={typeOfHabit === 'build'}
              >
                Build
              </ToggleButton>
              <ToggleButton
                onClick={handleTypeOfHabitClick('quit')}
                activeStyle={typeOfHabit === 'quit'}
              >
                Quit
              </ToggleButton>
            </StyledButtonGroup>
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="habitWeight">
          <Form.Label column xs="4" className="input-text-label">
            Weight of habit
          </Form.Label>
          <Col xs="8">
            <Select
              placeholder="Select weight of habit"
              styles={customDropdownStyles}
              options={
                typeOfHabit === 'build'
                  ? WeightDropDownList
                  : NegativeWeightDropDownList
              }
              value={selectedWeight}
              onChange={handleWeightChange}
              components={{
                IndicatorSeparator: null,
              }}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="description">
          <Form.Label column xs="4" className="input-text-label">
            Description
          </Form.Label>
          <Col xs="8">
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Description"
              name="description"
              value={description}
              onChange={handleChange}
            />
          </Col>
        </Form.Group>

        <HeaderWrapper>Frequency</HeaderWrapper>

        <FrequencyMenuWrapper>
          {FrequencyMenuItem.map((menuItem) => {
            return (
              <MenuItem
                onClick={handleFrequencyChange(menuItem)}
                key={menuItem}
                activeStyle={frequency === menuItem}
              >
                {menuItem}
              </MenuItem>
            );
          })}
        </FrequencyMenuWrapper>

        <FrequencyTimeHeader>
          <div>Repeat</div>
          <div>{getRepeatFrequencyText()}</div>
        </FrequencyTimeHeader>

        <Form.Group as={Row} controlId="time">
          <Form.Label column xs="4" className="input-text-label">
            Time
          </Form.Label>
          <Col xs="8">
            <TimeInputWraper>
              {time.values.hour !== 0 || time.values.minute !== '00' ? (
                <TimeValue>{`${time.values.hour}:${time.values.minute} ${time.values.ampm}`}</TimeValue>
              ) : (
                <TimeValue placeholderText>HH:MM</TimeValue>
              )}
              <TimeIconWrapper
                src={WatchIcon}
                alt=""
                onClick={toggleTimePicker}
              />
            </TimeInputWraper>

            <TimePicker open={openTimePicker}>
              <Picker
                optionGroups={time.options}
                valueGroups={time.values}
                onChange={handleTimeChange}
              />
            </TimePicker>
          </Col>
        </Form.Group>
        {openTimePicker && <Backdrop transparent onClose={toggleTimePicker} />}
        <Form.Group as={Row} controlId="duration">
          <Form.Label column xs="4" className="input-text-label">
            Duration
          </Form.Label>
          <Col xs="8">
            <TimeInputWraper>
              {duration.values.hour !== 0 || duration.values.minute !== '00' ? (
                <TimeValue>{`${duration.values.hour}:${duration.values.minute}`}</TimeValue>
              ) : (
                <TimeValue placeholderText>HH:MM</TimeValue>
              )}
              <TimeIconWrapper
                src={WatchIcon}
                alt=""
                onClick={toggleDurationPicker}
              />
            </TimeInputWraper>

            <DurationPicker open={openDurationPicker}>
              <Picker
                optionGroups={duration.options}
                valueGroups={duration.values}
                onChange={handleDurationChange}
              />
            </DurationPicker>
          </Col>
        </Form.Group>
        {openDurationPicker && (
          <Backdrop transparent onClose={toggleDurationPicker} />
        )}

        <HeaderWrapper>Purpose</HeaderWrapper>
        <Form.Group as={Row} controlId="whtMotivateU">
          <Form.Label column xs="4" className="input-text-label">
            What motivates you
          </Form.Label>
          <Col xs="8">
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Write what motivates you"
              name="motivation"
              value={motivation}
              onChange={handleChange}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="triggers">
          <Form.Label column xs="4" className="input-text-label">
            Triggers
          </Form.Label>
          <Col xs="8">
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Write your triggers"
              name="triggers"
              value={triggers}
              onChange={handleChange}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="obstacles">
          <Form.Label column xs="4" className="input-text-label">
            Obstacles
          </Form.Label>
          <Col xs="8">
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Write your obstacles"
              name="obstacles"
              value={obstacles}
              onChange={handleChange}
            />
          </Col>
        </Form.Group>
      </StyledForm>
      <Footer>
        <ButtonComponent styles={cancelButtonStyles} onClick={onClose}>
          Cancel
        </ButtonComponent>
        <ButtonComponent
          styles={addbuttonStyles}
          loading={loading || userInfoLoading}
          onClick={handleSubmit}
        >
          Add
        </ButtonComponent>
      </Footer>
    </Wrapper>
  );
};
export default AddHabit;

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const StyledForm = styled.form`
  padding: 20px;
  height: 100%;
  overflow-y: auto;
  ${({ open }) =>
    open &&
    css`
      overflow-y: hidden;
    `}
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 20px;
  border-top: 1px solid ${({ theme }) => theme.palette.text.secondaryLight};
`;

const TimeInputWraper = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 36px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.palette.text.secondaryLight};
  background: ${({ theme }) => theme.palette.common.white};
  padding: 8px 12px;
  ${({ theme }) => theme.max('md')`
    width: 100%;
  `}
`;
const TimeIconWrapper = styled.img`
  cursor: pointer;
`;
const TimeValue = styled.div`
  font-family: Roboto;
  font-size: 14px;
  line-height: 20px;
  color: ${({ theme }) => theme.palette.text.primary};
  ${({ placeholderText }) =>
    placeholderText &&
    css`
      color: ${({ theme }) => theme.palette.text.secondary};
    `}
`;
const FrequencyTimeHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Roboto;
  font-size: 14px;
  line-height: 20px;
  padding: 16px 16px 0;
  margin-bottom: 16px;
  div:nth-child(1) {
    margin: 0px 3px;
    color: ${({ theme }) => theme.palette.text.secondary};
  }
  div:nth-child(2) {
    color: ${({ theme }) => theme.palette.text.primary};
  }
`;
const FrequencyMenuWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;
const MenuItem = styled.div`
  font-family: Roboto;
  font-size: 14px;
  line-height: 20px;
  padding: 0 12px 4px 12px;
  cursor: pointer;
  color: ${({ theme }) => theme.palette.text.primary};
  ${({ activeStyle }) =>
    activeStyle &&
    css`
      border-bottom: 2px solid ${({ theme }) => theme.palette.primary.main};
    `}
  ${({ theme }) => theme.max('xs')`
        margin-bottom: 10px;
    `}
`;
const StyledButtonGroup = styled(ButtonGroup)`
  height: 36px;
  width: 100%;
  border-radius: 5px;
`;

const ToggleButton = styled(Button)`
  border: 1px solid ${({ theme }) => theme.palette.text.secondaryLight} !important;
  box-shadow: none !important;
  font-family: Roboto;
  font-size: 14px;
  line-height: 16px;
  background: ${({ theme }) => theme.palette.common.white} !important;
  color: ${({ theme }) => theme.palette.text.primary} !important;
  ${({ activeStyle }) =>
    activeStyle &&
    css`
      background: ${({ theme }) => theme.palette.primary.main} !important;
      color: ${({ theme }) => theme.palette.common.white} !important;
    `}
`;
const HeaderWrapper = styled.div`
  font-family: Roboto;
  font-size: 18px;
  line-height: 20px;
  color: ${({ theme }) => theme.palette.text.primary};
  padding: 16px 0 12px;
  ${({ header }) =>
    header &&
    css`
      padding-top: 0;
    `}
`;

const TimePicker = styled.div`
  display: flex;
  position: absolute;
  top: 30px;
  right: 28px;
  z-index: 12;
  width: 0;
  height: 0;
  background: ${({ theme }) => theme.palette.common.white};
  border: 1px solid ${({ theme }) => theme.palette.text.secondaryLight};
  box-shadow: 0px 2px 20px rgba(27, 42, 61, 0.04);
  border-radius: 8px;
  .picker-container {
    height: 0 !important;
  }
  ${({ open }) =>
    open &&
    css`
      height: 200px;
      width: 126px;
      .picker-container {
        height: 200px !important;
      }
      .picker-highlight {
        top: 41%;
        margin-top: 0 !important;
      }
      .picker-inner {
        padding: 0;
      }
      .picker-item {
        padding: 0 !important;
        cursor: pointer;
        font-family: Roboto;
        font-size: 14px;
        line-height: 20px !important;
        color: ${({ theme }) => theme.palette.text.primary};
      }
    `}
`;

const DurationPicker = styled(TimePicker)`
  ${({ open }) =>
    open &&
    css`
      width: 88px;
    `}
`;

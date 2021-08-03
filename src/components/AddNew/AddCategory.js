import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import Select from 'react-select';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import orderBy from 'lodash.orderby';
import Alert from 'react-bootstrap/Alert';

import ButtonComponent from '../Button';
import CreatableDropdown from './CreatableDropdown';
import { customDropdownStyles, areaDropdownStyles } from './styles';
import {
  WeightDropDownList,
  addbuttonStyles,
  cancelButtonStyles,
} from '../../utils/constants';
import {
  getAreaBackgroundColor,
  getAreaColor,
  getStartEndDatesV2,
} from '../../utils/utility';
import {
  addCategory,
  resetFlagsDashboard,
  getUserInfo,
} from '../../modules/actions/DashboardActions';

const disabledOption = {
  label: 'Select an option or create one',
  disabled: true,
};

const AddCategory = ({ onClose }) => {
  const dispatch = useDispatch();

  const {
    addCategory: { loading, success, error },
    getUserInfoList: {
      data: userInfoData,
      loading: userInfoLoading,
      success: userInfoSuccess,
    },
    selectedWeek,
  } = useSelector(({ dashboard }) => dashboard);

  useEffect(() => {
    const options = userInfoData.map((d) => ({
      label: d.system_area_name.name,
      value: d.id,
      color: getAreaColor(d.system_area_name.code),
      bgColor: getAreaBackgroundColor(d.system_area_name.code),
    }));
    setAreaOptions(orderBy(options, 'label', 'asc'));
    return () => {
      setErrorMessage('');
      dispatch(resetFlagsDashboard({ blockType: 'addCategory' }));
    };
  }, []);

  const [areaOptions, setAreaOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([disabledOption]);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedWeight, setSelectedWeight] = useState(null);

  useEffect(() => {
    if (success) {
      dispatch(getUserInfo());
    }
    if (userInfoSuccess) onClose();
  }, [userInfoSuccess, success]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAreaChange = (newValue) => {
    setSelectedArea(newValue);
    setSelectedCategory(null);
    const selectedArea = userInfoData.find((d) => d.id === newValue.value);
    const categories =
      selectedArea.categories?.map((c) => ({
        label: c.name,
        value: c.id,
      })) || [];
    setCategoryOptions([disabledOption, ...categories]);
  };

  const handleCategoryChange = (newValue) => {
    setSelectedCategory(newValue);
  };

  const handleWeightChange = (newValue) => {
    setSelectedWeight(newValue);
  };

  const handleSubmit = () => {
    if (!selectedArea?.value) return setErrorMessage('Please select area.');
    if (!selectedCategory?.value)
      return setErrorMessage('Please select category.');
    if (!selectedWeight?.value) return setErrorMessage('Please select weight.');
    setErrorMessage('');
    const dates = getStartEndDatesV2(selectedWeek[0], selectedWeek[6]);
    const addCategoryPayload = {
      custom_category_name: selectedCategory.label,
      description: '',
      parent_area: selectedArea.value,
      weight: selectedWeight.value,
      start_date: dates.start,
      end_date: dates.end,
    };
    if (!isNaN(selectedCategory.value)) {
      addCategoryPayload.system_category_name = selectedCategory.value;
    }

    dispatch(addCategory(addCategoryPayload));
  };
  return (
    <Wrapper>
      <StyledForm>
        {(error || errorMessage) && (
          <Alert variant="danger">{error || errorMessage}</Alert>
        )}
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
            Select category
          </Form.Label>
          <Col xs="8">
            <CreatableDropdown
              placeholder="Select or create your own category"
              options={categoryOptions}
              value={selectedCategory}
              handleChange={handleCategoryChange}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="categoryWeight">
          <Form.Label column xs="4" className="input-text-label">
            Category weight
          </Form.Label>
          <Col xs="8">
            <Select
              placeholder="Select weight of category"
              styles={customDropdownStyles}
              options={WeightDropDownList}
              value={selectedWeight}
              onChange={handleWeightChange}
              components={{
                IndicatorSeparator: null,
              }}
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

export default AddCategory;

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
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 20px;
  border-top: 1px solid ${({ theme }) => theme.palette.text.secondaryLight};
`;

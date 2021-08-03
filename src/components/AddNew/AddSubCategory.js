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
import {
  WeightDropDownList,
  addbuttonStyles,
  cancelButtonStyles,
} from '../../utils/constants';
import { customDropdownStyles, areaDropdownStyles } from './styles';
import {
  getAreaBackgroundColor,
  getAreaColor,
  getStartEndDatesV2,
} from '../../utils/utility';
import {
  addSubcategory,
  resetFlagsDashboard,
  getUserInfo,
} from '../../modules/actions/DashboardActions';

const AddSubCategory = ({ onClose, areaId = '', categoryId = '' }) => {
  const dispatch = useDispatch();

  const {
    addSubcategory: { loading, success, error },
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

      if (categoryId) {
        const selectedCategoryRow = selectedAreaRow.userCategories.find(
          (item) => item.id === categoryId,
        );
        const selectedCategory = {
          label: selectedCategoryRow.custom_category_name,
          value: selectedCategoryRow.id,
        };
        setSelectedCategory(selectedCategory);
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
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [selectedWeight, setSelectedWeight] = useState(null);

  const handleAreaChange = (newValue) => {
    setSelectedArea(newValue);
    setSelectedCategory(null);
    const selectedArea = userInfoData.find((d) => d.id === newValue.value);
    const categories = selectedArea.userCategories.map((c) => ({
      label: c.custom_category_name,
      value: c.id,
    }));
    setCategoryOptions(categories);
  };

  const handleCategoryChange = (newValue) => {
    setSelectedCategory(newValue);
  };

  const handleSubcategoryChange = ({ target: { value } }) =>
    setSelectedSubcategory(value);

  const handleWeightChange = (newValue) => {
    setSelectedWeight(newValue);
  };

  const handleSubmit = () => {
    if (!selectedArea?.value) return setErrorMessage('Please select area.');
    if (!selectedCategory?.value)
      return setErrorMessage('Please select category.');
    if (!selectedSubcategory)
      return setErrorMessage('Please provide subcategory.');
    if (!selectedWeight?.value) return setErrorMessage('Please select weight.');
    setErrorMessage('');

    const dates = getStartEndDatesV2(selectedWeek[0], selectedWeek[6]);

    const addSubcategoryPayload = {
      custom_subcategory_name: selectedSubcategory,
      description: '',
      parent_category: selectedCategory.value,
      weight: selectedWeight.value,
      start_date: dates.start,
      end_date: dates.end,
    };
    dispatch(addSubcategory(addSubcategoryPayload));
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
            Category
          </Form.Label>
          <Col xs="8">
            <Select
              placeholder="Select category"
              styles={customDropdownStyles}
              options={categoryOptions}
              value={selectedCategory}
              onChange={handleCategoryChange}
              components={{
                IndicatorSeparator: null,
              }}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="subcategory">
          <Form.Label column xs="4" className="input-text-label">
            Name of subcategory
          </Form.Label>
          <Col xs="8">
            <Form.Control
              placeholder="Enter name of subcategory"
              value={selectedSubcategory}
              onChange={handleSubcategoryChange}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="categoryWeight">
          <Form.Label column xs="4" className="input-text-label">
            Subcategory weight
          </Form.Label>
          <Col xs="8">
            <Select
              placeholder="Select weight of subcategory"
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

export default AddSubCategory;

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

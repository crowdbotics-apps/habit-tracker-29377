import React, { useState } from 'react';
import Select from 'react-select';
import styled, { css } from 'styled-components';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import CollapseAllIcon from '../../assets/images/CollapseAllIcon';
import ExpandAllIcon from '../../assets/images/ExpandAllIcon';
import { customDropdownStyles } from '../AddNew/styles';

const displayTypeOptions = [
  { label: 'Table', value: 'table' },
  { label: 'Table & Carts', value: 'table_carts' },
  { label: 'Carts', value: 'carts' },
];

const displayDataOptions = [
  { label: 'AVG %', value: 'avg' },
  { label: 'Points', value: 'points' },
];

const AddModifyViewDialog = () => {
  const [displayType, setDisplayType] = useState(displayTypeOptions[1]);
  const [displayData, setDisplayData] = useState(displayDataOptions[0]);
  const [expandCollapse, setExpandCollapse] = useState('collapse');

  const handleDisplayTypeChange = (newValue) => setDisplayType(newValue);
  const handleDisplayDataChange = (newValue) => setDisplayData(newValue);
  const handleExpandCollapseClick = (state) => () => setExpandCollapse(state);

  return (
    <AddScoreWrapper>
      <FormWrapper>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={4}>
            Display type
          </Form.Label>
          <Col lg={8}>
            <Select
              isSearchable={false}
              styles={customDropdownStyles}
              options={displayTypeOptions}
              value={displayType}
              onChange={handleDisplayTypeChange}
              components={{
                IndicatorSeparator: null,
              }}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="formHorizontalPassword">
          <Form.Label column sm={4}>
            Displayed data
          </Form.Label>
          <Col sm={8}>
            <Select
              isSearchable={false}
              styles={customDropdownStyles}
              options={displayDataOptions}
              value={displayData}
              onChange={handleDisplayDataChange}
              components={{
                IndicatorSeparator: null,
              }}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="formHorizontalPassword">
          <Form.Label column sm={4}>
            Weekly progress
          </Form.Label>
          <CustomSwitchWrapper sm={8}>
            <Form.Switch id="custom-switch" />
          </CustomSwitchWrapper>
        </Form.Group>
      </FormWrapper>

      <FooterDivider />

      <FooterWrapper>
        <NavButton
          onClick={handleExpandCollapseClick('collapse')}
          activeItem={expandCollapse === 'collapse'}
        >
          <CollapseAllIcon
            color={expandCollapse === 'collapse' ? '#1689CA' : '#8E97A3'}
          />
          <span className="ml-2">Collapse all</span>
        </NavButton>
        <NavButton
          onClick={handleExpandCollapseClick('expand')}
          activeItem={expandCollapse === 'expand'}
        >
          <ExpandAllIcon
            color={expandCollapse === 'expand' ? '#1689CA' : '#8E97A3'}
          />
          <span className="ml-2">Expand all</span>
        </NavButton>
      </FooterWrapper>
    </AddScoreWrapper>
  );
};
export default AddModifyViewDialog;

const AddScoreWrapper = styled.div`
  width: 452px;
  background: ${({ theme }) => theme.palette.common.white};
  border: 1px solid ${({ theme }) => theme.palette.text.secondaryLight};
  box-sizing: border-box;
  box-shadow: 0px 2px 20px rgba(27, 42, 61, 0.04);
  border-radius: 4px;
  ${({ theme }) => theme.max('sm')`
    width: 100%;
  `}
`;
const FormWrapper = styled(Form)`
  padding: 20px 20px 0 20px;
`;
const CustomSwitchWrapper = styled(Col)`
  display: flex;
  align-items: center;
`;
const FooterDivider = styled.div`
  border-top: 1px solid ${({ theme }) => theme.palette.text.secondaryLight};
`;
const FooterWrapper = styled.div`
  height: 56px;
  display: flex;
  padding: 20px;
`;

const NavButton = styled.div`
  cursor: pointer;
  font-family: Roboto;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  margin-right: 16px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.palette.text.secondary};
  ${({ activeItem }) =>
    activeItem &&
    css`
      color: ${({ theme }) => theme.palette.primary.main};
    `}
`;

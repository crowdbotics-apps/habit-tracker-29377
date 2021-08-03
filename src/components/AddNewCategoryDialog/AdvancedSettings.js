import React from 'react';
import styled from 'styled-components';
import Form from 'react-bootstrap/Form';

import TextBoxLabel from '../../atoms/TextBoxLabel';
import DefaultScoringSystem from './DefaultScoringSystem';
import CustomScoringSystem from './CustomScoringSystem';

const AdvancedSettings = ({
  scoring_type,
  motivation,
  trigger,
  obstacle,
  handleChange,
}) => {
  return (
    <MainWrapper>
      <FormControlWrapper>
        <Label>Scoring type</Label>
        <RightWrapper>
          <Form.Control
            as="select"
            name="scoring_type"
            value={scoring_type}
            onChange={handleChange}
          >
            <option value="default">Standard scoring system</option>
            <option value="custom">
              Custom scoring system (create your own)
            </option>
          </Form.Control>
        </RightWrapper>
      </FormControlWrapper>
      {scoring_type === 'custom' && <CustomScoringSystem />}
      <DefaultScoringSystem
        motivation={motivation}
        trigger={trigger}
        obstacle={obstacle}
        handleChange={handleChange}
      />
    </MainWrapper>
  );
};

export default AdvancedSettings;

const MainWrapper = styled.div`
  background: ${({ theme }) => theme.palette.background.main};
  padding: 30px 30px 0;
  ${({ theme }) => theme.max('sm')`
    padding: 30px 14px 0 10px;
  `}
`;

const FormControlWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  > * {
    &:first-child {
      margin-right: 11px;
    }
  }
  max-height: 100%;
  margin-bottom: 30px;
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

const Label = styled(TextBoxLabel)`
  white-space: nowrap;
  margin-top: 7px;
  min-width: 136px;
  ${({ theme }) => theme.max('sm')`
    margin-top: 0;
  `}
`;

const RightWrapper = styled.div`
  width: 100%;
`;

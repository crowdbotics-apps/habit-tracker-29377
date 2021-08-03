import React, { Fragment } from 'react';
import styled from 'styled-components';
import Form from 'react-bootstrap/Form';

import TextBoxLabel from '../../atoms/TextBoxLabel';
import helpIcon from '../AddScoreDialog/assets/helpIcon.png';

const DefaultScoringSystem = ({
  motivation,
  trigger,
  obstacle,
  handleChange,
}) => {
  return (
    <Fragment>
      <TextAreaWrapper>
        <LabelIconWrapper>
          <Label>What motivates you</Label>
          <img src={helpIcon} alt="icon" />
        </LabelIconWrapper>
        <TextBoxWrapper>
          <Form.Control
            as="textarea"
            rows={3}
            name="motivation"
            value={motivation}
            onChange={handleChange}
          />
        </TextBoxWrapper>
      </TextAreaWrapper>
      <TextAreaWrapper>
        <Label>Triggers</Label>
        <TextBoxWrapper>
          <Form.Control
            as="textarea"
            rows={3}
            name="trigger"
            value={trigger}
            onChange={handleChange}
          />
        </TextBoxWrapper>
      </TextAreaWrapper>
      <TextAreaWrapper>
        <Label>Obstacles</Label>
        <TextBoxWrapper>
          <Form.Control
            as="textarea"
            rows={3}
            name="obstacle"
            value={obstacle}
            onChange={handleChange}
          />
        </TextBoxWrapper>
      </TextAreaWrapper>
    </Fragment>
  );
};

export default DefaultScoringSystem;

const TextAreaWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  > * {
    &:first-child {
      margin-right: 11px;
    }
  }
  max-height: 100%;
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

const LabelIconWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  > * {
    &:first-child {
      margin-bottom: 10px;
    }
  }
  ${({ theme }) => theme.max('sm')`
    flex-direction: row;
    align-items: center;
    > * {
    &:first-child {
      margin-right: 24px;
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

const TextBoxWrapper = styled.div`
  width: 100%;
`;

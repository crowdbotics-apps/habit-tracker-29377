import React, { Fragment, useState } from 'react';
import styled from 'styled-components';

import deleteIcon from './assets/deleteIcon.png';
import CustomScorePicker from './CustomScorePicker';
import TextBox from '../../atoms/TextBox';

const CustomScoreBlock = ({ type, block, handleDelete }) => {
  const [score, setScore] = useState({
    value: '',
    valueFrom: '',
    valueTo: '',
    text: '',
  });

  const handleChange = ({ target: { name, value } }) => {
    setScore((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Wrapper>
      <DeleteIcon
        src={deleteIcon}
        alt="icon"
        onClick={handleDelete(block.id)}
      />
      <CustomScorePicker />
      <DividerInfoWrapper>
        <DividerLine />
        <Info>is equal to</Info>
        <DividerLine />
      </DividerInfoWrapper>
      <FormControlWrapper>
        {type === 'value' && (
          <TextBox
            type="number"
            required
            name="text"
            value={score.value}
            onChange={handleChange}
          />
        )}
        {type === 'range' && (
          <Fragment>
            <FormControlWrapper>
              <TextBox
                type="number"
                required
                name="from"
                value={score.valueFrom}
                onChange={handleChange}
              />
              <ToText>to</ToText>
              <TextBox
                type="number"
                required
                name="to"
                value={score.valueTo}
                onChange={handleChange}
              />
            </FormControlWrapper>
          </Fragment>
        )}
        <TextBox
          type="text"
          required
          name="text"
          value={score.text}
          onChange={handleChange}
        />
      </FormControlWrapper>
    </Wrapper>
  );
};

export default CustomScoreBlock;

const Wrapper = styled.div`
  padding: 23px 35px 30px 38px;
  margin-top: 20px;
  background: ${({ theme }) => theme.palette.common.white};
  border: 1px dashed #bfc4cb;
  border-radius: 10px;
  ${({ theme }) => theme.max('sm')`
    margin-top: 10px;
    padding: 20px 10px 17px;
  `}
`;

const DeleteIcon = styled.img`
  float: right;
  margin: -15px -26px;
  cursor: pointer;
  ${({ theme }) => theme.max('sm')`
     margin: -15px 0;
  `}
`;

const DividerInfoWrapper = styled.div`
  width: 100%;
  margin: 12px 0 15px;
  display: flex;
  align-items: center;
  > * {
    &:first-child {
      margin: 0 15px;
    }
  }
`;

const DividerLine = styled.div`
  height: 1px;
  width: 100%;
  background-color: ${({ theme }) => theme.palette.text.secondaryLight};
`;

const Info = styled.div`
  font-family: Roboto;
  text-align: center;
  font-size: 14px;
  line-height: 24px;
  color: ${({ theme }) => theme.palette.text.secondary};
  z-index: 3;
  min-width: 65px;
`;

const FormControlWrapper = styled.div`
  display: flex;
  > * {
    &:first-child {
      margin-right: 24px;
    }
  }
`;

const ToText = styled(Info)`
  min-width: max-content;
  margin-right: 24px;
`;

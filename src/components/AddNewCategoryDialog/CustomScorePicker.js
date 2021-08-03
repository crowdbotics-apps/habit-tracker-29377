import React, { Fragment, useState } from 'react';
import styled, { css } from 'styled-components';

import { ScoreData } from '../../utils/constants';

const CustomScorePicker = () => {
  const [selectedScore, setSelectedScore] = useState('');

  const handleScoreChange = (score) => () => {
    setSelectedScore(score);
  };

  return (
    <Fragment>
      <TextWrapper>
        <Text>Bad</Text>
        <Text>Great</Text>
      </TextWrapper>
      <RadioWrapper>
        {ScoreData.map((data, index) => (
          <RadioButton
            key={index}
            onClick={handleScoreChange(data.score)}
            activeStyle={selectedScore === data.score}
          >
            <RadioIndicator color={data.color} />
            <ScoreText>{data.score}</ScoreText>
          </RadioButton>
        ))}
      </RadioWrapper>
    </Fragment>
  );
};

export default CustomScorePicker;

const Text = styled.div`
  font-family: Roboto;
  font-size: 14px;
  line-height: 24px;
  color: ${({ theme }) => theme.palette.text.secondary};
`;

const TextWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  ${({ theme }) => theme.max('sm')`
    display: none;
  `}
`;

const RadioWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-left: -7px;
`;

const RadioButton = styled.div`
  width: 36px;
  height: 62px;
  display: flex;
  flex-direction: column;
  align-items: center;
  > * {
    &:first-child {
      margin-bottom: 2px;
    }
  }
  padding: 10px 0 3px;
  cursor: pointer;
  ${({ activeStyle }) =>
    activeStyle &&
    css`
      background: #818ea3;
      border-radius: 80px;
      & > span {
        color: ${({ theme }) => theme.palette.common.white};
      }
    `}
`;

const RadioIndicator = styled.div`
  height: 23px;
  width: 23px;
  background: ${({ theme }) => theme.palette.common.white};
  border: 3px solid ${({ color }) => color};
  border-radius: 50%;
`;

const ScoreText = styled.span`
  font-family: Roboto;
  font-size: 14px;
  line-height: 24px;
  color: ${({ theme }) => theme.palette.text.secondary};
`;

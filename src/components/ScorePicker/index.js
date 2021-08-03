import React from 'react';
import styled, { css } from 'styled-components';

import { ScoreData } from '../../utils/constants';

const ScorePicker = ({
  selectedScore,
  setSelectedScore,
  showLabel = false,
  disabled = false,
}) => {
  const handleScoreChange = (score) => () => {
    if (disabled) return;
    setSelectedScore(score);
  };

  return (
    <ScorePickerWrapper>
      {showLabel && (
        <TextWrapper>
          <Text>Bad</Text>
          <Text>Great</Text>
        </TextWrapper>
      )}
      <RadioWrapper>
        {ScoreData.map((data, index) => (
          <RadioButton key={index} onClick={handleScoreChange(data.score)}>
            <RadioIndicator color={data.color}>
              <Selected activeStyle={selectedScore === data.score} />
            </RadioIndicator>
            <ScoreText activeStyle={selectedScore === data.score}>
              {data.score}
            </ScoreText>
          </RadioButton>
        ))}
      </RadioWrapper>
    </ScorePickerWrapper>
  );
};

export default ScorePicker;

const ScorePickerWrapper = styled.div`
  width: 100%;
`;

const Text = styled.div`
  font-family: Roboto;
  font-size: 14px;
  line-height: 24px;
  color: ${({ theme }) => theme.palette.text.secondary};
`;

const TextWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const RadioWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 7px;
  ${({ theme }) => theme.max('sm')`
    margin-top: 0px;
  `}
`;

const RadioButton = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  > * {
    &:first-child {
      margin-bottom: 2px;
    }
  }
`;

const RadioIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 23px;
  width: 23px;
  background: ${({ theme }) => theme.palette.common.white};
  border: 3px solid ${({ color }) => color};
  border-radius: 50%;
  cursor: pointer;
`;

const Selected = styled.div`
  height: 13px;
  width: 13px;
  border-radius: 50%;
  background: transparent;
  ${({ activeStyle }) =>
    activeStyle &&
    css`
      background: ${({ theme }) => theme.palette.text.primary};
    `}
`;

const ScoreText = styled.span`
  font-family: Roboto;
  font-size: 14px;
  line-height: 24px;
  color: ${({ theme }) => theme.palette.text.secondary};
  ${({ activeStyle }) =>
    activeStyle &&
    css`
      font-weight: bold;
      color: ${({ theme }) => theme.palette.text.primary};
    `}
`;

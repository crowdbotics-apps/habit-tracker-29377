import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import moment from 'moment';

import RoundedProgress from '../RoundedProgress';

const WeeklyProgress = () => {
  const { selectedWeek } = useSelector(({ dashboard }) => dashboard);

  const startOfWeek = moment(selectedWeek[0]).format('MMM D');
  const endOfWeek = moment(selectedWeek[6]).format('MMM D');

  return (
    <WeeklyProgressWrapper>
      <div>
        <Text>Weekly progress</Text>{' '}
        <WeekText>{`(${startOfWeek} - ${endOfWeek})`}</WeekText>
      </div>
      <WeekProgressbarWrapper>
        {selectedWeek.map((date, i) => (
          <ProgressWrapper key={i}>
            <RoundedProgress progress={50} label={'50%'} />
          </ProgressWrapper>
        ))}
        <ProgressWrapper>
          <RoundedProgress
            strokeWidth={4}
            innerStrokeWidth={4}
            progress={50}
            label={'50%'}
          />
        </ProgressWrapper>
      </WeekProgressbarWrapper>
    </WeeklyProgressWrapper>
  );
};

export default WeeklyProgress;

const WeeklyProgressWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  padding: 12px 4rem 12px 20px;
  border-radius: 2px;
  background-color: ${({ theme }) => theme.palette.common.white};
`;

const Text = styled.span`
  font-family: Roboto;
  font-size: 18px;
  line-height: 20px;
  color: ${({ theme }) => theme.palette.text.primary};
`;

const WeekText = styled(Text)`
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.palette.text.secondary};
`;

const WeekProgressbarWrapper = styled.div`
  display: flex;
  width: 45%;
`;

const ProgressWrapper = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
  width: 12%;
  &:last-child {
    width: 16%;
  }
`;

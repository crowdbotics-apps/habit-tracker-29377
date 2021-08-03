import React from 'react';
import styled, { css } from 'styled-components';
import moment from 'moment';

const DayAndDate = ({ date, isToday = false, styles = {} }) => {
  return (
    <DateWrapper styles={styles}>
      <Day isToday={isToday}>{moment(date).format('dd')[0]}</Day>
      <Date isToday={isToday}>{moment(date).format('MMMM D')}</Date>
    </DateWrapper>
  );
};

export default DayAndDate;

const DateWrapper = styled.div`
  display: flex;
  align-items: center;
  min-width: 120px;
  ${({ styles }) => styles}
`;

const Day = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 32px;
  width: 32px;
  box-sizing: border-box;
  color: ${({ theme }) => theme.palette.text.secondary};
  font-family: Roboto;
  font-size: 12px;
  line-height: 16px;
  font-weight: 500;
  text-transform: uppercase;
  border: 1px solid ${({ theme }) => theme.palette.text.secondaryLight};
  border-radius: 4px;
  ${({ isToday }) =>
    isToday &&
    css`
      background: #eff7fb;
      color: ${({ theme }) => theme.palette.primary.main};
      border-color: ${({ theme }) => theme.palette.primary.main};
    `}
`;

const Date = styled.div`
  font-family: Roboto;
  font-size: 14px;
  line-height: 20px;
  color: ${({ theme }) => theme.palette.text.secondary};
  margin: 0px 16px;
  ${({ isToday }) =>
    isToday &&
    css`
      color: ${({ theme }) => theme.palette.primary.main};
    `}
`;

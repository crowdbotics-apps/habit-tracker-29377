import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled, { css } from 'styled-components';
import quoteIcon from './assets/quoteIcon.png';
import quoteStartIcon from './assets/quoteStartIcon.png';
import quoteEndIcon from './assets/quoteEndIcon.png';
import { getQuote } from '../../modules/actions/DashboardActions';

const Quote = () => {
  const dispatch = useDispatch();

  const {
    getQuote: {
      data: { results = [] },
    },
  } = useSelector(({ dashboard }) => dashboard);

  useEffect(() => {
    dispatch(getQuote());
  }, []);

  const quoteText = results[Math.floor(Math.random() * results.length)] || {};

  const { text, author, topic } = quoteText;

  return (
    <QuoteMain>
      <QuoteHeader>
        <QuoteTitle>{`Quote of the day`}</QuoteTitle>
        <QuoteIconWrapper>
          <QuoteIcon src={quoteIcon} alt="Quote of the day" />
        </QuoteIconWrapper>
      </QuoteHeader>
      <QuoteBody>
        {topic && <Topic>{topic}</Topic>}
        <QuoteIconInner>
          <QuoteIcon src={quoteStartIcon} alt="Quote of the day" />
        </QuoteIconInner>
        <Quotes>{text}</Quotes>
        <QuoteIconInner isLast>
          <QuoteIcon src={quoteEndIcon} alt="Quote of the day" />
        </QuoteIconInner>
        {author && <Author>{`- ${author}`}</Author>}
      </QuoteBody>
    </QuoteMain>
  );
};

export default Quote;

const QuoteMain = styled.div`
  width: 100%;
  height: max-content;
  min-height: 240px;
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  ${({ theme }) => theme.max('sm')`
    padding: 18px 12px;
  `}
`;

const QuoteHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

const QuoteTitle = styled.p`
  font-family: Roboto;
  font-size: 18px;
  color: ${({ theme }) => theme.palette.text.primary};
`;

const QuoteIconWrapper = styled.div`
  width: 46px;
  height: 46px;
  background: #1273b9;
  border-radius: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const QuoteIconInner = styled.div`
  display: flex;
  ${({ isLast }) =>
    isLast &&
    css`
      justify-content: flex-end;
    `}
`;

const QuoteIcon = styled.img`
  width: 20px;
  height: 20px;
`;

const QuoteBody = styled.div``;

const Quotes = styled.h3`
  font-family: Roboto;
  font-size: 30px;
  line-height: 35px;
  color: ${({ theme }) => theme.palette.text.primary};
  text-align: center;
  margin-bottom: 0;
`;

const Author = styled.h4`
  font-family: Roboto;
  text-align: right;
  margin-top: 15px;
  color: ${({ theme }) => theme.palette.text.primary};
`;

const Topic = styled(QuoteTitle)`
  text-align: left;
  margin-top: -15px;
`;

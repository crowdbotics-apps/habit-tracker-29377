import React, { useRef, useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import Button from 'react-bootstrap/Button';

import rightArrow from '../AddNewCategoryDialog/assets/rightArrow.png';

const CategoryPickerSlider = ({
  areaDisplayData,
  selectedAreaId,
  setSelectedAreaId,
  setNavigationIndex,
}) => {
  const ref = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScrollLeft, setMaxScrollLeft] = useState(0);

  useEffect(() => {
    setMaxScrollLeft(ref.current.scrollWidth - ref.current.clientWidth);
  }, [scrollPosition]);

  const handleArrowClick = (direction) => () => {
    if (direction === 'left') {
      ref.current.scrollLeft -= ref ? 200 : 0;
      setScrollPosition(ref.current.scrollLeft);
    } else {
      ref.current.scrollLeft += ref ? 200 : 0;
      setScrollPosition(ref.current.scrollLeft);
    }
  };

  const handleAreaClick = (areaId, index) => () => {
    setSelectedAreaId(areaId);
    setNavigationIndex(index);
  };

  return (
    <MainWrapper>
      <LeftButtonWrapper scrollPosition={scrollPosition}>
        <ArrowButton
          onClick={handleArrowClick('left')}
          disabled={scrollPosition <= 0}
        >
          <LeftArrow src={rightArrow} alt="icon" />
        </ArrowButton>
      </LeftButtonWrapper>
      <CategoryWrapper ref={ref}>
        {areaDisplayData.map((area, index) => (
          <CategoryNameWrapper
            key={area.id}
            active={+selectedAreaId === area.id}
            onClick={handleAreaClick(area.id, index)}
          >
            <img src={area.icon} alt="icon" />
            <CategoryName>{area.name}</CategoryName>
          </CategoryNameWrapper>
        ))}
      </CategoryWrapper>
      <RightButtonWrapper
        scrollPosition={scrollPosition}
        maxScrollLeft={maxScrollLeft}
      >
        <RightArrowButton
          onClick={handleArrowClick('right')}
          disabled={scrollPosition >= maxScrollLeft}
        >
          <img src={rightArrow} alt="icon" />
        </RightArrowButton>
      </RightButtonWrapper>
    </MainWrapper>
  );
};

export default CategoryPickerSlider;

const MainWrapper = styled.div`
  height: 50px;
  position: relative;
  display: flex;
  gap: 10px;
`;

const LeftButtonWrapper = styled.div`
  height: 50px;
  width: 24px;
  position: absolute;
  left: 0;
  ${({ scrollPosition }) =>
    scrollPosition > 0 &&
    css`
      width: 100px;
      background: linear-gradient(
        90deg,
        #ffffff 34.23%,
        rgba(255, 255, 255, 0) 97.63%
      );
    `}
`;

const RightButtonWrapper = styled.div`
  height: 50px;
  width: 24px;
  position: absolute;
  right: 0;
  ${({ scrollPosition, maxScrollLeft }) =>
    scrollPosition < maxScrollLeft &&
    css`
      width: 100px;
      background: linear-gradient(
        270deg,
        #ffffff 34.23%,
        rgba(255, 255, 255, 0) 97.63%
      );
    `}
`;

const ArrowButton = styled(Button)`
  width: 24px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${({ theme }) => theme.palette.text.secondaryLight} !important;
  border: none !important;
  box-shadow: none !important;
  border-radius: 5px;
`;

const RightArrowButton = styled(ArrowButton)`
  position: absolute;
  right: 0;
`;

const LeftArrow = styled.img`
  transform: rotate(180deg);
`;

const CategoryWrapper = styled.div`
  display: flex;
  gap: 10px;
  width: calc(100% - 68px);
  margin-left: 34px;
  overflow-x: scroll;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none;
  }
`;

const CategoryNameWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 13px 20px;
  background: ${({ theme }) => theme.palette.background.main};
  border-radius: 10px;
  cursor: pointer;
  ${({ active }) =>
    active &&
    css`
      background: ${({ theme }) => theme.palette.text.secondaryLight};
    `}
`;

const CategoryName = styled.div`
  font-family: Roboto;
  font-size: 16px;
  line-height: 24px;
  color: ${({ theme }) => theme.palette.text.primary};
  white-space: nowrap;
`;

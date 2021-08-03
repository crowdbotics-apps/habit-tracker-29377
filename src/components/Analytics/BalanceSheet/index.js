import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { Accordion, Card } from 'react-bootstrap';
import { useSelector } from 'react-redux';

import { getAreaColor, getAreaIcon } from '../../../utils/utility';

import arrowRightGrey from '../../../assets/images/arrowRightGrey.png';
import arrowDownGrey from '../../../assets/images/arrowDownGrey.png';
import moment from 'moment';
import { rangeTextRendering } from '../../../utils/analyticsCalculations';
import Loader from '../../Loader';

const { Toggle, Collapse } = Accordion;
const { Body, Header } = Card;

const BalanceSheet = ({ setNetWorthPoints }) => {
  const [selectedArea, setSelectedArea] = useState([]);
  const [selectedArea2, setSelectedArea2] = useState([]);
  const {
    areasList: {
      analyticsTableData,
      analyticsResultsCurrentRangeData,
      analyticsResultsPreviousRangeData,
    },
    analyticsLoader: { loading },
    selectedRangeForCompare,
    selectedPriod,
  } = useSelector(({ analytics }) => analytics);

  useEffect(() => {
    if (analyticsTableData.length) {
      const areas = analyticsTableData.map((area) => ({
        ...area,
        isCollapse: false,
        categories: area.subRows.map((a) => ({ ...a, isEdit: false })),
      }));
      setSelectedArea(areas);
      setSelectedArea2(areas);
    }
  }, []);

  const onAreaItemClick = (areaId) => () => {
    const areas = selectedArea.map((area) => ({
      ...area,
      isCollapse: area.id === areaId ? !area.isCollapse : area.isCollapse,
    }));
    setSelectedArea(areas);
  };

  const onAreaNegativeItemClick = (areaId) => () => {
    const areas = selectedArea2.map((area) => ({
      ...area,
      isCollapse: area.id === areaId ? !area.isCollapse : area.isCollapse,
    }));
    setSelectedArea2(areas);
  };

  const checkData = (value) => (value > 0 ? `+${value}₳` : `${value || 0}₳`);
  const areaPointsCalculator = (categories) => {
    const calculatePoints = categories.map((c) => {
      return c.monthsRange.map(
        (m) => c[moment(m.month, 'M').format('MMM').toLowerCase()].points,
      );
    });
    const filterData = calculatePoints.map((p) =>
      p.filter((n) => typeof n === 'number'),
    );
    const categoriesPointsSum = filterData.map((p) =>
      p.reduce((a, c) => a + c, 0),
    );
    const totalPoints = categoriesPointsSum.reduce((a, c) => a + c, 0);
    return totalPoints || 0;
  };

  const areaPointsPositiveCalculator = (categories) => {
    const calculatePoints = categories.map((c) => {
      return c.monthsRange.map(
        (m) => c[moment(m.month, 'M').format('MMM').toLowerCase()].points,
      );
    });
    const filterData = calculatePoints.map((p) =>
      p.filter((i) => typeof i === 'number' && i > 0),
    );
    const categoriesPointsSum = filterData.map((p) =>
      p.reduce((a, c) => a + c, 0),
    );
    const totalPoints = categoriesPointsSum.reduce((a, c) => a + c, 0);
    return totalPoints || 0;
  };

  const areaPointsNegativeCalculator = (categories) => {
    const calculatePoints = categories.map((c) => {
      return c.monthsRange.map(
        (m) => c[moment(m.month, 'M').format('MMM').toLowerCase()].points,
      );
    });
    const filterData = calculatePoints.map((p) =>
      p.filter((i) => typeof i === 'number' && i < 0),
    );
    const categoriesPointsSum = filterData.map((p) =>
      p.reduce((a, c) => a + c, 0),
    );
    const totalPoints = categoriesPointsSum.reduce((a, c) => a + c, 0);
    return totalPoints || 0;
  };

  const totalPoints =
    selectedArea?.length &&
    selectedArea?.map((item) => areaPointsCalculator(item.categories));

  const netWorth = totalPoints && totalPoints.reduce((a, c) => a + c, 0);

  useEffect(() => {
    setNetWorthPoints(checkData(netWorth));
  }, [netWorth]);

  const dataArrayCreater = (currentItem, previousItem) => {
    const {
      id,
      isCollapse,
      area: { title, code },
      categories,
    } = currentItem;
    if (previousItem) {
      const previousCategoriesPoints = previousItem?.subRows?.map(
        (i) => i.duration.points,
      );
      const categoriesPoints = categories.map((i) => {
        return {
          title: i.area.title,
          subTitle: i.area.subTitle,
          points: i.duration.points,
        };
      });
      return {
        id,
        title,
        code,
        isCollapse,
        categories: categoriesPoints,
        previousCategoriesPoints,
      };
    } else {
      const categoriesPoints = categories.map((i) => {
        return {
          title: i.area.title,
          subTitle: i.area.subTitle,
          points: i.duration.points,
        };
      });
      return { id, title, code, isCollapse, categories: categoriesPoints };
    }
  };

  const positiveDataArray =
    selectedArea.length &&
    selectedArea.map((item, index) =>
      dataArrayCreater(item, analyticsResultsPreviousRangeData[index]),
    );

  const positiveData =
    positiveDataArray?.length &&
    positiveDataArray?.map((item, i) => {
      const { id, title, code, isCollapse, categories } = item;
      const categoryPoints = categories.map((i) => i.points);
      const filterCategoryPoints = categoryPoints.filter((i) => i > 0);

      const filterPreviousCategoryPoints =
        item?.previousCategoriesPoints?.filter((i) => i > 0);
      const sumPoints = filterCategoryPoints.reduce((a, c) => a + c, 0);
      const sumOfPreviousPoints = filterPreviousCategoryPoints?.reduce(
        (a, c) => a + c,
        0,
      );
      const differance = sumPoints - sumOfPreviousPoints;
      let equation = analyticsResultsCurrentRangeData.length
        ? (filterCategoryPoints.length || filterPreviousCategoryPoints.length) >
          0
        : filterCategoryPoints.length > 0;
      if (equation) {
        return (
          <BalanceSheetMain key={i}>
            <ActivityRow>
              <Card>
                <ActivityCol color={getAreaColor(code)}>
                  <Toggle
                    as={Header}
                    eventKey={id}
                    onClick={onAreaItemClick(id)}
                  >
                    <NavWrapper>
                      <NavIcon
                        src={isCollapse ? arrowDownGrey : arrowRightGrey}
                        alt="icon"
                      />
                      {code && (
                        <ActivityIcon src={getAreaIcon(code)} alt="icon" />
                      )}
                      {`${title}`}
                    </NavWrapper>
                    <PointWrapper
                      comapreData={analyticsResultsCurrentRangeData.length}
                    >
                      {analyticsResultsCurrentRangeData.length ? (
                        <>
                          <AreaPoint color={'#68B966'}>
                            {checkData(sumPoints)}
                          </AreaPoint>
                          <Points>
                            <AreaPoint color={'#68B966'}>
                              {checkData(sumOfPreviousPoints)}
                            </AreaPoint>
                          </Points>
                        </>
                      ) : null}
                      <Points>
                        <AreaPoint color={'#68B966'}>
                          {checkData(
                            sumOfPreviousPoints ? differance : sumPoints,
                          )}
                        </AreaPoint>
                      </Points>
                    </PointWrapper>
                  </Toggle>
                </ActivityCol>
                <Collapse eventKey={id}>
                  <Body>
                    {isCollapse &&
                      categories.map((c, index) => {
                        const previousCategoryPoint =
                          item.previousCategoriesPoints &&
                          item?.previousCategoriesPoints[index];
                        const differanceCategoryPoints =
                          c.points - previousCategoryPoint;
                        let categoryEquation =
                          analyticsResultsCurrentRangeData.length
                            ? (previousCategoryPoint || c?.points) > 0
                            : c?.points > 0;
                        if (categoryEquation) {
                          return (
                            <ExpandedRow key={index}>
                              <NavWrapper>
                                <AreaWrapper>
                                  <SubCategoryName>{c.title}</SubCategoryName>
                                  <SubCategoryTitle>
                                    {c.subTitle}
                                  </SubCategoryTitle>
                                </AreaWrapper>
                              </NavWrapper>
                              <CategoryPointWrapper>
                                <PointWrapper
                                  comapreData={
                                    analyticsResultsCurrentRangeData.length
                                  }
                                >
                                  {analyticsResultsCurrentRangeData.length ? (
                                    <>
                                      <AreaPoint color={'#68B966'}>
                                        {checkData(c.points)}
                                      </AreaPoint>
                                      <Points>
                                        <AreaPoint color={'#68B966'}>
                                          {checkData(previousCategoryPoint)}
                                        </AreaPoint>
                                      </Points>
                                    </>
                                  ) : null}
                                  <Points>
                                    <AreaPoint color={'#68B966'}>
                                      {checkData(
                                        previousCategoryPoint
                                          ? differanceCategoryPoints
                                          : c.points,
                                      )}
                                    </AreaPoint>
                                  </Points>
                                </PointWrapper>
                              </CategoryPointWrapper>
                            </ExpandedRow>
                          );
                        }
                      })}
                  </Body>
                </Collapse>
              </Card>
            </ActivityRow>
          </BalanceSheetMain>
        );
      }
    });

  const negativeDataArray =
    selectedArea2.length &&
    selectedArea2.map((item, index) =>
      dataArrayCreater(item, analyticsResultsPreviousRangeData[index]),
    );
  const negativeData =
    negativeDataArray?.length &&
    negativeDataArray?.map((item, i) => {
      const { id, title, code, isCollapse, categories } = item;
      const categoryPoints = categories.map((i) => i.points);

      const checkCategoryPoints = categoryPoints.filter((i) => i < 0);
      const sumPoints = checkCategoryPoints.reduce((a, c) => a + c, 0);

      const filterPreviousCategoryPoints =
        item?.previousCategoriesPoints?.filter((i) => i < 0);
      const sumOfPreviousPoints = filterPreviousCategoryPoints?.reduce(
        (a, c) => a + c,
        0,
      );
      const differance = sumPoints - sumOfPreviousPoints;
      let equation = analyticsResultsCurrentRangeData.length
        ? (checkCategoryPoints.length || filterPreviousCategoryPoints.length) >
          0
        : checkCategoryPoints.length > 0;
      if (equation) {
        return (
          <BalanceSheetMain key={i}>
            <ActivityRow>
              <Card>
                <ActivityCol color={getAreaColor(code)}>
                  <Toggle
                    as={Header}
                    eventKey={id}
                    onClick={onAreaNegativeItemClick(id)}
                  >
                    <NavWrapper>
                      <NavIcon
                        src={isCollapse ? arrowDownGrey : arrowRightGrey}
                        alt="icon"
                      />
                      {code && (
                        <ActivityIcon src={getAreaIcon(code)} alt="icon" />
                      )}
                      {`${title}`}
                    </NavWrapper>
                    <PointWrapper
                      comapreData={analyticsResultsCurrentRangeData.length}
                    >
                      {analyticsResultsCurrentRangeData.length ? (
                        <>
                          <AreaPoint color={'#c64f4f'}>
                            {checkData(sumPoints)}
                          </AreaPoint>
                          <Points>
                            <AreaPoint color={'#c64f4f'}>
                              {checkData(sumOfPreviousPoints)}
                            </AreaPoint>
                          </Points>
                        </>
                      ) : null}
                      <Points>
                        <AreaPoint color={'#c64f4f'}>
                          {checkData(
                            sumOfPreviousPoints ? differance : sumPoints,
                          )}
                        </AreaPoint>
                      </Points>
                    </PointWrapper>
                  </Toggle>
                </ActivityCol>
                <Collapse eventKey={id}>
                  <Body>
                    {isCollapse &&
                      categories.map((c, index) => {
                        const previousCategoryPoint =
                          item.previousCategoriesPoints &&
                          item.previousCategoriesPoints[index];
                        const differanceCategoryPoints =
                          c.points - previousCategoryPoint;
                        let categoryEquation =
                          analyticsResultsCurrentRangeData.length
                            ? (previousCategoryPoint || c?.points) < 0
                            : c?.points < 0;
                        if (categoryEquation) {
                          return (
                            <ExpandedRow key={index}>
                              <NavWrapper>
                                <AreaWrapper>
                                  <SubCategoryName>{c.title}</SubCategoryName>
                                  <SubCategoryTitle>
                                    {c.subTitle}
                                  </SubCategoryTitle>
                                </AreaWrapper>
                              </NavWrapper>
                              <CategoryPointWrapper>
                                <PointWrapper
                                  comapreData={
                                    analyticsResultsCurrentRangeData.length
                                  }
                                >
                                  {analyticsResultsCurrentRangeData.length ? (
                                    <>
                                      <AreaPoint color={'#c64f4f'}>
                                        {checkData(c.points)}
                                      </AreaPoint>
                                      <AreaPoint color={'#c64f4f'}>
                                        {checkData(previousCategoryPoint)}
                                      </AreaPoint>
                                    </>
                                  ) : null}
                                  <Points>
                                    <AreaPoint color={'#c64f4f'}>
                                      {checkData(
                                        previousCategoryPoint
                                          ? differanceCategoryPoints
                                          : c.points,
                                      )}
                                    </AreaPoint>
                                  </Points>
                                </PointWrapper>
                              </CategoryPointWrapper>
                            </ExpandedRow>
                          );
                        }
                      })}
                  </Body>
                </Collapse>
              </Card>
            </ActivityRow>
          </BalanceSheetMain>
        );
      }
    });
  const range = {
    from: [selectedRangeForCompare[0]?.end, selectedRangeForCompare[0]?.start],
    to: [selectedRangeForCompare[1]?.end, selectedRangeForCompare[1]?.start],
  };
  const totalPositivePoints =
    selectedArea?.length &&
    selectedArea?.map((item) => areaPointsPositiveCalculator(item.categories));

  const totalPositivePreviousPoints =
    analyticsResultsPreviousRangeData?.length &&
    analyticsResultsPreviousRangeData?.map((item) =>
      areaPointsPositiveCalculator(item.subRows),
    );
  const assetsPrivousPoints =
    totalPositivePreviousPoints &&
    totalPositivePreviousPoints.reduce((a, c) => a + c, 0);
  const assetsPoints =
    totalPositivePoints && totalPositivePoints.reduce((a, c) => a + c, 0);

  const totalNegativePoints =
    selectedArea2?.length &&
    selectedArea2?.map((item) => areaPointsNegativeCalculator(item.categories));
  const liabilitiesPoints =
    totalNegativePoints && totalNegativePoints.reduce((a, c) => a + c, 0);

  const totalNegativePreviousPoints =
    analyticsResultsPreviousRangeData?.length &&
    analyticsResultsPreviousRangeData?.map((item) =>
      areaPointsNegativeCalculator(item.subRows),
    );
  const libilitiesPrivousPoints =
    totalNegativePreviousPoints &&
    totalNegativePreviousPoints.reduce((a, c) => a + c, 0);

  const assetsPointsDifferance = assetsPoints - assetsPrivousPoints;
  const liabilitiesPointsDifferance = assetsPoints - assetsPrivousPoints;
  return (
    <BalanceSheetWrapper>
      {loading ? (
        <Loader />
      ) : (
        <>
          {analyticsResultsCurrentRangeData.length ? (
            <TitleHeader>
              <TextHeader />
              <HeaderText>
                <HeaderLabel>
                  {rangeTextRendering(selectedPriod, range, 'start')}
                </HeaderLabel>
                <HeaderLabel>
                  {rangeTextRendering(selectedPriod, range, 'end')}
                </HeaderLabel>
                <HeaderLabel>Change %</HeaderLabel>
              </HeaderText>
            </TitleHeader>
          ) : null}
          <PositivePointsWrapper>
            <WorthTitle>ASSETS</WorthTitle>
            <PointWrapper comapreData={analyticsResultsCurrentRangeData.length}>
              {analyticsResultsCurrentRangeData.length ? (
                <>
                  <AreaPoints>{checkData(assetsPoints)}</AreaPoints>
                  <AreaPoints>{checkData(assetsPrivousPoints)}</AreaPoints>
                </>
              ) : null}
              <AreaPoints>
                {checkData(
                  assetsPrivousPoints ? assetsPointsDifferance : assetsPoints,
                )}
              </AreaPoints>
            </PointWrapper>
          </PositivePointsWrapper>
          {positiveData}
          <NegativePointsWrapper>
            <WorthTitle>LIABILITIES</WorthTitle>
            <PointWrapper comapreData={analyticsResultsCurrentRangeData.length}>
              {analyticsResultsCurrentRangeData.length ? (
                <>
                  <AreaPoints>{checkData(liabilitiesPoints)}</AreaPoints>
                  <AreaPoints>{checkData(libilitiesPrivousPoints)}</AreaPoints>
                </>
              ) : null}
              <AreaPoints>
                {checkData(
                  libilitiesPrivousPoints
                    ? liabilitiesPointsDifferance
                    : liabilitiesPoints,
                )}
              </AreaPoints>
            </PointWrapper>
          </NegativePointsWrapper>
          {negativeData}
        </>
      )}
    </BalanceSheetWrapper>
  );
};

export default BalanceSheet;

const BalanceSheetWrapper = styled.div`
  width: 100%;
`;

const TitleHeader = styled.div`
  width: 100%;
  color: #fff;
  font-size: 16px;
  margin: 20px 0;
  display: flex;
  justify-content: flex-end;
`;

const PointWrapper = styled.div`
  flex-direction: row;
  width: 26%;
  display: flex;
  justify-content: space-between;
  ${({ theme }) => theme.max('sm')`
    width:52%;
  `}
  ${({ comapreData }) =>
    comapreData === 0 &&
    css`
      justify-content: flex-end;
    `}
`;
const CategoryPointWrapper = styled.div`
  display: contents;
  justify-content: space-between;
  ${({ theme }) => theme.max('sm')`
  width:52%;
`}
`;

const Points = styled.div``;

const HeaderLabel = styled.span`
  font-family: Roboto;
  font-size: 12px;
  line-height: 14px;
  text-align: center;
  margin-left: 5px;
  text-transform: uppercase;
  color: #8e97a3;
`;

const NavWrapper = styled.div`
  width: 74%;
  ${({ theme }) => theme.max('sm')`
    width:50%;
  `}
`;

const TextHeader = styled.div`
  width: 74%;
  ${({ theme }) => theme.max('sm')`
    width:35%;
  `}
`;

const HeaderText = styled.div`
  width: 26%;
  display: flex;
  justify-content: space-between;
  ${({ theme }) => theme.max('sm')`
    width:53%;
  `}
`;

const BalanceSheetMain = styled.div`
  ${({ theme }) => theme.max('md')`
    overflow-x: auto;
    -ms-overflow-style: none; 
    scrollbar-width: none; 
    &::-webkit-scrollbar {
      display: none;
    }
  `}
`;

const ActivityRow = styled(Accordion)`
  background: ${({ theme }) => theme.palette.primary.contrastText};
  & .card {
    border: 0;
    border-radius: 0;
  }
  & .card-body {
    padding: 0;
    min-height: 0;
  }
  & .card-header {
    background-color: transparent;
    border-color: #f9f9f9;
  }
`;

const ActivityCol = styled.div`
  position: relative;
  cursor: pointer;
  text-align: left;
  border: 0;
  &:before {
    content: '';
    position: absolute;
    width: 4px;
    height: 100%;
    background-color: ${({ color }) => color};
    top: 0;
    left: 0;
    border-radius: 5px;
  }
  & .card-header {
    display: flex;
    justify-content: space-between;
  }
`;

const AreaPoint = styled.div`
  color: ${({ color }) => color};
  font-size: 14px;
  width: 50px;
  text-align: center !important;
`;

const ActivityIcon = styled.img`
  padding: 0 23px;
`;

const NavIcon = styled.img`
  padding-left: 5px;
`;

const ExpandedRow = styled.div`
  border-bottom: 2px solid ${({ theme }) => theme.palette.background.main};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.25rem;
  &:last-child {
    border-bottom: 10px solid ${({ theme }) => theme.palette.background.main};
  }
`;

const SubCategoryName = styled.div`
  font-size: 12px;
  min-width: 200px;
  padding-left: 40px;
  ${({ theme }) => theme.max('sm')`
      min-width: 100px;
      padding-left: 0px;
  `}
`;

const SubCategoryTitle = styled.div`
  font-size: 12px;
  color: #8e97a3;
  padding-left: 10px;
  ${({ theme }) => theme.max('sm')`
      padding-left: 0px !important;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
  `}
`;

const AreaWrapper = styled.div`
  display: flex;
`;

const PositivePointsWrapper = styled.div`
  background-color: #68b966;
  width: 100%;
  height: 50px;
  border-radius: 5px;
  color: #fff;
  padding: 13px 20px;
  font-size: 16px;
  margin: 20px 0;
  display: flex;
  justify-content: space-between;
`;

const NegativePointsWrapper = styled.div`
  background-color: #c64f4f;
  width: 100%;
  height: 50px;
  border-radius: 5px;
  color: #fff;
  padding: 13px 20px;
  font-size: 16px;
  margin: 20px 0;
  display: flex;
  justify-content: space-between;
`;
const WorthTitle = styled.p`
  width: 74%;
  ${({ theme }) => theme.max('sm')`
    width:35%;
  `}
`;

const AreaPoints = styled.p``;

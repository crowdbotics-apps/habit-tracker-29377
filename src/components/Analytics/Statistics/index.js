import React, { useEffect, Fragment, useState } from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Accordion, Card } from 'react-bootstrap';
import RoundedProgress from '../../RoundedProgress';
import arrowRightBlue from '../../../assets/images/arrowRightBlue.png';
import arrowBlue from '../../../assets/images/arrowBlue.png';
import { convertMinToHr } from '../../../utils/utility';
const { Toggle, Collapse } = Accordion;
const { Body, Header } = Card;
const StatisticsTable = ({ dropDownItem }) => {
  const [selectedArea, setSelectedArea] = useState([]);
  const {
    areasList: { analyticsTableData = [] },
  } = useSelector(({ analytics }) => analytics);
  const getDataLabel = (value, type) => {
    switch (dropDownItem) {
      case 'avg':
        if (type === 'Average')
          return typeof value === 'number' ? value + '%' : '-';
        else return typeof value.avg === 'number' ? value.avg + '%' : '-';
      case 'points':
        if (type === 'Average')
          return (
            <Fragment>
              {typeof value === 'number' ? (
                <Fragment>
                  <span>{value}</span>
                  <CurrencySign>₳</CurrencySign>
                </Fragment>
              ) : (
                '-'
              )}
            </Fragment>
          );
        else
          return (
            <Fragment>
              {typeof value.points === 'number' ? (
                <Fragment>
                  <span>{value.points}</span>
                  <CurrencySign>₳</CurrencySign>
                </Fragment>
              ) : (
                '-'
              )}
            </Fragment>
          );
      case 'duration':
      default:
        if (type === 'Average')
          return value
            ? value > 60
              ? Math.round(value / 60) + 'H'
              : value + 'M'
            : '-';
        else return value.duration ? convertMinToHr(value) : '-';
    }
  };
  const getDataProgress = (value, type) => {
    switch (dropDownItem) {
      case 'avg':
        if (type === 'Average') return value ? value : 1;
        else return value.avg !== '' ? value.avg : 1;
      case 'points':
        if (type === 'Average') return value ? value : 1;
        else return value.points !== '' ? value.points : 1;
      case 'duration':
      default:
        if (type === 'Average')
          return Math.round(((value.duration / 60) * 100) / 24) || 1;
        else return Math.round(((value.duration / 60) * 100) / 24) || 1;
    }
  };

  useEffect(() => {
    if (analyticsTableData.length) {
      const areas = analyticsTableData.map((area) => ({
        ...area,
        isCollapse: false,
      }));
      setSelectedArea(areas);
    }
  }, []);

  const areaItemHandler = (areaId) => () => {
    const areas = selectedArea.map((area) => ({
      ...area,
      isCollapse: area.id === areaId ? !area.isCollapse : false,
    }));
    setSelectedArea(areas);
  };

  const data =
    !!selectedArea?.length &&
    selectedArea?.map((item, i) => {
      const {
        id,
        isCollapse,
        area,
        monthsRange = [],
        subRows,
        duration,
      } = item;
      const areaValue = monthsRange.map(
        (i) => item[moment(i.month, 'M').format('MMM').toLowerCase()],
      );
      const MonthsName = monthsRange.map((i) =>
        moment(i.month, 'M').format('MMM').toUpperCase(),
      );
      const areaPoints = duration[dropDownItem];
      return (
        <ActivityRow key={i}>
          {i === 0 && (
            <TableHeader>
              {MonthsName.map((item, index) => {
                return <HeaderTitle key={index}>{item}</HeaderTitle>;
              })}
              <HeaderTitle>{dropDownItem.toUpperCase()}</HeaderTitle>
            </TableHeader>
          )}
          <Card>
            <ActivityCol disabled={subRows.length > 0}>
              <Toggle as={Header} eventKey={id} onClick={areaItemHandler(id)}>
                <div>
                  <AreaTitle>{area.title}</AreaTitle>
                  {subRows.length > 0 && (
                    <NavIcon
                      src={isCollapse ? arrowBlue : arrowRightBlue}
                      alt="icon"
                    />
                  )}
                </div>
                <div>
                  {areaValue.map((month, index) => (
                    <DayScoreTd key={index}>
                      <DayProgressWrapper>
                        <RoundedProgress
                          progress={getDataProgress(month)}
                          label={getDataLabel(month)}
                        />
                      </DayProgressWrapper>
                    </DayScoreTd>
                  ))}
                  <DayScoreTd>
                    <DayProgressWrapper>
                      <RoundedProgress
                        progress={getDataProgress(areaPoints, 'Average')}
                        label={getDataLabel(areaPoints, 'Average')}
                        strokeWidth={dropDownItem === 'points' ? 21 : 5}
                        innerStrokeWidth={dropDownItem === 'points' ? 0 : 5}
                        circleTwoStroke={
                          dropDownItem === 'points' ? '#F2F2F2' : '#6BB3DC'
                        }
                        fullWidth
                      />
                    </DayProgressWrapper>
                  </DayScoreTd>
                </div>
              </Toggle>
            </ActivityCol>
            <Collapse eventKey={id}>
              <Body>
                {subRows.map((subRow) => {
                  const { monthsRange, duration } = subRow;
                  const {
                    area: { title, subTitle },
                  } = subRow;
                  const monthsValue = monthsRange.map(
                    (i) =>
                      subRow[moment(i.month, 'M').format('MMM').toLowerCase()],
                  );
                  const avgMonthData = duration;
                  return (
                    <StyledSubRow key={subRow.id}>
                      <AreaWrapper>
                        <CategoryTitle>{title}</CategoryTitle>
                        <CategorySubTitle>{subTitle}</CategorySubTitle>
                      </AreaWrapper>
                      <div>
                        {monthsValue.map((month, index) => (
                          <DayScoreTd key={index}>
                            <DayProgressWrapper>
                              <RoundedProgress
                                progress={getDataProgress(month)}
                                label={getDataLabel(month)}
                              />
                            </DayProgressWrapper>
                          </DayScoreTd>
                        ))}
                        <DayScoreTd>
                          <DayProgressWrapper>
                            <RoundedProgress
                              progress={getDataProgress(
                                avgMonthData[dropDownItem],
                                'Average',
                              )}
                              label={getDataLabel(
                                avgMonthData[dropDownItem],
                                'Average',
                              )}
                              strokeWidth={dropDownItem === 'points' ? 21 : 5}
                              innerStrokeWidth={
                                dropDownItem === 'points' ? 0 : 5
                              }
                              circleTwoStroke={
                                dropDownItem === 'points'
                                  ? '#F2F2F2'
                                  : '#6BB3DC'
                              }
                              fullWidth
                            />
                          </DayProgressWrapper>
                        </DayScoreTd>
                      </div>
                    </StyledSubRow>
                  );
                })}
              </Body>
            </Collapse>
          </Card>
        </ActivityRow>
      );
    });

  return <StatisticsWrapper>{data}</StatisticsWrapper>;
};
export default StatisticsTable;
const StatisticsWrapper = styled.div`
  min-width: 100%;
  ${({ theme }) => theme.max('md')`
    min-width: 992px;
  `}
  ${({ theme }) => theme.max('sm')`
    min-width: 745px;
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
    background-color: #f9f9f9;
  }
  & .card-header {
    background-color: transparent;
    border-color: #f9f9f9;
  }
`;
const ActivityCol = styled.div`
  position: relative;
  cursor: ${({ disabled }) => (!disabled ? 'not-allowed' : 'pointer')};
  text-align: left;
  border: 0;
  & .card-header {
    display: flex;
    justify-content: space-between;
    padding-left: 31px;
    align-items: center;
    ${({ theme }) => theme.max('md')`
    padding-left: 1.25rem;
  `}
  }
`;
const NavIcon = styled.img`
  padding-left: 28px;
`;
const DayProgressWrapper = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
`;
const StyledSubRow = styled.div`
  padding: 0.75rem 1.25rem;
  display: flex;
  justify-content: space-between;
`;
const AreaWrapper = styled.div`
  padding-left: 60px;
  ${({ theme }) => theme.max('sm')`
    padding-left: 0px;
  `}
`;
const CategoryTitle = styled.div`
  font-family: Roboto;
  font-size: 14px;
  line-height: 16px;
  color: #2a3037;
  margin-bottom: 3px;
`;
const CategorySubTitle = styled.div`
  font-family: Roboto;
  font-size: 14px;
  line-height: 16px;
  color: #8e97a3;
`;
const DayScoreTd = styled.div`
  max-width: 6.8% !important;
  text-align: center;
  padding-left: 40px;
  display: table-cell;
  ${({ theme }) => theme.max('sm')`
    padding-left: 20px;
  `}
`;
const CurrencySign = styled.span`
  font-weight: 700;
  color: #ff9900;
`;
const TableHeader = styled.div`
  background-color: #f9f9f9;
  display: flex;
  justify-content: flex-end;
  padding: 10px 0;
`;
const HeaderTitle = styled.div`
  color: #8e97a3;
  font-size: 12px;
  width: 87px;
  text-align: center;
  ${({ theme }) => theme.max('sm')`
    width: 69px;
  `}
`;
const AreaTitle = styled.span`
  color: #1689ca;
  text-transform: uppercase;
  font-size: 12px;
`;

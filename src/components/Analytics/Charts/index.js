import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Row } from 'react-bootstrap';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';

import AreaActivityTrackerChart from './areaActivityTrackerChart';
import AreaComparisonChart from './areaComparisonChart';
import ActivityComparisonChart from './activityComparisonChart';
import { getAreasListForAnalytics } from '../../../modules/actions/AnalyticsAction';
import { getStartEndDates } from '../../../utils/utility';

const Charts = () => {
  const dispatch = useDispatch();
  const {
    areasList: {
      data: chartData,
      analyticsTableData,
      loading,
      analyticsChartData,
    },
    selectedMonths,
    analyticsChartDataMonthRange,
  } = useSelector(({ analytics }) => analytics);

  let a = moment(selectedMonths.from);
  let b = moment(selectedMonths.to);

  const newMonths = {
    from: moment(new Date(a))
      .subtract(Math.abs(a.diff(b, 'days')), 'days')
      .format('MMM DD YY'),
    to: selectedMonths.from,
  };

  const dateStart = moment(newMonths.from);
  const dateEnd = moment(newMonths.from);

  useEffect(() => {
    let equation =
      moment(analyticsChartDataMonthRange.from).format('DD-MM-YYYY') !==
        moment(newMonths.from).format('DD-MM-YYYY') &&
      moment(analyticsChartDataMonthRange.to).format('DD-MM-YYYY') !==
        moment(newMonths.to).format('DD-MM-YYYY');
    if (equation) {
      const body = getStartEndDates(newMonths.from, newMonths.to);
      // dispatch(getAreasListForAnalytics({ ...body }));
    }
  }, []);

  return (
    <ChartsWrapper>
      <Row>
        <LeftSectionWrapper>
          <AreaActivityTrackerChart
            analyticsTableData={analyticsTableData}
            chartData={chartData}
          />
        </LeftSectionWrapper>
        <RightSectionWrapper>
          <AreaComparisonChart
            chartData={analyticsChartData}
            analyticsTableData={analyticsTableData}
            dateStart={dateStart}
            dateEnd={dateEnd}
            loading={loading}
          />
          <ActivityComparisonChart
            analyticsTableData={analyticsTableData}
            chartData={chartData}
          />
        </RightSectionWrapper>
      </Row>
    </ChartsWrapper>
  );
};

export default Charts;

const ChartsWrapper = styled.div`
  min-width: 100%;
`;

const LeftSectionWrapper = styled.section`
  display: flex;
  flex-direction: column;
  padding: 20px 20px 14px 0;
  width: 50%;
  ${({ theme }) => theme.max('md')`
    width: 100%;
    padding: 0 10px 10px;
  `}
  ${({ theme }) => theme.between('md', 'xl')`
    width: 100%;
    padding: 20px;
    > * {
    &:first-child {
      margin-right: 10px;
    }
  }
  `}
`;

const RightSectionWrapper = styled.section`
  display: flex;
  flex-direction: column;
  > * {
    &:first-child {
      margin-bottom: 30px;
    }
  }
  padding: 20px 20px 14px 0;
  width: 50%;
  ${({ theme }) => theme.max('md')`
    width: 100%;
    > * {
    &:first-child {
      margin-bottom: 10px;
    }
  }
    padding: 0 10px 10px;
  `}
  ${({ theme }) => theme.between('md', 'xl')`
    width: 100%;
    flex-direction: column;
    padding: 20px;
  `}
`;

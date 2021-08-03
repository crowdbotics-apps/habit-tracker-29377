import React from 'react';
import moment from 'moment';
import styled from 'styled-components';
import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
} from 'recharts';
import { useSelector } from 'react-redux';
import {
  getDateOfSelectedWeek,
  getWeekDays,
  getWeekRange,
} from '../../utils/utility';

function CustomizedDot({ cx, cy }) {
  return (
    <svg x={cx - 12} y={cy - 12}>
      <circle
        cx={12}
        cy={12}
        r={6}
        stroke="#448FFF"
        strokeWidth={3}
        fill="white"
      />
    </svg>
  );
}

function LineChartComponent({ areaId, categoryId }) {
  const {
    areasList: { data: areasData },
    selectedWeek,
  } = useSelector(({ dashboard }) => dashboard);
  const currentWeek = getWeekDays(getWeekRange(new Date()).from);

  const chartData = (day) => {
    const selectedWeekData = selectedWeek.length ? selectedWeek : currentWeek;
    const specificDay = getDateOfSelectedWeek(selectedWeekData, day);
    const currentArea = areasData?.find((i) => i?.id === areaId);
    const areaCategories = currentArea && currentArea?.categories;

    const calculatedSumForDays = areaCategories?.filter(
      (category) => category?.id === categoryId,
    );
    const currentDayScore =
      calculatedSumForDays &&
      calculatedSumForDays[0]?.scores?.find(
        (score) => moment(score.date_time).format('YYYY-MM-DD') === specificDay,
      );
    return currentDayScore?.value || 0;
  };

  // const data = [
  //   {
  //     name: 'MON',
  //     score: chartData('mon'),
  //   },
  //   {
  //     name: 'TUE',
  //     score: chartData('tue'),
  //   },
  //   {
  //     name: 'WED',
  //     score: chartData('wed'),
  //   },
  //   {
  //     name: 'THU',
  //     score: chartData('thu'),
  //   },
  //   {
  //     name: 'FRI',
  //     score: chartData('fri'),
  //   },
  //   {
  //     name: 'SAT',
  //     score: chartData('sat'),
  //   },
  //   {
  //     name: 'SUN',
  //     score: chartData('sun'),
  //   },
  // ];
  const data = [
    {
      name: 'mon',
      score: 33,
    },
    {
      name: 'tue',
      score: 65,
    },
    {
      name: 'wed',
      score: 100,
    },
    {
      name: 'thu',
      score: 20,
    },
    {
      name: 'fri',
      score: 5,
    },
    {
      name: 'sat',
      score: 60,
    },
    {
      name: 'sun',
      score: 45,
    },
  ];
  const CustomizedLabel = ({ x, y, value }) => {
    return (
      <text
        x={x}
        y={y}
        dy={-15}
        fill="#1b2a3d"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {value + '%'}
      </text>
    );
  };
  return (
    <ResponsiveContainer width="100%" height={126}>
      <StyledLineChart
        data={data}
        margin={{
          top: 30,
          right: 0,
          left: -32,
          bottom: -10,
        }}
      >
        <CartesianGrid stroke="#F9F9F9" strokeWidth={2} vertical={false} />
        <XAxis dataKey="name" tickLine={false} scale="band" />
        <YAxis tickCount={3} axisLine={false} tickLine={false} />
        <Tooltip />
        <Line
          dataKey="score"
          stroke="#448FFF"
          strokeWidth={2}
          dot={<CustomizedDot />}
          activeDot={false}
          isAnimationActive={false}
        >
          <LabelList content={<CustomizedLabel />} />
        </Line>
      </StyledLineChart>
    </ResponsiveContainer>
  );
}

export default LineChartComponent;

const StyledLineChart = styled(LineChart)`
  & .recharts-label-list {
    font-family: Roboto;
    font-size: 12px;
    line-height: 16px;
    color: #1b2a3d;
  }
  & .recharts-cartesian-axis-tick-value {
    font-family: Roboto;
    font-size: 12px;
    line-height: 16px;
    font-weight: 500 !important;
    text-transform: uppercase;
    fill: #8e97a3;
  }
`;

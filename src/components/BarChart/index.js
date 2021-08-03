import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
} from 'recharts';
import styled from 'styled-components';

const data = [
  {
    name: 'mon',
    pv: 33,
    contentPv: '33%',
  },
  {
    name: 'tue',
    pv: 65,
    contentPv: '65%',
  },
  {
    name: 'wed',
    pv: 100,
    contentPv: '100%',
  },
  {
    name: 'thu',
    pv: 20,
    contentPv: '20%',
  },
  {
    name: 'fri',
    pv: 5,
    contentPv: '5%',
  },
  {
    name: 'sat',
    pv: 60,
    contentPv: '60%',
  },
  {
    name: 'sun',
    pv: 45,
    contentPv: '45%',
  },
];
const renderCustomizedLabel = ({ x, y, width, value }) => {
  const radius = 10;
  return (
    <g>
      <text
        x={x + width / 2}
        y={y - radius}
        fill="#1b2a3d"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {value + '%'}
      </text>
    </g>
  );
};

const BarCharts = () => {
  return (
    <ResponsiveContainer width="100%" height={126}>
      <StyledBarChart
        data={data}
        margin={{
          top: 30,
          right: 0,
          left: -32,
          bottom: -10,
        }}
        barSize={16}
      >
        <CartesianGrid stroke="#F9F9F9" strokeWidth={2} vertical={false} />
        <XAxis dataKey="name" tickLine={false} scale="band" />
        <YAxis tickCount={3} axisLine={false} tickLine={false} />
        <Bar dataKey="pv" fill="#2E99E7">
          <LabelList
            dataKey="contentPv"
            position="top"
            // content={renderCustomizedLabel}
          />
        </Bar>
      </StyledBarChart>
    </ResponsiveContainer>
  );
};
export default BarCharts;
const StyledBarChart = styled(BarChart)`
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

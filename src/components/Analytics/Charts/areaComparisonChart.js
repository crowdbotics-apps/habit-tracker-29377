import React from 'react';
// import Plotly from './minifiedPlotly';
// import createPlotlyComponent from 'react-plotly.js/factory';
import styled from 'styled-components';

import Loader from '../../Loader';
import {
  calculateAvgForMonth,
  getAverageOfMonth,
} from '../../../utils/analyticsCalculations';
import { getAreaColor } from '../../../utils/utility';
import useWindowSize from '../../../utils/useWindowSize';

// const Plot = createPlotlyComponent(Plotly);

const AreaComparisonChart = ({
  analyticsTableData,
  loading,
  chartData,
  dateStart,
  dateEnd,
}) => {
  const { width } = useWindowSize();
  let newMonthsRange = [];
  while (dateEnd > dateStart || dateStart.format('M') === dateEnd.format('M')) {
    newMonthsRange.push({
      month: dateStart.format('M'),
      year: dateStart.format('YYYY'),
    });
    dateStart.add(1, 'month');
  }
  const previousData = chartData.map((i) => {
    const calculationOfMonth = newMonthsRange.map((item) =>
      calculateAvgForMonth(item, i.id, chartData),
    );
    return getAverageOfMonth(calculationOfMonth.map((c) => c)) || 0;
  });

  const newData = analyticsTableData.map((data) => data.duration.avg || 0);

  let labels = [];
  let areaColors = [];
  chartData.map((i) => {
    labels = [...labels, i.area.name];
    areaColors = [...areaColors, getAreaColor(i.area.code)];
  });

  const currentData = {
    x: labels,
    y: newData,
    name: 'Current Data',
    marker: {
      color: areaColors,
    },
    type: 'bar',
  };
  const oldData = {
    x: labels,
    y: previousData,
    name: 'Previous Data',
    marker: {
      color: [
        '#175F94',
        '#55A2B2',
        '#80C23E',
        '#D4B870',
        '#C77676',
        '#DE901A',
        '#7C8AD1',
        '#9E74C0',
        '#FFE2EB',
        '#921F1F',
      ],
    },
    type: 'bar',
  };

  const areaLabels = labels.map((val, index) => (
    <AreaWrapper key={index}>
      <AreaColor color={areaColors[index]} />
      <LabelText>{val}</LabelText>
    </AreaWrapper>
  ));
  return (
    <MainWrapper>
      {loading ? (
        <Loader />
      ) : (
        <>
          {/* <Plot
            data={[currentData, oldData]}
            layout={{
              barmode: 'group',
              title: {
                text: 'Area comparison',
                x: 0.1,
              },
              autosize: true,
              height: width < 600 ? 350 : 450,
              showlegend: false,
            }}
            config={{
              displayModeBar: false,
            }}
          /> */}
          <BottomWrapper>
            <BottomInner>{areaLabels}</BottomInner>
          </BottomWrapper>
        </>
      )}
    </MainWrapper>
  );
};

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  background-color: white;
  min-height: 450px;
  .xtick {
    display: none;
  }
`;

const BottomWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  position: absolute;
  bottom: 0;
  padding: 0 10px;
`;

const BottomInner = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const AreaWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-right: 20px;
`;

const AreaColor = styled.p`
  height: 10px;
  width: 10px;
  background-color: ${({ color }) => color};
  margin-right: 5px;
  margin-bottom: 0;
  border-radius: 50px;
`;

const LabelText = styled.p`
  margin-bottom: 0;
`;

export default AreaComparisonChart;

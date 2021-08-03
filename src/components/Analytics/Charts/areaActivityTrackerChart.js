import React from 'react';

// import Plotly from './minifiedPlotly';
// import createPlotlyComponent from 'react-plotly.js/factory';
import { getAreaColor } from '../../../utils/utility';
import useWindowSize from '../../../utils/useWindowSize';

// const Plot = createPlotlyComponent(Plotly);

const AreaActivityTrackerChart = ({ chartData, analyticsTableData }) => {
  const { width } = useWindowSize();

  const chartLabel = chartData.map((i) => [
    i.area.name,
    ...i.categories.map((c) => c.category.name),
  ]);
  let resultArray = [];
  chartLabel.forEach((ary) => {
    resultArray = [...resultArray, ...ary];
  });
  let parentsResultArray = [];
  const parentsArray = chartData.map((i) => [
    '',
    ...i.categories.map((c) => i.area.name),
  ]);

  parentsArray.forEach((ary) => {
    parentsResultArray = [...parentsResultArray, ...ary];
  });
  const calculatedAverage = (value, areaValue) => {
    const categoryScoreValueArray = value.map((c) => c.duration.avg);
    const sumCategoryValue = categoryScoreValueArray.reduce((a, c) => a + c, 0);
    const requireValue =
      (areaValue - sumCategoryValue) / categoryScoreValueArray?.length || 0;
    const categoryValue = value.map(
      (c) => Math.abs(c.duration.avg) + requireValue,
    );
    return categoryValue;
  };
  const chartWeight = analyticsTableData.map((i) => [
    Math.abs(i.duration.avg),
    ...calculatedAverage(i.subRows, i.duration.avg),
  ]);
  const chartColor = analyticsTableData.map((i) => getAreaColor(i.area.code));
  let wightArray = [];
  chartWeight.forEach((ary) => {
    wightArray = [...wightArray, ...ary];
  });
  const calculatedValue = (value) => {
    const categoryScoreValueArray = value.map((c) =>
      c.duration.avg ? c.duration.avg : 0,
    );
    return categoryScoreValueArray;
  };
  const customValue = analyticsTableData.map((i) => [
    Math.abs(i.duration.avg),
    ...calculatedValue(i.subRows, i.duration.avg),
  ]);
  let customValues = [];
  customValue.forEach((ary) => {
    customValues = [...customValues, ...ary];
  });

  return (
    <></>
    // <Plot
    //   data={[
    //     {
    //       type: 'sunburst',
    //       maxdepth: 4,
    //       labels: resultArray,
    //       parents: parentsResultArray,
    //       values: wightArray,
    //       outsidetextfont: { color: '#ffffff' },
    //       insidetextorientation: 'radial',
    //       branchvalues: 'total',
    //       hovertemplate:
    //         '<b>%{label} </b> <br>Value: %{customdata} <extra></extra> ',
    //       customdata: customValues,
    //     },
    //   ]}
    //   layout={{
    //     sunburstcolorway: chartColor,
    //     extendsunburstcolorway: true,
    //     title: {
    //       text: 'Area activity tracker',
    //       x: 0.1,
    //     },
    //     height: width < 600 ? 450 : 930,
    //     autosize: true,
    //     hoverlabel: { bgcolor: '#FFF' },
    //   }}
    //   config={{
    //     displayModeBar: false,
    //     responsive: true,
    //   }}
    // />
  );
};

export default AreaActivityTrackerChart;

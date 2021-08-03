import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
// import Plotly from './minifiedPlotly';
// import createPlotlyComponent from 'react-plotly.js/factory';
import moment from 'moment';

import CompareActivityModal from './CompareActivityModal';
import { getAreaColor } from '../../../utils/utility';
import arrowDownGrey from '../../../assets/images/arrowDownGrey.png';
import useWindowSize from '../../../utils/useWindowSize';

// const Plot = createPlotlyComponent(Plotly);

const ActivityComparisonChart = ({ chartData, analyticsTableData }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedArea, setSelectedArea] = useState([]);
  const filterAreaId = selectedArea.map((i) => i.areaId);
  const filterChartData = analyticsTableData.filter((area) => {
    return filterAreaId.includes(area.id);
  });
  const chartCal = filterChartData.map((item) => {
    const areaValue = item.monthsRange.map(
      (i) => item[moment(i.month, 'M').format('MMM').toLowerCase()]?.avg || 0,
    );
    const aAxies = item.monthsRange.map((m) =>
      moment(m.month, 'M').format('MMM YY').toUpperCase(),
    );
    return {
      x: aAxies,
      y: areaValue,
      type: 'scatter',
      name: item.area.title,
      line: { color: getAreaColor(item.area.code) },
    };
  });
  useEffect(() => {
    if (chartData.length) {
      setSelectedArea([
        {
          areaId: chartData[0].id,
          areaName: chartData[0].area.name,
          areaCode: chartData[0].area.code,
        },
        {
          areaId: chartData[1].id,
          areaName: chartData[1].area.name,
          areaCode: chartData[1].area.code,
        },
      ]);
    }
  }, [chartData.length]);

  const dialogClose = () => setShowDialog(false);

  const dialogOpen = () => setShowDialog(true);
  const { width } = useWindowSize();
  return (
    <>
      <MainWrapper>
        {showDialog && (
          <CompareActivityModal
            show={showDialog}
            handleClose={dialogClose}
            data={chartData}
            setSelectedArea={setSelectedArea}
            selectedArea={selectedArea}
          />
        )}
        {/* <Plot
          data={chartCal}
          layout={{
            title: {
              text: 'Activity comparison',
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
          {selectedArea.map((item, index) => {
            return (
              <BottomInner
                onClick={dialogOpen}
                color={getAreaColor(item.areaCode)}
                key={index}
              >
                {item.areaName}
                <NavIcon src={arrowDownGrey} alt="navIcon" />
              </BottomInner>
            );
          })}
        </BottomWrapper>
      </MainWrapper>
    </>
  );
};

export default ActivityComparisonChart;

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  .xtick {
    display: none;
  }
`;

const BottomWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  position: absolute;
  bottom: 20px;
  left: 20px;
  padding: 0 10px;
`;

const BottomInner = styled.div`
  text-transform: uppercase;
  cursor: pointer;
  color: ${({ color }) => color};
  margin-right: 20px;
  font-size: 14px;
`;

const NavIcon = styled.img`
  padding-left: 5px;
`;

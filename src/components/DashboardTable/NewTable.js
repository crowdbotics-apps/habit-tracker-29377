import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDispatch, useSelector } from 'react-redux';
import update from 'immutability-helper';

import TableHeader from './TableHeader';
import WeeklyProgress from './WeeklyProgress';
import AreaRow from './AreaRow';
import { changeWeight } from '../../modules/actions/DashboardActions';
import { getStartEndDatesV2 } from '../../utils/utility';

const Table = ({ dropDownItem, handleDropdown, data = [] }) => {
  const dispatch = useDispatch();

  const [dashboardData, setDashboardData] = useState(data);
  const [weightUpdate, setWeightUpdate] = useState(false);

  const { selectedWeek } = useSelector(({ dashboard }) => dashboard);

  useEffect(() => {
    setDashboardData(data);
  }, [data]);

  useEffect(() => {
    if (weightUpdate) {
      const newRecords = dashboardData.map((record, index) => {
        return {
          ...record,
          weight: dashboardData.length - index,
        };
      });
      setDashboardData(newRecords);

      const updatedWeights = newRecords.map((record) => ({
        id: record.id,
        weight: record.weight,
      }));

      const dates = getStartEndDatesV2(selectedWeek[0], selectedWeek[6]);
      const payload = {
        type: 'area',
        start_date: dates.start,
        end_date: dates.end,
        weights: updatedWeights,
      };

      dispatch(changeWeight(payload));
      setWeightUpdate(false);
    }
  }, [weightUpdate]); // eslint-disable-line react-hooks/exhaustive-deps

  const moveAreaRow = useCallback(
    (dragIndex, hoverIndex) => {
      const dragCard = dashboardData[dragIndex];
      setDashboardData(
        update(dashboardData, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragCard],
          ],
        }),
      );
    },
    [dashboardData],
  );

  return (
    <TableWrapper>
      <StyledTable>
        <TableHeader
          dropDownItem={dropDownItem}
          handleDropdown={handleDropdown}
        />
        <WeeklyProgress />
        <DndProvider backend={HTML5Backend}>
          {!!dashboardData.length &&
            dashboardData.map((area, index) => (
              <AreaRow
                key={area.id}
                area={area}
                index={index}
                moveAreaRow={moveAreaRow}
                setWeightUpdate={setWeightUpdate}
              />
            ))}
        </DndProvider>
      </StyledTable>
    </TableWrapper>
  );
};

export default Table;

const TableWrapper = styled.div`
  ${({ theme }) => theme.max('md')`
    overflow: auto;
    height: 100vh;
    min-height: 100vh;
  `}
`;

const StyledTable = styled.div`
  min-width: 100%;
  ${({ theme }) => theme.max('md')`
    min-width: 1020px;
  `}
  ${({ theme }) => theme.max('sm')`
    min-width: 900px;
  `}
  ${({ theme }) => theme.between('sm', 'md')`
    margin-left: 13px;
  `}
`;

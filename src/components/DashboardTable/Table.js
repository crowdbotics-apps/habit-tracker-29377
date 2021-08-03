import React, { useState, useCallback, Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled, { css } from 'styled-components';
import { useTable, useExpanded } from 'react-table';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import Dropdown from 'react-bootstrap/Dropdown';

import Row from './Row';
import ExpandedComponent from './ExpandedComponent';
import { changeAreaWeight } from '../../modules/actions/DashboardActions';

const CustomDropdownToggle = React.forwardRef(({ children, onClick }, ref) => (
  <div
    ref={ref}
    className="customDropdown"
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    {children}
    <DropDownIcon alt="icon" />
  </div>
));

const Table = ({ columns, data, handleDropdown, dropDownItem }) => {
  const dispatch = useDispatch();

  const {
    areasList: { success },
    editScore: { success: editScoreSuccess },
    addScore: { success: addScoreSuccess },
  } = useSelector(({ dashboard }) => dashboard);

  const [records, setRecords] = useState(data);
  const [weightUpdate, setWeightUpdate] = useState(false);

  useEffect(() => {
    setRecords([...data]);
  }, [data.length, success, editScoreSuccess, addScoreSuccess]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (weightUpdate) {
      const newRecords = records.map((record, index) => ({
        ...record,
        weight: records.length - index,
      }));
      setRecords(newRecords);
      const updatedWeights = newRecords.map((record) => ({
        id: record.id,
        weight: record.weight,
      }));
      dispatch(changeAreaWeight({ weight_id_list: updatedWeights }));
      setWeightUpdate(false);
    }
  }, [weightUpdate]); // eslint-disable-line react-hooks/exhaustive-deps

  const moveRow = (dragIndex, hoverIndex) => {
    const dragRecord = records[dragIndex];
    setRecords(
      update(records, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragRecord],
        ],
      }),
    );
  };

  const getRowId = useCallback((row) => {
    return row.id;
  }, []);

  const getTableHeaders = (column) => {
    switch (column.id) {
      case 'weight':
        return (
          <WeightHeader {...column.getHeaderProps()}>
            {column.render('Header')}
          </WeightHeader>
        );
      case 'icon':
        return (
          <IconHeader {...column.getHeaderProps()}>
            {column.render('Header')}
          </IconHeader>
        );
      case 'mon':
      case 'tue':
      case 'wed':
      case 'thu':
      case 'fri':
      case 'sat':
      case 'sun':
        return (
          <DayHeader {...column.getHeaderProps()}>
            {column.render('Header')}
          </DayHeader>
        );
      case 'duration':
        return (
          <DurationHeader {...column.getHeaderProps()}>
            <StyledDropdown>
              <Dropdown.Toggle as={CustomDropdownToggle} id="dropdown-basic">
                <DropDownTitle>{column.render('Header')}</DropDownTitle>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <StyledDropdownItem
                  activeItem={dropDownItem === 'avg'}
                  onClick={handleDropdown('avg')}
                >
                  AVG %
                </StyledDropdownItem>
                <StyledDropdownItem
                  activeItem={dropDownItem === 'points'}
                  onClick={handleDropdown('points')}
                >
                  Points
                </StyledDropdownItem>
                <StyledDropdownItem
                  activeItem={dropDownItem === 'duration'}
                  onClick={handleDropdown('duration')}
                >
                  Duration
                </StyledDropdownItem>
              </Dropdown.Menu>
            </StyledDropdown>
          </DurationHeader>
        );
      default:
        return (
          <StyledHeader {...column.getHeaderProps()}>
            {column.render('Header')}
          </StyledHeader>
        );
    }
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    visibleColumns,
  } = useTable({ data: records, columns, getRowId }, useExpanded);
  return (
    <DndProvider backend={HTML5Backend}>
      <TableWrapper>
        <StyledTable {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => getTableHeaders(column))}
              </tr>
            ))}
          </thead>
          <tbody style={{ overflow: 'auto' }} {...getTableBodyProps()}>
            {rows.map((row, index) => {
              prepareRow(row);
              return (
                <Fragment key={row.id}>
                  {row.values.weight ? (
                    <Row
                      index={index}
                      row={row}
                      moveRow={moveRow}
                      setWeightUpdate={setWeightUpdate}
                      {...row.getRowProps()}
                    />
                  ) : null}

                  {row.isExpanded || row.values.expander.isExpanded ? (
                    <tr>
                      <StyledSubComponentTd colSpan={visibleColumns.length}>
                        <ExpandedComponent
                          row={row}
                          dropDownItem={dropDownItem}
                        />
                      </StyledSubComponentTd>
                    </tr>
                  ) : null}
                </Fragment>
              );
            })}
          </tbody>
        </StyledTable>
      </TableWrapper>
    </DndProvider>
  );
};

export default Table;

const TableWrapper = styled.div`
  ${({ theme }) => theme.max('md')`
    overflow-x: auto;
    -ms-overflow-style: none; 
    scrollbar-width: none; 
    &::-webkit-scrollbar {
      display: none;
    }
  `}
`;

const StyledTable = styled.table`
  min-width: 100%;
  ${({ theme }) => theme.max('md')`
    min-width: 992px;
  `}
  ${({ theme }) => theme.max('sm')`
    min-width: 745px;
  `}
`;

const StyledHeader = styled.th`
  padding-bottom: 17px;
  font-family: Roboto;
  font-size: 12px;
  line-height: 14px;
  text-transform: uppercase;
  color: #818ea3;
  ${({ theme }) => theme.max('lg')`
    padding-bottom: 11px;
  `}
`;

const BoldHeader = styled(StyledHeader)`
  font-weight: bold;
`;

const StyledSubComponentTd = styled.td`
  padding: 0;
  border-radius: 5px;
`;

const WeightHeader = styled(BoldHeader)`
  text-align: center;
  width: 5.5%;
`;

const IconHeader = styled(StyledHeader)`
  width: 4.5%;
`;

const DayHeader = styled(StyledHeader)`
  text-align: center;
  width: 6.8%;
`;

const DurationHeader = styled(BoldHeader)`
  cursor: pointer;
  width: 9%;
`;

const DropDownTitle = styled.div`
  margin-right: 4px;
`;

const DropDownIcon = styled.img`
  margin-top: -4px;
`;

const StyledDropdown = styled(Dropdown)`
  & > .customDropdown {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #1689ca;
    &:hover {
      color: #1689ca;
      text-decoration: underline;
    }
  }
  & .dropdown-menu {
    min-width: 115px;
    box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.05);
    border-radius: 10px;
    border: none;
  }
`;

const StyledDropdownItem = styled(Dropdown.Item)`
  padding: 10px 24px;
  font-family: Roboto;
  font-size: 12px;
  line-height: 14px;
  color: #313b4c;
  ${({ activeItem }) =>
    activeItem &&
    css`
      color: #1689ca !important;
      font-weight: bold;
    `}
  &:focus {
    color: ${({ theme }) => theme.palette.common.white} !important;
    background-color: ${({ theme }) => theme.palette.primary.main};
  }
`;

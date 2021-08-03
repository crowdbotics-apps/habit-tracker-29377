import React, { useMemo, useState, Fragment } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import Table from './NewTable';
import RoundedProgress from '../RoundedProgress';
import AddNewCategoryDialog from '../AddNewCategoryDialog';
import { convertMinToHr } from '../../utils/utility';

const DashboardTable = ({ dropDownItem, handleDropdown }) => {
  const {
    getUserInfoList: { data: userInfoData },
  } = useSelector(({ dashboard }) => dashboard);

  const getDropDownTitle = () => {
    return dropDownItem === 'avg' ? dropDownItem + ' %' : dropDownItem;
  };

  const getDayLabel = (value) => {
    switch (dropDownItem) {
      case 'avg':
        return value.avg !== '' ? value.avg + '%' : '-';
      case 'points':
        return (
          <Fragment>
            {value.points !== '' ? (
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
        return value.duration ? convertMinToHr(value) : '-';
    }
  };

  const getDayProgress = (value) => {
    switch (dropDownItem) {
      case 'avg':
        return value.avg || 1;
      case 'points':
        return value.points || 1;
      case 'duration':
      default:
        return Math.round(((value.duration / 60) * 100) / 24) || 1;
    }
  };

  const handleToggleCollapse = (row) => () => {
    row.toggleRowExpanded();
    if (row.values.expander.isExpanded) {
      row.toggleRowExpanded();
      row.values.expander.isExpanded = false;
    }
  };

  const columns = useMemo(
    () => [
      {
        accessor: 'weight',
        Header: 'Weight',
      },
      {
        accessor: 'icon',
        Header: '',
        Cell: ({ cell }) => {
          return (
            <Fragment>
              {cell.value && <img src={cell.value} alt="icon" />}
            </Fragment>
          );
        },
      },
      {
        id: 'expander',
        accessor: 'area',
        Header: () => {
          return (
            <AreaHeaderWrapper>
              <div>Areas / category</div>
            </AreaHeaderWrapper>
          );
        },
        Cell: ({ row, cell }) => {
          return (
            <AreaWrapper onClick={handleToggleCollapse(row)}>
              <AreaTitle>{cell.value.title}</AreaTitle>
              <AreaSubTitle>{cell.value.subTitle}</AreaSubTitle>
            </AreaWrapper>
          );
        },
      },
      {
        accessor: 'mon',
        Header: 'Mon',
        Cell: ({ cell }) => {
          return (
            <DayProgressWrapper>
              <RoundedProgress
                progress={getDayProgress(cell.value)}
                label={getDayLabel(cell.value)}
              />
            </DayProgressWrapper>
          );
        },
      },
      {
        accessor: 'tue',
        Header: () => 'TUE',
        Cell: ({ cell }) => {
          return (
            <DayProgressWrapper>
              <RoundedProgress
                progress={getDayProgress(cell.value)}
                label={getDayLabel(cell.value)}
              />
            </DayProgressWrapper>
          );
        },
      },
      {
        accessor: 'wed',
        Header: () => 'Wed',
        Cell: ({ cell }) => {
          return (
            <DayProgressWrapper>
              <RoundedProgress
                progress={getDayProgress(cell.value)}
                label={getDayLabel(cell.value)}
              />
            </DayProgressWrapper>
          );
        },
      },
      {
        accessor: 'thu',
        Header: () => 'Thu',
        Cell: ({ cell }) => {
          return (
            <DayProgressWrapper>
              <RoundedProgress
                progress={getDayProgress(cell.value)}
                label={getDayLabel(cell.value)}
              />
            </DayProgressWrapper>
          );
        },
      },
      {
        accessor: 'fri',
        Header: () => 'Fri',
        Cell: ({ cell }) => {
          return (
            <DayProgressWrapper>
              <RoundedProgress
                progress={getDayProgress(cell.value)}
                label={getDayLabel(cell.value)}
              />
            </DayProgressWrapper>
          );
        },
      },
      {
        accessor: 'sat',
        Header: () => 'Sat',
        Cell: ({ cell }) => {
          return (
            <DayProgressWrapper>
              <RoundedProgress
                progress={getDayProgress(cell.value)}
                label={getDayLabel(cell.value)}
              />
            </DayProgressWrapper>
          );
        },
      },
      {
        accessor: 'sun',
        Header: () => 'Sun',
        Cell: ({ cell }) => {
          return (
            <DayProgressWrapper>
              <RoundedProgress
                progress={getDayProgress(cell.value)}
                label={getDayLabel(cell.value)}
              />
            </DayProgressWrapper>
          );
        },
      },
      {
        accessor: 'duration',
        Header: getDropDownTitle(),
        Cell: ({ cell }) => {
          return (
            <DayProgressWrapper>
              <RoundedProgress
                progress={getDayProgress(cell.value)}
                label={getDayLabel(cell.value)}
                strokeWidth={dropDownItem === 'points' ? 21 : 5}
                innerStrokeWidth={dropDownItem === 'points' ? 0 : 5}
                circleTwoStroke={
                  dropDownItem === 'points' ? '#F2F2F2' : '#6BB3DC'
                }
                fullWidth
              />
            </DayProgressWrapper>
          );
        },
      },
    ],
    [dropDownItem], // eslint-disable-line react-hooks/exhaustive-deps
  );
  const [showAddCategoryDialog, setShowAddCategoryDialog] = useState(false);

  const addCategoryDialogClose = () => setShowAddCategoryDialog(false);

  return (
    <Fragment>
      <AddNewCategoryDialog
        show={showAddCategoryDialog}
        handleClose={addCategoryDialogClose}
      />
      <Table
        columns={columns}
        data={userInfoData}
        handleDropdown={handleDropdown}
        dropDownItem={dropDownItem}
      />
    </Fragment>
  );
};

export default DashboardTable;

const AreaHeaderWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const AreaTitle = styled.div`
  font-family: Roboto;
  font-size: 16px;
  line-height: 24px;
  margin-bottom: 3px;
  color: ${({ theme }) => theme.palette.text.primary};
`;

const AreaSubTitle = styled.div`
  font-family: Roboto;
  font-size: 14px;
  line-height: 16px;
  color: #8e97a3;
`;

const DayProgressWrapper = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
`;

const CurrencySign = styled.span`
  font-weight: 700;
  color: #ff9900;
`;

const AreaWrapper = styled.div`
  cursor: pointer;
`;

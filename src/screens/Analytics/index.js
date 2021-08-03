import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';

import Page from '../../components/Page';
import AnalyticsHeader from '../../components/Analytics/AnalyticsHeader';
import AnalyticsMenu from '../../components/AnalyticsMenu';
import { getAreasListForAnalytics } from '../../modules/actions/AnalyticsAction';
import Loader from '../../components/Loader';
import {
  getStartEndDates,
  getWeekDays,
  getWeekRange,
} from '../../utils/utility';
import { getAreasList } from '../../modules/actions/DashboardActions';
import CompareResultsDialog from '../../components/CompareResultsDialog.js';

const Analytics = () => {
  const dispatch = useDispatch();

  const {
    areasList: { loading, success, showLoader },
    selectedMonths,
  } = useSelector(({ analytics }) => analytics);

  const [dropDownItem, setDropDownItem] = useState('avg');
  const [activeTab, setActiveTab] = useState('statistics');
  const [showCompareResultsDialog, setShowCompareResultsDialog] =
    useState(false);

  const compareResultsDialogOpen = () => setShowCompareResultsDialog(true);

  const compareResultsDialogClose = () => setShowCompareResultsDialog(false);

  const handleDropdown = (type = 'duration') => {
    setDropDownItem(type);
  };

  useEffect(() => {
    const currentWeek = getWeekDays(getWeekRange(new Date()).from);
    const currentWeekData = getStartEndDates(currentWeek[0], currentWeek[6]);
    const selectedWeek =
      JSON.parse(localStorage.getItem('selectedWeek')) || currentWeekData;
    const body = selectedWeek;
    dispatch(getAreasList({ ...body }));
  }, []);

  useEffect(() => {
    if (selectedMonths.from && selectedMonths.to && !success && !loading) {
      const body = getStartEndDates(selectedMonths.from, selectedMonths.to);
      dispatch(
        getAreasListForAnalytics({
          ...body,
          showLoader: true,
          type: 'statistics',
        }),
      );
    }
  }, [selectedMonths]);

  return (
    <Page title={'ANALYTICS'}>
      <CompareResultsDialog
        show={showCompareResultsDialog}
        handleClose={compareResultsDialogClose}
      />
      <MainWrapper>
        {showLoader && loading ? (
          <Loader />
        ) : (
          <AnalyticsWrapper>
            <AnalyticsHeader
              compareResultsDialogOpen={compareResultsDialogOpen}
              dropDownItem={dropDownItem}
              activeTab={activeTab}
            />
            <AnalyticsMenu
              dropDownItem={dropDownItem}
              handleDropdown={handleDropdown}
              setActiveTab={setActiveTab}
            />
          </AnalyticsWrapper>
        )}
      </MainWrapper>
    </Page>
  );
};

export default Analytics;

const MainWrapper = styled.div`
  display: flex;
  ${({ theme }) => theme.max('xl')`
    flex-direction: column;
  `}
`;

const AnalyticsWrapper = styled.section`
  display: flex;
  flex-direction: column;
  > * {
    &:first-child {
      margin-bottom: 26px;
    }
  }
  margin: 20px 30px 14px 23px;
  width: 100%;
  ${({ theme }) => theme.max('md')`
  > * {
    &:first-child {
      margin-bottom: 15px;
    }
  }
    margin: 0;
  `}
  ${({ theme }) => theme.between('md', 'xl')`
    width: calc(100vw - 165px);
  `}
`;

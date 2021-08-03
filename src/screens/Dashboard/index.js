import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import Quote from '../../components/Quote';
import Loader from '../../components/Loader';
import Page from '../../components/Page';
import DashboardHeader from '../../components/DashboardHeader';
import DashboardTable from '../../components/DashboardTable';
import ObjectiveTracker from '../../components/ObjectiveTracker';
import ActivityJournal from '../../components/ActivityJournal';
import { getUserInfo } from '../../modules/actions/DashboardActions';
import { getStartEndDates } from '../../utils/utility';

const Dashboard = () => {
  const dispatch = useDispatch();
  const {
    getUserInfoList: { loading, success, showLoader },
    getActivityJournal: {
      loading: journalLoading,
      showLoader: journalShowLoader,
      success: journalSuccess,
    },
    selectedWeek,
  } = useSelector(({ dashboard }) => dashboard);

  const [dropDownItem, setDropDownItem] = useState('avg');
  const handleDropdown =
    (type = 'duration') =>
    () => {
      setDropDownItem(type);
    };

  useEffect(() => {
    if (
      selectedWeek.length &&
      !success &&
      !loading &&
      !journalLoading &&
      !journalSuccess
    ) {
      const body = getStartEndDates(selectedWeek[0], selectedWeek[6]);
      localStorage.setItem('selectedWeek', JSON.stringify(body));
      // dispatch(getActivityJournal({ ...body, showLoader: true }));
      dispatch(getUserInfo({ showLoader: true }));
    }
  }, [selectedWeek]);

  useEffect(() => {
    dispatch(getUserInfo({ showLoader: true }));
  }, []);

  return (
    <Page title="Dashboard">
      <MainWrapper>
        {(showLoader || journalShowLoader) && (loading || journalLoading) ? (
          <Loader />
        ) : (
          <Fragment>
            <DashBoardWrapper>
              <DashboardHeader dropDownItem={dropDownItem} />
              <DashboardTable
                dropDownItem={dropDownItem}
                handleDropdown={handleDropdown}
              />
            </DashBoardWrapper>
            <RightSectionWrapper>
              <ObjectiveTracker />
              <ActivityJournal />
              <QuoteWrapper>
                <Quote />
              </QuoteWrapper>
            </RightSectionWrapper>
          </Fragment>
        )}
      </MainWrapper>
    </Page>
  );
};

export default Dashboard;

const MainWrapper = styled.div`
  display: flex;
  overflow: auto;
  ${({ theme }) => theme.max('xl')`
    flex-direction: column;
  `}
`;

const DashBoardWrapper = styled.section`
  display: flex;
  flex-direction: column;
  width: calc(100% - 446px);
  > * {
    &:first-child {
      margin-bottom: 24px;
    }
  }
  padding: 24px 24px 24px 13px;
  ${({ theme }) => theme.max('xl')`
    width: 100%;
  `}
  ${({ theme }) => theme.min('xl')`
    overflow: auto;
  `}
  ${({ theme }) => theme.max('md')`
    > * {
      &:first-child {
        margin-bottom: 20px;
      }
    }
    padding: 20px 16px;
  `}
  ${({ theme }) => theme.between('md', 'xl')`
    padding: 24px 20px 24px 13px;
  `}
`;

const RightSectionWrapper = styled.section`
  display: flex;
  flex-direction: column;
  > * {
    &:nth-child(2) {
      margin: 16px 0;
    }
  }
  padding: 24px 20px 24px 0;
  width: 446px;
  ${({ theme }) => theme.min('xl')`
    overflow: auto;
  `}
  ${({ theme }) => theme.max('md')`
    width: 100%;
    > * {
      &:nth-child(2) {
        margin: 10px 0;
      }
    }
    padding: 0 16px 24px;
  `}
  ${({ theme }) => theme.between('md', 'xl')`
    width: 100%;
    flex-direction: row;
    padding: 0 20px 24px 13px;
    > * {
      &:nth-child(2) {
        margin: 0 20px;
      } 
    `}
`;

const QuoteWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
`;

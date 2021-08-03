import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import Page from '../../components/Page';
import TextBoxLabel from '../../atoms/TextBoxLabel';
import ObjectiveTracker from '../../components/ObjectiveTracker';
import ActivityJournal from '../../components/ActivityJournal';
import UserSettings from '../../components/UserSettings';
import { getAreasList } from '../../modules/actions/DashboardActions';
import {
  getStartEndDates,
  getWeekDays,
  getWeekRange,
} from '../../utils/utility';

const Settings = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const currentWeek = getWeekDays(getWeekRange(new Date()).from);
    const currentWeekData = getStartEndDates(currentWeek[0], currentWeek[6]);
    const selectedWeek =
      JSON.parse(localStorage.getItem('selectedWeek')) || currentWeekData;
    const body = selectedWeek;
    dispatch(getAreasList({ ...body }));
  }, []);

  return (
    <Page title={'GLOBAL SETTINGS'}>
      <MainWrapper>
        <AnalyticsWrapper>
          <Label>Settings</Label>
          <UserSettings />
        </AnalyticsWrapper>
        <RightSectionWrapper>
          <ObjectiveTracker />
          <ActivityJournal />
        </RightSectionWrapper>
      </MainWrapper>
    </Page>
  );
};
export default Settings;
const MainWrapper = styled.div`
  display: flex;
  overflow: auto;
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
  width: calc(100% - 446px);
  ${({ theme }) => theme.max('md')`
    > * {
    &:first-child {
      margin-bottom: 15px;
    }
  }
    margin: 10px;
    width: initial;
  `}
  ${({ theme }) => theme.between('md', 'xl')`
    width: calc(100vw - 165px);
    margin: 23px 10px 10px 20px;
  `}
`;
const RightSectionWrapper = styled.section`
  display: flex;
  flex-direction: column;
  > * {
    &:first-child {
      margin-bottom: 30px;
    }
  }
  padding: 20px 20px 14px 0;
  width: 446px;
  ${({ theme }) => theme.max('md')`
    display: none;
  `}
  ${({ theme }) => theme.between('md', 'xl')`
    width: 100%;
    flex-direction: row;
    padding: 20px;
    > * {
    &:first-child {
      margin-right: 30px;
    }
  }
  `}
`;
const Label = styled(TextBoxLabel)`
  font-size: 18px;
  padding: 20px 0;
  ${({ theme }) => theme.max('md', 'xl')`
    display: none;
  `}
`;

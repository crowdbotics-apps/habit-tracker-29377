import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import LineChart from '../LineChart';
import AddActivityJournalDialog from '../AddActivityJournalDialog';
import { getAreaIcon } from '../../utils/utility';
import ArrowIcon from '../DashboardHeader/assets/downArrowIcon';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import BarChart from '../BarChart';

const ObjectiveTracker = () => {
  const {
    areasList: { data: areasData = [] },
  } = useSelector(({ dashboard }) => dashboard);

  useEffect(() => {
    if (areasData.length) {
      setJournalData((prev) => ({
        ...prev,
        areaId: areasData[0].id,
        areaName: areasData[0].area.name,
        categoryId: areasData[0].categories.length
          ? areasData[0].categories[0].id
          : '',
        categoryName: areasData[0].categories.length
          ? areasData[0].categories[0].category.name
          : '',
      }));
      setIcon(areasData[0].area.code);
    }
  }, [areasData.length]);

  const [journalData, setJournalData] = useState({
    areaId: '',
    areaName: '',
    categoryId: '',
    categoryName: '',
  });
  const [icon, setIcon] = useState();

  useEffect(() => {
    const iconCode = areasData.find((i) => i?.id === journalData.areaId);
    setIcon(iconCode?.area?.code);
  }, [journalData]);

  const [showAddActivityJournalDialog, setShowAddActivityJournalDialog] =
    useState(false);

  const addActivityJournalDialogOpen = () =>
    setShowAddActivityJournalDialog(true);

  const addActivityJournalDialogClose = () =>
    setShowAddActivityJournalDialog(false);

  const addObjectiveTrackerDialog = (
    <StyledPopover id="popover-basic">
      <AddActivityJournalDialog
        show={showAddActivityJournalDialog}
        handleClose={addActivityJournalDialogClose}
        journalData={journalData}
        setJournalData={setJournalData}
        selectedDatesArea={areasData}
      />
    </StyledPopover>
  );

  return (
    <ObjectiveTrackerWrapper>
      <Header>
        <div>
          <Title>Daily Score</Title>
          <OverlayTrigger
            rootClose
            trigger="click"
            placement="bottom-start"
            overlay={addObjectiveTrackerDialog}
          >
            <TitleWrapper onClick={addActivityJournalDialogOpen}>
              <SubTitle>{journalData.areaName}</SubTitle>
              <Separator>/</Separator>
              <SubTitleSlug>{journalData.categoryName}</SubTitleSlug>
              <span className="ml-2">
                <ArrowIcon color="#1689CA" />
              </span>
            </TitleWrapper>
          </OverlayTrigger>
        </div>
        <IconWrapper>
          <img src={getAreaIcon(icon)} alt="icon" />
        </IconWrapper>
      </Header>
      {/*<LineChart*/}
      {/*  areaId={journalData.areaId}*/}
      {/*  categoryId={journalData.categoryId}*/}
      {/*/>*/}
      <BarChart />
    </ObjectiveTrackerWrapper>
  );
};

export default ObjectiveTracker;

const StyledPopover = styled(Popover)`
  border: none !important;
  & .arrow {
    &::after {
      display: none !important;
    }
    &::before {
      border-color: transparent !important;
    }
  }
`;

const ObjectiveTrackerWrapper = styled.div`
  height: max-content;
  min-width: 380px;
  padding: 24px;
  border-radius: 12px;
  background: ${({ theme }) => theme.palette.common.white};
  ${({ theme }) => theme.max('sm')`
    padding: 12px;
    min-width: auto;
  `}
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Title = styled.div`
  font-family: Roboto;
  font-size: 18px;
  line-height: 20px;
  color: ${({ theme }) => theme.palette.text.primary};
  margin-bottom: 10px;
`;

const Separator = styled.span`
  margin: 0 4px;
  color: #2e99e7;
`;

const SubTitle = styled.span`
  font-family: Roboto;
  font-weight: bold;
  font-size: 14px;
  line-height: 20px;
  color: #2e99e7;
`;

const SubTitleSlug = styled(SubTitle)`
  font-weight: 700;
  color: #2e99e7;
  font-size: 14px;
  line-height: 20px;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 46px;
  width: 46px;
`;

const TitleWrapper = styled.div`
  cursor: pointer;
`;

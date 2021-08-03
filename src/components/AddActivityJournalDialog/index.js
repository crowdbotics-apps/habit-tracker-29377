import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';
import Button from '../Button';
import ActivityJournalListing from './ActivityJournalListing';
import {
  addScore,
  editScore,
  getAreasList,
  getActivityJournal,
} from '../../modules/actions/DashboardActions';
import { getStartEndDates } from '../../utils/utility';

const AddActivityJournalDialog = ({
  show,
  handleClose,
  showJournal = false,
  selectedDate = '',
  selectedDatesArea,
  journalData,
  setJournalData,
}) => {
  const dispatch = useDispatch();

  const {
    addScore: { loading, success, error },
    editScore: {
      loading: editScoreLoading,
      success: editScoreSuccess,
      error: editScoreError,
    },
    areasList: { loading: areasListLoading, success: areasListSuccess },
    getActivityJournal: { loading: journalLoading },
    selectedWeek,
  } = useSelector(({ dashboard }) => dashboard);

  useEffect(() => {
    if (success || editScoreSuccess) {
      const body = getStartEndDates(selectedWeek[0], selectedWeek[6]);
      dispatch(getAreasList(body));
      // dispatch(getActivityJournal(body));
    }
  }, [success, editScoreSuccess]);

  useEffect(() => {
    if (areasListSuccess) {
      handleClose();
    }
  }, [areasListSuccess]);

  const handleAddScoreClick = () => {
    const {
      score: { scoreId, journal },
      categoryId,
      areaId,
    } = journalData;

    if (scoreId && journal !== '-') {
      let item = {
        body: {
          id: scoreId,
          journal,
          area: areaId,
          category: categoryId,
        },
        type: null,
      };
      dispatch(editScore(item));
    } else {
      const currentDate = new Date();
      let date = new Date(selectedDate).setHours(currentDate.getHours());
      date = new Date(date).setMinutes(currentDate.getMinutes());
      let item = {
        body: {
          area: areaId,
          category: categoryId,
          journal,
          date_time: new Date(date).toISOString(),
        },
        type: 'addScore',
      };
      dispatch(addScore(item));
    }
  };

  const buttonStyles = {
    width: 'max-content',
    padding: '11px 34px',
    background: '#789F08',
    marginRight: '30px',
  };

  return (
    <CommonAddScoreDialogWrapper>
      <Header>
        <Text>Weekly score</Text>
      </Header>
      <Content>
        {(error || editScoreError) && (
          <Alert variant="danger">{error || editScoreError}</Alert>
        )}
        <ActivityJournalListing
          showJournal={showJournal}
          handleClose={handleClose}
          journalData={journalData}
          setJournalData={setJournalData}
          selectedDatesArea={selectedDatesArea}
        />
        {showJournal && (
          <ButtonWrapper>
            <Button
              loading={
                loading ||
                editScoreLoading ||
                areasListLoading ||
                journalLoading
              }
              styles={buttonStyles}
              onClick={handleAddScoreClick}
            >
              Add entry
            </Button>
          </ButtonWrapper>
        )}
      </Content>
    </CommonAddScoreDialogWrapper>
  );
};

export default AddActivityJournalDialog;

const StyledModal = styled(Modal)`
  & .modal {
    padding-left: 0;
  }
  & .modal-content {
    border: none;
    border-radius: 10px;
    width: 360px;
  }
  & .dialogClass {
    max-width: 595px;
    margin: 78px auto;
    ${({ theme }) => theme.max('sm')`
      margin: 49px 10px;
    `}
  }
`;

const CommonAddScoreDialogWrapper = styled.div`
  width: 360px;
  height: auto;
  // padding: 12px 0px;
  // margin: 0px 20px;
  // overflow-y: scroll;
  background: #ffffff;
  border: 1px solid ${({ theme }) => theme.palette.text.secondaryLight};
  box-sizing: border-box;
  border-radius: 4px;
  box-shadow: 0px 2px 20px rgba(27, 42, 61, 0.04);
`;

const Header = styled.div`
  padding: 12px 32px 12px;
  background: ${({ theme }) => theme.palette.common.white};
  box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px 10px 0px 0px;
  border-bottom: 1px solid ${({ theme }) => theme.palette.text.secondaryLight};
`;

const CloseIcon = styled.img`
  float: right;
  cursor: pointer;
`;

const Text = styled.span`
  font-family: Roboto;
  font-size: 16px;
  line-height: 20px;
  color: ${({ theme }) => theme.palette.text.primary};
`;

const Content = styled.div`
  ${({ theme }) => theme.max('sm')`
    padding: 20px 10px 30px;
  `}
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 75px;
  ${({ theme }) => theme.max('sm')`
    & > button {
      width: 100%;
    }
  `}
`;

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';

import closeIcon from './assets/closeIcon.png';
import helpIcon from './assets/helpIcon.png';
import ScorePicker from '../ScorePicker';
import Button from '../../components/Button';
import DayAndDate from '../DayAndDate';
import AreaCategoryBadge from '../AreaCategoryBadge';
import useWindowSize from '../../utils/useWindowSize';
import { addScore, editScore } from '../../modules/actions/DashboardActions';

const AddScoreDialog = ({
  selectedScoreData: { areaId, categoryId, score, index, scoreId, journal },
  setDayScores,
  onClose,
}) => {
  const dispatch = useDispatch();
  const {
    addScore: { error },
    editScore: { error: editScoreError },
    selectedWeek,
  } = useSelector(({ dashboard }) => dashboard);

  const { width } = useWindowSize();
  const [selectedScore, setSelectedScore] = useState(score);
  const [journalData, setJournaldata] = useState(journal);

  const buttonStyles = {
    width: 'max-content',
    padding: '11px 34px',
    marginTop: '50px',
    background: '#789F08',
  };

  const handleCloseClick = () => {
    if (width < 992) return onClose();
    document.body.click();
  };

  const handleChange = ({ target: { value } }) => {
    setJournaldata(value);
  };

  const handleAddScoreClick = () => {
    setDayScores((prev) => {
      prev[index] = { ...prev[index], value: selectedScore };
      return prev;
    });
    if (scoreId && score !== '-') {
      let item = {
        body: {
          id: scoreId,
          value: selectedScore,
          journal: journalData,
          area: areaId,
          category: +categoryId.split('_')[1],
        },
        type: 'addScore',
      };
      dispatch(editScore(item));
    } else {
      const date = selectedWeek[index];
      const currentDate = new Date();
      let selectedDate = new Date(date).setHours(currentDate.getHours());
      selectedDate = new Date(selectedDate).setMinutes(
        currentDate.getMinutes(),
      );
      let item = {
        body: {
          area: areaId,
          category: +categoryId.split('_')[1],
          value: selectedScore,
          journal: journalData,
          date_time: new Date(selectedDate).toISOString(),
        },
        type: 'addScore',
      };
      dispatch(addScore(item));
    }
    handleCloseClick();
  };

  return (
    <AddScoreWrapper>
      <Header>
        <CloseIcon src={closeIcon} alt="icon" onClick={handleCloseClick} />
        <AddScoreText>Add score for</AddScoreText>
        <AreaCategoryBadge areaId={areaId} categoryId={categoryId} />
        <DayAndDate styles={{ marginTop: '10px' }} date={selectedWeek[index]} />
      </Header>
      <Content>
        {(error || editScoreError) && (
          <Alert variant="danger">{error || editScoreError}</Alert>
        )}
        <ScorePickerWrapper>
          <Score>{selectedScore !== '' ? selectedScore : '-'}</Score>
          <ScorePicker
            showLabel
            selectedScore={selectedScore}
            setSelectedScore={setSelectedScore}
          />
        </ScorePickerWrapper>
        <JournalEntryWrapper>
          <JournalEntryHeader>
            <JournalEntryText>Journal entry</JournalEntryText>
            <HelpIcon src={helpIcon} alt="icon" />
          </JournalEntryHeader>
          <Form.Control
            as="textarea"
            rows={2}
            value={journalData}
            onChange={handleChange}
          />
          <ButtonWrapper>
            <Button styles={buttonStyles} onClick={handleAddScoreClick}>
              Done
            </Button>
          </ButtonWrapper>
        </JournalEntryWrapper>
      </Content>
    </AddScoreWrapper>
  );
};

export default AddScoreDialog;

const AddScoreWrapper = styled.div`
  width: 595px;
  background: ${({ theme }) => theme.palette.background.main};
  box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  ${({ theme }) => theme.max('sm')`
    width: 100%;
  `}
`;

const Header = styled.div`
  padding: 31px 30px 26px;
  background: ${({ theme }) => theme.palette.common.white};
  box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px 10px 0px 0px;
  ${({ theme }) => theme.max('sm')`
    padding: 20px 30px 18px;
  `}
`;

const CloseIcon = styled.img`
  float: right;
  margin-top: -10px;
  cursor: pointer;
  ${({ theme }) => theme.max('sm')`
    margin-top: 0;
  `}
`;

const AddScoreText = styled.span`
  font-family: Roboto;
  font-size: 18px;
  line-height: 24px;
  color: ${({ theme }) => theme.palette.text.primary};
  margin-right: 35px;
  ${({ theme }) => theme.max('xs')`
    display: block;
    margin-bottom: 10px;
  `}
`;

const Content = styled.div`
  padding: 19px 24px 30px 30px;
  ${({ theme }) => theme.max('sm')`
    padding: 20px 20px 30px;
  `}
`;

const ScorePickerWrapper = styled.div`
  display: flex;
  > * {
    &:first-child {
      margin-right: 40px;
    }
  }
  ${({ theme }) => theme.max('sm')`
       > * {
    &:first-child {
      margin-right: 30px;
    }
  }
  `}
  ${({ theme }) => theme.max('xs')`
       > * {
    &:first-child {
      margin-right: 10px;
    }
  }
  `}
`;

const Score = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 31px;
  height: 42px;
  min-width: 42px;
  background: ${({ theme }) => theme.palette.common.white};
  border: 1px solid #eaebee;
  box-sizing: border-box;
  border-radius: 10px;
  font-family: Roboto;
  font-size: 18px;
  line-height: 21px;
  color: ${({ theme }) => theme.palette.common.black};
`;

const JournalEntryWrapper = styled.div`
  margin: 30px 9px 0 0;
  ${({ theme }) => theme.max('sm')`
     margin: 30px 0 0;
  `}
`;

const JournalEntryHeader = styled.div`
  display: flex;
  align-items: center;
  > * {
    &:first-child {
      margin-right: 19px;
    }
  }
  margin-bottom: 15px;
`;

const JournalEntryText = styled.span`
  font-family: Roboto;
  font-size: 14px;
  line-height: 16px;
  color: #2a3037;
`;

const HelpIcon = styled.img`
  cursor: pointer;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  ${({ theme }) => theme.max('sm')`
    & > button {
      width: 100%;
      margin-top: 20px;
    }
  `}
`;

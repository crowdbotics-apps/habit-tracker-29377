import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import moment from 'moment';
import Alert from 'react-bootstrap/Alert';

import closeIcon from '../AddScoreDialog/assets/closeIcon.png';
import helpIcon from '../AddScoreDialog/assets/helpIcon.png';
import editIcon from './assets/editIcon.png';
import disableEditIcon from './assets/disableEditIcon.png';
import Button from '../Button';
import DayAndDate from '../DayAndDate';
import CategoryPickerSlider from './CategoryPickerSlider';
import ScorePicker from '../ScorePicker';
import { getAreaIcon, getDateOfSelectedWeek } from '../../utils/utility';
import { addScore, editScore } from '../../modules/actions/DashboardActions';
import CongratulationsDialog from '../CongratulationsDialog';

const CommonAddScoreDialog = ({ show, handleClose }) => {
  const dispatch = useDispatch();

  const {
    areasList: { data: areasData },
    selectedWeek,
    addScore: { success, error },
    editScore: { success: editScoreSuccess, error: editScoreError },
  } = useSelector(({ dashboard }) => dashboard);

  const [navigationIndex, setNavigationIndex] = useState(0);
  const [selectedAreaId, setSelectedAreaId] = useState('');
  const [selectedArea, setSelectedArea] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [showCongratulationsDialog, setShowCongratulationsDialog] =
    useState(false);

  const showCongratulationsDialogOpen = () =>
    setShowCongratulationsDialog(true);

  const showCongratulationsDialogClose = () =>
    setShowCongratulationsDialog(false);
  const areaDisplayData = areasData.map((item) => {
    const {
      id,
      area: { name, code },
      categories,
    } = item;
    return {
      key: id,
      id: id,
      icon: getAreaIcon(code),
      name: `${name} (${categories.length})`,
    };
  });

  useEffect(() => {
    if (success || editScoreSuccess) {
      setNextCategory();
    }
  }, [success, editScoreSuccess]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const area = areasData[navigationIndex];
    setSelectedAreaId(area?.id);
    setSelectedArea(area);
    setSelectedCategory(0);
  }, [areaDisplayData.length, navigationIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleEditCategoryClick = (categoryIndex) => () => {
    setSelectedCategory(categoryIndex);
  };

  const getCurrentDayScore = (scores) => {
    if (!scores || !scores.length) {
      return {};
    }
    return scores.find((score) => {
      const currentDate = new Date();
      const scoreDate = new Date(score.date_time);
      return (
        currentDate.getDate() === scoreDate.getDate() &&
        currentDate.getMonth() === scoreDate.getMonth() &&
        currentDate.getFullYear() === scoreDate.getFullYear()
      );
    });
  };

  const handleChange = (value, change = '') => {
    const editableCategory = selectedArea.categories[selectedCategory];
    let newScore = getCurrentDayScore(editableCategory.scores) || {};
    if (change === 'journal') {
      newScore = { ...newScore, journal: value };
    } else {
      newScore = { ...newScore, value };
    }
    if (!newScore.date_time) {
      newScore.date_time = new Date();
    }
    editableCategory.scores[0] = newScore;
    const categories = selectedArea.categories.map((c) => {
      return c.id === editableCategory.id ? editableCategory : { ...c };
    });
    setSelectedArea((prev) => ({ ...prev, categories }));
  };

  const handleJournalChange = ({ target: { value } }) => {
    handleChange(value, 'journal');
  };

  const setNextCategory = () => {
    const isLast = selectedArea.categories.length
      ? selectedArea.categories.length - 1 === selectedCategory
      : true;
    if (!isLast) {
      setSelectedCategory(selectedCategory + 1);
    } else {
      if (navigationIndex === areasData.length - 1) {
        showCongratulationsDialogOpen();
      } else {
        setNavigationIndex(navigationIndex + 1);
      }
    }
  };

  const handleAddScoreClick = () => {
    const category = selectedArea.categories[selectedCategory];
    if (!category) {
      return setNextCategory();
    }
    const score = category.scores[0];
    if (score) {
      if (score.id && score.value !== '-') {
        let item = {
          body: {
            id: score.id,
            value: score.value,
            journal: score.journal,
            area: category.area.id,
            category: +category.id,
          },
          type: null,
        };
        dispatch(editScore(item));
      } else {
        const date = getDateOfSelectedWeek(
          selectedWeek,
          moment(new Date()).format('ddd').toLowerCase(),
        );
        const currentDate = new Date();
        let selectedDate = new Date(date).setHours(currentDate.getHours());
        selectedDate = new Date(selectedDate).setMinutes(
          currentDate.getMinutes(),
        );
        let item = {
          body: {
            category: category.id,
            value: score.value,
            journal: score.journal,
            date_time: new Date(selectedDate).toISOString(),
            area: category.area.id,
          },
          type: null,
        };
        dispatch(addScore(item));
      }
    } else {
      return setNextCategory();
    }
  };

  const buttonStyles = {
    width: 'max-content',
    padding: '11px 34px',
    marginTop: '44px',
    background: '#789F08',
  };

  return (
    <StyledModal show={show} onHide={handleClose} dialogClassName="dialogClass">
      {showCongratulationsDialog && (
        <CongratulationsDialog
          show={showCongratulationsDialog}
          handleClose={showCongratulationsDialogClose}
        />
      )}
      <CommonAddScoreDialogWrapper>
        <Header>
          <CloseIcon src={closeIcon} alt="icon" onClick={handleClose} />
          <Text>Add score for</Text>
          <DayAndDate styles={{ margin: '10px 0 13px' }} />
          <CategoryPickerSlider
            areaDisplayData={areaDisplayData}
            selectedAreaId={selectedAreaId}
            setSelectedAreaId={setSelectedAreaId}
            setNavigationIndex={setNavigationIndex}
          />
        </Header>
        <Content>
          {(error || editScoreError) && (
            <Alert variant="danger">{error || editScoreError}</Alert>
          )}
          {!!selectedArea?.categories?.length ? (
            selectedArea?.categories?.map((c, index) => {
              return (
                <CategoryWrapper key={c.id}>
                  <ScorePickerWrapper>
                    <CategoryNameWrapper>
                      <div>
                        <div>
                          <CategoryText>{c.category.name}</CategoryText>
                          <HelpIcon src={helpIcon} alt="icon" />
                        </div>
                        <CategoryDescription>
                          {c.description}
                        </CategoryDescription>
                      </div>
                      <IconScoreWrapper>
                        <EditIcon
                          src={
                            selectedCategory === index
                              ? editIcon
                              : disableEditIcon
                          }
                          alt="icon"
                          onClick={handleEditCategoryClick(index)}
                        />

                        <Score>
                          {getCurrentDayScore(c.scores)?.value || '-'}
                        </Score>
                      </IconScoreWrapper>
                    </CategoryNameWrapper>
                    <ScorePicker
                      selectedScore={getCurrentDayScore(c.scores)?.value}
                      setSelectedScore={handleChange}
                      disabled={index !== selectedCategory}
                    />
                  </ScorePickerWrapper>
                  {selectedCategory === index && (
                    <JournalEntryWrapper>
                      <JournalEntryHeader>
                        <JournalEntryText>Journal entry</JournalEntryText>
                        <HelpIcon src={helpIcon} alt="icon" />
                      </JournalEntryHeader>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        value={c.scores[0]?.journal}
                        onChange={handleJournalChange}
                      />
                    </JournalEntryWrapper>
                  )}
                </CategoryWrapper>
              );
            })
          ) : (
            <Text>No Categories found.</Text>
          )}
          <ButtonWrapper>
            <Button onClick={handleAddScoreClick} styles={buttonStyles}>
              Next
            </Button>
          </ButtonWrapper>
        </Content>
      </CommonAddScoreDialogWrapper>
    </StyledModal>
  );
};

export default CommonAddScoreDialog;

const StyledModal = styled(Modal)`
  & .modal {
    padding-left: 0;
  }
  & .modal-content {
    border: none;
    border-radius: 10px;
  }
  & .dialogClass {
    max-width: 900px;
    margin: 78px auto;
    ${({ theme }) => theme.max('sm')`
      margin: 49px 10px;
    `}
  }
`;

const CommonAddScoreDialogWrapper = styled.div`
  background: ${({ theme }) => theme.palette.background.main};
  box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
`;

const Header = styled.div`
  padding: 20px 20px 23px;
  background: ${({ theme }) => theme.palette.common.white};
  box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px 10px 0px 0px;
`;

const CloseIcon = styled.img`
  float: right;
  cursor: pointer;
`;

const Text = styled.span`
  font-family: Roboto;
  font-size: 18px;
  line-height: 24px;
  color: ${({ theme }) => theme.palette.text.primary};
`;

const Content = styled.div`
  padding: 49px 30px 30px 26px;
  ${({ theme }) => theme.max('sm')`
    padding: 20px 10px 30px;
  `}
`;

const CategoryWrapper = styled.div`
  margin-top: 49px;
  &:first-child {
    margin-top: 0;
  }
  ${({ theme }) => theme.max('sm')`
      padding: 0 10px;
  `}
`;

const CategoryNameWrapper = styled.div`
  width: 80%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  ${({ theme }) => theme.max('sm')`
    width: 100%;
  `}
`;

const CategoryText = styled(Text)`
  margin-right: 13px;
  font-size: 14px;
  line-height: 16px;
  color: #2a3037;
`;

const CategoryDescription = styled(CategoryText)`
  color: #8e97a3;
`;

const EditIcon = styled.img`
  cursor: pointer;
  margin-top: 8px;
`;

const IconScoreWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  > * {
    &:first-child {
      margin-right: 19px;
    }
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  ${({ theme }) => theme.max('sm')`
    & > button {
      width: 100%;
    }
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
    flex-direction: column;
    > * {
    &:first-child {
      margin-bottom: 30px;
    }
  }
  `}
`;

const Score = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 42px;
  width: 42px;
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

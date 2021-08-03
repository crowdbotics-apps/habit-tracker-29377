import React, { useState, Fragment, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled, { css } from 'styled-components';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import moment from 'moment';

import AddIcon from '../AddIcon';
import DayAndDate from '../DayAndDate';
import AreaCategoryBadge from '../AreaCategoryBadge';
import {
  getDateOfSelectedWeek,
  getWeekDays,
  getWeekRange,
} from '../../utils/utility';
import Drawer from '../Drawer';
import Dropdown from 'react-bootstrap/Dropdown';
import DeleteModal from '../DeleteModal';
import ThreeDotsIcon from '../../assets/images/ThreeDotsIcon';
import AddNote from '../AddNew/AddNote';

const EditDeleteToggle = React.forwardRef(({ onClick }, ref) => (
  <div
    ref={ref}
    className="customDropdown"
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    <EditDeleteToggleWrapper>
      <ThreeDotsIcon color="#1689CA" />
    </EditDeleteToggleWrapper>
  </div>
));

const ActivityJournal = () => {
  const {
    getActivityJournal: { data: journalData = [], success },
    areasList: { data: areasData },
    selectedWeek,
  } = useSelector(({ dashboard }) => dashboard);

  const currentWeek = getWeekDays(getWeekRange(new Date()).from);
  const selectedWeekData = selectedWeek.length ? selectedWeek : currentWeek;

  const [openAddNoteModal, setOpenAddNoteModal] = useState(false);

  const [selectedJournalData, setSelectedJournalData] = useState({
    areaId: '',
    areaName: '',
    categoryId: '',
    categoryName: '',
    score: { scoreId: '', journal: '' },
  });

  const [openEditNoteModal, setOpenEditNoteModal] = useState(false);
  const toggleEditNoteModal = () => setOpenEditNoteModal((prev) => !prev);

  const [openDeleteNoteModal, setOpenDeleteNoteModal] = useState(false);
  const toggleDeleteNoteModal = () => setOpenDeleteNoteModal((prev) => !prev);

  const [data, setData] = useState(
    selectedWeekData.map((date, index) => ({
      id: index + 1,
      isExpanded: false,
      date,
      activities: [],
    })),
  );

  const [selectedDatesArea, setSelectedDatesAreas] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    setData(
      selectedWeekData.map((date, index) => ({
        id: index + 1,
        isExpanded: false,
        date,
        activities: getJournalData(moment(date).format('ddd').toLowerCase()),
      })),
    );
  }, [journalData?.length, success]);

  const addActivityJournalDialogOpen = (date) => () => {
    setSelectedDate(date);
    const journalDate = moment(date).format('YYYY-MM-DD');
    const selectedDatesAreas = areasData.map((area) => ({
      ...area,
      categories: area.categories.map((c) => ({
        ...c,
        scores: c.scores?.filter(
          (score) =>
            moment(score.date_time).format('YYYY-MM-DD') === journalDate,
        ),
      })),
    }));
    setSelectedDatesAreas(selectedDatesAreas);
    setOpenAddNoteModal(true);
  };

  const toggleAddNoteModal = () => setOpenAddNoteModal(false);

  const getJournalData = (day) => {
    const journals = journalData.map((journal) => ({
      ...journal,
      date_time: moment(journal.date_time).format('YYYY-MM-DD'),
    }));
    const specificDay = getDateOfSelectedWeek(selectedWeekData, day);
    return journals.filter((journal) => journal.date_time === specificDay);
  };

  const handleActivityToggle = (id) => () => {
    const active = data.find((d) => d.id === id);
    const index = data.findIndex((d) => d.id === id);
    if (active.activities.length) {
      active.isExpanded = !active.isExpanded;
      const newData = [...data];
      newData.splice(index, 1, active);
      setData(newData);
    }
  };

  const handleDropdown = (type) => () => {
    if (type === 'editNote') {
      toggleEditNoteModal();
    } else {
      toggleDeleteNoteModal();
    }
  };

  return (
    <MainWrapper>
      <MainText>Activity Journal</MainText>
      <ActivityJournalWrapper>
        {data.map((journal, i) => {
          let isCollapse = journal.activities.filter((i) => i.journal)?.length;
          const isToday =
            moment(journal.date).format('YYYY-MM-DD') ===
            moment(new Date()).format('YYYY-MM-DD');
          return (
            <StyledAccordion key={journal.id}>
              <Card>
                <ActivityDateWrapper>
                  <Accordion.Toggle
                    as={Button}
                    eventKey={isCollapse && journal.id}
                    onClick={isCollapse && handleActivityToggle(journal.id)}
                  >
                    <DayAndDate date={journal.date} isToday={isToday} />
                  </Accordion.Toggle>
                  <div className="ml-3">
                    <AddIcon
                      onClick={addActivityJournalDialogOpen(journal.date)}
                    />
                  </div>
                </ActivityDateWrapper>

                {/* <Separator
                  hidden={journal.isExpanded || i === data.length - 1}
                /> */}

                <ActivityData>
                  <Fragment>
                    <ContentWrapper>
                      <NameIconWrapper>
                        <AreaCategoryBadge areaId={2} categoryId={12} />
                        <StyledDropdown>
                          <Dropdown.Toggle
                            as={EditDeleteToggle}
                            id="dropdown-basic"
                          />
                          <Dropdown.Menu>
                            <StyledDropdownItem
                              onClick={handleDropdown('editNote')}
                            >
                              Edit note
                            </StyledDropdownItem>
                            <StyledDropdownItem
                              onClick={handleDropdown('deleteNote')}
                            >
                              Delete note
                            </StyledDropdownItem>
                          </Dropdown.Menu>
                        </StyledDropdown>
                      </NameIconWrapper>
                      <ActivityText>
                        I should make sure I have more time to #work on tasks
                        and talk to my #Manager about it.
                      </ActivityText>
                    </ContentWrapper>
                  </Fragment>
                </ActivityData>

                {!!journal.activities?.length && (
                  <Accordion.Collapse eventKey={journal.id}>
                    <ActivityData>
                      {journal.activities.map((activity) => (
                        <Fragment key={activity.id}>
                          {activity.journal && (
                            <ContentWrapper>
                              <AreaCategoryBadge
                                areaId={activity.category.area.id}
                                categoryId={activity.category.id + ''}
                              />
                              <ActivityText>{activity.journal}</ActivityText>
                            </ContentWrapper>
                          )}
                        </Fragment>
                      ))}
                    </ActivityData>
                  </Accordion.Collapse>
                )}
              </Card>
            </StyledAccordion>
          );
        })}
      </ActivityJournalWrapper>
      {/*{openAddNoteModal && (*/}
      {/*  <AddActivityJournalDialog*/}
      {/*    show={openAddNoteModal}*/}
      {/*    handleClose={toggleAddNoteModal}*/}
      {/*    showJournal*/}
      {/*    selectedDate={selectedDate}*/}
      {/*    selectedDatesArea={selectedDatesArea}*/}
      {/*    journalData={selectedJournalData}*/}
      {/*    setJournalData={setSelectedJournalData}*/}
      {/*  />*/}
      {/*)}*/}
      {openAddNoteModal && (
        <Drawer
          open={openAddNoteModal}
          onClose={toggleAddNoteModal}
          header="Add new note"
          subHeader="(June 7)"
        >
          <AddNote onClose={toggleAddNoteModal} />
        </Drawer>
      )}
      {openEditNoteModal && (
        <Drawer
          open={openEditNoteModal}
          onClose={toggleEditNoteModal}
          header="Edit habit note"
          subHeader="(June 7)"
        >
          <AddNote onClose={toggleEditNoteModal} />
        </Drawer>
      )}
      {openDeleteNoteModal && (
        <DeleteModal
          show={openDeleteNoteModal}
          onHide={toggleDeleteNoteModal}
          title="Delete note"
          buttonText="Delete Note"
          message="Are you sure you want to delete this note?"
          subMessage="The entered note will be lost."
        />
      )}
    </MainWrapper>
  );
};

export default ActivityJournal;

const StyledDropdown = styled(Dropdown)`
  & > .customDropdown {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #1689ca;
  }
  & .dropdown-menu {
    min-width: max-content;
    // height: 116px;
    padding: 4px 0;
    border: 1px solid ${({ theme }) => theme.palette.text.secondaryLight};
    box-sizing: border-box;
    box-shadow: 0px 2px 20px rgba(27, 42, 61, 0.04);
    border-radius: 4px;
  }
`;
const StyledDropdownItem = styled(Dropdown.Item)`
  font-family: Roboto;
  font-size: 14px;
  line-height: 20px;
  padding: 8px 12px;
  color: ${({ theme }) => theme.palette.text.primary};
`;

const MainWrapper = styled.div`
  width: 100%;
  padding: 24px;
  background: ${({ theme }) => theme.palette.common.white};
  border-radius: 12px;
  ${({ theme }) => theme.max('sm')`
    padding: 12px;
  `}
`;

const Text = styled.div`
  font-family: Roboto;
  font-size: 18px;
  line-height: 21px;
  color: ${({ theme }) => theme.palette.text.primary};
`;

const MainText = styled(Text)`
  margin-bottom: 30px;
`;

const ActivityJournalWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const ActivityDateWrapper = styled.div`
  display: flex;
  align-items: center;
  & > .btn-primary {
    padding: 0;
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
  }
`;

const Separator = styled.div`
  height: 20px;
  margin: 6px 0 4px 14px;
  border-left: 1px solid ${({ theme }) => theme.palette.text.secondaryLight};
  ${({ hidden }) =>
    hidden &&
    css`
      display: none;
    `}
`;

const ActivityData = styled.div`
  margin: 2px 0 0px 14px;
  border-left: 1px solid ${({ theme }) => theme.palette.text.secondaryLight};
`;

const ContentWrapper = styled.div`
  padding: 20px 0 0px 28px;
  &:last-child {
    padding: 20px 0 20px 28px;
  }
`;

const ActivityText = styled(Text)`
  font-size: 14px;
  line-height: 24px;
  margin: 4px 10px 0px 0;
`;

const StyledAccordion = styled(Accordion)`
  & .card {
    border: none;
    border-radius: 0;
  }
  & .card-header {
    display: flex;
    align-items: center;
    gap: 26px;
    cursor: pointer;
    padding: 0;
    border-bottom: none;
    background: ${({ theme }) => theme.palette.common.white};
  }
`;

const NameIconWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const EditDeleteToggleWrapper = styled.div`
  padding: 0 4px;
  cursor: pointer;
`;

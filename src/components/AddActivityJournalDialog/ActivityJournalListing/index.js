import React, { useState, useEffect, useContext } from 'react';
import styled, { css } from 'styled-components';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import AccordionContext from 'react-bootstrap/AccordionContext';
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';

import ArrowDown from '../../../assets/images/ArrowDown';
import { AreaDropDownList, newFormatData } from '../../../utils/constants';

const AreaToggle = ({ eventKey }) => {
  const currentEventKey = useContext(AccordionContext);
  const isCurrent = currentEventKey === eventKey;

  const decoratedOnClick = useAccordionToggle(eventKey);

  return (
    <StyledArrowDown
      isCurrent={isCurrent}
      color="#1B2A3D"
      onClick={decoratedOnClick}
    />
  );
};

const ActivityJournalListing = ({
  showJournal,
  handleClose,
  journalData,
  setJournalData,
  selectedDatesArea,
}) => {
  const [selectedArea, setSelectedArea] = useState([]);

  useEffect(() => {
    if (selectedDatesArea.length) {
      const areas = selectedDatesArea.map((area) => ({
        ...area,
        isCollapse: false,
        categories: area.categories.map((c) => ({ ...c, isEdit: false })),
      }));
      setSelectedArea(areas);
    }
  }, []);

  const onAreaItemClick = (areaId) => () => {
    const areas = selectedArea.map((area) => ({
      ...area,
      isCollapse: area.id === areaId ? !area.isCollapse : false,
    }));
    setSelectedArea(areas);
  };

  const handleJournalChange = ({ target: { value } }) => {
    setJournalData((prev) => ({
      ...prev,
      score: { ...prev.score, journal: value },
    }));
  };

  const selectSubJournalCategory = (areaId, categoryId) => () => {
    const area = selectedArea.find((area) => area.id === areaId);
    const areaIndex = selectedArea.findIndex((area) => area.id === areaId);
    const categories = area.categories.map((c) => ({
      ...c,
      isEdit: c.id === categoryId,
    }));
    const selectedCategory = categories.find((c) => c.id === categoryId);
    const editableCategory = categories.find((c) => c.isEdit);
    setJournalData((prev) => ({
      ...prev,
      score: {
        ...prev.score,
        scoreId: selectedCategory.scores.length
          ? selectedCategory.scores[0].id
          : '',
        journal: selectedCategory.scores.length
          ? selectedCategory.scores[0].journal
          : '',
      },
      areaId: area.id,
      areaName: area.area.name,
      categoryId: editableCategory.id,
      categoryName: editableCategory.category.name,
    }));
    const newData = [...selectedArea];
    newData.splice(areaIndex, 1, { ...area, categories });
    setSelectedArea(newData);
    if (!showJournal) handleClose();
  };

  // const data =
  // selectedArea?.length &&
  // selectedArea?.map((item, i) => {
  //   const {
  //     id,
  //     isCollapse,
  //     area: { name, code },
  //     categories,
  //   } = item;

  return (
    <>
      {newFormatData.map((item, i) => {
        return (
          <ActivityWrapper key={item.id}>
            <ActivityRow>
              <Card>
                <ActivityCol>
                  <Accordion.Toggle
                    as={Card.Header}
                    eventKey={item.id}
                    // onClick={onAreaItemClick(id)}
                  >
                    <ExpandedRow>
                      <NavIcon>
                        <AreaToggle eventKey={item.id} />
                      </NavIcon>
                      {/*{code && <ActivityIcon src={getAreaIcon(code)} alt="icon" />}*/}
                      <AreaText>{item.area}</AreaText>
                    </ExpandedRow>
                  </Accordion.Toggle>
                </ActivityCol>
                <Accordion.Collapse eventKey={item.id}>
                  <>
                    {item.categories.map((category, index) => {
                      return (
                        <Card.Body>
                          <Accordion key={item.id}>
                            <Accordion.Toggle
                              as={Card.Header}
                              variant="link"
                              eventKey={category.id}
                            >
                              <CategoryRow key={index}>
                                <NavIcon>
                                  <AreaToggle eventKey={category.id} />
                                </NavIcon>
                                <CategoryName
                                // onClick={selectSubJournalCategory(id, c.id)}
                                >
                                  {category.categoryName}
                                </CategoryName>
                              </CategoryRow>
                            </Accordion.Toggle>

                            <Accordion.Collapse eventKey={category.id}>
                              <>
                                {category.subCategories.map((subCategory) => {
                                  return (
                                    <Card.Body>
                                      <Accordion key={item.id}>
                                        <Accordion.Toggle
                                          as={Card.Header}
                                          variant="link"
                                          eventKey={subCategory.id}
                                        >
                                          <SubCategoryExpandRow>
                                            <NavIcon>
                                              <AreaToggle
                                                eventKey={subCategory.id}
                                              />
                                            </NavIcon>
                                            <SubCategoryName>
                                              {subCategory.subCategory}
                                            </SubCategoryName>
                                          </SubCategoryExpandRow>
                                        </Accordion.Toggle>
                                        <Accordion.Collapse
                                          eventKey={subCategory.id}
                                        >
                                          <>
                                            {subCategory.habits.map((habit) => {
                                              return (
                                                <HabitExpandRow>
                                                  <HabitName>
                                                    {habit.habit}
                                                  </HabitName>
                                                </HabitExpandRow>
                                              );
                                            })}
                                          </>
                                        </Accordion.Collapse>
                                      </Accordion>
                                    </Card.Body>
                                  );
                                })}
                              </>
                            </Accordion.Collapse>
                          </Accordion>
                        </Card.Body>
                      );
                    })}
                  </>
                </Accordion.Collapse>
              </Card>
            </ActivityRow>
          </ActivityWrapper>
        );
      })}
    </>
  );
};

export default ActivityJournalListing;

const StyledArrowDown = styled(ArrowDown)`
  cursor: pointer;
  transform: rotate(-90deg);
  ${({ isCurrent }) =>
    isCurrent &&
    css`
      transform: rotate(0);
    `}
`;

const ActivityWrapper = styled.div`
  ${({ theme }) => theme.max('md')`
    overflow-x: auto;
    -ms-overflow-style: none; 
    scrollbar-width: none; 
    &::-webkit-scrollbar {
      display: none;
    }
  `}
`;
const AreaText = styled.span`
  font-family: Roboto;
  font-size: 16px;
  line-height: 20px;
  ${({ color }) =>
    color &&
    css`
      color: ${color};
    `}
`;
const ActivityRow = styled(Accordion)`
  background: ${({ theme }) => theme.palette.primary.contrastText};
  & .card {
    border: 0;
    border-radius: 0;
  }
  & .card-body {
    padding: 0;
    min-height: 0;
  }
  & .card-header {
    background-color: white;
    border-color: white;
    padding: unset;
    // padding: 12px 16px;
  }
`;

const ActivityCol = styled.div`
  position: relative;
  cursor: pointer;
  text-align: left;
  border: 0;
  &:before {
    content: '';
    position: absolute;
    width: 4px;
    height: 100%;
    background-color: ${({ color }) => color};
    top: 0;
    left: 0;
    border-radius: 5px;
  }
`;
const CategoryRow = styled.div`
  padding: 6px 32px;
  display: flex;
  align-items: center;
`;
const NavIcon = styled.span`
  padding-right: 8px;
`;

const ExpandedRow = styled.div`
  padding: 8px 16px;
  display: flex;
  align-items: center;
  > * {
    &:nth-child(1) {
      padding-top: 0px;
    }
  }
`;
const SubCategoryExpandRow = styled.div`
  display: flex;
  align-items: center;
  padding: 6px 50px;
`;
const HabitExpandRow = styled.div`
  display: flex;
  align-items: center;
  padding: 6px 16px 6px 82px;
`;
const CategoryName = styled.div`
  cursor: pointer;
  color: ${({ theme }) => theme.palette.text.primary};
  font-size: 14px;
  line-height: 20px;
  font-family: Roboto;
`;
const SubCategoryName = styled.div`
  cursor: pointer;
  font-size: 14px;
  line-height: 20px;
  font-family: Roboto;
`;
const HabitName = styled.div`
  cursor: pointer;
  font-size: 14px;
  line-height: 20px;
  font-family: Roboto;
`;

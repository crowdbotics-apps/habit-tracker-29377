import React, { useContext } from 'react';
import styled, { css } from 'styled-components';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import AccordionContext from 'react-bootstrap/AccordionContext';
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import {
  addbuttonStyles,
  cancelButtonStyles,
  newFormatData,
} from '../../utils/constants';
import ButtonComponent from '../Button';
import DownArrowIcon from '../DashboardHeader/assets/downArrowIcon';

const AreaToggle = ({ eventKey }) => {
  const currentEventKey = useContext(AccordionContext);
  const isCurrent = currentEventKey === eventKey;

  const decoratedOnClick = useAccordionToggle(eventKey);

  return <StyledArrowDown isCurrent={isCurrent} onClick={decoratedOnClick} />;
};

const AddNote = ({ onClose }) => {
  return (
    <FormWrapper>
      <StyledForm>
        <Form.Group as={Row} controlId="location">
          <Form.Label column sm="4" className="input-text-label">
            Location
          </Form.Label>
          <Col sm="8">
            <Form.Control type="text" placeholder="Enter location" />
            {/* {newFormatData.map((item, i) => {
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
                            <Text>{item.area}</Text>
                            <NavIcon>
                              <AreaToggle eventKey={item.id} />
                            </NavIcon>
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
                                      <Text>{category.categoryName}</Text>
                                      <NavIcon>
                                        <AreaToggle eventKey={category.id} />
                                      </NavIcon>
                                    </CategoryRow>
                                  </Accordion.Toggle>

                                  <Accordion.Collapse eventKey={category.id}>
                                    <>
                                      {category.subCategories.map(
                                        (subCategory) => {
                                          return (
                                            <Card.Body>
                                              <Accordion key={item.id}>
                                                <Accordion.Toggle
                                                  as={Card.Header}
                                                  variant="link"
                                                  eventKey={subCategory.id}
                                                >
                                                  <SubCategoryExpandRow>
                                                    <Text>
                                                      {subCategory.subCategory}
                                                    </Text>
                                                    <NavIcon>
                                                      <AreaToggle
                                                        eventKey={
                                                          subCategory.id
                                                        }
                                                      />
                                                    </NavIcon>
                                                  </SubCategoryExpandRow>
                                                </Accordion.Toggle>
                                                <Accordion.Collapse
                                                  eventKey={subCategory.id}
                                                >
                                                  <>
                                                    {subCategory.habits.map(
                                                      (habit) => {
                                                        return (
                                                          <HabitExpandRow>
                                                            <Text>
                                                              {habit.habit}
                                                            </Text>
                                                          </HabitExpandRow>
                                                        );
                                                      },
                                                    )}
                                                  </>
                                                </Accordion.Collapse>
                                              </Accordion>
                                            </Card.Body>
                                          );
                                        },
                                      )}
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
            })} */}
          </Col>
        </Form.Group>
        <Form.Group as={Row} controlId="note">
          <Form.Label column sm="4" className="input-text-label">
            Note
          </Form.Label>
          <Col sm="8">
            <Form.Control as="textarea" rows={3} placeholder="Enter note" />
          </Col>
        </Form.Group>
      </StyledForm>
      <Footer>
        <ButtonComponent styles={cancelButtonStyles} onClick={onClose}>
          Cancel
        </ButtonComponent>
        <ButtonComponent styles={addbuttonStyles}>Add</ButtonComponent>
      </Footer>
    </FormWrapper>
  );
};

export default AddNote;

const FormWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const StyledForm = styled.form`
  padding: 20px;
  height: 100%;
  overflow-y: auto;
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 20px;
  border-top: 1px solid ${({ theme }) => theme.palette.text.secondaryLight};
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

const Text = styled.span`
  font-family: Roboto;
  font-size: 14px;
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
    padding: 0;
  }
`;

const ActivityCol = styled.div`
  position: relative;
  cursor: pointer;
  text-align: left;
  border: 0;
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

const StyledArrowDown = styled(DownArrowIcon)`
  cursor: pointer;
  margin-left: 9px;
  transform: rotate(-90deg);
  ${({ isCurrent }) =>
    isCurrent &&
    css`
      transform: rotate(0);
    `}
`;

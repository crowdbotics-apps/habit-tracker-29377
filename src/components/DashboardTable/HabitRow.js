import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import Dropdown from 'react-bootstrap/Dropdown';
import { useDrag, useDrop } from 'react-dnd';

import Badge from '../Badge';
import RoundedProgress from '../RoundedProgress';
import ThreeDotsIcon from '../../assets/images/ThreeDotsIcon';
import WeightDragIcon from '../WeightDragIcon';
import DeleteModal from '../DeleteModal';
import Drawer from '../Drawer';
import AddHabit from '../AddNew/AddHabbit';

const CustomDropdownToggle = React.forwardRef(({ onClick }, ref) => (
  <div
    ref={ref}
    className="customDropdown"
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    <div className="px-2">
      <ThreeDotsIcon />
    </div>
  </div>
));

const HabitRow = ({
  userHabit,
  subcategoryId,
  index,
  moveHabitRow,
  setHabitWeightUpdate,
}) => {
  const { id, custom_habit_name, weight } = userHabit;

  const dropRef = useRef(null);
  const dragRef = useRef(null);
  const DND_ITEM_TYPE = `HABIT-${subcategoryId}`;

  const [openEditHabitModal, setOpenEditHabitModal] = useState(false);
  const [openDeleteHabitModal, setOpenDeleteHabitModal] = useState(false);

  const toggleEditHabitModal = () => setOpenEditHabitModal((prev) => !prev);
  const toggleDeleteHabitModal = () => setOpenDeleteHabitModal((prev) => !prev);

  const [, drop] = useDrop({
    accept: DND_ITEM_TYPE,
    drop() {
      setHabitWeightUpdate(true);
    },
    hover(item, monitor) {
      if (!dropRef.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      const hoverBoundingRect = dropRef.current?.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      moveHabitRow(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag, preview] = useDrag({
    type: DND_ITEM_TYPE,
    item: () => {
      return { id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  preview(drop(dropRef));
  drag(dragRef);

  return (
    <>
      {openEditHabitModal && (
        <Drawer
          open={openEditHabitModal}
          onClose={toggleEditHabitModal}
          header="Edit habit"
        >
          <AddHabit onClose={toggleEditHabitModal} />
        </Drawer>
      )}
      {openDeleteHabitModal && (
        <DeleteModal
          show={openDeleteHabitModal}
          onHide={toggleDeleteHabitModal}
          title="Delete habit"
          message="Are you sure you want to delete this habit?"
          subMessage="The entered data will be lost."
          buttonText="Delete Habit"
        />
      )}
      <Habit ref={dropRef} style={{ opacity: isDragging ? 0 : 1 }}>
        <HabitWeightWrapper>
          <div ref={dragRef}>
            <WeightDragIcon weight={weight} activeBorder />
          </div>
          <div className="d-flex flex-wrap">
            <ItemName>{custom_habit_name}</ItemName>
            <div className="ml-1">
              {id > 0 ? (
                <Badge
                  text="Build"
                  bgColor="#EDFBEF"
                  color="#03AD14"
                  largeText
                />
              ) : (
                <Badge
                  text="Quit"
                  bgColor="#FEEDED"
                  color="#F00000"
                  largeText
                />
              )}
            </div>
          </div>
        </HabitWeightWrapper>
        <ScoresDotsWrapper>
          <ScoresWrapper>
            {[1, 2, 3, 4, 5, 6, 7].map((d, i) => (
              <DayScoreWrapper>
                <DayScore key={i}>
                  <Score>{d}</Score>
                </DayScore>
              </DayScoreWrapper>
            ))}
            <ProgressWrapper>
              <RoundedProgress
                strokeWidth={4}
                innerStrokeWidth={4}
                progress={50}
                label={'50%'}
              />
            </ProgressWrapper>
          </ScoresWrapper>
        </ScoresDotsWrapper>
        <StyledDropdown>
          <Dropdown.Toggle as={CustomDropdownToggle} id="dropdown-basic" />
          <Dropdown.Menu>
            <StyledDropdownItem onClick={toggleEditHabitModal}>
              Edit
            </StyledDropdownItem>
            <StyledDropdownItem onClick={toggleDeleteHabitModal}>
              Delete
            </StyledDropdownItem>
          </Dropdown.Menu>
        </StyledDropdown>
      </Habit>
    </>
  );
};

export default HabitRow;

const HabitWeightWrapper = styled.div`
  width: 37%;
  display: flex;
  align-items: center;
`;

const Habit = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 10px 12px 12px;
  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.palette.text.secondaryLight};
  }
`;

const Text = styled.span`
  font-family: Roboto;
  font-size: 14px;
  line-height: 20px;
  color: ${({ theme }) => theme.palette.text.primary};
`;

const ItemName = styled(Text)`
  margin: 0 4px 0 8px;
`;

const ScoresDotsWrapper = styled.div`
  width: 62.5%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ScoresWrapper = styled.div`
  display: flex;
  /* justify-content: space-between; */
  width: 100%;
  /* margin-right: 1rem; */
`;

const ProgressWrapper = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
  width: 16%;
`;

const DayScoreWrapper = styled.div`
  width: 12%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DayScore = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 36px;
  height: 36px;
  background: #ffffff;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid ${({ theme }) => theme.palette.text.secondaryLight};
  &:hover {
    box-shadow: 0px 0px 0px 4px #f3f3f3;
  }
`;

const Score = styled(Text)`
  color: ${({ theme }) => theme.palette.text.primary};
`;

const StyledDropdown = styled(Dropdown)`
  & > .customDropdown {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #1689ca;
    cursor: pointer;
    &:hover {
      color: #1689ca;
      text-decoration: underline;
    }
  }
  & .dropdown-menu {
    min-width: 115px;
    box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.05);
    border-radius: 10px;
    border: none;
  }
`;

const StyledDropdownItem = styled(Dropdown.Item)`
  padding: 10px 12px;
  font-family: Roboto;
  font-size: 12px;
  line-height: 14px;
  color: #313b4c;
  &:focus {
    color: ${({ theme }) => theme.palette.common.white} !important;
    background-color: ${({ theme }) => theme.palette.primary.main};
  }
`;

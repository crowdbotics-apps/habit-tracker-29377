import React, {
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
} from 'react';
import styled, { css } from 'styled-components';
import Accordion from 'react-bootstrap/Accordion';
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';
import AccordionContext from 'react-bootstrap/AccordionContext';
import { useDrag, useDrop } from 'react-dnd';
import update from 'immutability-helper';

import Badge from '../Badge';
import Drawer from '../Drawer';
import AddHabit from '../AddNew/AddHabbit';
import RoundedProgress from '../RoundedProgress';
import CategoryRow from './CategoryRow';
import AddNewItemButton from '../AddNewItemButton';
import WeightDragIcon from '../WeightDragIcon';
import ArrowDown from '../../assets/images/ArrowDown';
import HealthIcon from '../../assets/images/areas/HealthIcon';
import { getStartEndDatesV2 } from '../../utils/utility';
import { changeWeight } from '../../modules/actions/DashboardActions';
import { useDispatch, useSelector } from 'react-redux';

const AreaToggle = ({ eventKey }) => {
  const currentEventKey = useContext(AccordionContext);
  const isCurrent = currentEventKey === eventKey;

  const decoratedOnClick = useAccordionToggle(eventKey);

  return (
    <StyledArrowDown
      isCurrent={isCurrent}
      color="#1689CA"
      onClick={decoratedOnClick}
    />
  );
};

const AreaRow = ({ index, area, moveAreaRow, setWeightUpdate }) => {
  const {
    id,
    weight,
    system_area_name: { name: areaName },
    userCategories: userCategoriesData,
  } = area;

  const dispatch = useDispatch();

  const dropRef = useRef(null);
  const dragRef = useRef(null);
  const DND_ITEM_TYPE = 'AREA';

  const [userCategories, setUserCategories] = useState(userCategoriesData);
  const [categoryWeightUpdate, setCategoryWeightUpdate] = useState(false);
  const [openAddNewHabitModal, setOpenAddNewHabitModal] = useState(false);
  const toggleAddNewHabitModal = () => setOpenAddNewHabitModal((prev) => !prev);

  const { selectedWeek } = useSelector(({ dashboard }) => dashboard);

  useEffect(() => {
    if (categoryWeightUpdate) {
      const updatedWeights = userCategories.map((record) => ({
        id: record.customcategory,
        weight: record.weight,
      }));

      const dates = getStartEndDatesV2(selectedWeek[0], selectedWeek[6]);
      const payload = {
        type: 'category',
        start_date: dates.start,
        end_date: dates.end,
        weights: updatedWeights,
      };

      dispatch(changeWeight(payload));
      setCategoryWeightUpdate(false);
    }
  }, [categoryWeightUpdate]); // eslint-disable-line react-hooks/exhaustive-deps

  const [, drop] = useDrop({
    accept: DND_ITEM_TYPE,
    drop(...params) {
      setWeightUpdate(true);
    },
    hover(item, monitor) {
      if (!dropRef.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = dropRef.current?.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      // Time to actually perform the action
      moveAreaRow(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
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

  const moveCategoryRow = useCallback(
    (dragIndex, hoverIndex) => {
      const dragCard = userCategories[dragIndex];
      let weights = userCategories.map((cat) => cat.weight);
      weights = weights.sort((a, b) => b - a);
      let newCategories = update(userCategories, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragCard],
        ],
      });
      newCategories = newCategories.map((category, index) => {
        category.weight = weights[index];
        return category;
      });
      setUserCategories(newCategories);
    },
    [userCategories],
  );

  useEffect(() => {
    setUserCategories(userCategoriesData);
  }, [userCategoriesData]);

  return (
    <>
      {openAddNewHabitModal && (
        <Drawer
          open={openAddNewHabitModal}
          onClose={toggleAddNewHabitModal}
          header="Add new habit"
        >
          <AddHabit onClose={toggleAddNewHabitModal} areaId={id} />
        </Drawer>
      )}
      <Accordion defaultActiveKey={id} key={id}>
        <AreaRowWrapper ref={dropRef} style={{ opacity: isDragging ? 0 : 1 }}>
          <AreaHeader>
            <StyledHealthIcon />
            <div className="d-flex align-items-center">
              <AreaToggle eventKey={id} />
              <div ref={dragRef}>
                <WeightDragIcon weight={weight} withoutBorder />
              </div>
              <AreaName>{areaName}</AreaName>
              <Badge text="Area" />
              <div className="add-button">
                <AddNewItemButton
                  buttonText="Add New Habit"
                  onClick={toggleAddNewHabitModal}
                />
              </div>
            </div>
            <ProgressbarsWrapper>
              {[1, 2, 3, 4, 5, 6, 7].map((date, i) => (
                <ProgressWrapper key={i}>
                  <RoundedProgress progress={50} label={'50%'} />
                </ProgressWrapper>
              ))}
              <ProgressWrapper>
                <RoundedProgress
                  strokeWidth={4}
                  innerStrokeWidth={4}
                  progress={50}
                  label={'50%'}
                />
              </ProgressWrapper>
            </ProgressbarsWrapper>
          </AreaHeader>
          <Accordion.Collapse eventKey={id}>
            <AreaBody>
              {!!userCategories.length &&
                userCategories.map((category, categoryIndex) => {
                  return (
                    <CategoryRow
                      key={category.id}
                      areaId={id}
                      category={category}
                      index={categoryIndex}
                      moveCategoryRow={moveCategoryRow}
                      setCategoryWeightUpdate={setCategoryWeightUpdate}
                    />
                  );
                })}
            </AreaBody>
          </Accordion.Collapse>
        </AreaRowWrapper>
      </Accordion>
    </>
  );
};

export default AreaRow;

const AreaRowWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 8px;
  border-radius: 2px;
  background-color: ${({ theme }) => theme.palette.common.white};
  position: relative;
  &:before {
    content: '';
    position: absolute;
    width: 2px;
    height: 100%;
    background-color: #2e99e7;
    left: 0;
    top: 0;
    border-radius: 2px 0 0 2px;
    ${({ isExpanded }) =>
      isExpanded &&
      css`
        border-radius: 2px 0 0 0;
      `}
  }
`;

const StyledArrowDown = styled(ArrowDown)`
  cursor: pointer;
  transform: rotate(-90deg);
  ${({ isCurrent }) =>
    isCurrent &&
    css`
      transform: rotate(0);
    `}
`;

const Text = styled.span`
  font-family: Roboto;
  font-size: 18px;
  line-height: 20px;
  color: ${({ theme }) => theme.palette.text.primary};
`;

const AreaHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 4rem 12px 23px;
  .add-button {
    display: none;
    margin-left: 18px;
  }
  &:hover {
    .add-button {
      display: block;
    }
  }
  ${({ theme }) => theme.max('sm')`
    padding: 8px 4rem 8px 8px;
  `}
`;

const StyledHealthIcon = styled(HealthIcon)`
  position: absolute;
  left: -13px;
  ${({ theme }) => theme.max('sm')`
    display: none;
  `}
`;

const AreaName = styled(Text)`
  margin-right: 4px;
`;

const ProgressbarsWrapper = styled.div`
  display: flex;
  width: 45%;
`;

const ProgressWrapper = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
  width: 12%;
  &:last-child {
    width: 16%;
  }
`;

const AreaBody = styled.div``;

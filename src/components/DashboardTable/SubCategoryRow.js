import React, { useState, useRef, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { useDrag, useDrop } from 'react-dnd';
import update from 'immutability-helper';

import Badge from '../Badge';
import AddIcon from '../AddIcon';
import WeightDragIcon from '../WeightDragIcon';
import Drawer from '../Drawer';
import AddHabit from '../AddNew/AddHabbit';
import HabitRow from './HabitRow';
import { getStartEndDatesV2 } from '../../utils/utility';
import { changeWeight } from '../../modules/actions/DashboardActions';
import { useDispatch, useSelector } from 'react-redux';

const SubCategoryRow = ({
  subcategory,
  categoryId,
  index,
  moveSubcategoryRow,
  areaId,
  setSubCategoryWeightUpdate,
}) => {
  const {
    id,
    custom_subcategory_name,
    userHabits: userHabitsData,
    weight,
  } = subcategory;

  const dispatch = useDispatch();

  const dropRef = useRef(null);
  const dragRef = useRef(null);
  const DND_ITEM_TYPE = `SUB_CATEGORY-${categoryId}`;

  const [userHabits, setUserHabits] = useState(userHabitsData);
  const [openAddHabitModal, setOpenAddHabitModal] = useState(false);
  const [HabitWeightUpdate, setHabitWeightUpdate] = useState(false);

  const { selectedWeek } = useSelector(({ dashboard }) => dashboard);

  useEffect(() => {
    setUserHabits(userHabitsData);
  }, [userHabitsData]);

  useEffect(() => {
    if (HabitWeightUpdate) {
      const updatedWeights = userHabits.map((record) => ({
        id: record.user_habit,
        weight: record.weight,
      }));

      const dates = getStartEndDatesV2(selectedWeek[0], selectedWeek[6]);
      const payload = {
        type: 'habit',
        start_date: dates.start,
        end_date: dates.end,
        weights: updatedWeights,
      };

      dispatch(changeWeight(payload));
      setHabitWeightUpdate(false);
    }
  }, [HabitWeightUpdate]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleAddHabitModal = () => setOpenAddHabitModal((prev) => !prev);

  const [, drop] = useDrop({
    accept: DND_ITEM_TYPE,
    drop() {
      setSubCategoryWeightUpdate(true);
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
      moveSubcategoryRow(dragIndex, hoverIndex);
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

  const moveHabitRow = useCallback(
    (dragIndex, hoverIndex) => {
      const dragCard = userHabits[dragIndex];

      let weights = userHabits.map((habit) => habit.weight);
      weights = weights.sort((a, b) => b - a);
      let newHabits = update(userHabits, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragCard],
        ],
      });
      newHabits = newHabits.map((category, index) => {
        category.weight = weights[index];
        return category;
      });

      setUserHabits(newHabits);
    },
    [userHabits],
  );

  return (
    <>
      {openAddHabitModal && (
        <Drawer
          open={openAddHabitModal}
          onClose={toggleAddHabitModal}
          header="Add new habit"
        >
          <AddHabit
            onClose={toggleAddHabitModal}
            areaId={areaId}
            categoryId={categoryId}
            subCategoryId={id}
          />
        </Drawer>
      )}
      <SubCategoryRowWrapper
        ref={dropRef}
        style={{ opacity: isDragging ? 0 : 1 }}
      >
        <SubCategory>
          <div className="d-flex align-items-center">
            <div ref={dragRef}>
              <WeightDragIcon weight={weight} />
            </div>
            <div className="d-flex flex-wrap">
              <ItemName>{custom_subcategory_name}</ItemName>
              <div className="ml-1">
                <Badge text="Subcategory" />
              </div>
            </div>
          </div>
          <div className="add-button">
            <AddIcon onClick={toggleAddHabitModal} />
          </div>
        </SubCategory>
        <HabitWrapper>
          {!!userHabits.length &&
            userHabits.map((userHabit, userHabitIndex) => (
              <HabitRow
                key={userHabit.id}
                subcategoryId={userHabit.parent_subcategory}
                index={userHabitIndex}
                userHabit={userHabit}
                moveHabitRow={moveHabitRow}
                setHabitWeightUpdate={setHabitWeightUpdate}
              />
            ))}
        </HabitWrapper>
      </SubCategoryRowWrapper>
    </>
  );
};

export default SubCategoryRow;

const SubCategoryRowWrapper = styled.div`
  display: flex;
  align-items: center;
  min-height: 60px;
  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.palette.text.secondaryLight};
  }
`;

const SubCategory = styled.div`
  width: 26%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px 0 32px;
  .add-button {
    display: none;
  }
  &:hover {
    .add-button {
      display: block;
    }
  }
  ${({ theme }) => theme.max('sm')`
    padding: 0 8px;
  `}
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

const HabitWrapper = styled.div`
  width: 74%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-left: 1px solid ${({ theme }) => theme.palette.text.secondaryLight};
`;

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
import Dropdown from 'react-bootstrap/Dropdown';
import { useDrag, useDrop } from 'react-dnd';
import update from 'immutability-helper';

import Badge from '../Badge';
import SubCategoryRow from './SubCategoryRow';
import ArrowDown from '../../assets/images/ArrowDown';
import ThreeDotsIcon from '../../assets/images/ThreeDotsIcon';
import AddNewItemButton from '../AddNewItemButton';
import WeightDragIcon from '../WeightDragIcon';
import Drawer from '../Drawer';
import AddHabit from '../AddNew/AddHabbit';
import AddSubCategory from '../AddNew/AddSubCategory';
import DeleteModal from '../DeleteModal';
import AddCategory from '../AddNew/AddCategory';
import { getStartEndDatesV2 } from '../../utils/utility';
import { changeWeight } from '../../modules/actions/DashboardActions';
import { useDispatch, useSelector } from 'react-redux';

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

const CategoryToggle = ({ eventKey }) => {
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

const CategoryRow = ({
  index,
  areaId,
  category,
  moveCategoryRow,
  setCategoryWeightUpdate,
}) => {
  const {
    id,
    custom_category_name,
    userSubCategories: userSubCategoriesData,
    weight,
  } = category;

  const dispatch = useDispatch();

  const dropRef = useRef(null);
  const dragRef = useRef(null);
  const DND_ITEM_TYPE = `CATEGORY-${areaId}`;

  const [userSubCategories, setUserSubCategories] = useState(
    userSubCategoriesData,
  );
  const [openAddNewHabitModal, setOpenAddNewHabitModal] = useState(false);
  const [openDeleteCategoryModal, setOpenDeleteCategoryModal] = useState(false);
  const [openEditCategorymodal, setOpenEditCategorymodal] = useState(false);
  const [openAddSubcategoryModal, setOpenAddSubcategoryModal] = useState(false);
  const [subCategoryWeightUpdate, setSubCategoryWeightUpdate] = useState(false);

  const { selectedWeek } = useSelector(({ dashboard }) => dashboard);

  useEffect(() => {
    setUserSubCategories(userSubCategoriesData);
  }, [userSubCategoriesData]);

  useEffect(() => {
    if (subCategoryWeightUpdate) {
      const updatedWeights = userSubCategories.map((record) => ({
        id: record.id,
        weight: record.weight,
      }));

      const dates = getStartEndDatesV2(selectedWeek[0], selectedWeek[6]);
      const payload = {
        type: 'subcategory',
        start_date: dates.start,
        end_date: dates.end,
        weights: updatedWeights,
      };

      dispatch(changeWeight(payload));
      setSubCategoryWeightUpdate(false);
    }
  }, [subCategoryWeightUpdate]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleAddNewHabitModal = () => setOpenAddNewHabitModal((prev) => !prev);

  const toggleDeleteCategoryModal = () =>
    setOpenDeleteCategoryModal((prev) => !prev);

  const toggleAddSubcategoryModal = () =>
    setOpenAddSubcategoryModal((prev) => !prev);

  const toggleEditCategoryModal = () =>
    setOpenEditCategorymodal((prev) => !prev);

  const [, drop] = useDrop({
    accept: DND_ITEM_TYPE,
    drop() {
      setCategoryWeightUpdate(true);
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
      moveCategoryRow(dragIndex, hoverIndex);
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

  const moveSubcategoryRow = useCallback(
    (dragIndex, hoverIndex) => {
      const dragCard = userSubCategories[dragIndex];
      let weights = userSubCategories.map((cat) => cat.weight);
      weights = weights.sort((a, b) => b - a);
      let newSubCategories = update(userSubCategories, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragCard],
        ],
      });
      newSubCategories = newSubCategories.map((category, index) => {
        category.weight = weights[index];
        return category;
      });

      setUserSubCategories(newSubCategories);
    },
    [userSubCategories],
  );

  const accordianProps =
    openAddSubcategoryModal || openEditCategorymodal || openDeleteCategoryModal
      ? { activeKey: id }
      : {};

  return (
    <>
      {openAddNewHabitModal && (
        <Drawer
          open={openAddNewHabitModal}
          onClose={toggleAddNewHabitModal}
          header="Add new habit"
        >
          <AddHabit
            onClose={toggleAddNewHabitModal}
            areaId={areaId}
            categoryId={id}
          />
        </Drawer>
      )}
      {openAddSubcategoryModal && (
        <Drawer
          open={openAddSubcategoryModal}
          onClose={toggleAddSubcategoryModal}
          header="Add new subcategory"
        >
          <AddSubCategory
            onClose={toggleAddSubcategoryModal}
            areaId={areaId}
            categoryId={id}
          />
        </Drawer>
      )}
      {openEditCategorymodal && (
        <Drawer
          open={openEditCategorymodal}
          onClose={toggleEditCategoryModal}
          header="Edit category"
        >
          <AddCategory onClose={toggleEditCategoryModal} />
        </Drawer>
      )}
      {openDeleteCategoryModal && (
        <DeleteModal
          show={openDeleteCategoryModal}
          onHide={toggleDeleteCategoryModal}
          title="Delete category"
          message="Are you sure you want to delete this category?"
          subMessage="All subcategories and habits within the category will also be deleted."
          buttonText="Delete category"
        />
      )}
      <Accordion defaultActiveKey={id} {...accordianProps}>
        <StyledCategoryRow
          ref={dropRef}
          style={{ opacity: isDragging ? 0 : 1 }}
        >
          <CategoryHeader>
            <div className="d-flex align-items-center">
              <CategoryToggle eventKey={id} />
              <div ref={dragRef}>
                <WeightDragIcon weight={weight} withoutBorder />
              </div>
              <AreaName>{custom_category_name}</AreaName>
              <Badge text="Category" bgColor="#fff" />
              <div className="add-button">
                <AddNewItemButton
                  buttonText="Add New Habit"
                  onClick={toggleAddNewHabitModal}
                />
              </div>
            </div>

            <StyledDropdown>
              <Dropdown.Toggle as={CustomDropdownToggle} id="dropdown-basic" />
              <Dropdown.Menu>
                <StyledDropdownItem onClick={toggleAddSubcategoryModal}>
                  Add new subcategory
                </StyledDropdownItem>
                <StyledDropdownItem onClick={toggleEditCategoryModal}>
                  Edit
                </StyledDropdownItem>
                <StyledDropdownItem onClick={toggleDeleteCategoryModal}>
                  Delete
                </StyledDropdownItem>
              </Dropdown.Menu>
            </StyledDropdown>
          </CategoryHeader>
          <Accordion.Collapse eventKey={id}>
            <>
              {!!userSubCategories.length && (
                <SubCategoryTable>
                  {userSubCategories.map(
                    (userSubCategory, userSubCategoryIndex) => {
                      return (
                        <SubCategoryRow
                          key={userSubCategory.id}
                          categoryId={id}
                          subcategory={userSubCategory}
                          index={userSubCategoryIndex}
                          moveSubcategoryRow={moveSubcategoryRow}
                          areaId={areaId}
                          setSubCategoryWeightUpdate={
                            setSubCategoryWeightUpdate
                          }
                        />
                      );
                    },
                  )}
                </SubCategoryTable>
              )}
            </>
          </Accordion.Collapse>
        </StyledCategoryRow>
      </Accordion>
    </>
  );
};

export default CategoryRow;

const StyledCategoryRow = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 16px 12px;
  border-radius: 2px;
  background-color: ${({ theme }) => theme.palette.common.grey};
  border: 1px solid ${({ theme }) => theme.palette.text.secondaryLight};
  border-radius: 4px;
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
  font-size: 16px;
  line-height: 20px;
  color: ${({ theme }) => theme.palette.text.primary};
`;

const CategoryHeader = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 11px 26px 11px 20px;
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
    padding: 8px 34px 8px 8px;
  `}
`;

const AreaName = styled(Text)`
  margin-right: 4px;
`;

const SubCategoryTable = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 16px 12px;
  background-color: ${({ theme }) => theme.palette.common.white};
  border: 1px solid ${({ theme }) => theme.palette.text.secondaryLight};
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

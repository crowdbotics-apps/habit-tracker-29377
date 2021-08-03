import React, { useRef } from 'react';
import styled, { css } from 'styled-components';
import { useDrag, useDrop } from 'react-dnd';

import dragIcon from '../../assets/images/dragIcon.png';
import { getAreaColor } from '../../utils/utility';

const Row = ({ row, index, moveRow, setWeightUpdate }) => {
  const dropRef = useRef(null);
  const dragRef = useRef(null);
  const DND_ITEM_TYPE = 'row';

  const [, drop] = useDrop({
    accept: DND_ITEM_TYPE,
    drop() {
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
      const hoverBoundingRect = dropRef.current.getBoundingClientRect();
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
      moveRow(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag, preview] = useDrag({
    item: { type: DND_ITEM_TYPE, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  preview(drop(dropRef));
  drag(dragRef);

  const handleWeightClick = (row) => () => {
    if (row.isExpanded) row.toggleRowExpanded();
  };

  const getTableRowData = (cell) => {
    switch (cell.column.id) {
      case 'weight':
        return (
          <WeightTd
            ref={dragRef}
            isExpanded={
              cell.row.isExpanded || cell.row.values.expander.isExpanded
            }
            color={getAreaColor(cell.row.original.area.code)}
            onDragStart={handleWeightClick(cell.row)}
            {...cell.getCellProps()}
          >
            {cell.value && (
              <div>
                <Weight>{cell.value}</Weight>
                <DragNDropIcon src={dragIcon} alt="icon" />
              </div>
            )}
          </WeightTd>
        );
      default:
        return (
          <StyledTd
            isExpanded={
              cell.row.isExpanded || cell.row.values.expander.isExpanded
            }
            {...cell.getCellProps()}
          >
            {cell.render('Cell')}
          </StyledTd>
        );
    }
  };

  return (
    <StyledRow
      ref={dropRef}
      isExpanded={row.isExpanded || row.values.expander.isExpanded}
      isDragging={isDragging}
    >
      {row.cells.map((cell) => getTableRowData(cell))}
    </StyledRow>
  );
};

export default Row;

const StyledRow = styled.tr`
  background: ${({ theme }) => theme.palette.common.white};
  border-bottom: 2px solid #f9f9f9;
  opacity: 1;
  ${({ isDragging }) =>
    isDragging &&
    css`
      opacity: 0;
      border-bottom: none;
      border: 1px dashed #8e97a3;
    `}
  ${({ isExpanded }) =>
    isExpanded &&
    css`
      border-bottom: none;
      box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.1);
    `}
`;

const StyledTd = styled.td`
  &:first-child {
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }
  &:last-child {
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }
  ${({ isExpanded }) =>
    isExpanded &&
    css`
      &:first-child {
        border-top-left-radius: 5px;
        border-bottom-left-radius: 0;
      }
      &:last-child {
        border-top-right-radius: 5px;
        border-bottom-right-radius: 0;
      }
    `}
`;

const WeightTd = styled(StyledTd)`
  text-align: center;
  padding: 18px 0;
  position: relative;
  &:before {
    content: '';
    position: absolute;
    width: 4px;
    height: 100%;
    background-color: ${({ color }) => color};
    top: 0;
    left: 0;
    border-radius: 5px;
    ${({ isExpanded }) =>
      isExpanded &&
      css`
        border-radius: 5px 5px 0 0;
      `}
  }
`;

const Weight = styled.div`
  font-family: Roboto;
  font-weight: bold;
  font-size: 16px;
  line-height: 19px;
  color: #818ea3;
`;

const DragNDropIcon = styled.img`
  cursor: pointer;
`;

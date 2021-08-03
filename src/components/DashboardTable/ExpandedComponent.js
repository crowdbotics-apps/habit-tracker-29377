import React, { Fragment, useState, useEffect } from 'react';
import styled from 'styled-components';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import AddNewCategoryDialog from '../AddNewCategoryDialog';
import AddIcon from '../AddIcon';
import { getAreaColor } from '../../utils/utility';
import ExpandedComponentRow from './ExpandedComponentRow';

const ExpandedComponent = ({ row, dropDownItem }) => {
  const [showAddCategoryDialog, setShowAddCategoryDialog] = useState(false);

  const addCategoryDialogOpen = () => setShowAddCategoryDialog(true);
  const addCategoryDialogClose = () => setShowAddCategoryDialog(false);

  const [records, setRecords] = useState(row.subRows);
  useEffect(() => {
    setRecords(row.subRows);
  }, [row]);
  return (
    <Fragment>
      <AddNewCategoryDialog
        show={showAddCategoryDialog}
        handleClose={addCategoryDialogClose}
        areaId={row.id}
      />
      <DndProvider backend={HTML5Backend}>
        <StyledTable>
          <tbody>
            {records.map((subRow, index) => (
              <ExpandedComponentRow
                key={subRow.id}
                row={row}
                subRow={subRow}
                index={index}
                records={records}
                setRecords={setRecords}
                dropDownItem={dropDownItem}
              />
            ))}
          </tbody>
        </StyledTable>
      </DndProvider>
      <AddCategoryMainWrapper color={getAreaColor(row.original.area.code)}>
        <AddCategoryWrapper onClick={addCategoryDialogOpen}>
          <AddIcon />
          <AddText>Add Category</AddText>
        </AddCategoryWrapper>
      </AddCategoryMainWrapper>
    </Fragment>
  );
};

export default ExpandedComponent;

const StyledTable = styled.table`
  width: 100%;
  background: ${({ theme }) => theme.palette.common.grey};
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.palette.text.secondaryLight};
  box-sizing: border-box;
  margin: 12px 0px;
  padding: 12px 16px;
  // width: 1292px;
  height: 280px;
  top: 60px;
`;

const AddCategoryMainWrapper = styled.div`
  padding: 21px 7% 27px;
  background: ${({ theme }) => theme.palette.common.white};
  border-radius: 0 0 5px 5px;
  position: relative;
  box-shadow: 0px 10px 10px rgb(0 0 0 / 10%);
  &:before {
    content: '';
    position: absolute;
    width: 4px;
    height: 100%;
    background-color: ${({ color }) => color};
    top: 0;
    left: 0;
    border-radius: 0 0 5px 5px;
  }
`;

const AddCategoryWrapper = styled.div`
  display: flex;
  > * {
    &:first-child {
      margin-right: 20px;
    }
  }
  align-items: center;
  cursor: pointer;
  width: max-content;
`;

const AddText = styled.div`
  font-family: Roboto;
  font-size: 14px;
  line-height: 16px;
  color: ${({ theme }) => theme.palette.text.secondary};
`;

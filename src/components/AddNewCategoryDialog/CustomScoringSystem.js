import React, { Fragment, useState } from 'react';
import styled from 'styled-components';
import Form from 'react-bootstrap/Form';

import AddIcon from '../AddIcon';
import CustomScoreBlock from './CustomScoreBlock';

const CustomScoringSystem = () => {
  const [scoringType, selectedScoringType] = useState('value');
  const [customBlocks, setCustomBlocks] = useState([{ id: 1 }]);

  const handleScoringTypeChange = ({ target: { value } }) => {
    selectedScoringType(value);
  };

  const handleAddBlock = (length) => () => {
    setCustomBlocks((prev) => [...prev, { id: length + 1 }]);
  };

  const handleDeleteBlock = (id) => () => {
    if (customBlocks.length === 1) return;
    setCustomBlocks((prev) => prev.filter((block) => block.id !== id));
  };

  return (
    <Fragment>
      <CustomTypeWrapper>
        <TextBoxWrapper>
          <Form.Control as="select" onChange={handleScoringTypeChange}>
            <option value="value">Value</option>
            <option value="range">Range</option>
          </Form.Control>
        </TextBoxWrapper>
      </CustomTypeWrapper>

      {customBlocks.map((block) => (
        <CustomScoreBlock
          key={block.id}
          type={scoringType}
          block={block}
          handleDelete={handleDeleteBlock}
        />
      ))}
      <AddBlock onClick={handleAddBlock(customBlocks.length)}>
        <div>Add another range</div>
        <AddIcon />
      </AddBlock>
    </Fragment>
  );
};

export default CustomScoringSystem;

const CustomTypeWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: -10px;
  ${({ theme }) => theme.max('sm')`
    justify-content: flex-start;
  `}
`;

const TextBoxWrapper = styled.div`
  width: 388px;
  max-width: 388px;
  ${({ theme }) => theme.max('sm')`
    width: 100%;
    max-width: 100%;
  `}
`;

const AddBlock = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  > * {
    &:first-child {
      margin-right: 17px;
    }
  }
  padding: 11px;
  margin-top: 10px;
  margin-bottom: 27px;
  background: ${({ theme }) => theme.palette.common.white};
  border: 1px dashed #bfc4cb;
  border-radius: 10px;
  font-family: Roboto;
  font-size: 12px;
  line-height: 14px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.palette.text.secondary};
  cursor: pointer;
  ${({ theme }) => theme.max('sm')`
    margin-bottom: 18px;
  `}
`;

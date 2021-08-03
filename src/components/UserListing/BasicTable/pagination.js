import React from 'react';
import styled from 'styled-components';

const pagination = ({
  canPreviousPage,
  canNextPage,
  maxPage,
  gotoPage,
  nextPage,
  previousPage,
  pageIndex,
}) => {
  return (
    <Pagination>
      <NavButton onClick={() => previousPage()} disabled={!canPreviousPage}>
        {'Previous'}
      </NavButton>
      <span>
        <Lable>Page</Lable>
        <Input
          type="number"
          min={1}
          max={maxPage}
          value={pageIndex}
          onChange={(e) => {
            const page = e.target.value ? Number(e.target.value) - 1 : 0;
            gotoPage(page);
          }}
        />
        <Lable>of {maxPage}</Lable>
      </span>
      <NavButton onClick={() => nextPage()} disabled={!canNextPage}>
        {'Next'}
      </NavButton>
    </Pagination>
  );
};

export default pagination;

const Pagination = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  align-items: center;
  padding: 30px 0;
`;

const NavButton = styled.button`
  color: #1689ca;
  background-color: transparent;
  border: 0;
  padding: 0 28px;
  font-size: 14px;
  font-weight: bold;
`;

const Lable = styled.span`
  padding: 5px;
  font-size: 14px;
`;

const Input = styled.input`
  width: 40px;
  text-align: center;
  border: 1px solid ${({ theme }) => theme.palette.text.secondaryLight};
  border-radius: 5px;
`;

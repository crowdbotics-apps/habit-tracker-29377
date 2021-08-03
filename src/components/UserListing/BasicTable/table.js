import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled, { css } from 'styled-components';
import orderBy from 'lodash.orderby';

import arrowDownGrey from '../../../assets/images/arrowDownGrey.png';
import Row from './Row';
import { resetFlagsUsers } from '../../../modules/actions/UserActions';

const Table = () => {
  const dispatch = useDispatch();

  const {
    allUsersList: { adminData },
    assignCoachToUser: { success: assignCoachSuccess },
  } = useSelector(({ user }) => user);

  const { results = [] } = adminData;

  useEffect(() => {
    if (assignCoachSuccess) {
      setSortedData(orderBy(results, 'name', order));
      dispatch(resetFlagsUsers({ blockType: 'assignCoachToUser' }));
    }
  }, [assignCoachSuccess]);

  const [order, setOrder] = useState('asc');
  const [sortedData, setSortedData] = useState(orderBy(results, 'name', order));

  const sortByFirstName = () => {
    const tempOrder = order === 'asc' ? 'desc' : 'asc';
    setOrder(tempOrder);
    setSortedData(orderBy(results, 'name', tempOrder));
  };

  return (
    <StyledTable>
      <thead>
        <StyledTr>
          <StyledTh>Picture</StyledTh>
          <StyledTh>
            <SortLabel order={order} onClick={sortByFirstName}>
              First name
              <SortIcon order={order} src={arrowDownGrey} alt={'arrow'} />
            </SortLabel>
          </StyledTh>
          <StyledTh>Last Name</StyledTh>
          <StyledTh>User type</StyledTh>
          <StyledTh>Points</StyledTh>
          <StyledTh>Tracked habits</StyledTh>
          <StyledTh>good habits</StyledTh>
          <StyledTh>Bad habits</StyledTh>
          <StyledTh>Habits avg score</StyledTh>
          <StyledTh>Coached by</StyledTh>
        </StyledTr>
      </thead>

      <tbody>
        {!!sortedData.length ? (
          sortedData.map((user) => <Row key={user.id} user={user} />)
        ) : (
          <StyledTr>
            <StyledTd center colSpan={10} className="py-3">
              No users found.
            </StyledTd>
          </StyledTr>
        )}
      </tbody>
    </StyledTable>
  );
};

export default Table;

const StyledTable = styled.table`
  min-width: 100%;
  ${({ theme }) => theme.max('md')`
    min-width: 992px;
  `}
`;

const StyledTh = styled.th`
  min-width: max-content;
  padding: 20px 15px 11px;
  font-family: Roboto;
  font-size: 12px;
  line-height: 14px;
  text-transform: uppercase;
  color: #818ea3;
  &:first-child {
    padding-left: 20px;
  }
  &:nth-child(2) {
    font-weight: bold;
  }
`;

const StyledTr = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.palette.text.secondaryLight};
`;

const StyledTd = styled.td`
  padding: 10px 15px;
  font-size: 14px;
  color: ${({ theme }) => theme.palette.text.primary};
  &:first-child {
    padding-left: 10px;
  }
  ${({ center }) =>
    center &&
    css`
      text-align: center;
    `}
`;

const SortLabel = styled.div`
  cursor: pointer;
`;

const SortIcon = styled.img`
  margin-left: 7px;
  ${({ order }) =>
    order === 'desc' &&
    css`
      transform: rotate(180deg);
    `}
`;

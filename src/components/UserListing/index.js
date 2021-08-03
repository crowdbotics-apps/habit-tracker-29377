import React, { Fragment, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import Form from 'react-bootstrap/Form';
import debounce from 'lodash.debounce';

import goBackIcon from '../../assets/images/goBackIcon.png';
import Button from '../Button';
import Table from './BasicTable/table';
import Pagination from './BasicTable/pagination';
import {
  getAllUsersList,
  setPageIndex,
  setUserQuery,
} from '../../modules/actions/UserActions';

const UserListing = () => {
  const dispatch = useDispatch();

  const {
    allUsersList: { adminData },
    pageIndex,
    userQuery,
  } = useSelector(({ user }) => user);

  const { count, next, previous, results = [] } = adminData;

  const limit = 10;
  const maxPage = Math.ceil(count / limit) || 0;

  const queryCall = (value) => {
    if (value) {
      dispatch(getAllUsersList({ query: value }));
    } else {
      dispatch(getAllUsersList({ limit: 10, offset: 0 }));
    }
  };

  const delayedQuery = useCallback(
    debounce((value) => queryCall(value), 500),
    [],
  );

  const gotoPage = (page) => {
    dispatch(setPageIndex(page));
    if (page > maxPage || page < 1) {
      return;
    }
    dispatch(getAllUsersList({ limit: 10, offset: (page - 1) * limit }));
  };

  const previousPage = () => {
    const page = pageIndex - 1;
    dispatch(setPageIndex(page));
    dispatch(getAllUsersList({ limit: 10, offset: (page - 1) * limit }));
  };

  const nextPage = () => {
    const page = pageIndex + 1;
    dispatch(setPageIndex(page));
    dispatch(getAllUsersList({ limit: 10, offset: (page - 1) * limit }));
  };

  const handleChange = ({ target: { value } }) => {
    dispatch(setUserQuery(value));
    delayedQuery(value);
  };

  return (
    <Fragment>
      <HeaderLayout>
        <NavButton
          icon={goBackIcon}
          isLeft
          onClick={() => window.history.back()}
        >
          Go Back
        </NavButton>
        <Text>View all users</Text>
      </HeaderLayout>
      <FilterWrapper>
        <SearchWrapper>
          <Label>Search for user</Label>
          <Form.Control
            type="text"
            placeholder="Search users"
            value={userQuery}
            onChange={handleChange}
          />
        </SearchWrapper>
        <FilterButton>filter results</FilterButton>
      </FilterWrapper>
      <Table />
      <Pagination
        canPreviousPage={!!previous && results.length}
        canNextPage={!!next && results.length}
        maxPage={maxPage}
        gotoPage={gotoPage}
        nextPage={nextPage}
        previousPage={previousPage}
        pageIndex={pageIndex}
      />
    </Fragment>
  );
};

export default UserListing;

const HeaderLayout = styled.div`
  display: flex;
  border-radius: 10px;
  background-color: #fff;
  padding: 30px;
  margin: 10px 10px 20px;
  align-items: center;
`;

const NavButton = styled(Button)`
  background: #1689ca;
  border-radius: 5px;
  width: 140px;
  text-transform: uppercase;
`;

const Text = styled.div`
  margin-left: 45px;
`;

const FilterWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 0 20px;
`;

const SearchWrapper = styled.div`
  display: flex;
  align-items: center;
  & > input {
    width: 400px;
    max-width: 400px;
  }
`;

const Label = styled.div`
  min-width: max-content;
  font-family: Roboto;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: #2a3037;
  margin-right: 25px;
`;

const FilterButton = styled(NavButton)`
  margin: 0 20px;
`;

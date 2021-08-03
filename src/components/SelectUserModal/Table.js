import React, { Fragment, useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import styled, { css } from 'styled-components';
import chunk from 'lodash.chunk';
import { useDispatch, useSelector } from 'react-redux';

import Pagination from '../UserListing/BasicTable/pagination';
import DefaultAvatar from '../../assets/images/DefaultAvatar.png';
import Button from '../Button';
import { assignCoaches, assignUsers } from '../../modules/actions/UserActions';

const Table = ({ from, data, selectedUser, userData, closeModal }) => {
  const dispatch = useDispatch();

  const {
    assignCoachToUser: { loading },
  } = useSelector(({ user }) => user);

  const pageSize = 5;
  const [dataList, setDataList] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [selectedData, setSelectedData] = useState([]);

  const previousPage = () => {
    setPageIndex((prev) => prev - 1);
  };

  const nextPage = () => {
    setPageIndex((prev) => prev + 1);
  };

  useEffect(() => {
    const usersData = data.map((user) => {
      return {
        ...user,
        checked: false,
      };
    });
    setDataList(chunk(usersData, pageSize));
  }, [data.length]);

  const checkHandler = (user) => () => {
    const newData = [...selectedData];
    const existItemIndex = selectedData.findIndex(
      (coach) => coach.id === user.id,
    );
    if (existItemIndex !== -1) {
      newData.splice(existItemIndex, 1);
    } else {
      newData.push(user);
    }
    setSelectedData(newData);
  };

  const handleSubmit = () => {
    selectedUser(selectedData);
    closeModal();
    const users = [];
    selectedData.map(({ id }) => {
      users.push(id);
    });

    if (userData.is_coach) {
      const item = {
        user_id: users,
        coach_id: userData.id,
      };
      dispatch(assignUsers(item));
    } else {
      const item = {
        user_id: userData.id,
        coach_id: users,
        from,
      };
      dispatch(assignCoaches(item));
    }
  };

  return (
    <Fragment>
      <StyledTable>
        <thead>
          <StyledTr>
            <StyledTh>Picture</StyledTh>
            <StyledTh>Name</StyledTh>
          </StyledTr>
        </thead>
        <tbody>
          {!!dataList[pageIndex]?.length ? (
            dataList[pageIndex]?.map((user) => {
              return (
                <StyledTr key={user.id}>
                  <StyledTd>
                    <ProfilePicture
                      src={user.profile_picture || DefaultAvatar}
                      alt="profile"
                      height={60}
                      width={60}
                    />
                  </StyledTd>
                  <StyledTd>
                    <NameCheckbox>
                      <div>{user.name || 'Guest'}</div>
                      <div>
                        <Form.Check
                          type="checkbox"
                          onChange={checkHandler(user)}
                        />
                      </div>
                    </NameCheckbox>
                  </StyledTd>
                </StyledTr>
              );
            })
          ) : (
            <StyledTr>
              <StyledTd center colSpan={2} className="py-3">
                No users found.
              </StyledTd>
            </StyledTr>
          )}
        </tbody>
      </StyledTable>
      <Pagination
        canPreviousPage={pageIndex !== 0 && dataList[pageIndex]?.length}
        canNextPage={
          pageIndex !== dataList.length - 1 && dataList[pageIndex]?.length
        }
        maxPage={dataList.length}
        gotoPage={setPageIndex}
        nextPage={nextPage}
        previousPage={previousPage}
        pageIndex={pageIndex}
      />
      <ButtonWrapper>
        <Button
          loading={from && loading}
          disabled={selectedData.length === 0}
          onClick={handleSubmit}
        >
          Save changes
        </Button>
      </ButtonWrapper>
    </Fragment>
  );
};

export default Table;

const StyledTable = styled.table`
  width: 100%;
`;

const StyledTh = styled.th`
  padding: 0 20px 11px 0;
  font-family: Roboto;
  font-size: 12px;
  line-height: 14px;
  text-transform: uppercase;
  color: #818ea3;
  &:first-child {
    padding-left: 23px;
    width: 90px;
  }
`;

const StyledTd = styled.td`
  font-family: Roboto;
  font-size: 14px;
  line-height: 24px;
  color: ${({ theme }) => theme.palette.text.primary};
  ${({ center }) =>
    center &&
    css`
      text-align: center;
    `}
`;

const NameCheckbox = styled.div`
  display: flex;
  justify-content: space-between;
  margin-right: 20px;
`;

const StyledTr = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.palette.text.secondaryLight};
`;

const ButtonWrapper = styled.div`
  padding: 0 10px 20px;
  & > button {
    background: #789f08;
  }
`;

const ProfilePicture = styled.img`
  border-radius: 5px;
  margin: 10px 0 10px 23px;
`;

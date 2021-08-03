import React, { Fragment, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import DefaultAvatar from '../../../assets/images/DefaultAvatar.png';
import RoundedProgress from '../../RoundedProgress';
import { setSelectedUser } from '../../../modules/actions/UserActions';
import DialogModal from '../../SelectUserModal';

const Row = ({ user }) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const {
    allUsersList: { normalUsers, coachUsers },
  } = useSelector(({ user }) => user);

  const [showDialog, setShowDialog] = useState(false);
  const [filteredData, setFilteredData] = useState([]);

  const closeModal = () => {
    setShowDialog(false);
  };

  const showModal = () => {
    const assignedList = user.is_coach ? user.assignees : user.coaches;
    const usersList = user.is_coach ? normalUsers : coachUsers;
    let users = [...usersList];
    assignedList.forEach((assigned) => {
      let foundIndex = users.findIndex((a) => a.id === assigned.id);
      if (foundIndex !== -1) {
        users.splice(foundIndex, 1);
      }
    });
    setFilteredData(users);
    setShowDialog(true);
  };

  const handleProfileClick = () => {
    dispatch(setSelectedUser(user));
    history.push(`/users/${user.id}`);
  };

  const {
    profile_picture,
    first_name,
    last_name,
    name,
    is_coach,
    points,
    tracked_habits,
    good_habits,
    bad_habits,
    habits_avg_score,
    coaches,
  } = user;

  return (
    <Fragment>
      {showDialog && (
        <DialogModal
          from="dashboard"
          show={showDialog}
          handleClose={closeModal}
          selectedUser={() => {}}
          modalData={filteredData}
          userData={user}
        />
      )}
      <StyledTr>
        <StyledTd>
          <ProfileImage
            src={profile_picture || DefaultAvatar}
            alt="icon"
            onClick={handleProfileClick}
          />
        </StyledTd>
        <StyledTd>{first_name || name?.split(' ')[0] || 'Guest'}</StyledTd>
        <StyledTd>{last_name || name?.split(' ')[1] || '-'}</StyledTd>
        <StyledTd>{is_coach ? 'Coach' : 'Normal user'}</StyledTd>
        <StyledTd>
          <PointValue>{points}</PointValue>
          <CurrencySign>₳</CurrencySign>
        </StyledTd>
        <StyledTd>{tracked_habits}</StyledTd>
        <StyledTd>{good_habits}</StyledTd>
        <StyledTd>{bad_habits}</StyledTd>
        <StyledTd>
          <DayProgressWrapper>
            <RoundedProgress
              progress={habits_avg_score}
              label={habits_avg_score}
            />
          </DayProgressWrapper>
        </StyledTd>
        <StyledTd>
          <ImagePreview>
            {is_coach ? (
              'None'
            ) : !!coaches.length ? (
              coaches.map(({ profile_picture }, index) => (
                <Image
                  src={profile_picture || DefaultAvatar}
                  alt="icon"
                  key={index}
                />
              ))
            ) : (
              <StylistButton onClick={showModal}>Assign</StylistButton>
            )}
          </ImagePreview>
        </StyledTd>
      </StyledTr>
    </Fragment>
  );
};

export default Row;

const StyledTd = styled.td`
  padding: 10px 15px;
  font-size: 14px;
  color: ${({ theme }) => theme.palette.text.primary};
  &:first-child {
    padding-left: 10px;
  }
`;

const StyledTr = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.palette.text.secondaryLight};
`;

const ProfileImage = styled.img`
  cursor: pointer;
  max-height: 60px;
  max-width: 60px;
  border-radius: 5px;
`;

const CurrencySign = styled.span`
  font-weight: 700;
  color: #ff9900;
`;

const PointValue = styled.span`
  padding: 10px 0;
  font-size: 14px;
  color: ${({ theme }) => theme.palette.text.primary};
`;

const DayProgressWrapper = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
  width: 50px;
`;

const ImagePreview = styled.div``;

const Image = styled.img`
  max-height: 60px;
  max-width: 60px;
  border-radius: 5px;
  position: relative;
  transition: 0.2s;
  cursor: pointer;
  &:not(:first-child) {
    margin-left: -40px;
  }
  &:hover {
    transform: translateY(-1rem) rotate(3deg);
    z-index: 1;
  }
`;

const StylistButton = styled.button`
  border: 0;
  background-color: transparent;
  color: #1689ca;
  font-weight: bold;
  font-size: 14px;
`;

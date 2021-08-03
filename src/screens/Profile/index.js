import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import isEmpty from 'lodash.isempty';
import Page from '../../components/Page';
import Loader from '../../components/Loader';
import UserProfile from '../../components/UserProfile';
import ProfileHeader from '../../components/UserProfile/ProfileHeader';
import {
  getAllUsersList,
  getSpecificUser,
} from '../../modules/actions/UserActions';

const Profile = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const userId = params.id;

  const {
    selectedUser,
    userData: { data, loading, success, error },
    getSpecificUser: { data: specificUser, loading: specificUserLoading },
    allUsersList: { loading: allUsersLoading, success: allUsersSuccess },
  } = useSelector(({ user }) => user);

  const userData = userId
    ? isEmpty(selectedUser)
      ? specificUser
      : selectedUser
    : data;

  useEffect(() => {
    if (userId && isEmpty(selectedUser)) {
      dispatch(getSpecificUser({ user_id: userId }));
    }
  }, []);

  useEffect(() => {
    if (
      (success || userId) &&
      !userData.is_superuser &&
      !allUsersLoading &&
      !allUsersSuccess
    ) {
      dispatch(getAllUsersList());
    }
  }, [success, userId]);

  const { is_superuser = false, is_coach = false } = userData;

  const getPageTitle = () => {
    if (userId) {
      return 'USER MANAGEMENT';
    }
    return is_superuser
      ? 'VIEW MY PROFILE - ADMIN'
      : is_coach
      ? 'VIEW MY PROFILE - COACH'
      : 'VIEW MY PROFILE - NORMAL USER';
  };

  return (
    <Page title={getPageTitle()}>
      {loading || allUsersLoading || specificUserLoading ? (
        <Loader />
      ) : (
        <ProfileWrapper>
          <ProfileHeader userData={userData} userId={userId} />
          <UserProfile
            userData={userData}
            loading={loading}
            error={error}
            userId={userId}
          />
        </ProfileWrapper>
      )}
    </Page>
  );
};

export default Profile;

const ProfileWrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow: auto;
`;

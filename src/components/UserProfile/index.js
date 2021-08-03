import React, { useState } from 'react';
import styled from 'styled-components';

import Form from './Form';
import ActivityJournal from '../ActivityJournal';
import ResetPassword from '../ResetPassword';

const Profile = ({ userData, error, loading, userId }) => {
  const [isResetPassword, setIsResetPassword] = useState(false);

  return (
    <ProfileWrapper>
      {isResetPassword ? (
        <ResetPassword loading={loading} error={error} />
      ) : (
        <Form
          userData={userData}
          loading={loading}
          setIsResetPassword={setIsResetPassword}
          userId={userId}
        />
      )}
      <ActivitySection>
        <ActivityJournal />
      </ActivitySection>
    </ProfileWrapper>
  );
};

export default Profile;

const ProfileWrapper = styled.div`
  display: flex;
  ${({ theme }) => theme.between('md', 'xl')`
    flex-direction: column;
  `}
  ${({ theme }) => theme.max('sm')`
   flex-direction: column;
  `}
`;

const ActivitySection = styled.div`
  flex-direction: column;
  padding: 20px 20px 14px 0;
  width: 436px;
  ${({ theme }) => theme.max('md')`
   display: none;
  `}
`;

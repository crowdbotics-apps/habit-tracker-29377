import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import Alert from 'react-bootstrap/Alert';

import LeftNavbar from '../LeftNavbar';
import Header from '../Header';
import { getUserData } from '../../modules/actions/UserActions';
import { getPredefineAreaList } from '../../modules/actions/DashboardActions';

const Page = ({ children, title }) => {
  const dispatch = useDispatch();

  const {
    userData: { loading: userDataLoading, success: userDataSuccess },
  } = useSelector(({ user }) => user);

  const {
    login: { success: loginSuccess },
  } = useSelector(({ auth }) => auth);

  const {
    predefineAreasList: {
      loading: predefineAreaListLoading,
      success: predefineAreaListSuccess,
    },
  } = useSelector(({ dashboard }) => dashboard);

  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (!userDataLoading && !userDataSuccess && !loginSuccess) {
      dispatch(getUserData());
    }
  }, []);

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  return (
    <StyledPage>
      <LeftNavbar />
      <HeaderComponentWrapper>
        <Header title={title} />
        {showAlert && (
          <StyledAlert variant="danger" onClose={handleCloseAlert} dismissible>
            Thanks for signing up. Verify your email address by clicking the
            link in the email sent to the email provided.{' '}
            <span>resend verification email</span>
          </StyledAlert>
        )}
        {children}
      </HeaderComponentWrapper>
    </StyledPage>
  );
};

export default Page;

const StyledPage = styled.div`
  display: flex;
  height: 100vh;
  background: ${({ theme }) => theme.palette.background.main};
  overflow: hidden;
`;

const HeaderComponentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const StyledAlert = styled(Alert)`
  margin: 10px;
  & > span {
    color: #721c24;
    text-decoration: underline;
    cursor: pointer;
  }
`;

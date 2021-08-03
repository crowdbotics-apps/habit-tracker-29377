import React, { Fragment, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import styled, { css } from 'styled-components';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import AppleLogin from 'react-apple-login';
import Alert from 'react-bootstrap/Alert';

import Button from '../../atoms/Button';
import ButtonComponent from '../../components/Button';
import LeftIcon from '../../assets/images/logo.png';
import GoogleIcon from './assets/googleIcon.png';
import FacebookIcon from './assets/facebookIcon.png';
import AppleIcon from './assets/appleIcon.png';
import {
  googleLogin,
  facebookLogin,
  appleLogin,
} from '../../modules/actions/AuthActions';

const AuthWrapper = ({
  children,
  leftButtonText,
  leftButtonText2,
  leftButtonLink,
  leftButtonLink2,
  authInfoText,
  type,
  leftDescription,
  rightTitle,
  rightDescription,
}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const ref = useRef();
  const [rightSideHeight, setRightSideHeight] = useState(0);
  const isPasswordScreen = ['forgotPassword', 'changePassword'].includes(type);

  const [socialAuthError, setSocialAuthError] = useState({
    message: '',
    show: false,
  });

  const {
    googleLogin: {
      loading: googleLoading,
      error: googleError,
      success: googleSuccess,
    },
    facebookLogin: {
      loading: facebookLoading,
      error: facebookError,
      success: facebookSuccess,
    },
    appleLogin: {
      loading: appleLoading,
      error: appleError,
      success: appleSuccess,
    },
  } = useSelector(({ auth }) => auth);

  useEffect(() => {
    if (googleSuccess || facebookSuccess || appleSuccess) {
      history.push('/dashboard');
    }
  }, [googleSuccess, facebookSuccess, appleSuccess]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setRightSideHeight(ref.current.clientHeight);
  }, [ref.current?.clientHeight]); // eslint-disable-line react-hooks/exhaustive-deps

  const authbuttonStyles = {
    width: '80px',
    height: '80px',
    cursor: 'pointer',
    boxShadow: '0px 10px 10px rgba(0, 0, 0, 0.1)',
    background: '#FFF',
  };

  const handleClick = () => {
    setSocialAuthError({ ...socialAuthError, show: true });
  };

  const responseGoogle = (response) => {
    if (response.error === 'idpiframe_initialization_failed')
      return setSocialAuthError({
        ...socialAuthError,
        message: response.details?.toLowerCase().includes('cookies')
          ? 'Please enable cookies in your preferences to use Google Sign in.'
          : `We're getting an error with Google Sign In. Please use another method to sign in.`,
      });
    if (response.accessToken) {
      dispatch(googleLogin({ access_token: response.accessToken }));
    }
  };

  const GoogleButton = (renderProps) => (
    <ButtonComponent
      onClick={socialAuthError.message ? handleClick : renderProps.onClick}
      disabled={
        !socialAuthError.message && (renderProps.disabled || googleLoading)
      }
      loading={googleLoading}
      styles={authbuttonStyles}
    >
      <img src={GoogleIcon} alt="google" />
    </ButtonComponent>
  );

  const responseFacebook = (response) => {
    // if (response.accessToken) {
    //   dispatch(facebookLogin(response.accessToken));
    // }
  };

  const FacebookButton = (renderProps) => (
    <ButtonComponent
      onClick={renderProps.onClick}
      disabled={renderProps.isDisabled || facebookLoading}
      loading={renderProps.isProcessing || facebookLoading}
      styles={authbuttonStyles}
    >
      <img src={FacebookIcon} alt="facebook" />
    </ButtonComponent>
  );

  const responseApple = (response) => {
    // if (response.accessToken) {
    //   dispatch(facebookLogin(response.accessToken));
    // }
  };

  const AppleButton = (renderProps) => (
    <ButtonComponent
      onClick={renderProps.onClick}
      disabled={appleLoading}
      loading={appleLoading}
      styles={authbuttonStyles}
    >
      <img src={AppleIcon} alt="apple" />
    </ButtonComponent>
  );

  const { message, show } = socialAuthError;

  const showError =
    googleError || facebookError || appleError || (show && message);

  const errorMessage = googleError || facebookError || appleError || message;

  return (
    <PageWrapper>
      <MainWrapper>
        <LeftWrapper>
          <LeftContentWrapper height={rightSideHeight}>
            <Icon src={LeftIcon} alt="icon" />
            <LeftTitle>Lets make life better together</LeftTitle>
            <LeftDescription>{leftDescription}</LeftDescription>
            <LeftBottomWrapper>
              {type === 'login' && <NewUserText>New to Arootah?</NewUserText>}
              <Link to={leftButtonLink}>
                <LeftFirstButton lessMargin={isPasswordScreen}>
                  {leftButtonText}
                </LeftFirstButton>
              </Link>
              {isPasswordScreen && (
                <Link to={leftButtonLink2}>
                  <LeftSecondButton>{leftButtonText2}</LeftSecondButton>
                </Link>
              )}
              {['login', 'signup'].includes(type) && (
                <LinkWrapper>
                  <ForgotPasswordLink to="/forgot-password">
                    I forgot my password
                  </ForgotPasswordLink>
                </LinkWrapper>
              )}
            </LeftBottomWrapper>
          </LeftContentWrapper>
        </LeftWrapper>
        <RightWrapper ref={ref}>
          <RightTitle>{rightTitle}</RightTitle>
          <RightDescription>{rightDescription}</RightDescription>
          {showError && (
            <StyledAlert variant="danger">{errorMessage}</StyledAlert>
          )}
          <RightChildWrapper>{children}</RightChildWrapper>
          {['login', 'signup'].includes(type) && (
            <Fragment>
              <RightInfoWrapper>
                <InfoLine />
                <RightInfo>{authInfoText}</RightInfo>
                <InfoLine />
              </RightInfoWrapper>
              <AuthMethodsWrapper>
                <GoogleLogin
                  clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                  render={GoogleButton}
                  onSuccess={responseGoogle}
                  onFailure={responseGoogle}
                  cookiePolicy={'single_host_origin'}
                />
                <ButtonComponent styles={authbuttonStyles}>
                  <img src={FacebookIcon} alt="facebook" />
                </ButtonComponent>
                <ButtonComponent styles={authbuttonStyles}>
                  <img src={AppleIcon} alt="apple" />
                </ButtonComponent>
                {/* <FacebookLogin
                  appId={process.env.REACT_APP_FACEBOOK_CLIENT_ID}
                  autoLoad
                  render={FacebookButton}
                  callback={responseFacebook}
                />
                <AppleLogin
                  clientId={process.env.REACT_APP_APPLE_CLIENT_ID}
                  redirectURI="localhost:3000"
                  usePopup={true}
                  render={AppleButton}
                  callback={responseApple}
                /> */}
              </AuthMethodsWrapper>
            </Fragment>
          )}
        </RightWrapper>
      </MainWrapper>
    </PageWrapper>
  );
};

export default AuthWrapper;

const PageWrapper = styled.div`
  max-width: 100vw;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.palette.background.main};
  ${({ theme }) => theme.max('sm')`
      display: flex;
      align-items: flex-start;
      justify-content: flex-start;
  `}
`;

const MainWrapper = styled.div`
  display: flex;
  width: auto;
  height: auto;
  min-width: 900px;
  min-height: 663px;
  background: ${({ theme }) => theme.palette.common.white};
  box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  margin: 20px 0;
  ${({ theme }) => theme.between('sm', 'md')`
      min-width: 100vw;
      min-height: 100vh;
      height: 100vh;
      margin: 0;
      border-radius: 0;
      box-shadow: none;
  `}
  ${({ theme }) => theme.max('sm')`
      min-width: 100vw;
      min-height: 100vh;
      flex-direction: column-reverse;
      position: relative;
      margin: 0;
      border-radius: 0;
  `}
`;

const LeftWrapper = styled.div`
  width: 400px;
  border-radius: 10px 0px 0px 10px;
  background: ${({ theme }) => theme.palette.primary.main};
  color: ${({ theme }) => theme.palette.common.white};
  ${({ theme }) => theme.between('sm', 'md')`
      border-radius: 0;
      width: 45%;
  `}
  ${({ theme }) => theme.max('sm')`
      width: 100vw;
      min-height: 100vh;
      z-index: 1; 
      border-radius: 0;
  `}
`;

const LeftContentWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  padding: 63px 61px 54px;
  ${({ theme }) => theme.between('sm', 'md')`
      padding: 63px 41px 54px;
  `}
  ${({ theme, height }) => theme.max('sm')`
      margin-top: ${height}px;
      padding: 29px 47px;  
  `}
`;

const RightWrapper = styled.div`
  padding: 49px 60px 45px;
  display: flex;
  flex-direction: column;
  width: 500px;
  height: 100%;
  ${({ theme }) => theme.between('sm', 'md')`
      width: 55%;
  `}
  ${({ theme }) => theme.max('sm')`
      width: 100vw;
      height: auto;
      position: absolute;
      top: 0;
      z-index: 2;
      padding: 30px 20px 20px;
      box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.1);
      border-radius: 0 0 10px 10px;  
      background: ${theme.palette.common.white};
  `}
`;

const Icon = styled.img`
  width: 39px;
  height: 46px;
`;

const LeftTitle = styled.div`
  font-family: Roboto;
  font-size: 60px;
  line-height: 70px;
  padding-top: 30px;
  color: ${({ theme }) => theme.palette.common.white};
  ${({ theme }) => theme.max('sm')`
      font-size: 40px;
      line-height: 47px;
  `}
`;

const LeftDescription = styled.div`
  font-family: Roboto;
  font-size: 12px;
  line-height: 14px;
  padding-top: 47px;
  color: ${({ theme }) => theme.palette.common.white};
  ${({ theme }) => theme.max('sm')`
      padding-top: 15px;
  `}
`;

const LeftBottomWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const NewUserText = styled.div`
  position: absolute;
  margin-top: 65px;
  font-family: Roboto;
  font-size: 12px;
  line-height: 14px;
  color: ${({ theme }) => theme.palette.common.white};
  ${({ theme }) => theme.max('sm')`
      display: none;
  `}
`;

const LeftFirstButton = styled(Button)`
  margin-top: 95px;
  ${({ lessMargin }) =>
    lessMargin &&
    css`
      margin-top: 81px;
    `}
  ${({ theme }) => theme.max('sm')`
      margin-top: 15px;
  `}
`;

const LeftSecondButton = styled(Button)`
  margin-top: 20px;
`;

const LinkWrapper = styled.div`
  padding-top: 12px;
`;

const ForgotPasswordLink = styled(Link)`
  font-family: Roboto;
  font-weight: bold;
  font-size: 14px;
  line-height: 30px;
  text-decoration: underline;
  color: ${({ theme }) => theme.palette.link.main};
`;

const RightTitle = styled.div`
  font-family: Roboto;
  font-size: 30px;
  line-height: 35px;
  color: ${({ theme }) => theme.palette.text.primary};
`;

const RightDescription = styled.div`
  padding-top: 10px;
  font-family: Roboto;
  font-weight: 500;
  font-size: 12px;
  line-height: 14px;
  color: ${({ theme }) => theme.palette.text.secondary};
`;

const RightChildWrapper = styled.div`
  padding-top: 34px;
  width: 100%;
  ${({ theme }) => theme.max('sm')`
      padding-top: 24px;
  `}
`;

const RightInfoWrapper = styled.div`
  width: 100%;
  padding-top: 23px;
  display: flex;
  position: relative;
  align-items: center;
`;

const InfoLine = styled.div`
  height: 1px;
  width: 100%;
  background-color: ${({ theme }) => theme.palette.text.secondaryLight};
`;

const RightInfo = styled.div`
  position: relative;
  font-family: Roboto;
  font-weight: 500;
  text-align: center;
  font-size: 12px;
  line-height: 14px;
  color: ${({ theme }) => theme.palette.text.secondary};
  z-index: 3;
  min-width: 164px;
`;

const AuthMethodsWrapper = styled.div`
  padding-top: 30px;
  display: flex;
  justify-content: center;
  > * {
    &:nth-child(2) {
      margin: 0 30px;
    }
  }
`;

const StyledAlert = styled(Alert)`
  margin: 10px 0 0;
`;

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Form from 'react-bootstrap/Form';
import { useSelector, useDispatch } from 'react-redux';
import { Alert } from 'react-bootstrap';

import TextBox from '../../atoms/TextBox';
import TextBoxLabel from '../../atoms/TextBoxLabel';
import Button from '../../components/Button';

import {
  changePassword,
  resetBlockAuth,
} from '../../modules/actions/AuthActions';

const ResetPassword = ({ error, loading }) => {
  const dispatch = useDispatch();

  const [profileDetails, setProfileDetails] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const {
    changePassword: {
      error: changePasswordError,
      loading: changePasswordLoading,
      success,
    },
  } = useSelector(({ auth }) => auth);

  useEffect(() => {
    return () => {
      dispatch(resetBlockAuth({ blockType: 'changePassword' }));
    };
  }, []);

  const [errorMessage, setErrorMessage] = useState(error);

  const handleChange = ({ target: { name, value } }) => {
    setProfileDetails({ ...profileDetails, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { oldPassword, newPassword, confirmPassword } = profileDetails;
    let item = {
      new_password1: newPassword,
      new_password2: confirmPassword,
    };
    if (!newPassword || !confirmPassword || !oldPassword) {
      return setErrorMessage('Please fill Password');
    } else if (newPassword !== confirmPassword) {
      return setErrorMessage('Please Check your confirm Password');
    }
    dispatch(changePassword(item));
  };

  const resetMessages = () => {
    setErrorMessage('');
    dispatch(resetBlockAuth({ blockType: 'changePassword' }));
  };

  const buttonStyles = {
    marginTop: '30px',
    background: '#789F08',
    width: '380px',
  };

  return (
    <FormWrapper>
      {(errorMessage || changePasswordError) && (
        <Alert variant="danger" onClose={resetMessages} dismissible>
          {error || errorMessage || changePasswordError}
        </Alert>
      )}
      {success && (
        <Alert variant="success" onClose={resetMessages} dismissible>
          Your password has been reset successfully.
        </Alert>
      )}
      <FormInner>
        <Form noValidate onSubmit={handleSubmit}>
          <FormGroup>
            <Label className="authLabel">Old Password</Label>
            <TextBoxs
              type="password"
              name="oldPassword"
              value={profileDetails.first_name}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label className="authLabel">New Password</Label>
            <TextBoxs
              type="password"
              name="newPassword"
              value={profileDetails.last_name}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label className="authLabel">Confirm Password</Label>
            <TextBoxs
              type="password"
              name="confirmPassword"
              value={profileDetails.email}
              onChange={handleChange}
            />
          </FormGroup>
          <Button
            type="submit"
            styles={buttonStyles}
            loading={loading || changePasswordLoading}
            disabled={loading}
          >
            Save Changes
          </Button>
        </Form>
      </FormInner>
    </FormWrapper>
  );
};

export default ResetPassword;

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px 20px 33px;
  ${({ theme }) => theme.max('md')`
    margin: 23px 10px 10px;
  `}
  ${({ theme }) => theme.between('md', 'xl')`
    width: calc(100vw - 165px);
    margin: 23px 10px 10px 20px;
  `}
`;

const FormInner = styled.div`
  min-width: 100%;
  ${({ theme }) => theme.max('md')`
    min-width: 992px;
  `}
  ${({ theme }) => theme.max('sm')`
    min-width: 800px;
  `}
  ${({ theme }) => theme.min('xl')`
    min-width: 1200px;
  `}
`;

const FormGroup = styled.div`
  display: flex;
  background: #ffffff;
  border-radius: 5px;
  padding: 22px;
  align-items: center;
  margin-bottom: 2px;
  &:last-child {
    margin-bottom: 0;
  }
  ${({ theme }) => theme.max('md')`
      display: block;
      margin-bottom: 5px;
  `}
`;

const Label = styled(TextBoxLabel)`
  width: 150px;
  padding: 0 10px;
  ${({ theme }) => theme.max('md')`
      padding: 15px 0 0;
  `}
`;

const TextBoxs = styled(TextBox)`
  width: 380px;
`;

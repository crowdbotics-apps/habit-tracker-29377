import React, { useState } from 'react';
import styled from 'styled-components';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';

import AuthWrapper from '../AuthWrapper';
import TextBox from '../../atoms/TextBox';
import TextBoxLabel from '../../atoms/TextBoxLabel';
import Button from '../../components/Button';

const ChangePassword = () => {
  const [changePasswordDetails, setChangePasswordDetails] = useState({
    old_password: '',
    new_password1: '',
    new_password2: '',
  });
  const [validated, setValidated] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = ({ target: { name, value } }) => {
    setChangePasswordDetails({ ...changePasswordDetails, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;
    const { new_password1, new_password2 } = changePasswordDetails;
    if (form.checkValidity() === true) {
      if (new_password1 !== new_password2) {
        setErrorMessage('Confirm password should be same as password.');
        return;
      }
      setErrorMessage('');
    } else {
      setValidated(true);
    }
  };

  const props = {
    leftButtonText: 'sign up',
    leftButtonText2: 'login',
    leftButtonLink: '/signup',
    leftButtonLink2: '/login',
    authInfoText: 'Login using other accounts',
    type: 'changePassword',
    leftDescription:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin feugiat est nisl, non rhoncus lectus fermentum in.',
    rightTitle: 'Change my password',
    rightDescription:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin feugiat est nisl, non rhoncus lectus fermentum in.',
  };

  const buttonStyles = {
    marginTop: '30px',
    background: '#789F08',
  };

  return (
    <AuthWrapper {...props}>
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Label className="authLabel">Old Password</Label>
        <TextBox
          type="password"
          required
          name="old_password"
          value={changePasswordDetails.old_password}
          onChange={handleChange}
        />
        <Form.Control.Feedback type="invalid">
          Please provide old password.
        </Form.Control.Feedback>
        <Label className="authLabel">New Password</Label>
        <TextBox
          type="password"
          required
          name="new_password1"
          value={changePasswordDetails.new_password1}
          onChange={handleChange}
        />
        {!changePasswordDetails.new_password1 && (
          <Form.Control.Feedback type="invalid">
            Please provide new password.
          </Form.Control.Feedback>
        )}
        <Label className="authLabel">Confirm Password</Label>
        <TextBox
          type="password"
          required
          name="new_password2"
          value={changePasswordDetails.new_password2}
          onChange={handleChange}
        />
        {!changePasswordDetails.new_password2 && (
          <Form.Control.Feedback type="invalid">
            Please provide confirm password.
          </Form.Control.Feedback>
        )}
        <Button type="submit" styles={buttonStyles}>
          Reset my password
        </Button>
      </Form>
    </AuthWrapper>
  );
};

export default ChangePassword;

const Label = styled(TextBoxLabel)`
  padding: 20px 0 10px;
  &:first-child {
    padding-top: 0;
  }
`;

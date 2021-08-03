import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';

import AuthWrapper from '../AuthWrapper';
import TextBox from '../../atoms/TextBox';
import TextBoxLabel from '../../atoms/TextBoxLabel';
import Button from '../../components/Button';
import { signup } from '../../modules/actions/AuthActions';

const Signup = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const {
    signup: { loading, success, error },
  } = useSelector(({ auth }) => auth);

  useEffect(() => {
    if (success) {
      history.push('/login');
    }
  }, [success]); // eslint-disable-line react-hooks/exhaustive-deps

  const [signUpDetails, setSignUpDetails] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [validated, setValidated] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = ({ target: { name, value } }) => {
    setSignUpDetails({ ...signUpDetails, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;
    if (form.checkValidity() === true) {
      if (signUpDetails.password !== '') {
        //regex for one special character, one digit, one capital and small alphabet
        let pattern = new RegExp(
          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s)/,
        );
        if (signUpDetails.password.length !== 8) {
          return setErrorMessage('Password length should be 8 character.');
        } else if (!pattern.test(signUpDetails.password)) {
          return setErrorMessage('Please enter strong password.');
        }
      }

      if (signUpDetails.password !== signUpDetails.confirmPassword) {
        return setErrorMessage('Confirm password should be same as password.');
      }
      setErrorMessage('');
      dispatch(signup(signUpDetails));
    } else {
      setValidated(true);
    }
  };

  const props = {
    leftButtonText: 'login',
    leftButtonLink: '/login',
    authInfoText: 'Sign up using other accounts',
    type: 'signup',
    leftDescription:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin feugiat est nisl, non rhoncus lectus fermentum in.',
    rightTitle: 'Register new account',
    rightDescription:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin feugiat est nisl, non rhoncus lectus fermentum in.',
  };

  const buttonStyles = {
    marginTop: '30px',
    background: '#789F08',
  };

  return (
    <AuthWrapper {...props}>
      {(error || errorMessage) && (
        <Alert variant="danger">{error || errorMessage}</Alert>
      )}
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Label className="authLabel">Email</Label>
        <TextBox
          type="email"
          required
          name="email"
          value={signUpDetails.email}
          onChange={handleChange}
        />
        <Form.Control.Feedback type="invalid">
          Please provide valid email.
        </Form.Control.Feedback>
        <Label className="authLabel">Password</Label>
        <TextBox
          type="password"
          required
          name="password"
          value={signUpDetails.password}
          onChange={handleChange}
        />
        {!signUpDetails.password && (
          <Form.Control.Feedback type="invalid">
            Please provide password.
          </Form.Control.Feedback>
        )}
        <Label className="authLabel">Confirm Password</Label>
        <TextBox
          type="password"
          required
          name="confirmPassword"
          value={signUpDetails.confirmPassword}
          onChange={handleChange}
        />
        {!signUpDetails.confirmPassword && (
          <Form.Control.Feedback type="invalid">
            Please provide confirm password.
          </Form.Control.Feedback>
        )}
        <Button type="submit" loading={loading} styles={buttonStyles}>
          sign up
        </Button>
      </Form>
    </AuthWrapper>
  );
};

export default Signup;

const Label = styled(TextBoxLabel)`
  padding: 20px 0 10px;
  &:first-child {
    padding-top: 0;
  }
`;

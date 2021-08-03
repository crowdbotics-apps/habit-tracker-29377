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
import { login } from '../../modules/actions/AuthActions';

const Login = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const {
    login: { loading, success, error },
  } = useSelector(({ auth }) => auth);

  useEffect(() => {
    if (success) {
      history.push('/dashboard');
    }
  }, [success]); // eslint-disable-line react-hooks/exhaustive-deps

  const [loginDetails, setLoginDetails] = useState({ email: '', password: '' });
  const [validated, setValidated] = useState(false);

  const handleChange = ({ target: { name, value } }) => {
    setLoginDetails({ ...loginDetails, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;
    if (form.checkValidity() === true) {
      dispatch(login(loginDetails));
    } else {
      setValidated(true);
    }
  };

  const props = {
    leftButtonText: 'sign up',
    leftButtonLink: '/signup',
    authInfoText: 'Login using other accounts',
    type: 'login',
    leftDescription:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin feugiat est nisl, non rhoncus lectus fermentum in.',
    rightTitle: 'Login',
    rightDescription:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin feugiat est nisl, non rhoncus lectus fermentum in.',
  };

  const buttonStyles = {
    marginTop: '30px',
    background: '#789F08',
  };

  return (
    <AuthWrapper {...props}>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Label>Email</Label>
        <TextBox
          type="email"
          required
          name="email"
          value={loginDetails.email}
          onChange={handleChange}
        />
        <Form.Control.Feedback type="invalid">
          Please provide valid email.
        </Form.Control.Feedback>
        <Label>Password</Label>
        <TextBox
          type="password"
          required
          name="password"
          value={loginDetails.password}
          onChange={handleChange}
        />
        {!loginDetails.password && (
          <Form.Control.Feedback type="invalid">
            Please provide password.
          </Form.Control.Feedback>
        )}
        <Button type="submit" loading={loading} styles={buttonStyles}>
          login
        </Button>
      </Form>
    </AuthWrapper>
  );
};

export default Login;

const Label = styled(TextBoxLabel)`
  padding: 20px 0 10px;
  &:first-child {
    padding-top: 0;
  }
`;

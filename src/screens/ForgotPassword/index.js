import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';

import AuthWrapper from '../AuthWrapper';
import TextBox from '../../atoms/TextBox';
import TextBoxLabel from '../../atoms/TextBoxLabel';
import Button from '../../components/Button';
import { forgotPassword } from '../../modules/actions/AuthActions';

const ForgotPassword = () => {
  const dispatch = useDispatch();

  const {
    forgotPassword: { loading, success, error },
  } = useSelector(({ auth }) => auth);

  const [email, setEmail] = useState('');
  const [validated, setValidated] = useState(false);

  const handleChange = ({ target: { value } }) => {
    setEmail(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;
    if (form.checkValidity() === true) {
      dispatch(forgotPassword({ email }));
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
    type: 'forgotPassword',
    leftDescription:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin feugiat est nisl, non rhoncus lectus fermentum in.',
    rightTitle: 'Forgot Password',
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
      {success && (
        <Alert variant="success">
          An email has been sent to provided email address.
        </Alert>
      )}
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Label className="authLabel">Email</Label>
        <TextBox
          type="email"
          required
          name="email"
          value={email}
          onChange={handleChange}
        />
        <Form.Control.Feedback type="invalid">
          Please provide valid email.
        </Form.Control.Feedback>
        <Button type="submit" loading={loading} styles={buttonStyles}>
          Reset my password
        </Button>
      </Form>
    </AuthWrapper>
  );
};

export default ForgotPassword;

const Label = styled(TextBoxLabel)`
  padding: 20px 0 10px;
  &:first-child {
    padding-top: 0;
  }
`;

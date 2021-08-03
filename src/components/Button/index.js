import React from 'react';
import styled from 'styled-components';
import Spinner from 'react-bootstrap/Spinner';

import ButtonAtom from '../../atoms/Button';

const Button = ({
  styles = {},
  children,
  loading,
  disabled,
  icon,
  isLeft,
  ...rest
}) => {
  return (
    <ButtonAtom {...rest} disabled={loading || disabled} styles={styles}>
      {isLeft && <Icon src={icon} alt="Icon" />}
      {children}
      {loading && <StyledSpinner animation="border" />}
    </ButtonAtom>
  );
};

export default Button;

const StyledSpinner = styled(Spinner)`
  width: 25px !important;
  height: 25px !important;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -12px;
  margin-left: -12px;
`;

const Icon = styled.img`
  height: 16px;
  width: 16px;
  margin-right: 10px;
`;

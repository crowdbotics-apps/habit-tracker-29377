import React from 'react';
import styled from 'styled-components';
import Spinner from 'react-bootstrap/Spinner';

const Loader = () => {
  return (
    <Container>
      <StyledSpinner animation="border" />
    </Container>
  );
};

export default Loader;

const Container = styled.div`
  height: calc(100vh - 200px);
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledSpinner = styled(Spinner)`
  width: 45px;
  height: 45px;
  color: ${({ theme }) => theme.palette.primary.main};
`;

import styled from 'styled-components';

const ButtonAtom = styled.button`
  position: relative;
  height: 36px;
  width: 100%;
  font-family: Roboto;
  font-weight: 500;
  font-size: 12px;
  line-height: 20px;
  color: #ffffff;
  background: #47b0eb;
  text-transform: uppercase;
  border-radius: 4px;
  border: none;
  ${({ styles }) => styles}
`;

export default ButtonAtom;

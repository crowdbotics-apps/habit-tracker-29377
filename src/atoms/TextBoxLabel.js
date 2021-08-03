import styled from 'styled-components';

const TextBoxLabel = styled.div`
  font-family: Roboto;
  font-size: 14px;
  line-height: 24px;
  color: ${({ theme }) => theme.palette.text.primary};
`;

export default TextBoxLabel;

import React from 'react';
import styled, { css, keyframes } from 'styled-components';

const Checkbox = ({
  type = 'checkbox',
  name,
  checked = false,
  onChange,
  disabled,
}) => {
  return (
    <Label disabled={disabled}>
      <Input type={type} name={name} checked={checked} onChange={onChange} />
      <Indicator checked={checked} />
    </Label>
  );
};

export default Checkbox;

const Input = styled.input`
  height: 0;
  width: 0;
  opacity: 0;
  z-index: -1;
  cursor: pointer;
`;

const Label = styled.label`
  position: relative;
  display: inline-block;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  margin: 0.6em 1em;
`;

const rotate = keyframes`
 from {
    opacity: 0;
    transform: rotate(0deg);
  }
  to {
    opacity: 1;
    transform: rotate(45deg);
  }
`;

const Indicator = styled.div`
  width: 1.2em;
  height: 1.2em;
  position: absolute;
  top: 0em;
  border: 2px solid #818ea3;
  border-radius: 0.2em;
  z-index: 999;
  opacity: 0.2;

  ${Input}:not(:disabled):checked & {
    background: #d1d1d1;
  }

  ${Label}:hover & {
  }

  &::after {
    content: '';
    position: absolute;
    display: none;
  }

  ${Input}:checked + &::after {
    display: block;
    top: 0.1em;
    left: 0.35em;
    width: 35%;
    height: 70%;
    border: solid #818ea3;
    border-width: 0 0.2em 0.2em 0;
    animation-name: ${rotate};
    animation-duration: 0.3s;
    animation-fill-mode: forwards;
  }

  &::disabled {
    cursor: not-allowed;
  }

  ${(checked) =>
    checked.checked &&
    css`
      opacity: 1 !important;
    `};
`;

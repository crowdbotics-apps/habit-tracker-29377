import React from 'react';
import Modal from 'react-bootstrap/Modal';
import deleteImage from './deleteImage.svg';
import styled from 'styled-components';

const DeleteModal = ({
  show,
  onHide,
  title = '',
  buttonText = '',
  message = '',
  subMessage = '',
}) => {
  return (
    <StyledModal show={show} onHide={onHide} centered>
      <StyledModalHeader closeButton>
        <ModalTitle>{title}</ModalTitle>
      </StyledModalHeader>
      <StyledModalBody>
        <img src={deleteImage} alt="" />
        <MessageWrapper>{message}</MessageWrapper>
        <SubMessageWrapper>{subMessage}</SubMessageWrapper>
      </StyledModalBody>
      <ModalFooter>
        <CloseButton type="button" onClick={onHide}>
          Close
        </CloseButton>
        <DeleteButton type="button">{buttonText}</DeleteButton>
      </ModalFooter>
    </StyledModal>
  );
};

export default DeleteModal;

const StyledModalHeader = styled(Modal.Header)`
  display: flex;
  align-items: center;
  .close {
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 4px;
    border: 1px solid ${({ theme }) => theme.palette.text.secondaryLight};
    margin: unset;
  }
`;
const StyledModal = styled(Modal)`
  .modal-content {
    border-radius: 16px;
    box-shadow: 0px 2px 20px rgb(27 42 61 / 4%);
    border: 1px solid white;
  }
`;
const ModalTitle = styled(Modal.Title)`
  font-family: Roboto;
  font-weight: bold;
  font-size: 20px;
  line-height: 24px;
  color: ${({ theme }) => theme.palette.text.primary};
  padding: 8px;
`;
const StyledModalBody = styled(Modal.Body)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;
const MessageWrapper = styled.div`
  padding: 32px 0 12px;
  font-family: Roboto;
  font-weight: bold;
  font-size: 18px;
  line-height: 20px;
  color: ${({ theme }) => theme.palette.text.primary};
`;
const SubMessageWrapper = styled.div`
  font-family: Roboto;
  font-size: 16px;
  line-height: 20px;
  color: ${({ theme }) => theme.palette.text.primary};
`;
const ModalFooter = styled.div`
  padding: 18px 20px;
  border-top: 1px solid ${({ theme }) => theme.palette.text.secondaryLight};
  display: flex;
  justify-content: flex-end;
`;
const CloseButton = styled.button`
  padding: 8px 12px;
  background: ${({ theme }) => theme.palette.common.white};
  color: ${({ theme }) => theme.palette.primary.main};
  border-radius: 4px;
  font-family: Roboto;
  font-weight: 500;
  font-size: 12px;
  line-height: 20px;
  text-transform: uppercase;
  border: 1px solid ${({ theme }) => theme.palette.text.secondaryLight};
  margin-right: 12px;
`;
const DeleteButton = styled.button`
  padding: 8px 12px;
  background: #c64f4f;
  color: ${({ theme }) => theme.palette.common.white};
  border-radius: 4px;
  font-family: Roboto;
  font-weight: 500;
  font-size: 12px;
  line-height: 20px;
  text-transform: uppercase;
  border: 1px solid #c64f4f;
`;

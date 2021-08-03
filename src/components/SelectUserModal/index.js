import React, { useState } from 'react';
import styled from 'styled-components';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import closeIcon from '../../assets/images/closeIcon.png';
import Table from './Table';

const DialogModal = ({
  from = '',
  show,
  handleClose,
  modalData,
  selectedUser,
  userData,
}) => {
  const [searchInput, setSearchInput] = useState('');

  const handleChange = ({ target: { value } }) => {
    setSearchInput(value);
  };

  const newData = modalData.filter(
    (item) =>
      item.first_name?.toLowerCase().includes(searchInput.toLowerCase()) ||
      item.last_name?.toLowerCase().includes(searchInput.toLowerCase()) ||
      item.name?.toLowerCase().includes(searchInput.toLowerCase()),
  );

  return (
    <StyledModal show={show} onHide={handleClose} dialogClassName="dialogClass">
      <MainWrapper>
        <Header>
          <CloseIcon src={closeIcon} alt="icon" onClick={handleClose} />
          <Text>{userData.is_coach ? 'Coaching' : 'Coached by'}</Text>
          <FilterLabel>Filter results</FilterLabel>
          <FormGroup>
            <Label>Search for user</Label>
            <Form.Control
              type="text"
              placeholder="Search users"
              value={searchInput}
              onChange={handleChange}
            />
          </FormGroup>
        </Header>
        <Table
          from={from}
          data={newData}
          selectedUser={selectedUser}
          closeModal={handleClose}
          userData={userData}
        />
      </MainWrapper>
    </StyledModal>
  );
};

export default DialogModal;

const StyledModal = styled(Modal)`
  & .modal {
    padding-left: 0;
  }
  & .modal-content {
    border: none;
    border-radius: 10px;
  }
  & .dialogClass {
    max-width: 399px;
    margin-top: 78px;
    ${({ theme }) => theme.max('sm')`
      margin-top: 49px;
    `}
  }
`;

const MainWrapper = styled.div`
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.05);
  border-radius: 10px;
`;

const Header = styled.div`
  padding: 29px 20px 20px 23px;
  background: ${({ theme }) => theme.palette.common.white};
  border-radius: 10px 10px 0px 0px;
  ${({ theme }) => theme.max('sm')`
    padding: 25px 30px 18px;
  `}
`;

const CloseIcon = styled.img`
  float: right;
  cursor: pointer;
  margin: -10px 0;
`;

const Text = styled.span`
  font-family: Roboto;
  font-size: 16px;
  line-height: 24px;
  color: ${({ theme }) => theme.palette.text.primary};
`;

const FilterLabel = styled.div`
  font-family: Roboto;
  font-weight: bold;
  font-size: 14px;
  line-height: 24px;
  color: ${({ theme }) => theme.palette.common.white};
  background: ${({ theme }) => theme.palette.primary.main};
  border-radius: 20px;
  padding: 1px 18px;
  margin: 20px 0;
  width: max-content;
`;

const FormGroup = styled(Form.Group)`
  display: flex;
  align-items: center;
  & > input {
    width: auto;
  }
`;

const Label = styled.div`
  font-family: Roboto;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: #2a3037;
  margin-right: 27px;
`;

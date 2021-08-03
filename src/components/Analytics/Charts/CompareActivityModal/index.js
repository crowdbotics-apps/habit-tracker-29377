import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import Modal from 'react-bootstrap/Modal';

import Button from '../../../Button';
import ActivityListing from './ActivityListing';
import closeIcon from './ActivityListing/assets/closeIcon.png';

const CompareActivityModal = ({
  show,
  handleClose,
  data,
  setSelectedArea,
  selectedArea,
}) => {
  const [selectedCategory, setSelectedCategory] = useState([]);

  useEffect(() => {
    setSelectedCategory(selectedArea);
  }, [selectedArea]);

  const buttonStyles = {
    width: 'max-content',
    padding: '11px 34px',
    background: '#789F08',
    marginRight: '30px',
  };

  const compareActivity = () => {
    setSelectedArea(selectedCategory);
    handleClose();
  };
  const totalCategorysCount = data.length || 0;
  const selectedCategorysCount = selectedCategory.length || 0;
  return (
    <StyledModal show={show} onHide={handleClose} dialogClassName="dialogClass">
      <DialogWrapper>
        <Header>
          <CloseIcon src={closeIcon} alt="icon" onClick={handleClose} />
          <Text>
            Compare activity (
            {`${selectedCategorysCount}/${totalCategorysCount}`})
          </Text>
        </Header>
        <Content>
          <ActivityListing
            data={data}
            setSelectedCategory={setSelectedCategory}
            selectedCategory={selectedCategory}
          />
          <ButtonWrapper>
            <Button styles={buttonStyles} onClick={compareActivity}>
              Compare
            </Button>
          </ButtonWrapper>
        </Content>
      </DialogWrapper>
    </StyledModal>
  );
};

export default CompareActivityModal;

const StyledModal = styled(Modal)`
  & .modal {
    padding-left: 0;
  }
  & .modal-content {
    border: none;
    border-radius: 10px;
  }
  & .dialogClass {
    max-width: 595px;
    margin: 78px auto;
    ${({ theme }) => theme.max('sm')`
      margin: 49px 10px;
    `}
  }
`;

const DialogWrapper = styled.div`
  background: ${({ theme }) => theme.palette.background.main};
  box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
`;

const Header = styled.div`
  padding: 20px 20px 23px;
  background: ${({ theme }) => theme.palette.common.white};
  box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px 10px 0px 0px;
  margin-bottom: 5px;
`;

const CloseIcon = styled.img`
  float: right;
  cursor: pointer;
`;

const Text = styled.span`
  font-family: Roboto;
  font-size: 18px;
  line-height: 24px;
  color: ${({ theme }) => theme.palette.text.primary};
`;

const Content = styled.div`
  ${({ theme }) => theme.max('sm')`
    padding: 20px 10px 30px;
  `}
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 75px;
  ${({ theme }) => theme.max('sm')`
    & > button {
      width: 100%;
    }
  `}
`;

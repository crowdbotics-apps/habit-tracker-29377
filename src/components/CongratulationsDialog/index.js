import React from 'react';
import { useSelector } from 'react-redux';
import styled, { css } from 'styled-components';

import Modal from 'react-bootstrap/Modal';
import nextIcon from '../../assets/images/nextIcon.png';
import Button from '../Button';

import Congratulations from '../../assets/images/congratulations.png';
import RoundedProgress from '../RoundedProgress';
import { NavLink } from 'react-router-dom';

const CongratulationsDialog = ({ show, handleClose }) => {
  const {
    areasList: {
      dashboardTableData,
      subHeaderData: { headerPoints },
    },
  } = useSelector(({ dashboard }) => dashboard);
  const categories = dashboardTableData.map((i) => {
    return { name: i.area.title.split(' ')[0], avg: i.duration.avg };
  });
  const handleAddScoreClick = () => {
    handleClose();
  };

  const buttonStyles = {
    width: 'max-content',
    padding: '11px 34px',
    background: '#789F08',
    marginRight: '30px',
    marginBottom: '30px',
    textTransform: 'uppercase',
  };

  return (
    <StyledModal show={show} onHide={handleClose} dialogClassName="dialogClass">
      <CommonAddScoreDialogWrapper>
        <Header>
          <CongratulationsIcon src={Congratulations} alt="Congratulations" />
          <TextWrapper>
            <Text>Congratulations</Text>
            <SubText>you finished your activity today</SubText>
          </TextWrapper>
        </Header>

        <Content>
          <ProgressBarWrapper>
            <ProgressBar>
              <Divider />
            </ProgressBar>
            <ProgressBarStripe width={80}>
              <ProgressBarText>Points today</ProgressBarText>
              <ProgressBarText>{headerPoints}₳</ProgressBarText>
            </ProgressBarStripe>
          </ProgressBarWrapper>
          <CategoryMainWrapper>
            {categories.map((i, index) => {
              return (
                <>
                  <CategoryWrapper key={index}>
                    <CategoryText>{i.name}</CategoryText>
                    <DayProgressWrapper>
                      <RoundedProgress
                        progress={i.avg}
                        label={i.avg ? i.avg + '%' : '-'}
                      />
                    </DayProgressWrapper>
                  </CategoryWrapper>
                  {categories.length === index + 1 && (
                    <StatisticsWrapper>
                      <StatisticsText>Statistics</StatisticsText>
                      <ImageWrapper to={'/analytics'}>
                        <NextIcon src={nextIcon} alt="next" />
                      </ImageWrapper>
                    </StatisticsWrapper>
                  )}
                </>
              );
            })}
          </CategoryMainWrapper>
          <ButtonWrapper>
            <Button styles={buttonStyles} onClick={handleAddScoreClick}>
              done
            </Button>
          </ButtonWrapper>
        </Content>
      </CommonAddScoreDialogWrapper>
    </StyledModal>
  );
};

export default CongratulationsDialog;

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

const CommonAddScoreDialogWrapper = styled.div`
  background: ${({ theme }) => theme.palette.background.main};
  box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 20px 20px 23px;
  background: ${({ theme }) => theme.palette.common.white};
  box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px 10px 0px 0px;
  margin-bottom: 31px;
`;
const CategoryMainWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 20px 17px;
`;

const Text = styled.span`
  font-family: Roboto;
  font-size: 18px;
  line-height: 24px;
  color: ${({ theme }) => theme.palette.text.primary};
`;

const SubText = styled.span`
  font-family: Roboto;
  font-size: 14px;
  font-weight: 400;
  line-height: 24px;
  color: #8e97a3;
`;

const ProgressBarText = styled.span`
  font-family: Roboto;
  padding: 0 20px;
  font-size: 16px;
  font-weight: 400;
  line-height: 18.75px;
  color: #ffff;
`;

const CategoryText = styled.span`
  font-family: Roboto;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  display: flex;
  margin-top: 10px;
  margin-bottom: 9px;
  justify-content: center;
  color: ${({ theme }) => theme.palette.text.primary};
`;

const StatisticsText = styled.span`
  font-family: Roboto;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  display: flex;
  margin-top: 10px;
  margin-bottom: 9px;
  justify-content: center;
  color: #1689ca;
`;

const Content = styled.div`
  ${({ theme }) => theme.max('sm')`
    padding: 20px 10px 30px;
    background: #F9F9F9;
  `}
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  ${({ theme }) => theme.max('sm')`
    & > button {
      width: 100%;
    }
  `}
`;

const CongratulationsIcon = styled.img`
  height: 71px;
  width: 71px;
`;

const NextIcon = styled.img`
  height: 14px;
  width: 16px;
`;

const ImageWrapper = styled(NavLink)`
  height: 47px;
  width: 47px;
  border-radius: 47px;
  background: #f2f2f2;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TextWrapper = styled.p`
  display: flex;
  flex-direction: column;
  padding-left: 20px;
`;
const DayProgressWrapper = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
`;

const ProgressBarWrapper = styled.div`
  position: relative;
  margin: 0px 30px;
`;
const CategoryWrapper = styled.div`
  margin: 10px;
  padding: 10px;
  width: 120px;
  height: 120px;
  border-radius: 5px;
  background: #ffff;
`;
const StatisticsWrapper = styled.div`
  margin: 10px;
  padding: 10px;
  width: 120px;
  height: 120px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  flex-direction: column;
  background: #ffff;
`;
const Divider = styled.div`
  width: 8px;
  height: 50px;
  background: #d7d7d7;
  border-radius: 5px;
  margin-right: 15%;
`;

const ProgressBar = styled.div`
  min-width: 143px;
  height: 50px;
  border-radius: 5px;
  background: #ffff;
  display: flex;
  justify-content: flex-end;
`;

const ProgressBarStripe = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: space-between;
  top: 0px;
  left: 2px;
  height: 50px;
  width: 6px;
  padding: 1px;
  border-radius: 5px;
  background: linear-gradient(90deg, #00a3ff 0%, #a1de65 1744.05%);
  ${({ width }) =>
    width &&
    css`
      width: ${width}%;
      background: linear-gradient(90deg, #00a3ff 0%, #a1de65 74.48%);
      ${+width === 100 &&
      css`
        width: 98%;
        &::after {
          content: '';
          position: absolute;
          top: -4px;
          right: -12px;
          height: 14px;
          width: 14px;
          z-index: 3;
        }
      `}
      ${width <= 6 &&
      css`
        width: 6px;
        background: linear-gradient(90deg, #00a3ff 0%, #a1de65 1744.05%);
      `}
    `}
`;

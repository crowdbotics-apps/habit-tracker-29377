import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { useSelector } from 'react-redux';

import MobileNavToggleIcon from './assets/MobileNavToggleIcon';
import CloseIcon from './assets/CloseIcon';
import CommonAddScoreDialog from '../CommonAddScoreDialog';
import MobileNavDrawer from '../MobileNavDrawer';
import progressComplete from './assets/progressComplete.png';
import DefaultAvatar from '../../assets/images/DefaultAvatar.png';

const Header = ({ title }) => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [showAddScoreDialog, setShowAddScoreDialog] = useState(false);
  const [todayCategories, setTodayCategories] = useState();

  const {
    todayAreasList: { data: todayAreasData },
    areasList: { data: areasListData, subHeaderData },
  } = useSelector(({ dashboard }) => dashboard);

  const {
    userData: {
      data: { profile_picture, name },
    },
  } = useSelector(({ user }) => user);

  useEffect(() => {
    setTodayCategories(
      todayAreasData
        ?.map((i) =>
          i?.categories
            ?.map((c) =>
              c.scores.filter(
                (i) =>
                  new Date(i.date_time)?.toDateString() ===
                    new Date().toDateString() && typeof i.value === 'number',
              )?.length
                ? 1
                : 0,
            )
            ?.reduce(
              (accumulator, currentValue) => accumulator + currentValue,
              0,
            ),
        )
        ?.reduce(
          (accumulator, currentValue) => accumulator + currentValue,
          0,
        ) || 0,
    );
  }, [todayAreasData]);

  const addCategoryDialogOpen = () => setShowAddScoreDialog(true);
  const addCategoryDialogClose = () => setShowAddScoreDialog(false);

  const handleNavToggle = () => {
    setOpenDrawer((prev) => !prev);
  };

  const totalCategories =
    areasListData
      ?.map((i) => i.categories?.length)
      ?.reduce((accumulator, currentValue) => accumulator + currentValue, 0) ||
    0;

  const progressBarRange = (
    (todayCategories * 100) /
    totalCategories
  )?.toString();

  return (
    <HeaderWrapper>
      {showAddScoreDialog && (
        <CommonAddScoreDialog
          show={showAddScoreDialog}
          handleClose={addCategoryDialogClose}
        />
      )}
      <MobileNavDrawer open={openDrawer} onClose={handleNavToggle} />
      <MobileNavToggle onClick={handleNavToggle}>
        {openDrawer ? <CloseIcon /> : <MobileNavToggleIcon />}
      </MobileNavToggle>
      <HeadingWrapper>
        <DashboardName>Acountability Habit Tracker</DashboardName>
        <DashboardText>{title}</DashboardText>
      </HeadingWrapper>
      <RightWrapper>
        <UserDetails>
          <DetailsWrapper>
            <UserNameWrapper>
              <WelcomeText>Welcome back </WelcomeText>
              <UserName>{`${name || 'Guest'}`}</UserName>
            </UserNameWrapper>
            <ProgressWrapper>
              <ProgressLabelWrapper>
                <ProgressText>Progress today</ProgressText>
                <ProgressText>
                  {`${todayCategories}/${totalCategories}`}
                </ProgressText>
              </ProgressLabelWrapper>
              <ProgressBarWrapper>
                <ProgressBar />
                <ProgressBarStripe width={progressBarRange} />
              </ProgressBarWrapper>
            </ProgressWrapper>
          </DetailsWrapper>
          <TrackActivityButton onClick={addCategoryDialogOpen}>
            Track activity
          </TrackActivityButton>
          <PointsWrapper>
            <Points>
              <Points>{subHeaderData.headerPoints || 0}</Points>
              <CurrencySign>₳</CurrencySign>
            </Points>
            <PointsText>Arootah Points</PointsText>
          </PointsWrapper>
        </UserDetails>
        <ProfilePicture src={profile_picture || DefaultAvatar} alt="profile" />
      </RightWrapper>
    </HeaderWrapper>
  );
};

export default Header;

const HeaderWrapper = styled.div`
  width: calc(100vw - 124px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
  padding: 15px 19px;
  border: 1px solid ${({ theme }) => theme.palette.primary.main};
  border-radius: 8px;
  background: ${({ theme }) => theme.palette.common.white};
  ${({ theme }) => theme.max('md')`
    width: calc(100% - 20px);
    margin: 10px 10px 0;
    padding: 20px;
  `}
  ${({ theme }) => theme.max('sm')`
    padding: 7px 8px;
  `}
`;

const MobileNavToggle = styled.div`
  display: none;
  ${({ theme }) => theme.max('md')`
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 50px;
    min-height: 50px;
    background: ${({ theme }) => theme.palette.primary.main};
    border-radius: 4px;
    cursor: pointer;
  `}
  ${({ theme }) => theme.max('sm')`
    min-width: 40px;
    min-height: 40px;
  `}
`;

const HeadingWrapper = styled.div`
  ${({ theme }) => theme.max('md')`
    display: none;
  `}
`;

const DashboardName = styled.div`
  font-family: Roboto;
  font-weight: bold;
  font-size: 20px;
  line-height: 24px;
  color: ${({ theme }) => theme.palette.text.primary};
  margin-bottom: 4px;
`;

const DashboardText = styled.div`
  font-family: Roboto;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.palette.text.secondary};
`;

const RightWrapper = styled.div`
  display: flex;
  align-items: center;
  > * {
    &:first-child {
      margin-right: 20px;
      ${({ theme }) => theme.max('sm')`
        margin-right: 8px;
      `}
    }
  }
`;

const UserDetails = styled.div`
  display: flex;
  align-items: center;
`;

const DetailsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-right: 21px;
  ${({ theme }) => theme.max('sm')`
    margin-right: 8px;
  `}
`;

const UserNameWrapper = styled.div`
  display: flex;
  > * {
    &:first-child {
      margin-right: 5px;
    }
  }
  margin-bottom: 4px;
  ${({ theme }) => theme.max('sm')`
    flex-direction: column;
    display: none;
  `}
`;

const WelcomeText = styled.div`
  font-family: Roboto;
  font-size: 18px;
  line-height: 20px;
  color: ${({ theme }) => theme.palette.text.primary};
`;

const UserName = styled(WelcomeText)`
  font-weight: bold;
`;

const ProgressWrapper = styled.div`
  display: flex;
  align-items: center;
  ${({ theme }) => theme.max('md')`
    flex-direction: column;
    align-items: flex-end;
  `}
  ${({ theme }) => theme.max('sm')`
    align-items: flex-start;
  `}
`;

const ProgressLabelWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-right: 8px;
  ${({ theme }) => theme.max('md')`
    margin-right: 0;
    margin-bottom: 4px;
  `}
  > * {
    &:first-child {
      margin-right: 4px;
    }
  }
`;

const ProgressText = styled.div`
  font-family: Roboto;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.palette.text.secondary};
`;

const ProgressBarWrapper = styled.div`
  position: relative;
`;

const ProgressBar = styled.div`
  min-width: 160px;
  height: 10px;
  border: 1px solid ${({ theme }) => theme.palette.text.secondaryLight};
  border-radius: 20px;
  background: ${({ theme }) => theme.palette.background.main};
  ${({ theme }) => theme.max('md')`
    min-width: 132px;
  `}
`;

const ProgressBarStripe = styled.div`
  max-width: 155px;
  position: absolute;
  top: 2px;
  left: 2px;
  height: 6px;
  width: 6px;
  padding: 1px;
  border-radius: 20px;
  background: linear-gradient(90deg, #00a3ff 0%, #a1de65 1744.05%);
  ${({ theme }) => theme.max('md')`
    max-width: 127px;
  `}
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
          background-image: url(${progressComplete});
        }
      `}
      ${width <= 6 &&
      css`
        width: 6px;
        background: linear-gradient(90deg, #00a3ff 0%, #a1de65 1744.05%);
      `}
    `}
`;

const TrackActivityButton = styled.div`
  width: 125px;
  height: 56px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${({ theme }) => theme.palette.primary.main};
  border-radius: 5px;
  font-family: Roboto;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.palette.common.white};
  cursor: pointer;
  margin-right: 21px;
  ${({ theme }) => theme.max('sm')`
    display: none;
  `}
`;

const ProfilePicture = styled.img`
  border-radius: 5px;
  width: 56px;
  height: 56px;
  ${({ theme }) => theme.max('sm')`
    width: 40px;
    height: 40px;
  `}
`;

const PointsWrapper = styled.div`
  height: 56px;
  min-width: 97px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  border-radius: 4px;
  padding-right: 8px;
  background: ${({ theme }) => theme.palette.background.main};
  ${({ theme }) => theme.max('sm')`
    flex-direction: column-reverse;
    align-items: flex-start;
    background: ${({ theme }) => theme.palette.common.white};
    min-width: 77px;
    height: auto;
    padding-right: 0;
  `}
`;

const Points = styled.span`
  font-family: Roboto;
  font-weight: bold;
  font-size: 18px;
  line-height: 20px;
  color: ${({ theme }) => theme.palette.text.primary};
  ${({ theme }) => theme.max('sm')`
    font-size: 12px;
    line-height: 16px;
    font-weight: normal;
  `}
`;

const CurrencySign = styled(Points)`
  color: #ff9900;
  margin-left: 4px;
`;

const PointsText = styled.div`
  font-family: Roboto;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.palette.text.secondary};
  ${({ theme }) => theme.max('sm')`
    flex-direction: column-reverse;
    background: ${({ theme }) => theme.palette.common.white};
  `}
`;

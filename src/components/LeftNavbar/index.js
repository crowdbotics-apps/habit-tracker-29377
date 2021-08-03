import React from 'react';
import styled, { css } from 'styled-components';
import { NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import logo from '../../assets/images/logo.png';
import DashboardIcon from './assets/DashboardIcon';
import AnalyticsIcon from './assets/AnalyticsIcon';
import SettingsIcon from './assets/SettingsIcon';
import ProfileIcon from './assets/ProfileIcon';
import ActiveDashboardIcon from './assets/ActiveDashboardIcon';
import ActiveAnalyticsIcon from './assets/ActiveAnalyticsIcon';
import ActiveSettingsIcon from './assets/ActiveSettingsIcon';
import ActiveProfileIcon from './assets/ActiveProfileIcon';

const NavItems = [
  {
    id: 'dashboard',
    text: 'dashboard',
    link: '/dashboard',
    icon: DashboardIcon,
    activeIcon: ActiveDashboardIcon,
  },
  {
    id: 'analytics',
    text: 'analytics',
    link: '/analytics',
    icon: AnalyticsIcon,
    activeIcon: ActiveAnalyticsIcon,
  },
  {
    id: 'settings',
    text: 'settings',
    link: '/settings',
    icon: SettingsIcon,
    activeIcon: ActiveSettingsIcon,
  },
  {
    id: 'profile',
    text: 'profile',
    link: '/profile',
    icon: ProfileIcon,
    activeIcon: ActiveProfileIcon,
  },
  {
    id: 'users',
    text: 'all users',
    link: '/users',
    icon: ProfileIcon,
    activeIcon: ActiveProfileIcon,
  },
];

const LeftNavbar = () => {
  const { pathname } = useLocation();

  const {
    userData: { data: { is_superuser = false } = {} },
  } = useSelector(({ user }) => user);

  return (
    <LeftNavbarCont>
      <DesktopLogo>
        <img src={logo} alt="logo" width={34} height={40} />
      </DesktopLogo>
      <NavbarCont>
        <div>
          {NavItems.map((nav, i) => {
            const { id, link, text, icon: Icon, activeIcon: ActiveIcon } = nav;
            if (id !== 'users' || (is_superuser && id === 'users'))
              return (
                <NavItemCont key={i} to={link} active={pathname === link}>
                  {pathname === link ? (
                    <ActiveIcon color="#1689CA" />
                  ) : (
                    <Icon color="#8E97A3" />
                  )}
                  <NavItemText isActive={pathname === link}>{text}</NavItemText>
                </NavItemCont>
              );
          })}
        </div>
        <ArootahLogo>Arootah</ArootahLogo>
      </NavbarCont>
    </LeftNavbarCont>
  );
};

export default LeftNavbar;

const LeftNavbarCont = styled.div`
  display: flex;
  flex-direction: column;
  > * {
    &:first-child {
      margin-bottom: 10px;
    }
  }
  width: 88px;
  margin: 12px;
  ${({ theme }) => theme.max('md')`
    display: none;
  `}
`;

const DesktopLogo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 88px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.palette.primary.main};
`;

const NavbarCont = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: calc(100vh - 124px);
  border-radius: 8px;
  background-color: ${({ theme }) => theme.palette.common.white};
`;

const NavItemCont = styled(NavLink)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  margin: 4px 4px 16px;
  text-decoration: none !important;
  border-radius: 4px;
  cursor: pointer;
  > * {
    &:first-child {
      margin-bottom: 8px;
    }
  }
  ${({ active }) =>
    active &&
    css`
      border: 1px solid ${({ theme }) => theme.palette.background.main};
    `}
`;

const NavItemText = styled.div`
  font-family: Roboto;
  font-size: 12px;
  line-height: 16px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.palette.text.secondary};
  ${({ isActive }) =>
    isActive &&
    css`
      color: ${({ theme }) => theme.palette.primary.main};
    `}
`;

const ArootahLogo = styled.div`
  font-family: Roboto;
  font-weight: bold;
  font-size: 20px;
  line-height: 24px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: #b7babb;
  transform: rotate(-90deg);
  position: absolute;
  bottom: 90px;
`;
